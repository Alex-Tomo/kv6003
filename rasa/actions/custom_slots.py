class CustomSlots:
    course = None
    courseCode = None

    def setCourse(self, course):
        self.course = course

    def setCourseCode(self, courseCode):
        self.courseCode = courseCode

    def getCourse(self):
        return self.course

    def getCourseCode(self):
        return self.courseCode