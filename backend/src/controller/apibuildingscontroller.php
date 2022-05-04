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
    $buildingCode = $this->getRequest()->getParameter("building_code");
    $buildingName = $this->getRequest()->getParameter("building_name");

    if ($buildingCode !== null) {
      $this->getGateway()->getBuildingLocationByCode($buildingCode);
    } else if ($buildingName !== null) {
      $this->getGateway()->getBuildingLocationByName($buildingName);
    } else {
      $this->getGateway()->getAllBuildingCodes();
    }

    return $this->getGateway()->getResult();
  }
}