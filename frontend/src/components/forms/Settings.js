import React from "react"

class Settings extends React.Component {
  render() {
    return (
        <div id="settings">
          <div style={{display: "flex", flexDirection: "column"}}>
            <div className="field">
              <label htmlFor="theme">{this.props.colourTheme} Theme:
                <input
                  className="checkbox"
                  type="checkbox"
                  name="theme"
                  onChange={this.props.changeColourTheme}
                  checked={this.props.colourThemeChecked}
                />
              </label>
            </div>
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
    )
  }
}

export default Settings
