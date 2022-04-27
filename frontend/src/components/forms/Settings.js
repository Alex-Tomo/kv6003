import React from "react"

import LightIcon from "../../assets/light_black.svg"
import DarkIcon from "../../assets/dark_black.svg"

import MuteIcon from "../../assets/mute_black.svg"
import SoundIcon from "../../assets/sound_black.svg"

/**
 * The Settings class contains modifiable settings:
 *    Currently the user can change the colour theme and
 *    set the sound to on or off
 *
 * @author - Alex Thompson, W19007452
 */

class Settings extends React.Component {
  render() {
    return (
        <div id="settings">
          <div id="setting-container">
            <div className="field">
              <img
                className="settings-switch"
                src={LightIcon}
                alt="Colour Theme Icon"
              />
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={this.props.changeColourTheme}
                  checked={this.props.colourThemeChecked}
                />
                <span className="slider round"/>
              </label>
              <img
                className="settings-switch"
                src={DarkIcon}
                alt="Colour Theme Icon"
              />
            </div>

            <div className="field">
              <img
                className="settings-switch"
                src={MuteIcon}
                alt="Mute Icon"
              />
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={this.props.handleChange}
                  checked={this.props.isChecked}
                />
                <span className="slider round"/>
              </label>
              <img
                className="settings-switch"
                src={SoundIcon}
                alt="Sound Icon"
              />
            </div>
          </div>
        </div>
    )
  }
}

export default Settings
