<?php

abstract class Gateway
{
    private $database;
    private $result;

    protected function setDatabase($database)
    {
        $this->database = new Database($database);
    }

    protected function getDatabase()
    {
        return $this->database;
    }

    protected function setResult($result)
    {
        $this->result = $result;
    }

    public function getResult()
    {
        return $this->result;
    }
}