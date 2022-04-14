from typing import Any, Text, Dict, List

import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher
from .courses import getCourses, getMostLikelyCourse


class ActionOfferHelp(Action):
    def name(self) -> Text:
        return "action_offer_help"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buttons = [{
                "title": "aspiring student",
                "payload": "/my_student_type{\"student_type\":\"aspiring\"}"
            },
            {
                "title": "existing student",
                "payload": "/my_student_type{\"student_type\":\"existing\"}"
            }]

        dispatcher.utter_message(text="Are you an...?", buttons=buttons)
        return []


class ActionStudentOptions(Action):

    def name(self) -> Text:
        return "action_student_options"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        print(str(tracker.get_slot("student_type")))

        buttons = []

        if str(tracker.get_slot("student_type")) == "aspiring":
            buttons.append({"title": "courses", "payload": "/interest_in_course"})
            buttons.append({"title": "accommodation", "payload": "/university_accommodation"})
            buttons.append({"title": "visit campus", "payload": "/visit_campus"})
        elif str(tracker.get_slot("student_type")) == "existing":
            buttons.append({"title": "buildings", "payload": "/buildings"})
            buttons.append({"title": "lecturers", "payload": "/lecturers_option"})
            buttons.append({"title": "calendar", "payload": "/show_me_the_calendar"})

        dispatcher.utter_message(text="What would you like to know about?", buttons=buttons)
        return []


class ActionGetCourses(Action):

    def name(self) -> Text:
        return "action_get_courses"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        courses = getCourses()
        dispatcher.utter_message(text="Here are the courses I found:", buttons=courses)
        return []


class ActionSayCourseName(Action):

    def name(self) -> Text:
        return "action_say_course_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        course = getMostLikelyCourse(str(tracker.get_slot("course")).lower(), getCourses())
        print(tracker.get_slot("course"))

        if course['ratio'] is not None and course['ratio'] < 0.4:
            dispatcher.utter_message(text="Sorry, I cannot find that course")
        elif course['ratio'] is not None and course['ratio'] < 0.8:
            dispatcher.utter_message(text=f"Did you mean {course['course']}?",
                                     buttons=[{"title": "Yes", "payload": "/affirm"},
                                              {"title": "No", "payload": "/deny"}])
        elif course['course'] is not None and course['courseCode'] is not None:
            buttons = [
                {"title": "modules", "payload": "/show_modules"},
                {"title": "entry requirements", "payload": "/entry_requirements"},
                {"title": "fees", "payload": "/course_fees"},
                {"title": "apply", "payload": "/apply"}
            ]
            dispatcher.utter_message(text=f"What would you like to know about {course['course']}?", buttons=buttons)

        return [SlotSet("courseCode", course['courseCode'])]


class ActionWhichModules(Action):

    def name(self) -> Text:
        return "action_which_modules"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        modules = [
            {"title": "All Modules", "payload": "/choose_module_type{\"year\":\"all\"}"},
            {"title": "Year 1 Modules", "payload": "/choose_module_type{\"year\":\"1\"}"},
            {"title": "Year 2 Modules", "payload": "/choose_module_type{\"year\":\"2\"}"},
            {"title": "Year 3 Modules", "payload": "/choose_module_type{\"year\":\"3\"}"},
            {"title": "Year 4 Modules", "payload": "/choose_module_type{\"year\":\"4\"}"}
        ]

        dispatcher.utter_message(text="Which modules would you like to see?", buttons=modules)
        return []


class ActionShowModules(Action):

    def name(self) -> Text:
        return "action_show_modules"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        courseCode = str(tracker.get_slot("courseCode"))
        year = str(tracker.get_slot("year"))
        print("Year Chosen: " + str(tracker.get_slot("year")))

        if courseCode is None:
            dispatcher.utter_message(text="You have not selected a course:")
            return []

        if year.lower() == "all":
            response = requests.get(
                "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&year=all")
        else:
            response = requests.get(
                "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&year=" + year)

        modules = []
        modulesTemp = ""
        for i in range(0, len(response.json())):
            modulesTemp += response.json()[i]['module_title'] + "\n"
            modules.append({"title": response.json()[i]['module_title']})

        dispatcher.utter_message(text="Here are the modules:\n" + modulesTemp)

        return []


class ActionShowModulesForSpecificCourse(Action):

    def name(self) -> Text:
        return "action_show_modules_for_specific_course"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        print("trigger action show modules for specific course")

        course = str(tracker.get_slot("course"))

        if course == "Computer and Digital Forensics BSc":
            courseCode = "GF44"
        elif course == "Computer Networks and Cyber Security BSc":
            courseCode = "G4W3"
        elif course == "Computer Science BSc":
            courseCode = "G400"
        elif course == "Computer Science with Artificial Intelligence BSc":
            courseCode = "G403"
        elif course == "Computer Science with Games Development BSc":
            courseCode = "G405"
        elif course == "Computer Science with Web Development BSc":
            courseCode = "G404"
        else:
            courseCode = None

        year = str(tracker.get_slot("year"))

        if year is None or courseCode is None:
            dispatcher.utter_message(text="Sorry, I could not find that course. \n")
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        if year.lower() == "all":
            response = requests.get(
                "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&year=all")
        else:
            response = requests.get(
                "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&year=" + year)

        modules = []
        modulesTemp = ""
        for i in range(0, len(response.json())):
            modulesTemp += response.json()[i]['module_title'] + "\n"
            modules.append({"title": response.json()[i]['module_title']})

        dispatcher.utter_message(text="Here are the modules:\n" + modulesTemp)

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

        if course == "Computer and Digital Forensics BSc":
            courseCode = "GF44"
        elif course == "Computer Networks and Cyber Security BSc":
            courseCode = "G4W3"
        elif course == "Computer Science BSc":
            courseCode = "G400"
        elif course == "Computer Science with Artificial Intelligence BSc":
            courseCode = "G403"
        elif course == "Computer Science with Games Development BSc":
            courseCode = "G405"
        elif course == "Computer Science with Web Development BSc":
            courseCode = "G404"
        else:
            courseCode = None

        if courseCode is None:
            dispatcher.utter_message(text="Sorry, I could not find that course. ")
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        response = requests.get(
            "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&entry_requirements=true")

        entry_requirements = ""
        entry_requirements += response.json()[0]['tariff_points'] + "\n"
        entry_requirements += response.json()[0]['subject_requirements'] + "\n"
        entry_requirements += response.json()[0]['gcse_requirements'] + "\n"
        entry_requirements += response.json()[0]['english_requirements'] + "\n"

        dispatcher.utter_message(text="The entry requirements for " + course + " are: \n" + entry_requirements)

        return []


class ActionVisitCampus(Action):

    def name(self) -> Text:
        return "action_visit_campus"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        modules = []
        modules.append({"title": "Open Days", "payload": "/utter_open_days"})
        modules.append({"title": "University Facilities", "payload": "/utter_campus_facilities"})
        modules.append({"title": "Campus Map", "payload": "/utter_campus_map"})

        dispatcher.utter_message(text="What would you like to know about university campus?", buttons=modules)
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


class ActionGetBuildingName(Action):

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

        dispatcher.utter_message(text="What is the building code?", buttons=buildingCodes)


class ActionAskAboutBuildings(Action):

    def name(self) -> Text:
        return "action_ask_about_buildings"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buttons = []
        buttons.append({"title": "Building Codes", "payload": "/building_codes_option"})
        buttons.append({"title": "Building Locations", "payload": "/building_location_option"})
        buttons.append({"title": "Building Map", "payload": "/show_map"})

        dispatcher.utter_message(text=f"How can i help you with buildings?", buttons=buttons)


class ActionGetBuildingLocation(Action):

    def name(self) -> Text:
        return "action_get_building_location"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buildingCode = str(tracker.get_slot("building_code"))

        response = requests.get(
            "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?location=true&building_code=" + buildingCode
        )

        buildingNumber = str(response.json()[0]['building_number'])
        buildingName = str(response.json()[0]['building_name'])

        dispatcher.utter_message(text=buildingName + " is number " + buildingNumber + " on the map",
                                 image="https://northumbria-cdn.azureedge.net/-/media/services/campus-services/documents/pdf/city-campus-map-sept-2020-master.pdf?modified=20201116104043")


class ActionLecturerOptions(Action):

    def name(self) -> Text:
        return "action_lecturer_options"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        buttons = []
        buttons.append({"title": "Emails", "payload": "/lecturer_email"})
        # buttons.append({"title": "Offices", "payload": "/lecturer_office"})

        dispatcher.utter_message(text="What would you like to know?", buttons=buttons)


class ActionGetLecturerEmail(Action):

    def name(self) -> Text:
        return "action_get_lecturer_email"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        lecturer = str(tracker.get_slot("lecturer"))

        if lecturer == "Jeremy Ellman":
            email = "jeremy.ellman@northumbria.ac.uk"
        elif lecturer == "Christina Vasiliou":
            email = "christina.vasiliou@northumbria.ac.uk"
        elif lecturer == "Kay Rogage":
            email = "kay.rogage@northumbria.ac.uk"

        if lecturer is not None and email is not None:
            dispatcher.utter_message(text=lecturer + " email is " + email)
        else:
            dispatcher.utter_message(text="could not find lecturer ")
