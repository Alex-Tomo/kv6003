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

  handleSettings = () => {
    this.props.displaySettingsModal().then(() => {
      document.querySelectorAll(('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .cancel') || []).forEach((close) => {
        close.addEventListener('click', () => {
          this.props.closeModal()
        })
      })
    })
  }

  render() {
    console.log(this.props.userType)

    let buttons = ""

    if (this.props.loggedIn) {
      buttons = (
        <div id="buttons-container">
          <div>
            <button className="button" onClick={this.handleSettings}>Settings</button>
            {(this.props.userType === "admin") ? null
                // <button className="button"><Link>Admin</Link></button>
                : null}
          </div>
          <div>
            <button className="button" onClick={this.props.handleLogout}>Logout</button>
          </div>
        </div>
      )
    } else {
      buttons = (
        <div id="buttons-container">
          <div>
            <button className="button" onClick={this.handleSettings}>Settings</button>
          </div>
          <div>
            <button className="button" onClick={this.handleSignup}>Sign Up</button>
            <button className="button" onClick={this.handleLogin}>Log In</button>
          </div>
        </div>
      )
    }

    return (
      <div id="nav-container">
        <div id="nav" className={this.props.colourTheme}>
          <h1>NUBot</h1>
          <hr />
          {buttons}
        </div>
        {/*<hr style={{padding: "2.5px"}}/>*/}
      </div>
    )
  }
}

export default NavBar