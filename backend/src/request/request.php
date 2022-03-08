<?php


class Request
{
    private $url;
    private $basePath;
    private $path;
    private $requestMethod;

    public function __construct()
    {
        $this->setUrl();
        $this->setBasePath();
        $this->setPath();
        $this->requestMethod = $_SERVER["REQUEST_METHOD"];
    }

    public function getParameter($param)
    {
        if ($this->getRequestMethod() === "GET") {
            $param = filter_input(INPUT_GET, $param, FILTER_SANITIZE_SPECIAL_CHARS);
        }
        if ($this->getRequestMethod() === "POST") {
            $param = filter_input(INPUT_POST, $param, FILTER_SANITIZE_SPECIAL_CHARS);
        }
        return $param;
    }

    public function getRequestMethod()
    {
        return $this->requestMethod;
    }

    public function getPath()
    {
        return $this->path;
    }

    private function setPath()
    {
        $this->path = parse_url($this->getUrl())["path"];
        $this->path = str_replace($this->getBasePath(), "", $this->path);
        $this->path = trim($this->path, '/');
        $this->path = strtolower($this->path);
    }

    private function getUrl()
    {
        return $this->url;
    }

    private function setUrl()
    {
        $this->url = $_SERVER["REQUEST_URI"];
    }

    private function getBasePath()
    {
        return $this->basePath;
    }

    private function setBasePath()
    {
        $this->basePath = BASEPATH;
    }
}