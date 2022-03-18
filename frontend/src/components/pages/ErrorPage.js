import React from "react"
import {Link} from "react-router-dom";

class ErrorPage extends React.Component {
  render() {
    return (
      <div>
        <h1>This is not the page you are looking for...</h1>
        <Link to="/">Home</Link>
      </div>
    )
  }
}

export default ErrorPage