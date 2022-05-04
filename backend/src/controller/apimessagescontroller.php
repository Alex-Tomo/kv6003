<?php

/**
 * Get all messages from the gateway and returns them
 *
 * @author Alex Thompson, W19007452
 */

class ApiMessagesController extends Controller
{
  protected function setGateway()
  {
    $this->gateway = new ApiMessagesGateway();
  }

  protected function processRequest()
  {
    // if the request is GET return an error
    if (!parent::isValidRequestMethod("POST")) return ["error"];

    $add = $this->getRequest()->getParameter("add");
    $remove = $this->getRequest()->getParameter("remove");
    $id = $this->getRequest()->getParameter("id");
    $type = $this->getRequest()->getParameter("type");
    $message = $this->getRequest()->getParameter("message");
    $link = $this->getRequest()->getParameter("link");
    $date = $this->getRequest()->getParameter("date");

    // Add a new message
    if ($add !== null) {
      $this->getGateway()->addMessage($id, $type, $message, $link, $date);
    } else if ($remove !== null) {
      $this->getGateway()->removeMessages($this->getRequest()->getParameter("id"));
    // get all users messages
    } else if ($id !== null) {
      $this->getGateway()->getMessages($this->getRequest()->getParameter("id"));
    }

    return $this->getGateway()->getResult();
  }
}