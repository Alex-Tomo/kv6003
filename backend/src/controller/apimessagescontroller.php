<?php

class ApiMessagesController extends Controller
{
  protected function setGateway()
  {
    $this->gateway = new ApiMessagesGateway();
  }

  protected function processRequest()
  {
    if (!parent::isValidRequestMethod("POST")) return "error";

    if ($this->getRequest()->getParameter("add") !== null) {
      $id = $this->getRequest()->getParameter("id");
      $type = $this->getRequest()->getParameter("type");
      $message = $this->getRequest()->getParameter("message");
      $date = $this->getRequest()->getParameter("date");
      $this->getGateway()->addMessage($id, $type, $message, $date);
    } else if ($this->getRequest()->getParameter("id") !== null) {
      $this->getGateway()->getMessages($this->getRequest()->getParameter("id"));
    }

    return $this->getGateway()->getResult();
  }
}