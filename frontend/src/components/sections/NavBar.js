import React from "react"

// Icons
import SettingsBlack from "../../assets/settings_black.svg"
import SettingsWhite from "../../assets/settings_white.svg"
import LogoutBlack from "../../assets/logout_black.svg"
import LogoutWhite from "../../assets/logout_white.svg"
import MenuBlack from "../../assets/menu_black.svg"
import MenuWhite from "../../assets/menu_white.svg"
import CloseBlack from "../../assets/close_black.svg"
import CloseWhite from "../../assets/close_white.svg"
import AdminBlack from "../../assets/admin_black.svg"
import AdminWhite from "../../assets/admin_white.svg"

class NavBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showMenu: false,
      windowSize: window.innerWidth
    }
  }

  async componentDidMount() {
    if (window.innerWidth > 600) {
      document.getElementById("buttons-container").classList.remove("is-hidden")
      document.getElementById("messages-header").classList.remove("is-hidden")
      document.getElementById("messages").classList.remove("is-hidden")
      document.getElementById("message-functionality-container").classList.remove("is-hidden")

      await this.setState({ showMenu: false })
    } else {
      await this.showMenu()
    }

    window.addEventListener("resize", async () => {
      if (window.innerWidth > 600) {
        document.getElementById("buttons-container").classList.remove("is-hidden")
        document.getElementById("messages-header").classList.remove("is-hidden")
        document.getElementById("messages").classList.remove("is-hidden")
        document.getElementById("message-functionality-container").classList.remove("is-hidden")

        await this.setState({ showMenu: false, windowSize: window.innerWidth })
      } else {
        await this.showMenu()
        await this.setState({ windowSize: window.innerWidth })
      }
    })
  }

  changeMenu = async () => {
    await this.setState({ showMenu: !this.state.showMenu })
  }

  showMenu = async () => {
    if (this.state.showMenu) {
      document.getElementById("main-root").classList.add("active-nav")
      document.getElementById("buttons-container").classList.remove("is-hidden")
      document.getElementById("messages-header").classList.add("is-hidden")
      document.getElementById("messages").classList.add("is-hidden")
      document.getElementById("message-functionality-container").classList.add("is-hidden")
    } else {
      document.getElementById("main-root").classList.remove("active-nav")
      document.getElementById("buttons-container").classList.add("is-hidden")
      document.getElementById("messages-header").classList.remove("is-hidden")
      document.getElementById("messages").classList.remove("is-hidden")
      document.getElementById("message-functionality-container").classList.remove("is-hidden")
    }
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
    let buttons = ""

    if (this.props.loggedIn) {
      buttons = (
        <div id="buttons-container" className={(this.state.windowSize <= 600) ? "mobile-buttons-container is-hidden" : null}>
          <div>
            <button className="button" onClick={this.handleSettings}>
              <img className="icons" src={SettingsBlack}  alt="Settings Icon" />
              Settings
            </button>
            {(localStorage.getItem("user_type") === "admin") ?
                <button className="button">
                  <img className="icons" src={AdminBlack} alt="Admin Icon" />
                  Admin
                </button> : null}
          </div>
          <div>
            <button className="button" onClick={this.props.handleLogout}>
              <img className="icons" src={LogoutBlack} alt="Logout Icon" />
              Logout
            </button>
          </div>
        </div>
      )
    } else {
      buttons = (
        <div id="buttons-container" className={(this.state.windowSize <= 600) ? "mobile-buttons-container is-hidden" : null}>
          <div>
            <button className="button" onClick={this.handleSettings}>
              <img className="icons" src={SettingsBlack}  alt="Settings Icon" />
                Settings
            </button>
          </div>
          <div>
            <button className="button" onClick={this.handleSignup}>Sign Up</button>
            <button className="button" onClick={this.handleLogin}>Log In</button>
          </div>
        </div>
      )
    }

    if (this.state.windowSize > 600) {
      return (
        <div id="nav-container" className={this.props.colourTheme}>
          <div id="nav" className={this.props.colourTheme}>
            <div style={{height: "70px"}}>
              <h1 style={{minHeight: "53px", maxHeight: "53px"}}>NUBot</h1>
            </div>
            {buttons}
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div id="nav-container" className={this.props.colourTheme}>
            <div id="nav" className={this.props.colourTheme}>
              <div style={{height: "70px"}}>
                <h1 style={{minHeight: "53px", maxHeight: "53px"}}>NUBot</h1>
              </div>
              <div id="mobile-menu">
                <img
                  src={(this.props.colourTheme === "dark") ?
                    (this.state.showMenu) ? CloseWhite : MenuWhite :
                    (this.state.showMenu) ? CloseBlack : MenuBlack
                  }
                  alt="Menu Icon"
                  height="40px"
                  width="40px"
                  style={{cursor: "pointer"}}
                  onClick={() => {
                    this.changeMenu().then(() => this.showMenu())
                  }}
                />
              </div>
            </div>
          </div>
          {buttons}
        </div>
      )
    }
  }
}

export default NavBar