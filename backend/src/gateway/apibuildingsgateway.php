<?php

class ApiBuildingsGateway extends Gateway
{
  public function getBuildingName($buildingCode)
  {
    $sql = "SELECT building_name FROM kv6003_buildings
                WHERE kv6003_buildings.building_code = :building_code";
    $params = [":building_code" => $buildingCode];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }

  public function getAllBuildingCodes()
  {
    $sql = "SELECT building_code FROM kv6003_buildings";
    $result = $this->getDatabase()->executeSQL($sql);
    $this->setResult($result);
  }

  public function getBuildingLocation($buildingCode)
  {
    $sql = "SELECT * FROM kv6003_buildings
                WHERE kv6003_buildings.building_code = :building_code";
    $params = [":building_code" => $buildingCode];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }
}