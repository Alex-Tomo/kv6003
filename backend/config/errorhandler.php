<?php

/**
 * @param $errno - error number
 * @param $errstr - error string
 * @param $errfile - error file location
 * @param $errline - error line number
 *
 * @throws Exception - throw exception if development mode is true
 *
 * @author Alex Thompson
 */

function errorHandler($errno, $errstr, $errfile, $errline)
{
  if (DEVELOPMENT_MODE || ($errno != 2 && $errno != 8)) {
    throw new Exception(
      "Error Detected: [$errno] $errstr file: $errfile line: $errline",
      1
    );
  }
}