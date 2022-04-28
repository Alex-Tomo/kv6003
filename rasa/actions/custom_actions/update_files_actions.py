import inspect

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
            message = request.json.get("message")
            metadata = request.json.get("metadata")

            if metadata['file'] == 'config':
                if metadata['add']:
                    for i in range(len(metadata['data'])):
                        print(f"adding {metadata['data'][i]}")
                elif metadata['remove']:
                    for i in range(len(metadata['data'])):
                        print(f"adding {metadata['data'][i]}")
            if metadata['file'] == 'domain':
                if metadata['add']:
                    for i in range(len(metadata['data'])):
                        print(f"adding {metadata['data'][i]}")
                elif metadata['remove']:
                    for i in range(len(metadata['data'])):
                        print(f"adding {metadata['data'][i]}")
            if metadata['file'] == 'nlu':
                if metadata['add']:
                    for i in range(len(metadata['data'])):
                        print(f"adding {metadata['data'][i]}")
                elif metadata['remove']:
                    for i in range(len(metadata['data'])):
                        print(f"adding {metadata['data'][i]}")

            return response.json({"message": "hey"})

        return custom_webhook
