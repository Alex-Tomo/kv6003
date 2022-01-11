<?php

function exceptionHandler($exception)
{
    echo "internal server error!";
    echo " Message: ".$exception->getMessage();
    echo " File: ".$exception->getFile();
    echo " Line: ".$exception->getLine();
}

function exceptionHandlerJSON($exception)
{
    if (DEVELOPMENT_MODE) {
        exceptionHandler($exception);
    } else {
        header("Access-Control-Allow-Origin: *");
        header("
            Access-Control-Allow-Methods: 
                OPTIONS,
                GET,
                POST,
                PUT,
                DELETE
        ");
        header("Access-Control-Max-Age: 3600");
        header("
            Access-Control-Allow-Headers: 
                Content-Type, 
                Access-Control-Allow-Headers, 
                Authorization, 
                X-Requested-With
        ");
        header("Content-Type: application/json; charset=UTF-8");

        http_response_code(500);
        $array['code'] = 500;
        $array['message'] = "Internal Server Error";
        echo json_encode($array);
    }
}
