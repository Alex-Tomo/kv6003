import React from "react"

class Messages extends React.Component {
  render() {
    return (
      <div
        id="messages"
        className={this.props.colourTheme}
      >
        {this.props.responses}
        <hr style={{padding: "2.5px"}}/>
      </div>
    )
  }
}

export default Messages