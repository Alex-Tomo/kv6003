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
    // If a course code has been provided
    if ($this->getRequest()->getParameter("course_code") !== null) {
      if ($this->getRequest()->getParameter("year") === "all") {
        $this->getGateway()->getModules($this->getRequest()->getParameter("course_code"));
      } else {
        $this->getGateway()->getModulesByYear($this->getRequest()->getParameter("course_code"), $this->getRequest()->getParameter("year"));
      }

      if ($this->getRequest()->getParameter("entry_requirements") !== null) {
        $this->getGateway()->getEntryRequirements($this->getRequest()->getParameter("course_code"));
      }

    // get and all courses from the gateway
    } else {
      $this->getGateway()->getCourses();
    }

    return $this->getGateway()->getResult();
  }
}