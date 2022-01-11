import React from "react"

class Button extends React.Component {
    render() {
        return (
            <button onClick={this.props.handleClick}>Send</button>
        )
    }
}

export default Button
