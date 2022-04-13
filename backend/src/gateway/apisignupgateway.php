<?php

class ApiSignupGateway extends Gateway
{
  public function addUser($username, $password)
  {
    $sql = "
            INSERT INTO kv6003_users (username, user_password) VALUES (:username, :password)
        ";
    $params = [":username" => $username, ":password" => $password];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }
}