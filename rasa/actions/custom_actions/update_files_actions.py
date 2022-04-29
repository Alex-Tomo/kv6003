import inspect
import os
import yaml

from rasa.core.channels.channel import UserMessage, InputChannel
from sanic import Sanic, Blueprint, response
from sanic.request import Request
from sanic.response import HTTPResponse
from typing import Text, Dict, Any, Optional, Callable, Awaitable, NoReturn


class UpdateFiles(InputChannel):
    def name(self):
        return "updatefiles"

    def blueprint(
            self, on_new_message: Callable[[UserMessage], Awaitable[None]]
    ) -> Blueprint:
        custom_webhook = Blueprint(
            "custom_webhook_{}".format(type(self).__name__),
            inspect.getmodule(self).__name__,
        )

        @custom_webhook.route("/", methods=["GET"])
        async def health(request: Request) -> HTTPResponse:
            return response.json({"status": "ok"})

        @custom_webhook.route("/webhook", methods=["POST"])
        async def receive(request: Request) -> HTTPResponse:
            sender = request.json.get("sender")
            metadata = request.json.get("metadata")

            data = None

            if metadata['file'] == 'nlu.yml':
                with open(os.path.join(os.getcwd(), 'data', 'nlu.yml'), "r") as stream:
                    try:
                        data = yaml.safe_load(stream)
                    except yaml.YAMLError as error:
                        print(error)
                        return

            f = open(os.path.join(os.getcwd(), 'data', 'nlu.yml'), "w")
            f.write("")
            f.close()

            f = open(os.path.join(os.getcwd(), 'data', 'nlu.yml'), "a")
            f.write("version: " + yaml.dump(data['version']) + "\n")
            f.write("nlu: \n")
            for i in range(len(data['nlu'])):
                f.write("  - intent: " + data['nlu'][i]['intent'] + "\n")
                f.write("    examples: |\n")
                if data['nlu'][i]['intent'] == metadata['intentTitle']:
                    splitData = str(data['nlu'][i]['examples']).split("\n")
                    intentValue = "- " + metadata['intentValue']
                    for k in range(len(splitData) + 1):
                        if k == len(splitData):
                            f.write("      " + intentValue + "\n")
                            continue
                        if splitData[k] == "":
                            continue
                        f.write("      " + splitData[k] + "\n")
                    splitData.append(intentValue)
                else:
                    splitData = str(data['nlu'][i]['examples']).split("\n")
                    for k in range(len(splitData)):
                        if splitData[k] == "":
                            continue
                        f.write("      " + splitData[k] + "\n")

            f.close()

            return response.json({"status": 200})

        return custom_webhook
