import React from 'react'

/**
 * Displays the intents modal, allows the user to view
 * and add more intent data
 *
 * @author - Alex Thompson, W19007452
 */

class IntentsModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      intentValue: ''
    }
  }

  /**
   * Checks if the input field is not empty then adds
   * the new intent to the training data
   */
  addIntent = () => {
    if (this.state.intentValue.trim() === '') {
      alert('Input field cannot be empty')
      return
    }

    fetch('http://localhost:5005/webhooks/updatefiles/webhook', {
      method: 'POST',
      body: JSON.stringify({
        sender: 'admin',
        metadata: {
          file: 'nlu.yml',
          intentTitle: this.props.title,
          intentValue: this.state.intentValue.trim()
        }
      })
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    // splits the intents so they are displayed more clearly
    let intents = ''
    let splitIntents = this.props.intents.split('\n')

    if (splitIntents.length > 0) {
      intents = splitIntents.map((intent, i) => {
        return (
          <p
            key={i}
            className='intent-paragraphs'
          >
            {intent}
          </p>
        )
      })
    }

    return (
      <div className='modal is-active'>
        <div className='modal-background'/>
        <div className='modal-card modal-card-width'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>
              {this.props.title} intent
            </p>
            <button
              className='delete'
              aria-label='close'
            />
          </header>
          <section className='modal-card-body'>
            <div
              id='error-notification'
              className='notification is-danger is-hidden'
            >
              <p id='error-message'/>
            </div>
            {intents}
          </section>
          <footer className='modal-card-foot'>
            <div className='intent-modal-footer'>
            <input
              placeholder='Type New Intent Here...'
              type='text'
              className='input intent-input'
              onChange={(e) => {
                this.setState({intentValue: e.target.value})
              }}
            />
            <div className='intent-footer-buttons'>
              <button
                className='button is-success intent-success-button'
                onClick={this.addIntent}
              >
                Add New Intent
              </button>
              <button className='button cancel intent-cancel-button'>
                Cancel
              </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}

export default IntentsModal