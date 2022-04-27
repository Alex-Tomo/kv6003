<?php

/**
 * Sets the database connection and has a function
 * to execute SQL queries
 *
 * @author Alex Thompson, W19007452
 */

class Database
{
  private $dbConnection;

  public function __construct()
  {
    $this->setDbConnection();
  }

  private function setDbConnection()
  {
    $this->dbConnection = new PDO(
      "mysql:host=localhost;dbname=unn_w19007452",
      "unn_w19007452",
      "Password"
    );
    $this->dbConnection->setAttribute(
      PDO::ATTR_ERRMODE,
      PDO::ERRMODE_EXCEPTION
    );
  }

  public function executeSQL($sql, $params = [])
  {
    $stmt = $this->dbConnection->prepare($sql);
    $stmt->execute($params);

    try {
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      return $e;
    }
  }
}