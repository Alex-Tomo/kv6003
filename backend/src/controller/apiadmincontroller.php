<?php

/**
 * Get unknown and incorrect messages from the gateway
 * only to be used by admin users
 *
 * @author Alex Thompson, W19007452
 */

class ApiAdminController extends Controller
{
  protected function setGateway()
  {
    $this->gateway = new ApiAdminGateway();
  }

  protected function processRequest()
  {
    if (!parent::isValidRequestMethod("POST")) return "error";

    $add = $this->getRequest()->getParameter("add");
    $incorrect = $this->getRequest()->getParameter("incorrect");
    $remove = $this->getRequest()->getParameter("remove");
    $userMessage = $this->getRequest()->getParameter("user_message");
    $botMessage = $this->getRequest()->getParameter("bot_message");
    $id = $this->getRequest()->getParameter("id");

    if ($add !== null) {
      if ($incorrect !== null) {
        $this->getGateway()->insertIncorrectMessage($userMessage, $botMessage);
      }
    } else if ($remove !== null) {
      if ($incorrect !== null) {
        $this->getGateway()->removeIncorrectMessage($id);
      }
    } else {
      if ($incorrect !== null) {
        $this->getGateway()->getIncorrectMessages();
      }
    }

    return $this->getGateway()->getResult();
  }
}