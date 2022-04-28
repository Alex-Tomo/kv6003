import inspect
import os

import requests
import yaml
from rasa.core.channels.channel import UserMessage, InputChannel
from sanic import Sanic, Blueprint, response
from sanic.request import Request
from sanic.response import HTTPResponse
from typing import Text, Dict, Any, Optional, Callable, Awaitable, NoReturn


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

            print("training")

            config = None
            with open(os.getcwd() + '\\config.yml', "r") as stream:
                try:
                    config = yaml.safe_load(stream)
                except yaml.YAMLError as error:
                    print(error)
                    return

            domain = None
            with open(os.getcwd() + '\\domain.yml', "r") as stream:
                try:
                    domain = yaml.safe_load(stream)
                except yaml.YAMLError as error:
                    print(error)
                    return

            nlu = None
            with open(os.getcwd() + '\\data\\nlu.yml', "r") as stream:
                try:
                    nlu = yaml.safe_load(stream)
                except yaml.YAMLError as error:
                    print(error)
                    return

            rules = None
            with open(os.getcwd() + '\\data\\rules.yml', "r") as stream:
                try:
                    rules = yaml.safe_load(stream)
                except yaml.YAMLError as error:
                    print(error)
                    return

            stories = None
            with open(os.getcwd() + '\\data\\stories.yml', "r") as stream:
                try:
                    stories = yaml.safe_load(stream)
                except yaml.YAMLError as error:
                    print(error)
                    return

            requests.post('http://localhost:5005/model/train',
                          data=yaml.dump({
                              "pipeline": config['pipeline'],
                              "policies": config['policies'],
                              "entities": domain['entities'],
                              "intents": domain['intents'],
                              "version": domain['version'],
                              "slots": domain['slots'],
                              "actions": domain['actions'],
                              "forms": {},
                              "e2e_actions": {},
                              "responses": domain['responses'],
                              "session_config": domain['session_config'],
                              "nlu": nlu['nlu'],
                              "rules": rules['rules'],
                              "stories": stories['stories']
                          }))

            return response.json({"status": 200})

        return custom_webhook
