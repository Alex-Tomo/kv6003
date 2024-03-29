<?php

/**
 * get course related data depending on parameters
 * provided by the user
 *
 * @author Alex Thompson, W19007452
 */

class ApiCoursesGateway extends Gateway
{
  public function getCourses()
  {
    $sql = "SELECT * FROM kv6003_courses";
    $result = $this->getDatabase()->executeSQL($sql);
    $this->setResult($result);
  }

  public function getModules($courseCode)
  {
    $sql = "
      SELECT * 
      FROM kv6003_modules
      WHERE kv6003_modules.course_code = :course_code
    ";
    $params = [":course_code" => $courseCode];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }

  public function getModulesByYear($courseCode, $year)
  {
    $sql = "
      SELECT * 
      FROM kv6003_modules
      WHERE kv6003_modules.course_code = :course_code
      AND kv6003_modules.year = :year
    ";
    $params = [
      ":course_code" => $courseCode,
      ":year" => $year
    ];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }

  public function getEntryRequirements($courseCode)
  {
    $sql = "
      SELECT * 
      FROM kv6003_entry_requirements
      WHERE kv6003_entry_requirements.course_code = :course_code
    ";
    $params = [":course_code" => $courseCode];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }
}