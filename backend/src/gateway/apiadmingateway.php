<?php

class ApiAdminGateway extends Gateway
{
  public function insertUnknownMessage($message)
  {
    $sql = "INSERT INTO kv6003_unknown_messages (message) VALUES (:message)";
    $params = [":message" => $message];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }

  public function getUnknownMessages()
  {
    $sql = "SELECT * FROM kv6003_unknown_messages";
    $result = $this->getDatabase()->executeSQL($sql);
    $this->setResult($result);
  }

  public function removeUnknownMessage($messageId)
  {
    $sql = "DELETE FROM kv6003_unknown_messages WHERE kv6003_unknown_messages.id = :messageId";
    $params = [":messageId" => $messageId];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }

  public function insertIncorrectMessage($userMessage, $botMessage)
  {
    $sql = "INSERT INTO kv6003_incorrect_messages (user_message, bot_message) VALUES (:user_message, :bot_message)";
    $params = [":user_message" => $userMessage, ":bot_message" => $botMessage];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }

  public function getIncorrectMessages()
  {
    $sql = "SELECT * FROM kv6003_incorrect_messages";
    $result = $this->getDatabase()->executeSQL($sql);
    $this->setResult($result);
  }

  public function removeIncorrectMessage($messageId)
  {
    $sql = "DELETE FROM kv6003_incorrect_messages WHERE kv6003_incorrect_messages.id = :messageId";
    $params = [":messageId" => $messageId];
    $result = $this->getDatabase()->executeSQL($sql, $params);
    $this->setResult($result);
  }
}