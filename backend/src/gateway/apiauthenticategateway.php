<?php

class apiAuthenticateGateway extends Gateway
{
    public function __construct()
    {
        $this->setDatabase(USER_DATABASE);
    }

    public function findPassword($username)
    {
        $sql = "
            SELECT users.user_id, users.user_password 
            FROM users 
            WHERE users.username = :username
        ";
        $params = [":username" => $username];
        $result = $this->getDatabase()->executeSQL($sql, $params);
        $this->setResult($result);
    }
}