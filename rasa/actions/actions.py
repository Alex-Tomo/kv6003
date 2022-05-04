"""
The main actions file, this is used in conjuncture with
Rasa. When the user gives specific intents a class is run.

@author Alex Thompson, W19007452
"""

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher
from .courses import *
from .constants.constants import *
from .custom_slots import *
from .lecturers import *
from .buildings import *

# Custom slots is used to keep track of the current slots
customSlots = CustomSlots()


class ActionOfferHelp(Action):

    def name(self) -> Text:
        return "action_offer_help"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="What can i help you with?",
            buttons=HOW_CAN_I_HELP_BUTTONS
        )
        return []


class ActionGetCourses(Action):

    def name(self) -> Text:
        return "action_get_courses"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="Here are the courses I found:",
            buttons=getCourses()
        )
        return []


class ActionSayCourseName(Action):

    def name(self) -> Text:
        return "action_say_course_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        course = getMostLikelyCourse(str(tracker.get_slot("course")), getCourses())

        if course['ratio'] is not None and course['ratio'] < 0.4:
            dispatcher.utter_message(
                text="Sorry, I cannot find that course"
            )
        elif course['ratio'] is not None and course['ratio'] < 0.8:
            dispatcher.utter_message(
                text=f"Did you mean {course['course']}?",
                buttons=YES_NO_BUTTONS
            )
        elif course['course'] is not None and course['courseCode'] is not None:
            SlotSet("course", course['course'])
            dispatcher.utter_message(
                text=f"What would you like to know about {course['course']}?",
                buttons=COURSE_INFORMATION_BUTTONS
            )

        return [SlotSet("courseCode", course['courseCode'])]


class ActionConfirmCourseName(Action):

    def name(self) -> Text:
        return "action_confirm_course_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        courseCode = str(tracker.get_slot("courseCode"))
        course = str(tracker.get_slot("course"))

        response = requests.get("http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses")

        for i in range(0, len(response.json())):
            if courseCode == str(response.json()[i]['course_code']):
                SlotSet("course", str(response.json()[i]['course_title']))
                course = str(response.json()[i]['course_title'])

        dispatcher.utter_message(
            text=f"What would you like to know about {course}?",
            buttons=COURSE_INFORMATION_BUTTONS
        )
        return []


class ActionWhichModules(Action):

    def name(self) -> Text:
        return "action_which_modules"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        if str(tracker.get_slot("course")) == str(None):
            dispatcher.utter_message(
                text="Sorry, I cannot find that course"
            )

        course = getMostLikelyCourse(str(tracker.get_slot("course")), getCourses())

        if course['ratio'] is not None and course['ratio'] < 0.4:
            dispatcher.utter_message(
                text="Sorry, I cannot find that course"
            )
        elif course['ratio'] is not None and course['ratio'] < 0.8:
            dispatcher.utter_message(
                text=f"Did you mean {course['course']}?",
                buttons=YES_NO_BUTTONS
            )
        elif course['course'] is not None and course['courseCode'] is not None:
            SlotSet("course", course['course'])
            dispatcher.utter_message(
                text="Which modules would you like to see?",
                buttons=MODULE_YEAR_BUTTONS
            )

        return []


class ActionShowModules(Action):

    def name(self) -> Text:
        return "action_show_modules"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        courseCode = str(tracker.get_slot("courseCode"))

        if courseCode == "None":
            courseCode = customSlots.getCourseCode()

        year = str(tracker.get_slot("year"))

        if courseCode == "None":
            dispatcher.utter_message(
                text="You have not selected a course:"
            )
            return []

        if year == "None":
            ActionWhichModules.run(self, dispatcher, tracker, domain)
            return []

        modules = getCourseModulesByYear(courseCode, year)
        moduleText = ""
        for i in range(len(modules)):
            moduleText += modules[i]['title'] + "\n\n"

        dispatcher.utter_message(
            text="Here are the modules i found:",
        )
        dispatcher.utter_message(
            text=f"{moduleText}",
        )

        return [SlotSet("year", None)]


class ActionShowModulesForSpecificCourse(Action):

    def name(self) -> Text:
        return "action_show_modules_for_specific_course"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        course = str(tracker.get_slot("course"))
        year = str(tracker.get_slot("year"))

        if course is None:
            dispatcher.utter_message(
                text="Sorry, I could not find that course."
            )
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        courseDetails = getMostLikelyCourse(course, getCourses())

        if courseDetails['ratio'] is not None and courseDetails['ratio'] < 0.4:
            dispatcher.utter_message(
                text="Sorry, I could not find that course."
            )
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        elif courseDetails['ratio'] is not None and courseDetails['ratio'] < 0.8:
            dispatcher.utter_message(
                text=f"Did you mean {courseDetails['course']}?",
                buttons=YES_NO_BUTTONS
            )

        if year == "None":
            dispatcher.utter_message(
                text=f"I'm sorry, I didn't get the year."
            )
            customSlots.setCourseCode(courseDetails['courseCode'])
            ActionWhichModules.run(self, dispatcher, tracker, domain)
            return [SlotSet("year", None)]

        if courseDetails['course'] == "None" and courseDetails['courseCode'] == "None":
            dispatcher.utter_message(
                text="Sorry, I could not find that course."
            )
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        moduleButtons = getCourseModulesByYear(courseDetails['courseCode'], year)

        dispatcher.utter_message(
            text="Here are the modules:",
            buttons=moduleButtons
        )
        return [SlotSet("year", None)]


class ActionSayCourseEntryRequirements(Action):

    def name(self) -> Text:
        return "action_say_course_entry_requirements"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        course = str(tracker.get_slot("course"))

        if course is None:
            dispatcher.utter_message(
                text="Which course would you like to know entry requirements for?"
            )
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        courseDetails = getMostLikelyCourse(course, getCourses())

        if courseDetails['ratio'] is not None and courseDetails['ratio'] < 0.4:
            dispatcher.utter_message(
                text="Sorry, I could not find that course."
            )
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        elif courseDetails['ratio'] is not None and courseDetails['ratio'] < 0.8:
            dispatcher.utter_message(
                text=f"Did you mean {courseDetails['course']}?",
                buttons=YES_NO_BUTTONS
            )

        if courseDetails['course'] == 'None' and courseDetails['courseCode'] == 'None':
            dispatcher.utter_message(
                text="Sorry, I could not find that course."
            )
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        entryRequirements = getCourseEntryRequirements(courseDetails['courseCode'])

        dispatcher.utter_message(
            text=f"The entry requirements for {courseDetails['course']} are: {entryRequirements}"
        )
        return []


class ActionVisitCampus(Action):

    def name(self) -> Text:
        return "action_visit_campus"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="What would you like to know about university campus?",
            buttons=VISIT_CAMPUS_BUTTONS
        )
        return []


class ActionGetBuildingName(Action):

    def name(self) -> Text:
        return "action_get_building_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        buildingCode = str(tracker.get_slot("building_code"))

        response = requests.get(
            f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?building_code={buildingCode}"
        )

        if len(response.json()) > 0:
            dispatcher.utter_message(
                text=f"{str(response.json()[0]['building_code'])} is {str(response.json()[0]['building_name'])}",
                buttons=[{"title": "Get Directions"}, {"title": "Show on Map"}]
            )
        else:
            dispatcher.utter_message(
                text="I cannot find that building"
            )

        return []


class ActionAskBuildingCode(Action):

    def name(self) -> Text:
        return "action_ask_for_building_code"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        response = requests.get(
            "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings"
        )

        buildingCodes = []
        for i in range(0, len(response.json())):
            title = str(response.json()[i]['building_code'])
            buildingCodes.append({
                "title": title,
                "payload": "/building_name{\"building_code\":\"" + title + "\"}"
            })

        dispatcher.utter_message(
            text="What is the building code?",
            buttons=buildingCodes
        )
        return []


class ActionAskBuildingName(Action):

    def name(self) -> Text:
        return "action_ask_for_building_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        response = requests.get(
            "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings"
        )

        buildingNames = []
        for i in range(0, len(response.json())):
            title = str(response.json()[i]['building_name'])
            buildingNames.append({
                "title": title
            })

        dispatcher.utter_message(
            text="Which building do you want to find?",
            buttons=buildingNames
        )


class ActionAskAboutBuildings(Action):

    def name(self) -> Text:
        return "action_ask_about_buildings"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="How can i help you with buildings?",
            buttons=BUILDING_BUTTONS
        )
        return []


class ActionGetBuildingLocation(Action):

    def name(self) -> Text:
        return "action_get_building_location"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        buildingCode = str(tracker.get_slot("building_code"))
        buildingName = str(tracker.get_slot("building_name"))

        buildings = getAllBuildings()

        origin = []
        response = None

        if str(buildingName) != str(None):
            origin = getMostLikelyBuildingByName(buildingName, buildings)
        elif str(buildingCode) != str(None):
            origin = getMostLikelyBuildingByCode(buildingCode, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            dispatcher.utter_message(response="utter_can_i_help")
            return []

        if origin['ratio'] is not None and origin['ratio'] < 0.4:
            dispatcher.utter_message(
                text="Sorry, I could not find that building."
            )
            dispatcher.utter_message(response="utter_can_i_help")
            return []
        elif origin['ratio'] is not None and origin['ratio'] < 0.8:
            dispatcher.utter_message(
                text=f"Did you mean {origin['name']}?",
                buttons=YES_NO_BUTTONS
            )
            customSlots.setLastAction('action_get_building_location')
            customSlots.setLocation(origin['name'])
            return []

        if origin['code'] is not None:
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_code={origin['code']}"
            )
        elif origin['name'] is not None:
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_name={origin['name']}"
            )

        if response is None:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        buildingNumber = str(response.json()[0]['building_number'])
        buildingName = str(response.json()[0]['building_name'])

        dispatcher.utter_message(
            text=f"{buildingName} is number {buildingNumber} on the map below",
            image="http://unn-w19007452.newnumyspace.co.uk/kv6003/campus_map",
        )
        dispatcher.utter_message(response="utter_can_i_help")
        return [SlotSet('building_code', None), SlotSet('building_name', None)]


class ActionBuildingMap(Action):

    def name(self) -> Text:
        return "action_building_map"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        buildingCode = tracker.get_slot("building_code")
        buildingName = tracker.get_slot("building_name")

        buildings = getAllBuildings()

        origin = []
        response = None

        if str(buildingName) != str(None):
            origin = getMostLikelyBuildingByName(buildingName, buildings)
        elif str(buildingCode) != str(None):
            origin = getMostLikelyBuildingByCode(buildingCode, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            dispatcher.utter_message(response="utter_can_i_help")
            return []

        if origin['ratio'] is not None and origin['ratio'] < 0.4:
            dispatcher.utter_message(
                text="Sorry, I could not find that building."
            )
            dispatcher.utter_message(response="utter_can_i_help")
            return []
        elif origin['ratio'] is not None and origin['ratio'] < 0.8:
            dispatcher.utter_message(
                text=f"Did you mean {origin['name']}?",
                buttons=YES_NO_BUTTONS
            )
            customSlots.setLastAction('action_building_map')
            customSlots.setLocation(origin['name'])
            return []

        if origin['code'] is not None:
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_code={origin['code']}"
            )
        elif origin['name'] is not None:
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_name={origin['name']}"
            )

        if response is None:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        dispatcher.utter_message(
            text=f"Heres what i found for {str(response.json()[0]['building_name'])}",
            json_message={
                "map": [{
                    "lat": str(response.json()[0]['building_lat']),
                    "lng": str(response.json()[0]['building_lng']),
                    "name": str(response.json()[0]['building_name'])
                }]
            }
        )
        dispatcher.utter_message(response="utter_can_i_help")

        return [SlotSet('building_code', None), SlotSet('building_name', None)]


class ActionMyLocationToBuildingMap(Action):

    def name(self) -> Text:
        return "action_my_location_to_building_map"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        buildingCode = str(tracker.get_slot("building_code"))
        buildingName = str(tracker.get_slot("building_name"))

        buildings = getAllBuildings()

        origin = []
        response = None

        if str(buildingName) != str(None):
            origin = getMostLikelyBuildingByName(buildingName, buildings)
        elif str(buildingCode) != str(None):
            origin = getMostLikelyBuildingByCode(buildingCode, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        if origin['ratio'] is not None and origin['ratio'] < 0.4:
            dispatcher.utter_message(
                text="Sorry, I could not find that building."
            )
            return []
        elif origin['ratio'] is not None and origin['ratio'] < 0.8:
            dispatcher.utter_message(
                text=f"Did you mean {origin['name']}?",
                buttons=YES_NO_BUTTONS
            )
            customSlots.setLastAction('action_my_location_to_building_map')
            customSlots.setLocation(origin['name'])
            return []

        if origin['code'] is not None:
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_code={origin['code']}"
            )
        elif origin['name'] is not None:
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_name={origin['name']}"
            )

        if response is None:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        dispatcher.utter_message(
            text=f"Your location to {str(response.json()[0]['building_name'])}",
            json_message={
                "my_location": True,
                "map": [{
                    "lat": str(response.json()[0]['building_lat']),
                    "lng": str(response.json()[0]['building_lng']),
                    "name": str(response.json()[0]['building_name'])
                }]
            }
        )
        dispatcher.utter_message(response="utter_can_i_help")
        return [SlotSet('building_code', None), SlotSet('building_name', None)]


class ActionBuildingToBuildingMap(Action):

    def name(self) -> Text:
        return "action_building_to_building_map"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        buildingCode = str(tracker.get_slot("building_code"))
        buildingCodeDestination = str(tracker.get_slot("building_code_destination"))
        buildingName = str(tracker.get_slot("building_name"))
        buildingNameDestination = str(tracker.get_slot("building_name_destination"))

        buildings = getAllBuildings()

        origin = []
        destination = []
        response = None
        responseDestination = None

        if str(buildingName) != str(None):
            origin = getMostLikelyBuildingByName(buildingName, buildings)
        elif str(buildingCode) != str(None):
            origin = getMostLikelyBuildingByCode(buildingCode, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        if str(buildingNameDestination) != str(None):
            destination = getMostLikelyBuildingByName(buildingNameDestination, buildings)
        elif str(buildingCodeDestination) != str(None):
            destination = getMostLikelyBuildingByCode(buildingCodeDestination, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        if origin['code'] is not None:
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_code={origin['code']}"
            )
        elif origin['name'] is not None:
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_name={origin['name']}"
            )

        if response is None or len(response.json()) == 0:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        if destination['code'] is not None:
            responseDestination = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_code={destination['code']}"
            )
        elif destination['name'] is not None:
            responseDestination = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_name={destination['name']}"
            )

        if responseDestination is None or len(responseDestination.json()) == 0:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        if str(responseDestination.json()[0]['building_name']) == str(response.json()[0]['building_name']):
            dispatcher.utter_message(text="Those are the same building")
            return []

        dispatcher.utter_message(
            text=f"{str(destination['name'])} to {str(origin['name'])}",
            json_message={
                "my_location": True,
                "map": [
                    {
                        "lat": str(responseDestination.json()[0]['building_lat']),
                        "lng": str(responseDestination.json()[0]['building_lng']),
                        "name": str(responseDestination.json()[0]['building_name'])
                    },
                    {
                        "lat": str(response.json()[0]['building_lat']),
                        "lng": str(response.json()[0]['building_lng']),
                        "name": str(response.json()[0]['building_name'])
                    }
                ]
            }
        )
        dispatcher.utter_message(response="utter_can_i_help")

        return [
            SlotSet('building_code', None),
            SlotSet('building_name', None),
            SlotSet('building_code_destination', None),
            SlotSet('building_name_destination', None)
        ]


class ActionGetLocationAfterConfirmation(Action):

    def name(self) -> Text:
        return "action_location_after_confirmation"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        last = customSlots.getLastAction()
        locationName = customSlots.getLocation()

        if last == 'action_get_building_location':
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_name={locationName}"
            )

            if response is None:
                dispatcher.utter_message(text="I cannot find that building")
                dispatcher.utter_message(response="utter_can_i_help")
                return []

            buildingNumber = str(response.json()[0]['building_number'])
            buildingName = str(response.json()[0]['building_name'])

            dispatcher.utter_message(
                text=f"{buildingName} is number {buildingNumber} on the map below",
                image="http://unn-w19007452.newnumyspace.co.uk/kv6003/campus_map"
            )
            dispatcher.utter_message(response="utter_can_i_help")
            return [SlotSet('building_code', None), SlotSet('building_name', None)]
        elif last == 'action_building_map':
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_name={locationName}"
            )

            if response is None:
                dispatcher.utter_message(text="I cannot find that building")
                dispatcher.utter_message(response="utter_can_i_help")
                return []

            dispatcher.utter_message(
                text=f"Heres what i found for {str(response.json()[0]['building_name'])}",
                json_message={
                    "map": [{
                        "lat": str(response.json()[0]['building_lat']),
                        "lng": str(response.json()[0]['building_lng']),
                        "name": str(response.json()[0]['building_name'])
                    }]
                }
            )
            dispatcher.utter_message(response="utter_can_i_help")
            return [SlotSet('building_code', None), SlotSet('building_name', None)]

        elif last == 'action_my_location_to_building_map':
            response = requests.get(
                f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?"
                f"&building_name={locationName}"
            )

            if response is None:
                dispatcher.utter_message(text="I cannot find that building")
                dispatcher.utter_message(response="utter_can_i_help")
                return []

            dispatcher.utter_message(
                text=f"Your location to {str(response.json()[0]['building_name'])}",
                json_message={
                    "my_location": True,
                    "map": [{
                        "lat": str(response.json()[0]['building_lat']),
                        "lng": str(response.json()[0]['building_lng']),
                        "name": str(response.json()[0]['building_name'])
                    }]
                }
            )
            dispatcher.utter_message(response="utter_can_i_help")
            return [SlotSet('building_code', None), SlotSet('building_name', None)]

        return []


class ActionLecturerOptions(Action):

    def name(self) -> Text:
        return "action_lecturer_options"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="What would you like to know?",
            buttons=LECTURER_BUTTONS
        )
        return []


class ActionGetLecturerEmail(Action):

    def name(self) -> Text:
        return "action_get_lecturer_email"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        lecturer = str(tracker.get_slot("lecturer"))

        lecturerDetails = getMostLikelyLecturer(lecturer)

        if lecturer != "None" and lecturerDetails is not None:
            dispatcher.utter_message(
                text=f"{lecturerDetails['lecturerName']}s email is {lecturerDetails['lecturerEmail']}"
            )
        else:
            dispatcher.utter_message(
                text="I could not find lecturer"
            )
        dispatcher.utter_message(response="utter_can_i_help")
        return []


class ActionAccommodation(Action):

    def name(self) -> Text:
        return "action_accommodation"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="Northumbria offers a range of student accomodation. Visit {?} for more information.",
            json_message={
                "link": "https://www.northumbria.ac.uk/study-at-northumbria/accommodation/?gclid=Cj0KCQjw3IqSBhCoARIsAMBkTb2zQJMARbWTKZaCBOFFpAhNehqGP-QnM33p9T3m_UrRAVjjQt0Mw80aArOMEALw_wcB&gclsrc=aw.ds"
            }
        )

        return []


class ActionGrades(Action):

    def name(self) -> Text:
        return "action_grades"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="40% of 100 credits from 5th year plus 60% of 100 credits from final year or 100% of final year. Visit {?} for more information.",
            json_message={
                "link": "https://www.ucas.com/connect/videos/coronavirus/calculated-grades"
            }
        )

        return []


class ActionOpenDays(Action):

    def name(self) -> Text:
        return "action_open_days"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="There are two types of open days, virtual and on-campus. Visit {?} to register.",
            json_message={
                "link": "https://app.geckoform.com/public/?_gl=1*fjwu5l*_gcl_aw*R0NMLjE2NDg1NjE1ODAuQ2owS0NRanczSXFTQmhDb0FSSXNBTUJrVGIxQUVIWjhhakVjNmpIejlfS0xQRm5nNE5ZbDlMS3pmaE9qQlFTVjl5SnRLWS1LX1VPX0hyTWFBa2IzRUFMd193Y0I.*_gcl_dc*R0NMLjE2NDg1NjE1ODAuQ2owS0NRanczSXFTQmhDb0FSSXNBTUJrVGIxQUVIWjhhakVjNmpIejlfS0xQRm5nNE5ZbDlMS3pmaE9qQlFTVjl5SnRLWS1LX1VPX0hyTWFBa2IzRUFMd193Y0I.&_ga=2.241359426.1395756847.1648549005-1643827260.1647389419&_gac=1.27663694.1648561580.Cj0KCQjw3IqSBhCoARIsAMBkTb1AEHZ8ajEc6jHz9_KLPFng4NYl9LKzfhOjBQSV9yJtKY-K_UO_HrMaAkb3EALw_wcB#/modern/21FO0085r8wa8l00908qnh8haw"
            }
        )

        return []


class ActionCampusFacilities(Action):

    def name(self) -> Text:
        return "action_campus_facilities"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="Northumbria offers a range of facilities. Visit {?} for more information.",
            json_message={
                "link": "https://www.northumbria.ac.uk/study-at-northumbria/coming-to-northumbria/creative/our-facilities/"
            }
        )

        return []


class ActionGetCalendar(Action):

    def name(self) -> Text:
        return "action_get_calendar"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="View {?} for the semester calendar.",
            json_message={
                "link": "https://www.northumbria.ac.uk/about-us/university-services/student-library-and-academic-services/registry-records-and-returns/academic-calendars/2021-2022-calendar/"
            }
        )

        return []
