import React from "react"

class Input extends React.Component {
    render() {
        return (
            <input
                type="text"
                value={this.props.value}
                onChange={this.props.handleInput}
                onKeyPress={this.props.handleKeyPress}
            />
        )
    }
}

export default Input
