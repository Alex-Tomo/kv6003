import inspect
import os

from rasa.core.channels.channel import UserMessage, InputChannel
from sanic import Sanic, Blueprint, response
from sanic.request import Request
from sanic.response import HTTPResponse
from typing import Text, Dict, Any, Optional, Callable, Awaitable, NoReturn


class GetModels(InputChannel):
    def name(self):
        return "get_models"

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

            files = [file for file in os.listdir(os.path.join(os.getcwd(), 'models'))]
            try:
                files.remove('.DS_Store')
            except:
                print("No .DS_Store")

            return response.json({'filenames': files})

        return custom_webhook
