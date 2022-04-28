"""
Functions for getting building related queries

@author Alex Thompson, W19007452
"""

import Levenshtein
import requests
import string
from .constants.constants import BASE_BUILDING_URL


def getAllBuildings():
    response = requests.get(BASE_BUILDING_URL)

    buildings = []
    for i in range(len(response.json())):
        buildings.append({
            "code": response.json()[i]['building_code'],
            "name": response.json()[i]['building_name']
        })

    return buildings


def getMostLikelyBuildingByCode(buildingCode, buildings):
    mostLikelyBuildingName = None
    mostLikelyBuildingCode = None
    ratio = None

    for i in range(len(buildings)):
        if ratio is None:
            ratio = Levenshtein.ratio(str(buildingCode), str(buildings[i]['code']).lower())
            mostLikelyBuildingName = buildings[i]['name']
            mostLikelyBuildingCode = buildings[i]['code']

        if ratio < Levenshtein.ratio(str(buildingCode), str(buildings[i]['code']).lower()):
            ratio = Levenshtein.ratio(str(buildingCode), str(buildings[i]['code']).lower())
            mostLikelyBuildingName = buildings[i]['name']
            mostLikelyBuildingCode = buildings[i]['code']

    buildingName = mostLikelyBuildingName
    buildingCode = mostLikelyBuildingCode

    return {"ratio": ratio, "name": buildingName, "code": buildingCode}


def getMostLikelyBuildingByName(buildingName, buildings):
    mostLikelyBuildingName = None
    mostLikelyBuildingCode = None
    ratio = None

    for i in range(len(buildings)):
        if ratio is None:
            ratio = Levenshtein.ratio(string.capwords(buildingName), string.capwords(buildings[i]['name']))
            mostLikelyBuildingName = buildings[i]['name']
            mostLikelyBuildingCode = buildings[i]['code']

        if ratio < Levenshtein.ratio(string.capwords(buildingName), string.capwords(buildings[i]['name'])):
            ratio = Levenshtein.ratio(string.capwords(buildingName), string.capwords(buildings[i]['name']))
            mostLikelyBuildingName = buildings[i]['name']
            mostLikelyBuildingCode = buildings[i]['code']

    buildingName = mostLikelyBuildingName
    buildingCode = mostLikelyBuildingCode

    return {"ratio": ratio, "name": buildingName, "code": buildingCode}
