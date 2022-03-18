from typing import Any, Text, Dict, List

import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher


class ActionOfferHelp(Action):

    def name(self) -> Text:
        return "action_offer_help"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        buttons = []

        buttons.append({"title": "aspiring student", "payload": "/my_student_type{\"student_type\":\"aspiring\"}"})
        buttons.append({"title": "existing student", "payload": "/my_student_type{\"student_type\":\"existing\"}"})

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
            buttons.append({"title": "visit campus", "payload": "/open_days"})
        elif str(tracker.get_slot("student_type")) == "existing":
            buttons.append({"title": "buildings", "payload": "/building_name"})
            buttons.append({"title": "lecturers", "payload": "/lecturer_email"})
            buttons.append({"title": "calendar", "payload": "/show_me_the_calendar"})

        dispatcher.utter_message(text="What would you like to know about?", buttons=buttons)
        return []


class ActionGetCourses(Action):

    def name(self) -> Text:
        return "action_get_courses"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        response = requests.get("http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses")
        courses = []
        for i in range(0, len(response.json())):
            title = str(response.json()[i]['course_title'])
            courses.append({
                "title": title,
                "payload": "/select_course{\"course\":\"" + title + "\"}"
            })

        dispatcher.utter_message(text="Here are the courses I found:", buttons=courses)
        return []


class ActionSayCourseName(Action):

    def name(self) -> Text:
        return "action_say_course_name"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        course = str(tracker.get_slot("course"))
        print("Choosen Course: " + str(tracker.get_slot("course")))

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

        if course is not None:
            buttons = []

            buttons.append({"title": "modules", "payload": "/show_modules"})
            buttons.append({"title": "entry requirements", "payload": "/show_modules"})
            buttons.append({"title": "fees", "payload": "/show_modules"})
            buttons.append({"title": "dates", "payload": "/show_modules"})

            dispatcher.utter_message(text=f"What would you like to know about {course}?", buttons=buttons)
        else:
            dispatcher.utter_message(text="Sorry, I cannot find that course")

        return [SlotSet("courseCode", courseCode)]



class ActionWhichModules(Action):

    def name(self) -> Text:
        return "action_which_modules"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        modules = []
        modules.append({"title": "All Modules", "payload": "/choose_module_type{\"year\":\"all\"}"})
        modules.append({"title": "Year 1 Modules", "payload": "/choose_module_type{\"year\":\"1\"}"})
        modules.append({"title": "Year 2 Modules", "payload": "/choose_module_type{\"year\":\"2\"}"})
        modules.append({"title": "Year 3 Modules", "payload": "/choose_module_type{\"year\":\"3\"}"})
        modules.append({"title": "Year 4 Modules", "payload": "/choose_module_type{\"year\":\"4\"}"})

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
            response = requests.get("http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&year=all")
        else:
            response = requests.get("http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&year=" + year)

        modules = []
        modulesTemp = ""
        for i in range(0, len(response.json())):
            modulesTemp += response.json()[i]['module_title'] + "\n"
            modules.append({"title": response.json()[i]['module_title']})

        dispatcher.utter_message(text="Here are the modules:\n"+modulesTemp)

        return []


class ActionSayCourseEntryRequirements(Action):

    def name(self) -> Text:
        return "action_say_course_entry_requirements"

    def run(self, dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="The entry requirements for " + tracker.get_slot("course") + " are...")

        return []


