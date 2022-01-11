<?php

function autoloader($className)
{
    foreach (DIRECTORIES as $directory) {
        $fileName = "src\\$directory\\" . strtolower($className) . ".php";
        $fileName = str_replace('\\', DIRECTORY_SEPARATOR, $fileName);
        if (is_readable($fileName)) break;
    }

    if (is_readable($fileName)) {
        include_once $fileName;
    } else {
        throw new Exception("File not found : " . $className);
    }
}
