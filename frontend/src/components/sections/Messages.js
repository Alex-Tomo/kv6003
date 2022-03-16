import React from "react"

class Messages extends React.Component {
  render() {
    return (
      <div
        id="messages"
        className={this.props.colourTheme}
      >
        {this.props.responses}
      </div>
    )
  }
}

export default Messages