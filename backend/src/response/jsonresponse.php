<?php

/**
 * Returns the data in JSON format
 * Sets the head to allow for JSON content
 *
 * @author Alex Thompson, W19007452
 */

class JSONResponse
{
  private $data;
  private $message;
  private $statusCode;

  public function __construct()
  {
    $this->setHeader();
  }

  private function setHeader()
  {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Content-Type: application/json; charset=UTF-8");
  }

  public function setData($data)
  {
    $this->data = $data;
  }

  public function getData()
  {
    http_response_code($this->statusCode);

    return json_encode($this->data, JSON_PRETTY_PRINT);
  }

  public function setMessage($message)
  {
    $this->message = $message;
  }

  public function setStatusCode($statusCode)
  {
    $this->statusCode = $statusCode;
  }


}