<?php

include strtolower("config" . DIRECTORY_SEPARATOR . "autoloader.php");
include strtolower("config" . DIRECTORY_SEPARATOR . "exceptionhandler.php");
include strtolower("config" . DIRECTORY_SEPARATOR . "errorhandler.php");
include strtolower("config" . DIRECTORY_SEPARATOR . "constants.php");

spl_autoload_register("autoloader");
set_exception_handler("exceptionHandlerJSON");
set_error_handler("errorHandler");

ini_set("display_errors", DEVELOPMENT_MODE);
ini_set("display_startup_errors", DEVELOPMENT_MODE);


