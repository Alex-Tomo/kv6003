<?php

include strtolower("config".DIRECTORY_SEPARATOR."config.php");

$request = new Request();

$response = new JSONResponse();

switch ($request->getPath()) {
    case "api/signup":
        $controller = new ApiSignupController($request, $response);
        break;
    case "api/authenticate":
        $controller = new ApiAuthenticateController($request, $response);
        break;
    case "api/messages":
        $controller = new ApiMessagesController($request, $response);
        break;
    case "api/courses":
        $controller = new ApiCoursesController($request, $response);
        break;
    default:
        $controller = new ErrorController($request, $response);
        break;
}

echo $response->getData();
