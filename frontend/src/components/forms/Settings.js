import React from "react"

import LightIcon from "../../assets/light_black.svg"
import DarkIcon from "../../assets/dark_black.svg"

import MuteIcon from "../../assets/mute_black.svg"
import SoundIcon from "../../assets/sound_black.svg"

/**
 * The Settings class contains modifiyable settings:
 *    Currently the user can change the colour theme and
 *    set the sound to on or off
 *
 * @author - Alex Thompson, W19007452
 */

class Settings extends React.Component {
  render() {
    return (
        <div id="settings">
          <div style={{display: "flex", flexDirection: "column"}}>
            <div className="field"
                 style={{
                   display: "flex",
                   justifyContent: "center"
                 }}
            >
              <img
                  src={LightIcon}
                  alt="Colour Theme Icon"
                  style={{marginRight: "5px"}}
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
                  src={DarkIcon}
                  alt="Colour Theme Icon"
                  style={{marginLeft: "5px"}}
              />
            </div>

            <div className="field"
                 style={{
                   display: "flex",
                   justifyContent: "center"
                 }}
            >
              <img
                  src={MuteIcon}
                  alt="Mute Icon"
                  style={{marginRight: "5px"}}
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
                  src={SoundIcon}
                  alt="Sound Icon"
                  style={{marginLeft: "5px"}}
              />
            </div>
          </div>
        </div>
    )
  }
}

export default Settings
