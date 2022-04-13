import React from "react"

/**
 * TODO: Complete or delete this
 *
 * The VoiceModal class contains a modal which will display
 * what the user has said.
 *
 * @author - Alex Thompson, W19007452
 */

class VoiceModal extends React.Component {
  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card modal-card-width">
          <section className="modal-card-body">
            <h1 id="voice-modal-text">Speak</h1>
          </section>
        </div>
      </div>
    )
  }
}

export default VoiceModal