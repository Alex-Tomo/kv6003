import React from "react"

class Signup extends React.Component {
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
          <br />
          <br />

          <input
              className="input"
              type="password"
              placeholder="Repeat Password..."
              onChange={event => this.props.handleRepeatPassword(event)}
          />
        </div>
    )
  }
}

export default Signup
