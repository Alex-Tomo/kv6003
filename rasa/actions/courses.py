import Levenshtein
import requests


def getCourses():
    courses = []
    response = requests.get("http://unn-w19007452.newnumyspace.co.uk/kv6003/api/courses")
    for i in range(0, len(response.json())):
        title = str(response.json()[i]['course_title']).lower()
        code = str(response.json()[i]['course_title'])
        payload = "/select_course{\"course\":\"" + title + "\"}"

        courses.append({'title': title, 'code': code, 'payload': payload})

    return courses


def getMostLikelyCourse(course, courses):
    courseCode = None

    for i in range(len(courses)):
        if course is courses[i]['title']:
            courseCode = courses[i]['code']

    mostLikelyCourseTitle = None
    mostLikelyCourseCode = None
    ratio = None

    if courseCode is None:
        for i in range(len(courses)):
            if ratio is None:
                ratio = Levenshtein.ratio(course, courses[i]['title'])
                mostLikelyCourseTitle = courses[i]['title']
                mostLikelyCourseCode = courses[i]['code']

            if ratio < Levenshtein.ratio(course, courses[i]['title']):
                ratio = Levenshtein.ratio(course, courses[i]['title'])
                mostLikelyCourseTitle = courses[i]['title']
                mostLikelyCourseCode = courses[i]['code']

        course = mostLikelyCourseTitle
        courseCode = mostLikelyCourseCode

    return {"ratio": ratio, "course": course, "courseCode": courseCode}

