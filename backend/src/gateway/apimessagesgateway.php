<?php

/**
 * get all messages from the message database
 * Add a new message into the message database
 *
 * @author Alex Thompson, W19007452
 */

class ApiMessagesGateway extends Gateway
{
  public function getMessages($id)
  {
    $sql = "
      SELECT * 
      FROM kv6003_messages 
      WHERE user_id = :id
    ";
    $result = $this->getDatabase()->executeSQL($sql, [":id" => $id]);
    $this->setResult($result);
  }

  public function addMessage($id, $type, $message, $date)
  {
    $sql = "
      INSERT INTO kv6003_messages (user_id, type, message, date_added) 
      VALUES (:id, :type, :message, :date)
    ";
    $params = [
      ":id" => $id,
      ":type" => $type,
      ":message" => $message,
      ":date" => $date
    ];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }
}