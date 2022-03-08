<?php

class apiAuthenticateGateway extends Gateway
{
    public function __construct()
    {
        $this->setDatabase(USER_DATABASE);
    }

    public function findPassword($email)
    {
        $sql = "
            SELECT users.user_id, users.user_password 
            FROM users 
            WHERE users.user_email = :email
        ";
        $params = [":email" => $email];
        $result = $this->getDatabase()->executeSQL($sql, $params);
        $this->setResult($result);
    }
}