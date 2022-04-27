<?php

/**
 * Handles new users creating accounts
 *
 * @author Alex Thompson, W19007452
 */

class ApiSignupController extends Controller
{
  protected function setGateway()
  {
    $this->gateway = new ApiSignupGateway();
  }

  protected function processRequest()
  {
    // checks the request method is a POST method
    if (!parent::isValidRequestMethod("POST")) return [];

    list($parameters, $errors) = $this->getParametersAndErrors();

    // if the parameters have errors
    if (parent::requestHasErrors($errors, 401)) return [];

    $this->getGateway()->addUser($parameters['username'], $parameters['password']);

    return $this->getGateway()->getResult();
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
      $parameters["password"] = password_hash($this->getRequest()->
      getParameter("password"), PASSWORD_DEFAULT);
    } else {
      $errors = "Unauthorized";
    }

    return array($parameters, $errors);
  }
}