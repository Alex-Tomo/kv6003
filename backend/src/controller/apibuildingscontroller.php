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
      $this->getGateway()->getBuildingLocationByCode($this->getRequest()->getParameter("building_code"));
    } else if ($this->getRequest()->getParameter("building_name") !== null) {
      $this->getGateway()->getBuildingLocationByName($this->getRequest()->getParameter("building_name"));
    } else {
      $this->getGateway()->getAllBuildingCodes();
    }

    return $this->getGateway()->getResult();
  }
}