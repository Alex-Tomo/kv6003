<?php

/**
 * get building related data depending on parameters
 * provided by the user
 *
 * @author Alex Thompson, W19007452
 */

class ApiBuildingsGateway extends Gateway
{
  public function getBuildingName($buildingCode)
  {
    $sql = "
      SELECT building_name 
      FROM kv6003_buildings
      WHERE kv6003_buildings.building_code = :building_code
    ";
    $params = [":building_code" => $buildingCode];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }

  public function getAllBuildingCodes()
  {
    $sql = "
      SELECT building_code, building_name 
      FROM kv6003_buildings
    ";
    $result = $this->getDatabase()->executeSQL($sql);
    $this->setResult($result);
  }

  public function getBuildingLocationByCode($buildingCode)
  {
    $sql = "
      SELECT * 
      FROM kv6003_buildings
      WHERE kv6003_buildings.building_code = :building_code
    ";
    $params = [":building_code" => $buildingCode];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }

  public function getBuildingLocationByName($buildingName)
  {
    $sql = "
      SELECT * 
      FROM kv6003_buildings
      WHERE kv6003_buildings.building_name = :building_name
    ";
    $params = [":building_name" => $buildingName];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }
}