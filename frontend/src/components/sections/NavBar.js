import React from "react"

// Icons
import SettingsBlack from "../../assets/settings_black.svg"
import LogoutBlack from "../../assets/logout_black.svg"
import MenuBlack from "../../assets/menu_black.svg"
import MenuWhite from "../../assets/menu_white.svg"
import CloseBlack from "../../assets/close_black.svg"
import CloseWhite from "../../assets/close_white.svg"
import AdminBlack from "../../assets/admin_black.svg"
import HomeBlack from "../../assets/home_black.svg"

/**
 * The NavBar class will be displayed on all pages
 * allowing the user to manipulate settings, log in and signup
 *
 * @author - Alex Thompson, W19007452
 */

class NavBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showMenu: false,
      windowSize: window.innerWidth
    }
  }

  /**
   * Display either the desktop version of the navbar or the mobile version
   * of the navbar. Set a resize listener to show the correct version of the
   * navbar on window resize.
   */
  async componentDidMount() {
    let buttonContainer = document.getElementById("buttons-container")
    let messagesHeader = document.getElementById("messages-header")
    let messages = document.getElementById("messages")
    let messageFunctionalityContainer = document.getElementById("message-functionality-container")

    if (window.innerWidth > 600) {
      buttonContainer.classList.remove("is-hidden")
      messagesHeader.classList.remove("is-hidden")
      messages.classList.remove("is-hidden")
      messageFunctionalityContainer.classList.remove("is-hidden")

      await this.setState({ showMenu: false })
    } else {
      await this.showMenu()
    }

    window.addEventListener("resize", async () => {
      if (window.innerWidth > 600) {
        await this.setState({
          showMenu: false,
          windowSize: window.innerWidth
        })

        try {
          buttonContainer.classList.remove("is-hidden")
          messagesHeader.classList.remove("is-hidden")
          messages.classList.remove("is-hidden")
          messageFunctionalityContainer.classList.remove("is-hidden")
        } catch (e) {}
      } else {
        await this.showMenu()
        await this.setState({ windowSize: window.innerWidth })
      }
    })
  }

  /**
   * For the mobile view.
   * on menu click, show the mobile menu, otherwise hide it
   */
  changeMenu = async () => {
    await this.setState({
      showMenu: !this.state.showMenu
    })
  }

  /**
   * For the mobile view.
   * on menu click, show the mobile menu, otherwise hide it
   */
  showMenu = async () => {
    let admin = document.getElementById("admin")
    let mainRoot = document.getElementById("main-root")
    let buttonContainer = document.getElementById("buttons-container")
    let messagesHeader = document.getElementById("messages-header")
    let messages = document.getElementById("messages")
    let messageFunctionalityContainer =
        document.getElementById("message-functionality-container")

    if (this.state.showMenu) {
        if (this.props.displayAdmin) {
          admin.classList.add("is-hidden")
          mainRoot.classList.remove("admin")
          buttonContainer.classList.remove("is-hidden")
        } else {
          mainRoot.classList.add("active-nav")
          buttonContainer.classList.remove("is-hidden")
          messagesHeader.classList.add("is-hidden")
          messages.classList.add("is-hidden")
          messageFunctionalityContainer.classList.add("is-hidden")
        }
      } else {
        if (this.props.displayAdmin) {
          admin.classList.remove("is-hidden")
          mainRoot.classList.add("admin")
          buttonContainer.classList.add("is-hidden")
        } else {
          mainRoot.classList.remove("active-nav")
          buttonContainer.classList.add("is-hidden")
          messagesHeader.classList.remove("is-hidden")
          messages.classList.remove("is-hidden")
          messageFunctionalityContainer.classList.remove("is-hidden")
        }
      }
  }

  /**
   * Display the signup modal
   */
  handleSignup = () => {
    this.props.displaySignupModal().then(() => {
      document.querySelectorAll(('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .cancel') || []).forEach((close) => {
        close.addEventListener('click', () => {
          this.props.closeModal()
        })
      })
    })
  }

  /**
   * Display the login modal
   */
  handleLogin = () => {
    this.props.displayLoginModal().then(() => {
      document.querySelectorAll(('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .cancel') || []).forEach((close) => {
        close.addEventListener('click', () => {
          this.props.closeModal()
        })
      })
    })
  }

  /**
   * Display the settings modal
   */
  handleSettings = () => {
    this.props.displaySettingsModal().then(() => {
      document.querySelectorAll(('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .cancel') || []).forEach((close) => {
        close.addEventListener('click', () => {
          this.props.closeModal()
        })
      })
    })
  }

  /**
   * If param is true then display the admin button
   * otherwise dont display the admin button
   *
   * @param value boolean
   */
  updateAdmin = (value) => {
    this.props.updateAdmin(value)
    if (this.state.windowSize <= 600) {
      this.setState({showMenu: false})
      document.getElementById("buttons-container").classList.add("is-hidden")
    }
  }

  render() {
    let buttons = ""

    if (this.props.loggedIn) {
      buttons = (
        <div id="buttons-container" className={(this.state.windowSize <= 600) ? "mobile-buttons-container is-hidden" : null}>
          <div>
            {(localStorage.getItem("user_type") === "admin") ?
                (this.props.displayAdmin) ?
                    <button className="button" onClick={() => this.updateAdmin(false)}>
                      <img className="icons" src={HomeBlack} alt="Home Icon" />
                      Home
                    </button>

                    :

                    <button className="button" onClick={() => this.updateAdmin(true)}>
                    <img className="icons" src={AdminBlack} alt="Admin Icon" />
                    Admin
                  </button>

              : null}
            <button className="button" onClick={this.handleSettings}>
              <img className="icons" src={SettingsBlack}  alt="Settings Icon" />
              Settings
            </button>
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
              <h1 id="title" style={{minHeight: "53px", maxHeight: "53px"}}>NUBot</h1>
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
                <h1 id="title" style={{minHeight: "53px", maxHeight: "53px"}}>NUBot</h1>
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