"""
The main actions file, this is used in conjuncture with
Rasa. When the user gives specific intents a class is run.

@author Alex Thompson, W19007452
"""

from typing import Any, Text, Dict, List

import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher
from .courses import getCourses, getMostLikelyCourse, getCourseModulesByYear, getCourseEntryRequirements
from .constants import *


class ActionOfferHelp(Action):
    def name(self) -> Text:
        return "action_offer_help"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Are you an...?",
                                 buttons=STUDENT_TYPE_BUTTONS)
        return []


class ActionStudentOptions(Action):

    def name(self) -> Text:
        return "action_student_options"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        buttons = []

        if str(tracker.get_slot("student_type")) == "aspiring":
            buttons = ASPIRING_STUDENT_BUTTONS
        elif str(tracker.get_slot("student_type")) == "existing":
            buttons = EXISTING_STUDENT_BUTTONS

        dispatcher.utter_message(text="What would you like to know about?",
                                 buttons=buttons)
        return []


class ActionGetCourses(Action):

    def name(self) -> Text:
        return "action_get_courses"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Here are the courses I found:",
                                 buttons=getCourses())
        return []


class ActionSayCourseName(Action):

    def name(self) -> Text:
        return "action_say_course_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        course = getMostLikelyCourse(str(tracker.get_slot("course")), getCourses())

        if course['ratio'] is not None and course['ratio'] < 0.4:
            dispatcher.utter_message(text="Sorry, I cannot find that course")
        elif course['ratio'] is not None and course['ratio'] < 0.8:
            dispatcher.utter_message(text=f"Did you mean {course['course']}?",
                                     buttons=YES_NO_BUTTONS)
        elif course['course'] is not None and course['courseCode'] is not None:
            SlotSet("course", course['course'])
            dispatcher.utter_message(text=f"What would you like to know about {course['course']}?",
                                     buttons=COURSE_INFORMATION_BUTTONS)

        return [SlotSet("courseCode", course['courseCode'])]


class ActionConfirmCourseName(Action):

    def name(self) -> Text:
        return "action_confirm_course_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        courseCode = str(tracker.get_slot("courseCode"))
        print(courseCode)
        course = str(tracker.get_slot("course"))

        response = requests.get("http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses")

        for i in range(0, len(response.json())):
            if courseCode == str(response.json()[i]['course_code']):
                SlotSet("course", str(response.json()[i]['course_title']))
                course = str(response.json()[i]['course_title'])

        dispatcher.utter_message(text=f"What would you like to know about {course}?",
                                 buttons=COURSE_INFORMATION_BUTTONS)
        return []


class ActionWhichModules(Action):

    def name(self) -> Text:
        return "action_which_modules"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Which modules would you like to see?",
                                 buttons=MODULE_YEAR_BUTTONS)
        return []


class ActionShowModules(Action):

    def name(self) -> Text:
        return "action_show_modules"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        courseCode = str(tracker.get_slot("courseCode"))
        year = str(tracker.get_slot("year"))

        if courseCode is None:
            dispatcher.utter_message(text="You have not selected a course:")
            return []

        moduleButtons = getCourseModulesByYear(courseCode, year)

        dispatcher.utter_message(text="Here are the modules i found:\n",
                                 buttons=moduleButtons)
        return []


class ActionShowModulesForSpecificCourse(Action):

    def name(self) -> Text:
        return "action_show_modules_for_specific_course"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        course = str(tracker.get_slot("course"))

        if course is None:
            dispatcher.utter_message(text="Sorry, I could not find that course. \n")
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        courseDetails = getMostLikelyCourse(course, getCourses())

        year = str(tracker.get_slot("year"))

        if year is None or courseDetails['courseCode'] is None:
            dispatcher.utter_message(text="Sorry, I could not find that course. \n")
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        moduleButtons = getCourseModulesByYear(courseDetails['courseCode'], year)

        dispatcher.utter_message(text="Here are the modules:\n",
                                 buttons=moduleButtons)
        return []


class ActionSayCourseEntryRequirements(Action):

    def name(self) -> Text:
        return "action_say_course_entry_requirements"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        course = str(tracker.get_slot("course"))

        if course is None:
            dispatcher.utter_message(text="Sorry, I could not find that course. \n")
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        courseDetails = getMostLikelyCourse(course, getCourses())

        if courseDetails['courseCode'] is None:
            dispatcher.utter_message(text="Sorry, I could not find that course. ")
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        entryRequirements = getCourseEntryRequirements(courseDetails['courseCode'])

        dispatcher.utter_message(text="The entry requirements for " + courseDetails['course'] + " are: \n" + entryRequirements)
        return []


class ActionVisitCampus(Action):

    def name(self) -> Text:
        return "action_visit_campus"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="What would you like to know about university campus?",
                                 buttons=VISIT_CAMPUS_BUTTONS)
        return []


class ActionGetBuildingName(Action):

    def name(self) -> Text:
        return "action_get_building_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buildingCode = str(tracker.get_slot("building_code"))

        response = requests.get(
            "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?building_code=" + buildingCode)

        dispatcher.utter_message(text=buildingCode + " is " + str(response.json()[0]['building_name']))
        return []


class ActionAskBuildingCode(Action):

    def name(self) -> Text:
        return "action_ask_for_building_code"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        response = requests.get("http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings")

        buildingCodes = []
        for i in range(0, len(response.json())):
            title = str(response.json()[i]['building_code'])
            buildingCodes.append({
                "title": title,
                "payload": "/building_name{\"building_code\":\"" + title + "\"}"
            })

        dispatcher.utter_message(text="What is the building code?", buttons=buildingCodes)
        return []


class ActionAskAboutBuildings(Action):

    def name(self) -> Text:
        return "action_ask_about_buildings"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=f"How can i help you with buildings?",
                                 buttons=BUILDING_BUTTONS)
        return []


class ActionGetBuildingLocation(Action):

    def name(self) -> Text:
        return "action_get_building_location"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buildingCode = str(tracker.get_slot("building_code"))

        response = requests.get(f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?location=true"
                                f"&building_code={buildingCode}")

        buildingNumber = str(response.json()[0]['building_number'])
        buildingName = str(response.json()[0]['building_name'])

        dispatcher.utter_message(text=buildingName + " is number " + buildingNumber + " on the map",
                                 image="http://unn-w19007452.newnumyspace.co.uk/kv6003/campus_map")
        return []


class ActionLecturerOptions(Action):

    def name(self) -> Text:
        return "action_lecturer_options"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="What would you like to know?",
                                 buttons=LECTURER_BUTTONS)
        return []


class ActionGetLecturerEmail(Action):

    def name(self) -> Text:
        return "action_get_lecturer_email"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        lecturer = str(tracker.get_slot("lecturer"))
        email = None

        if lecturer == "Jeremy Ellman":
            email = "jeremy.ellman@northumbria.ac.uk"
        elif lecturer == "Christina Vasiliou":
            email = "christina.vasiliou@northumbria.ac.uk"
        elif lecturer == "Kay Rogage":
            email = "kay.rogage@northumbria.ac.uk"

        if lecturer is not None and email is not None:
            dispatcher.utter_message(text=lecturer + "s email is " + email)
        else:
            dispatcher.utter_message(text="I could not find lecturer ")

        return []
