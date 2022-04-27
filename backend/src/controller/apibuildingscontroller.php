<?php

/**
 * Get building related data from the gateway
 *
 * @author Alex Thompson, W19007452
 */

class ApiBuildingsController extends Controller
{
  protected function setGateway()
  {
    $this->gateway = new ApiBuildingsGateway();
  }

  protected function processRequest()
  {
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