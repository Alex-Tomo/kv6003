<?php

class ErrorController extends Controller
{

    protected function processRequest()
    {
        throw new Exception("Internal Server Error");
    }
}
