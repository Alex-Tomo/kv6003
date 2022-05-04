import inspect
import os

from rasa.core.channels.channel import UserMessage, InputChannel
from sanic import Sanic, Blueprint, response
from sanic.request import Request
from sanic.response import HTTPResponse
from typing import Callable, Awaitable

"""
Custom action used to retrain the model using a 
terminal command

@author Alex Thompson, W19007452
"""

class RetrainModel(InputChannel):
    def name(self):
        return "retrainmodel"

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

            # Runs the command rasa train from the terminal
            print("training")
            os.system("rasa train")

            return response.json({"status": 200})

        return custom_webhook
