"""
The CustomSlots class holds variables instead
of relying on Slots

@author Alex Thompson, W19007452
"""


class CustomSlots:
    course = None
    courseCode = None
    lastAction = None
    location = None

    def setCourse(self, course):
        self.course = course

    def setCourseCode(self, courseCode):
        self.courseCode = courseCode

    def setLocation(self, location):
        self.location = location

    def setLastAction(self, lastAction):
        self.lastAction = lastAction

    def getCourse(self):
        return self.course

    def getCourseCode(self):
        return self.courseCode

    def getLocation(self):
        return self.location

    def getLastAction(self):
        return self.lastAction
