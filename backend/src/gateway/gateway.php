<?php

/**
 * Abstract gateway to be extended by other gateway classes
 * Get, set the database connection
 * Get, set the data returned
 *
 * @author Alex Thompson, W19007452
 */

abstract class Gateway
{
  private $database;
  private $result;

  public function __construct()
  {
    $this->setDatabase();
  }

  protected function setDatabase()
  {
    $this->database = new Database();
  }

  protected function getDatabase()
  {
    return $this->database;
  }

  protected function setResult($result)
  {
    $this->result = $result;
  }

  public function getResult()
  {
    return $this->result;
  }
}