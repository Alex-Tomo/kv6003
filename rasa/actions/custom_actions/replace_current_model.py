import inspect
import os

import requests
import yaml
from rasa.core.channels.channel import UserMessage, InputChannel
from sanic import Sanic, Blueprint, response
from sanic.request import Request
from sanic.response import HTTPResponse
from typing import Text, Dict, Any, Optional, Callable, Awaitable, NoReturn


class ReplaceCurrentModel(InputChannel):
    def name(self):
        return "replace_current_model"

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

            print("loading " + metadata['filename'])
            requests.put("http://localhost:5005/model",
                         json={
                             "model_file": str(os.path.join(os.getcwd(), 'models', metadata['filename']))
                         })

        return custom_webhook
