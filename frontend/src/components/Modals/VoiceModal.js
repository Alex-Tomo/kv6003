import React from "react"

class VoiceModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card modal-card-width">
          <section className="modal-card-body">
            <h1 id="voice-modal-text" style={{color: "black"}} />
          </section>
        </div>
      </div>
    )
  }
}

export default VoiceModal