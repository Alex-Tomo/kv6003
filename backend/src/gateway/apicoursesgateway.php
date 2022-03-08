<?php

class ApiCoursesGateway extends Gateway
{
    public function __construct()
    {
        $this->setDatabase(COURSE_DATABASE);
    }

    public function getCourses()
    {
        $sql = "SELECT * FROM courses";
        $result = $this->getDatabase()->executeSQL($sql);
        $this->setResult($result);
    }

    public function getModules($courseCode)
    {
        $sql = "SELECT * FROM modules 
                WHERE modules.course_code = :course_code";
        $params = [":course_code" => $courseCode];
        $result = $this->getDatabase()->executeSQL($sql, $params);
        $this->setResult($result);
    }

    public function getModulesByYear($courseCode, $year)
    {
        $sql = "SELECT * FROM modules
                WHERE modules.course_code = :course_code
                AND modules.year = :year";
        $params = [":course_code" => $courseCode, ":year" => $year];
        $result = $this->getDatabase()->executeSQL($sql, $params);
        $this->setResult($result);
    }
}