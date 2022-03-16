import React from "react"

class MessagesHeader extends React.Component {
  render() {
    return (
        <div
            id="messages-header"
            className={this.props.colourTheme}
        >
          <p id="messages-header-para">NU Virtual Assistant<br/><em>Online</em></p>
          <hr />
        </div>
    )
  }
}

export default MessagesHeader