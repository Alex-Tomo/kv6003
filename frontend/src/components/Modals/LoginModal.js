import React from "react"
import Login from "../forms/Login";

class LoginModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: "",
      password: ""
    }
  }

  handleUsername = (event) => {
    this.setState({
      username: event.target.value
    })
  }

  handlePassword = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  handleLogin = () => {
    console.log(this.state.username)
    console.log(this.state.password)
    this.props.handleLogin()
  }

  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Log In</p>
            <button className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            <Login
              handleUsername={this.handleUsername}
              handlePassword={this.handlePassword}
            />
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.handleLogin}>Log In</button>
            <button className="button cancel" onClick={this.closeModal}>Cancel</button>
          </footer>
        </div>
      </div>
    )
  }
}

export default LoginModal