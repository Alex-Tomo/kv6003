"""
Functions for getting building related queries

@author Alex Thompson, W19007452
"""

import Levenshtein
import requests
import string


def getAllBuildings():
    response = requests.get(
        f"http://unn-w19007452.newnumyspace.co.uk/kv6003/api/buildings"
    )

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
            ratio = Levenshtein.ratio(string.capwords(buildingCode), string.capwords(buildings[i]['code']))
            mostLikelyBuildingName = buildings[i]['name']
            mostLikelyBuildingCode = buildings[i]['code']

        if ratio < Levenshtein.ratio(string.capwords(buildingCode), string.capwords(buildings[i]['code'])):
            ratio = Levenshtein.ratio(string.capwords(buildingCode), string.capwords(buildings[i]['code']))
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
