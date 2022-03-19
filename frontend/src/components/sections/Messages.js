import React from "react"
import AccountCircleWhite from "../../assets/account_circle_white.svg";
import AccountCircleBlack from "../../assets/account_circle_black.svg";

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
                AccountCircleWhite : AccountCircleBlack}
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