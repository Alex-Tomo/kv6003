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
  /**
   * Removes all the users messages from the database
   *
   * @param id - the users id
   */
  clearUserMessages = (id) => {
    let formData = new FormData()
    formData.append('id', id)
    formData.append('remove', true)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/messages', {
      method: 'POST',
      body: formData
    })
      .then(() => {
        window.location.href = "http://localhost:3000"
      })
      .catch(() => {
        alert("Could not delete messages")
      })
  }

  render() {
    const userId = localStorage.getItem("id")
    let clearMessagesButton =  ""

    if (userId !== null) {
      clearMessagesButton = (
        <div style={{marginTop: "20px"}}>
          <button
            className="button is-danger"
            onClick={() => {
              this.clearUserMessages(userId)
            }}
          >
            Clear Messages
          </button>
        </div>
      )
    }

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
          {clearMessagesButton}
        </div>
      </div>
    )
  }
}

export default Settings
