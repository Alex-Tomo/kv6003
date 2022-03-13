import React from "react"

class Login extends React.Component {
  render() {
    return (
      <div id="login">
        <input
          className="input"
          type="text"
          placeholder="Username..."
          onChange={event => this.props.handleUsername(event)}
        />

        <br />
        <br />

        <input
          className="input"
          type="password"
          placeholder="Password..."
          onChange={event => this.props.handlePassword(event)}
        />
      </div>
    )
  }
}

export default Login
