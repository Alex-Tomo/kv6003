<?php

class ApiBuildingsController extends Controller
{
  protected function setGateway()
  {
    $this->gateway = new ApiBuildingsGateway();
  }

  protected function processRequest()
  {
    if (!parent::isValidRequestMethod("GET")) return "error";

    if ($this->getRequest()->getParameter("building_code") !== null) {
      if ($this->getRequest()->getParameter("location") !== null) {
        $this->getGateway()->getBuildingLocation($this->getRequest()->getParameter("building_code"));
      } else {
        $this->getGateway()->getBuildingName($this->getRequest()->getParameter("building_code"));
      }
    } else {
      $this->getGateway()->getAllBuildingCodes();
    }

    return $this->getGateway()->getResult();
  }
}