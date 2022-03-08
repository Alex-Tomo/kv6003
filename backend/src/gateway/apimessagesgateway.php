<?php

class ApiMessagesGateway extends Gateway
{
    public function __construct()
    {
        $this->setDatabase(USER_DATABASE);
    }

    public function getMessages()
    {
        $sql = "SELECT * FROM messages";
        $result = $this->getDatabase()->executeSQL($sql);
        $this->setResult($result);
    }

    public function addMessage($sender, $message, $date_added)
    {
        $sql = "INSERT INTO messages (sender, message, date_added) VALUES (:sender, :message, :date_added)";
        $params = [":sender" => $sender, ":message" => $message, ":date_added" => $date_added];
        $result = $this->getDatabase()->executeSQL($sql, $params);
        $this->setResult($result);
    }
}