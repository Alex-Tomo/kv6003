import React from "react"
import RobotBlack from "../../assets/robot_black.svg"
import RobotWhite from "../../assets/robot_white.svg"

class Messages extends React.Component {
  render() {
    let hidden = false
    try {
      hidden = document.getElementById("messages").className.includes("is-hidden")
    } catch (e) {}

    return (
      <div
        id="messages"
        className={(hidden) ? "is-hidden " + this.props.colourTheme : "" + this.props.colourTheme}
      >
        {(this.props.responses.length > 0) ? this.props.responses :
          <div className="bot-message-container">
            <img
              src={(localStorage.getItem("theme") === "dark") ?
                RobotWhite : RobotBlack}
              alt="Account Circle"
              className={`chat-circle  ${localStorage.getItem("theme")}`}
            />
            <div className="bot-message">
              <p><em>is typing...</em></p>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Messages