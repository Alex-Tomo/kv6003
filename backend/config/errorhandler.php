<?php

function errorHandler($errno, $errstr, $errfile, $errline)
{
    if (DEVELOPMENT_MODE || ($errno != 2 && $errno != 8)) {
        throw new Exception(
            "Error Detected: [$errno] $errstr file: $errfile line: $errline",
            1
        );
    }
}