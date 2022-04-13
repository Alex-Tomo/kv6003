<?php

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