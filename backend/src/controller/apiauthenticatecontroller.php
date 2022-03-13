<?php

use Firebase\JWT\JWT;

class ApiAuthenticateController extends Controller
{

    protected function setGateway()
    {
        $this->gateway = new ApiAuthenticateGateway();
    }

    protected function processRequest()
    {
        // checks the request method is a POST method
        if (!parent::isValidRequestMethod("POST")) return [];

        list($parameters, $errors) = $this->getParametersAndErrors();

        // if the parameters have errors
        if (parent::requestHasErrors($errors, 401)) return [];

        $this->getGateway()->findPassword($parameters['username']);

        // if there are not results
        if (!parent::requestHasResults()) return [];

        $hashpassword = $this->getGateway()->getResult()[0]['user_password'];

        // if the passwords do not match
        // return a 401 unauthorised response
        // and an empty array.
        if (!password_verify($parameters['password'], $hashpassword)) {
            parent::requestHasErrors("Unauthorized", 401);
            return [];
        }

        // The token will contain two items of data, a
        // user_id and an exp (expiry) time.
        $payload = array(
            "user_id" => $this->getGateway()->getResult()[0]['user_id'],
            "exp" => time() + 7776000
        );

        // Use the JWT class to encode the token
        $jwt = JWT::encode($payload, SECRET_KEY);
        $data = ['token' => $jwt];

        // If the token was not created then
        // return a 401 unauthorised response
        // and an empty array.
        if (!array_key_exists('token', $data)) {
            parent::requestHasErrors("Unauthorized", 401);
            return [];
        }

        return $data;
    }

    /**
     * Check the parameters are not null and are valid
     * otherwise set and return an error.
     *
     * @return array
     */
    private function getParametersAndErrors()
    {
        $parameters["username"] = null;
        $parameters["password"] = null;
        $errors = null;

        // if the email is null, set an error
        if ($this->getRequest()->getParameter("username") !== null) {
            $parameters["username"] = $this->getRequest()->
                                     getParameter("username");
        } else {
            $errors = "Unauthorized";
        }

        // if the password is null, set an error
        if ($this->getRequest()->getParameter("password") !== null) {
            $parameters["password"] = $this->getRequest()->
                                        getParameter("password");
        } else {
            $errors = "Unauthorized";
        }

        return array($parameters, $errors);
    }
}