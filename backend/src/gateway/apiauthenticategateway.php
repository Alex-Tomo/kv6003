<?php

class apiAuthenticateGateway extends Gateway
{
    public function __construct()
    {
        $this->setDatabase();
    }

    public function findPassword($username)
    {
        $sql = "
            SELECT kv6003_users.user_id, kv6003_users.user_password
            FROM kv6003_users
            WHERE kv6003_users.username = :username
        ";
        $params = [":username" => $username];
        $result = $this->getDatabase()->executeSQL($sql, $params);
        $this->setResult($result);
    }
}