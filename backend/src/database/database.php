<?php

class Database
{
    private $dbConnection;

    public function __construct($db)
    {
        $this->setDbConnection($db);
    }

    private function setDbConnection($db)
    {
        $this->dbConnection = new PDO("sqlite:{$db}");
        $this->dbConnection->setAttribute(
            PDO::ATTR_ERRMODE,
            PDO::ERRMODE_EXCEPTION
        );
    }

    public function executeSQL($sql, $params = [])
    {
        $stmt = $this->dbConnection->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}