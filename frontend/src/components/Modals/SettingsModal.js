import React from "react"
import Settings from "../forms/Settings";


class SettingsModal extends React.Component {
  sound = (localStorage.getItem("sound") === 'true')
  colourTheme = (localStorage.getItem("theme") === null) ?
    "dark" : localStorage.getItem("theme")

  constructor(props) {
    super(props)

    this.state = {
      soundChecked: (localStorage.getItem("sound") === 'true'),
      colourTheme: (localStorage.getItem("theme") === null) ?
        "dark" : localStorage.getItem("theme")
    }
  }

  handleChange = () => {
    if (this.state.soundChecked) {
      localStorage.setItem("sound", false)
    } else {
      localStorage.setItem("sound", true)
    }
    this.setState({ soundChecked: !this.state.soundChecked })
  }

  changeColourTheme = () => {
    // Change to light theme
    if (this.state.colourTheme === "dark") {
      this.setState({colourTheme: "light"})
      localStorage.setItem("theme", "light")
      // Change to dark theme
    } else {
      this.setState({colourTheme: "dark"})
      localStorage.setItem("theme", "dark")
    }
  }

  closeModal = () => {
    if (this.colourTheme !== this.state.colourTheme || this.sound !== this.state.soundChecked) {
      document.getElementById("success-message").innerText = `Settings Updated`
      document.getElementById("notification").classList.add("is-success")
      document.getElementById("notification").classList.remove("is-hidden")

      setTimeout(() => {
        document.getElementById("success-message").innerText = ""
        document.getElementById("notification").classList.add("is-hidden")
        document.getElementById("notification").classList.remove("is-success")
      }, 3000)
    }

    this.props.closeModal()
  }

  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card modal-card-width">
          <header className="modal-card-head">
            <p className="modal-card-title">Settings</p>
            <button className="delete" aria-label="close"/>
          </header>
          <section className="modal-card-body">
            <Settings
              changeColourTheme={this.changeColourTheme}
              colourTheme={this.state.colourTheme}
              colourThemeChecked={this.state.colourTheme === "dark"}
              handleChange={this.handleChange}
              isChecked={this.state.soundChecked}
            />
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.closeModal}>Apply</button>
          </footer>
        </div>
      </div>
    )
  }
}

export default SettingsModal