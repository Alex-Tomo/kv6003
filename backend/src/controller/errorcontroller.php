<?php

/**
 * @return Exception - If the user accessed an invalid page,
 *                     throw a new exception
 *
 * @author Alex Thompson, W19007452
 */

class ErrorController extends Controller
{
  protected function processRequest()
  {
    throw new Exception("Internal Server Error");
  }
}
