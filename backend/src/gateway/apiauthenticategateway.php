<?php

/**
 * get user details for authentication
 *
 * @author Alex Thompson, W19007452
 */

class apiAuthenticateGateway extends Gateway
{
  public function findPassword($username)
  {
    $sql = "
      SELECT kv6003_users.user_id, kv6003_users.user_password, kv6003_users.user_type
      FROM kv6003_users
      WHERE kv6003_users.username = :username
    ";
    $params = [":username" => $username];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }
}