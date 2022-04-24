"""
List of constants used in other python files

@author Alex Thompson, W19007452
"""


HOW_CAN_I_HELP_BUTTONS = [
    {"title": "Courses", "payload": "/interest_in_course"},
    {"title": "Accommodation", "payload": "/university_accommodation"},
    {"title": "Visiting campus", "payload": "/visit_campus"},
    {"title": "Buildings", "payload": "/buildings"},
    {"title": "Lecturers", "payload": "/lecturers_option"},
    {"title": "Calendar", "payload": "/show_me_the_calendar"}
]

COURSE_INFORMATION_BUTTONS = [
    {"title": "modules", "payload": "/show_modules"},
    {"title": "entry requirements", "payload": "/entry_requirements"},
    {"title": "fees", "payload": "/course_fees"},
    {"title": "how to apply", "payload": "/apply"},
    {"title": "extensions", "payload": "/extensions"},
]

YES_NO_BUTTONS = [
    {"title": "Yes", "payload": "/affirm"},
    {"title": "No", "payload": "/deny"}
]

MODULE_YEAR_BUTTONS = [
    {"title": "All Modules", "payload": "/choose_module_type{\"year\":\"all\"}"},
    {"title": "Year 1 Modules", "payload": "/choose_module_type{\"year\":\"1\"}"},
    {"title": "Year 2 Modules", "payload": "/choose_module_type{\"year\":\"2\"}"},
    {"title": "Year 3 Modules", "payload": "/choose_module_type{\"year\":\"3\"}"},
    {"title": "Year 4 Modules", "payload": "/choose_module_type{\"year\":\"4\"}"}
]

VISIT_CAMPUS_BUTTONS = [
    {"title": "Open Days", "payload": "/utter_open_days"},
    {"title": "University Facilities", "payload": "/utter_campus_facilities"},
    {"title": "Show Campus Map", "payload": "/utter_campus_map"}
]

BUILDING_BUTTONS = [
    {"title": "Building Codes", "payload": "/building_codes_option"},
    {"title": "Building Locations", "payload": "/building_location_option"},
    {"title": "Show Building Map", "payload": "/utter_campus_map"}
]

LECTURER_BUTTONS = [
    {"title": "Emails", "payload": "/lecturer_email"}
]
