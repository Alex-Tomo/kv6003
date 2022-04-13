<?php

abstract class Controller
{
  private $request;
  private $response;
  protected $gateway;

  public function __construct($request, $response)
  {
    $this->setGateway();
    $this->setRequest($request);
    $this->setResponse($response);

    $data = $this->processRequest();
    $this->getResponse()->setData($data);
  }

  private function setRequest($request)
  {
    $this->request = $request;
  }

  protected function getRequest()
  {
    return $this->request;
  }

  private function setResponse($response)
  {
    $this->response = $response;
  }

  protected function getResponse()
  {
    return $this->response;
  }

  protected function setGateway()
  {

  }

  protected function getGateway()
  {
    return $this->gateway;
  }

  protected function isValidRequestMethod($requestMethod)
  {
    if ($this->getRequest()->getRequestMethod() === $requestMethod) {
      return true;
    }

    $this->getResponse()->setMessage("Method not allowed");
    $this->getResponse()->setStatusCode(405);

    return false;
  }

  protected function requestHasResults()
  {
    if (count($this->getGateway()->getResult()) > 0) {
      return true;
    }

    $this->getResponse()->setMessage("No Content Found");
    $this->getResponse()->setStatusCode(404);

    return false;
  }

  protected function requestHasErrors($errors, $errorCode)
  {
    if ($errors) {
      $this->getResponse()->setMessage($errors);
      $this->getResponse()->setStatusCode($errorCode);

      return true;
    }

    return false;
  }
}