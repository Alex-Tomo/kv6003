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
    let formData = new FormData()
    formData.append('username', this.state.username)
    formData.append('password', this.state.password)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/authenticate', {
      method: 'POST',
      body: formData
    }).then((response) => {
      if (response.status === 200) {
        return response.json()
      } else {
        this.reject()
      }
    }).then(r => {
      this.accept(r)
    }).catch((error) => {
      console.log(error)
    })
  }

  accept = (results) => {
    this.props.handleLogin(results.token, results.id, results.type)
  }

  reject = () => {
    console.log("could not log in")
  }

  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Log In</p>
            <button className="delete" aria-label="close"/>
          </header>
          <section className="modal-card-body">
            <Login
              handleUsername={this.handleUsername}
              handlePassword={this.handlePassword}
            />
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.handleLogin}>Log In</button>
            <button className="button cancel">Cancel</button>
          </footer>
        </div>
      </div>
    )
  }
}

export default LoginModal