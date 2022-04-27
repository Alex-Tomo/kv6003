<?php

/**
 * Defines the API and images routes
 *
 * Uses Firebase JWT token repository for
 * authentication purposes.
 *
 * @author Alex Thompson, W19007452
 */

include strtolower("config" . DIRECTORY_SEPARATOR . "config.php");

$request = new Request();
$response = new JSONResponse();

switch ($request->getPath()) {
  case "api/signup":
    $controller = new ApiSignupController($request, $response);
    break;
  case "api/authenticate":
    $controller = new ApiAuthenticateController($request, $response);
    break;
  case "api/admin":
    $controller = new ApiAdminController($request, $response);
    break;
  case "api/messages":
    $controller = new ApiMessagesController($request, $response);
    break;
  case "api/courses":
    $controller = new ApiCoursesController($request, $response);
    break;
  case "api/buildings":
    $controller = new ApiBuildingsController($request, $response);
    break;
  case "campus_map":
    header("Content-type: image/png");
    readfile("images/campus_map.png");
    break;
  default:
    $controller = new ErrorController($request, $response);
    break;
}

// if case is campus map, result should not be echoed
if ($response != null) {
  echo $response->getData();
}