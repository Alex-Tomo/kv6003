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
from .custom_slots import *
from .lecturers import getMostLikelyLecturer
from .buildings import getAllBuildings, getMostLikelyBuildingByCode, getMostLikelyBuildingByName

# Custom slots is used to keep track of the current slots
customSlots = CustomSlots()


class ActionOfferHelp(Action):
    def name(self) -> Text:
        return "action_offer_help"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="Are you an...?",
            buttons=STUDENT_TYPE_BUTTONS
        )
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

        dispatcher.utter_message(
            text="What would you like to know about?",
            buttons=buttons
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
        print(courseCode)
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

        moduleButtons = getCourseModulesByYear(courseCode, year)

        dispatcher.utter_message(
            text="Here are the modules i found:",
            buttons=moduleButtons
        )
        return [SlotSet("year", None)]


class ActionShowModulesForSpecificCourse(Action):

    def name(self) -> Text:
        return "action_show_modules_for_specific_course"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        course = str(tracker.get_slot("course"))

        if course is None:
            dispatcher.utter_message(
                text="Sorry, I could not find that course."
            )
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        courseDetails = getMostLikelyCourse(course, getCourses())

        year = str(tracker.get_slot("year"))

        if year == "None":
            customSlots.setCourseCode(courseDetails['courseCode'])
            ActionWhichModules.run(self, dispatcher, tracker, domain)
            return [SlotSet("year", None)]

        if courseDetails['courseCode'] == "None":
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
                text="Sorry, I could not find that course."
            )
            ActionGetCourses.run(self, dispatcher, tracker, domain)
            return []

        courseDetails = getMostLikelyCourse(course, getCourses())

        if courseDetails['courseCode'] is None:
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
                text=f"{buildingCode} is {str(response.json()[0]['building_name'])}",
                buttons=[{"title": "Get Directions"}, {"title": "Show on Map"}]
            )
        else:
            dispatcher.utter_message(
                text="I cannot find that building code"
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

        if buildingCode != "None":
            origin = getMostLikelyBuildingByCode(buildingCode, buildings)
        elif buildingName != "None":
            origin = getMostLikelyBuildingByName(buildingName, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        response = requests.get(
            f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?location=true"
            f"&building_code={origin['code']}"
        )

        buildingNumber = str(response.json()[0]['building_number'])
        buildingName = str(response.json()[0]['building_name'])

        dispatcher.utter_message(
            text=f"{buildingName} is number {buildingNumber} on the map below",
            image="http://unn-w19007452.newnumyspace.co.uk/kv6003/campus_map"
        )
        return []


class ActionBuildingMap(Action):

    def name(self) -> Text:
        return "action_building_map"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        buildingCode = str(tracker.get_slot("building_code"))
        buildingName = str(tracker.get_slot("building_name"))

        buildings = getAllBuildings()

        origin = []

        if buildingCode != "None":
            origin = getMostLikelyBuildingByCode(buildingCode, buildings)
        elif buildingName != "None":
            origin = getMostLikelyBuildingByName(buildingName, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        response = requests.get(
            f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?location=true"
            f"&building_code={origin['code']}"
        )

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

        return []


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

        if buildingCode != "None":
            origin = getMostLikelyBuildingByCode(buildingCode, buildings)
        elif buildingName != "None":
            origin = getMostLikelyBuildingByName(buildingName, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        response = requests.get(
            f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?location=true"
            f"&building_code={origin['code']}"
        )

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

        return []


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

        if buildingCode != "None":
            origin = getMostLikelyBuildingByCode(buildingCode, buildings)
        elif buildingName != "None":
            origin = getMostLikelyBuildingByName(buildingName, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            return []

        if buildingCodeDestination != "None":
            destination = getMostLikelyBuildingByCode(buildingCodeDestination, buildings)
        elif buildingNameDestination != "None":
            destination = getMostLikelyBuildingByName(buildingNameDestination, buildings)
        else:
            dispatcher.utter_message(text="I cannot find that building")
            return []



        response = requests.get(
            f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?location=true"
            f"&building_code={origin['code']}"
        )

        responseDestination = requests.get(
            f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings?location=true"
            f"&building_code={destination['code']}"
        )

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
