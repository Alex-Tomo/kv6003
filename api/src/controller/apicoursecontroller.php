<?php

class ApiCourseController extends Controller
{
    protected function setGateway()
    {
        $this->gateway = new ApiCourseGateway();
    }

    protected function processRequest()
    {
        if ($this->getRequest()->getParameter("course_code") !== null) {
            $this->getGateway()->getModules($this->getRequest()->getParameter("course_code"));
        } else {
            $this->getGateway()->findAllCourses();
        }

        return $this->getGateway()->getResult();
    }

//    private function getParametersAndErrors()
//    {
//        $parameters["email"] = null;
//        $parameters["password"] = null;
//        $errors = null;
//
//        // if the email is null, set an error
//        if ($this->getRequest()->getParameter("email") !== null) {
//            $parameters["email"] = $this->getRequest()->
//            getParameter("email");
//        } else {
//            $errors = "Unauthorized";
//        }
//
//        // if the password is null, set an error
//        if ($this->getRequest()->getParameter("password") !== null) {
//            $parameters["password"] = $this->getRequest()->
//            getParameter("password");
//        } else {
//            $errors = "Unauthorized";
//        }
//
//        return array($parameters, $errors);
//    }
}