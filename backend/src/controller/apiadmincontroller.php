<?php

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
            $this->getGateway()->insertUnknownMessage($this->getRequest()->getParameter("message"));
        } else if ($this->getRequest()->getParameter("remove") !== null) {
            $this->getGateway()->removeUnknownMessage($this->getRequest()->getParameter("id"));
        } else {
            $this->getGateway()->getUnknownMessages();
        }

        return $this->getGateway()->getResult();
    }
}