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
            $sender = $this->getRequest()->getParameter("sender");
            $message = $this->getRequest()->getParameter("message");
            $date_added = $this->getRequest()->getParameter("date_added");
            $this->getGateway()->addMessage($sender, $message, $date_added);
        } else {
            $this->getGateway()->getMessages();
        }

        return $this->getGateway()->getResult();
    }
}