<?php
//
//use Firebase\JWT\JWT;
//use Firebase\JWT\Key;
//
//class apiReadingListController extends Controller
//{
//    protected function setGateway()
//    {
//        $this->gateway = new apiReadingListGateway();
//    }
//
//    protected function processRequest()
//    {
//        // checks the request method is a POST method
//        if (!parent::isValidRequestMethod("POST")) return [];
//
//        list($parameters, $errors) = $this->getParametersAndErrors();
//        $this->findData($parameters);
//
//        // if the parameters have errors
//        if (parent::requestHasErrors($errors, 401)) return [];
//
//        return $this->getGateway()->getResult();
//    }
//
//    private function findData($parameters)
//    {
//        $this->getResponse()->setMessage("OK");
//        $this->getResponse()->setStatusCode(200);
//
//        if (!is_null($parameters['add'])) {
//            $this->getGateway()->add($parameters['user_id'], $parameters['add']);
//        } elseif (!is_null($parameters['remove'])) {
//            $this->getGateway()->remove($parameters['user_id'], $parameters['remove']);
//        } else {
//            $this->getGateway()->findAll($parameters['user_id']);
//        }
//    }
//
//    private function getParametersAndErrors()
//    {
//        $parameters["token"] = null;
//        $parameters["add"] = null;
//        $parameters["remove"] = null;
//        $errors = null;
//
//        // checks the token parameter is null, if so set an error
//        if ($this->getRequest()->getParameter("token") !== null) {
//            $parameters["token"] = $this->getRequest()->getParameter("token");
//
//            $decoded = JWT::decode($parameters['token'], new Key(SECRET_KEY, 'HS256'));
//            $parameters['user_id'] = $decoded->user_id;
//        } else {
//            $errors = "Unauthorized";
//        }
//
//        if ($this->getRequest()->getParameter("add") !== null) {
//            $parameters["add"] = $this->getRequest()->getParameter("add");
//        }
//
//        if ($this->getRequest()->getParameter("remove") !== null) {
//            $parameters["remove"] = $this->getRequest()->getParameter("remove");
//        }
//
//        return array($parameters, $errors);
//    }
//}