"""
Functions for getting lecturer related queries

@author Alex Thompson, W19007452
"""

import Levenshtein
import string


"""
Returns a list of lecturers names and emails
"""
def getLecturers():
    lecturers = [
        {"name": "Jeremy Ellman", "email": "jeremy.ellman@northumbria.ac.uk"},
        {"name": "Christina Vasiliou", "email": "christina.vasiliou@northumbria.ac.uk"},
        {"name": "Kay Rogage", "email": "kay.rogage@northumbria.ac.uk"},
        {"name": "Alex Thompson", "email": "alex.j.thompson@northumbria.ac.uk"}
    ]

    return lecturers


"""
Uses the Levenshtein distance to check the most likely
lecturer by name then return their email

lecturer -> the lecturers name to be checked
"""
def getMostLikelyLecturer(lecturer):
    lecturers = getLecturers()
    mostLikelyLecturerName = None
    mostLikelyLecturerEmail = None
    ratio = None

    for i in range(len(lecturers)):
        if ratio is None:
            ratio = Levenshtein.ratio(string.capwords(lecturer), string.capwords(lecturers[i]['name']))
            mostLikelyLecturerName = lecturers[i]['name']
            mostLikelyLecturerEmail = lecturers[i]['email']

        if ratio < Levenshtein.ratio(string.capwords(lecturer), string.capwords(lecturers[i]['name'])):
            ratio = Levenshtein.ratio(string.capwords(lecturer), string.capwords(lecturers[i]['name']))
            mostLikelyLecturerName = lecturers[i]['name']
            mostLikelyLecturerEmail = lecturers[i]['email']

    lecturerName = mostLikelyLecturerName
    lecturerEmail = mostLikelyLecturerEmail

    return {"ratio": ratio, "lecturerName": lecturerName, "lecturerEmail": lecturerEmail}
