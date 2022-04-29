import React from "react"

/**
 *
 * @author - Alex Thompson, W19007452
 */

class IntentsModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      intentValue: ""
    }
  }

  /**
   * Closes the settings modal and displays an updated settings notification
   * if the user has updated either of there settings
   */
  closeModal = () => {
    this.props.closeModal()
  }

  /**
   * Send the users details to the authentication API endpoint,
   * if the details are valid log the user in, otherwise display
   * an error to the user
   */
  addIntent = () => {
    if (this.state.intentValue.trim() === "") {
      alert("Input field cannot be empty")
      return
    }

    fetch('http://localhost:5005/webhooks/updatefiles/webhook', {
      method: 'POST',
      body: JSON.stringify({
        sender: "admin",
        metadata: {
          file: 'nlu.yml',
          intentTitle: this.props.title,
          intentValue: this.state.intentValue.trim()
        }
      })
    }).then((response) => {
      console.log(response)
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    let intents = ""
    let splitIntents = this.props.intents.split("\n")

    if (splitIntents.length > 0) {
      intents = splitIntents.map((intent, i) => {
        return (
          <p key={i} style={{color: "black", marginBottom: "2px", marginLeft: "10px", textAlign: "start"}}>
            {intent}
          </p>
        )
      })
    }

    return (
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card modal-card-width">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.props.title} intent</p>
            <button className="delete" aria-label="close"/>
          </header>
          <section className="modal-card-body">
            <div id="error-notification" className="notification is-danger is-hidden">
              <p id="error-message"/>
            </div>
            {intents}
          </section>
          <footer className="modal-card-foot">
            <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
            <input
              placeholder="Type New Intent Here..."
              type="text"
              className="input"
              style={{width: "100%", marginBottom: "5px"}}
              onChange={(e) => {
                this.setState({intentValue: e.target.value})
              }}
            />
            <div style={{display: "flex", flexDirection: "row"}}>
              <button
                style={{width: "60%"}}
                className="button is-success"
                onClick={this.addIntent}
              >
                Add New Intent
              </button>
              <button
                style={{width: "40%"}}
                className="button cancel">Cancel</button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}

export default IntentsModal