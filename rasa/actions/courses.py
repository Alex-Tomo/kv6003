"""
Functions for getting courses and checking which course
the user has chosen

@author Alex Thompson, W19007452
"""

import Levenshtein
import requests
import string


def getCourses():
    courses = []
    response = requests.get("http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses")
    for i in range(0, len(response.json())):
        title = str(response.json()[i]['course_title'])
        code = str(response.json()[i]['course_code'])
        payload = "/select_course{\"course\":\"" + title + "\"}"

        courses.append({'title': title, 'code': code, 'payload': payload})

    return courses


def getMostLikelyCourse(course, courses):
    mostLikelyCourseTitle = None
    mostLikelyCourseCode = None
    ratio = None

    # if courseCode is None:
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


def getCourseModulesByYear(courseCode, year):
    if year.lower() == "all":
        response = requests.get(
            "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&year=all")
    else:
        response = requests.get(
            "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&year=" + year)

    modules = []
    for i in range(0, len(response.json())):
        modules.append({"title": response.json()[i]['module_title']})

    return modules


def getCourseEntryRequirements(courseCode):
    response = requests.get(
        "http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses?course_code=" + courseCode + "&entry_requirements=true")

    entry_requirements = ""
    entry_requirements += response.json()[0]['tariff_points'] + "\n"
    entry_requirements += response.json()[0]['subject_requirements'] + "\n"
    entry_requirements += response.json()[0]['gcse_requirements'] + "\n"
    entry_requirements += response.json()[0]['english_requirements'] + "\n"

    return entry_requirements
