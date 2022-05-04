import React from 'react'
import {Link} from 'react-router-dom'

/**
 * The Error page will be displayed if the user
 * attempts to access a none existing page
 *
 * @author - Alex Thompson, W19007452
 */

class ErrorPage extends React.Component {
  render() {
    return (
      <div>
        <h1>
          This is not the page you are looking for...
        </h1>
        <Link to='/'>Home</Link>
      </div>
    )
  }
}

export default ErrorPage