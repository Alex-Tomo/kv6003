import inspect
import os

import yaml
from rasa.core.channels.channel import UserMessage, InputChannel
from sanic import Sanic, Blueprint, response
from sanic.request import Request
from sanic.response import HTTPResponse
from typing import Text, Dict, Any, Optional, Callable, Awaitable, NoReturn


class RecieveFiles(InputChannel):
    def name(self):
        return "recievefiles"

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
            metadata = request.json.get("metadata")

            data = None

            if metadata['file'] == 'config':
                with open(os.getcwd() + '\\config.yml', "r") as stream:
                    try:
                        data = yaml.safe_load(stream)
                    except yaml.YAMLError as error:
                        print(error)
                        return
            elif metadata['file'] == 'domain':
                with open(os.getcwd() + '\\domain.yml', "r") as stream:
                    try:
                        data = yaml.safe_load(stream)
                    except yaml.YAMLError as error:
                        print(error)
                        return
            elif metadata['file'] == 'nlu':
                with open(os.getcwd() + '\\data\\nlu.yml', "r") as stream:
                    try:
                        data = yaml.safe_load(stream)
                    except yaml.YAMLError as error:
                        print(error)
                        return
            elif metadata['file'] == 'rules':
                with open(os.getcwd() + '\\data\\rules.yml', "r") as stream:
                    try:
                        data = yaml.safe_load(stream)
                    except yaml.YAMLError as error:
                        print(error)
                        return
            elif metadata['file'] == 'stories':
                with open(os.getcwd() + '\\data\\stories.yml', "r") as stream:
                    try:
                        data = yaml.safe_load(stream)
                    except yaml.YAMLError as error:
                        print(error)
                        return

            return response.json({"data": data})

        return custom_webhook
