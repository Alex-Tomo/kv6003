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

    if ($this->getRequest()->getParameter("add") !== null) {
      if ($this->getRequest()->getParameter("unknown") !== null) {
        $this->getGateway()->insertUnknownMessage($this->getRequest()->getParameter("message"));
      } else if ($this->getRequest()->getParameter("incorrect") !== null) {
        $this->getGateway()->insertIncorrectMessage($this->getRequest()->getParameter("user_message"), $this->getRequest()->getParameter("bot_message"));
      }
    } else if ($this->getRequest()->getParameter("remove") !== null) {
      if ($this->getRequest()->getParameter("unknown") !== null) {
        $this->getGateway()->removeUnknownMessage($this->getRequest()->getParameter("id"));
      } else if ($this->getRequest()->getParameter("incorrect") !== null) {
        $this->getGateway()->removeIncorrectMessage($this->getRequest()->getParameter("id"));
      }
    } else {
      if ($this->getRequest()->getParameter("unknown") !== null) {
        $this->getGateway()->getUnknownMessages();
      } else if ($this->getRequest()->getParameter("incorrect") !== null) {
        $this->getGateway()->getIncorrectMessages();
      }
    }

    return $this->getGateway()->getResult();
  }
}