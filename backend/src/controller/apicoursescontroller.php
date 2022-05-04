<?php

/**
 * Get course related data and return in JSON format
 *
 * @author Alex Thompson, W19007452
 */

class ApiCoursesController extends Controller
{
  protected function setGateway()
  {
    $this->gateway = new ApiCoursesGateway();
  }

  protected function processRequest()
  {
    $courseCode = $this->getRequest()->getParameter("course_code");
    $year = $this->getRequest()->getParameter("year");
    $entryRequirements = $this->getRequest()->getParameter("entry_requirements");

    // If a course code has been provided
    if ($courseCode !== null) {
      if ($year === "all") {
        $this->getGateway()->getModules($courseCode);
      } else {
        $this->getGateway()->getModulesByYear($courseCode, $year);
      }

      if ($entryRequirements !== null) {
        $this->getGateway()->getEntryRequirements($courseCode);
      }
    // get and all courses from the gateway
    } else {
      $this->getGateway()->getCourses();
    }

    return $this->getGateway()->getResult();
  }
}