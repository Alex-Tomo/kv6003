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

  public function addMessage($id, $type, $message, $link, $date)
  {
    $sql = "
      INSERT INTO kv6003_messages (user_id, type, message, link, date_added) 
      VALUES (:id, :type, :message, :link, :date)
    ";
    $params = [
      ":id" => $id,
      ":type" => $type,
      ":message" => $message,
      ":link" => $link,
      ":date" => $date
    ];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }

  public function removeMessages($id)
  {
    $sql = "
      DELETE FROM kv6003_messages  
      WHERE user_id = :id
    ";
    $params = [":id" => $id];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }
}