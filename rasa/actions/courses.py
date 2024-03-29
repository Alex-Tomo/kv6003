"""
Functions for getting courses and checking which course
the user has chosen

@author Alex Thompson, W19007452
"""

import Levenshtein
import requests
import string
from .constants.constants import BASE_COURSE_URL


"""
Gets all the course names and codes from the database 
"""
def getCourses():
    courses = []
    response = requests.get(BASE_COURSE_URL)
    for i in range(0, len(response.json())):
        title = str(response.json()[i]['course_title'])
        code = str(response.json()[i]['course_code'])
        payload = "/select_course{\"course\":\"" + title + "\"}"

        courses.append({'title': title, 'code': code, 'payload': payload})

    return courses


"""
Uses Levenshtein distance to get the course thats
most similiar to the given course

course -> course to be checked
courses -> List of all the courses in the database 
"""
def getMostLikelyCourse(course, courses):
    mostLikelyCourseTitle = None
    mostLikelyCourseCode = None
    ratio = None

    for i in range(len(courses)):
        if ratio is None:
            ratio = Levenshtein.ratio(string.capwords(course), string.capwords(courses[i]['title']))
            mostLikelyCourseTitle = courses[i]['title']
            mostLikelyCourseCode = courses[i]['code']

        if ratio < Levenshtein.ratio(string.capwords(course), string.capwords(courses[i]['title'])):
            ratio = Levenshtein.ratio(string.capwords(course), string.capwords(courses[i]['title']))
            mostLikelyCourseTitle = courses[i]['title']
            mostLikelyCourseCode = courses[i]['code']

    course = mostLikelyCourseTitle
    courseCode = mostLikelyCourseCode

    return {"ratio": ratio, "course": course, "courseCode": courseCode}


"""
Requests all the modules in a course

courseCode -> used to filter all the courses
year -> can be 'all', 1, 2, 3 or 4
"""
def getCourseModulesByYear(courseCode, year):
    if year.lower() == "all":
        response = requests.get(
            f"{BASE_COURSE_URL}?course_code={courseCode}&year=all")
    else:
        response = requests.get(
            f"{BASE_COURSE_URL}?course_code={courseCode}&year={year}"
        )

    modules = []
    for i in range(0, len(response.json())):
        modules.append({"title": response.json()[i]['module_title']})

    return modules


"""
Requests the entry requirements for a course

courseCode -> used to filter all the courses
"""
def getCourseEntryRequirements(courseCode):
    response = requests.get(
        f"{BASE_COURSE_URL}?course_code={courseCode}&entry_requirements=true"
    )

    entry_requirements = ""
    entry_requirements += response.json()[0]['tariff_points'] + "\n"
    entry_requirements += response.json()[0]['subject_requirements'] + "\n"
    entry_requirements += response.json()[0]['gcse_requirements'] + "\n"
    entry_requirements += response.json()[0]['english_requirements'] + "\n"

    return entry_requirements
