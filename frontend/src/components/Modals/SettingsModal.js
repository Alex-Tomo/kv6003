import React from "react"
import Settings from "../forms/Settings";


class SettingsModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isChecked: (localStorage.getItem("sound") === 'true'),
      colourTheme: (localStorage.getItem("theme") === null) ? "dark" : localStorage.getItem("theme")
    }
  }

  handleChange = () => {
    if (this.state.isChecked) {
      localStorage.setItem("sound", false)
    } else {
      localStorage.setItem("sound", true)
    }
    this.setState({ isChecked: !this.state.isChecked })
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

  render() {
    return (
        <div className="modal is-active">
          <div className="modal-background"/>
          <div className="modal-card">
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
                  isChecked={this.state.isChecked}
              />
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={this.props.closeModal}>Apply</button>
            </footer>
          </div>
        </div>
    )
  }
}

export default SettingsModal