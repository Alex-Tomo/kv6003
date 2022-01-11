<?php

include strtolower("config".DIRECTORY_SEPARATOR."config.php");

$request = new Request();

$response = new JSONResponse();

switch ($request->getPath()) {
    case "api/authenticate":
        $controller = new ApiAuthenticateController($request, $response);
        break;
//    case "api/readinglist":
//        $controller = new ApiReadinglistController($request, $response);
//        break;
    default:
        $controller = new ErrorController($request, $response);
        break;
}

echo $response->getData();
