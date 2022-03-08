import React from "react"

class Login extends React.Component {
  render() {
    return (
      <div id="login">
        <label htmlFor="login-username">username</label><input name="login-username" type="text"/>
        <label htmlFor="login-password">password</label><input name="login-password" type="password"/>
        <button>Login</button>
      </div>
    )
  }
}

export default Login
