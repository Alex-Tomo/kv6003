<?php

/**
 * @param $className - name of class to search for
 * @throws Exception - throw exception if the class
 *                     cannot be found
 *
 * @author Alex Thompson, W19007452
 */

function autoloader($className)
{
  foreach (DIRECTORIES as $directory) {
    $fileName = "src\\$directory\\" . strtolower($className) . ".php";
    $fileName = str_replace(
      '\\',
      DIRECTORY_SEPARATOR,
      $fileName
    );
    if (is_readable($fileName)) break;
  }

  if (is_readable($fileName)) {
    include_once $fileName;
  } else {
    throw new Exception("File not found : " . $className);
  }
}
