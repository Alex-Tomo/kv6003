<?php

class ApiCourseGateway extends Gateway
{
    public function __construct()
    {
        $this->setDatabase(UNI_DATABASE);
    }

    public function findAllCourses()
    {
        $sql = "
            SELECT * FROM courses
        ";
        $result = $this->getDatabase()->executeSQL($sql);
        $this->setResult($result);
    }

    public function getModules($course_code)
    {
        $sql = "
            SELECT module_title, module_code, module_core, module_credits
            FROM modules 
            WHERE course_code = :course_code
        ";
        $params = [":course_code" => $course_code];
        $result = $this->getDatabase()->executeSQL($sql, $params);
        $this->setResult($result);
    }
}