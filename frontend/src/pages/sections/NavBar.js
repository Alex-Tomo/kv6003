import React from "react"

class NavBar extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSignup = () => {
    this.props.displaySignupModal().then(() => {
      document.querySelectorAll(('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .cancel') || []).forEach((close) => {
        close.addEventListener('click', () => {
          this.props.closeModal()
        })
      })
    })
  }

  handleLogin = () => {
    this.props.displayLoginModal().then(() => {
      document.querySelectorAll(('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .cancel') || []).forEach((close) => {
        close.addEventListener('click', () => {
          this.props.closeModal()
        })
      })
    })
  }

  render() {
    let buttons = ""

    if (this.props.loggedIn) {
      buttons = (
        <div style={{marginRight: "10px"}}>
          <button className="button" onClick={this.props.handleLogout}>Logout</button>
        </div>
      )
    } else {
      buttons = (
        <div style={{marginRight: "10px"}}>
          <button className="button" onClick={this.handleSignup}>Sign Up</button>
          <button className="button" onClick={this.handleLogin}>Log In</button>
        </div>
      )
    }

    return (
      <div>
        <div
          id="nav"
          className={this.props.colourTheme}
        >
          <h1>NUBot</h1>
          <div style={{display: "flex"}}>
            {buttons}
            <div style={{display: "flex", flexDirection: "column"}}>
              <label htmlFor="theme">{this.props.colourTheme}
                <input
                  className="checkbox"
                  type="checkbox"
                  name="speak"
                  onChange={this.props.changeColourTheme}
                  checked={this.props.colourTheme === "dark" ? true : false}
                />
              </label>
              <label htmlFor="speak">Sound:
                <input
                  className="checkbox"
                  type="checkbox"
                  name="speak"
                  onChange={this.props.handleChange}
                  checked={this.props.isChecked}
                />
              </label>
            </div>
          </div>
        </div>
        <hr style={{padding: "2.5px"}}/>
      </div>
    )
  }
}

export default NavBar