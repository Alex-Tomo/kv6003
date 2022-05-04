import React from 'react'

/**
 * The VoiceModal class contains a modal which displays
 * some lines indicating the user can speak. Used purely
 * as an animation.
 *
 * @author - Alex Thompson, W19007452
 */

class VoiceModal extends React.Component {
  render() {
    return (
      <div className='modal is-active'>
        <div className='modal-background'/>
        <div className='modal-card modal-card-width'>
          <section className='modal-card-body'>
            <h1 className='title-dark'>
              Speak Now
            </h1>
            <div className='speech-bar'>
              <div className='bar'/>
              <div className='bar'/>
              <div className='bar'/>
              <div className='bar'/>
              <div className='bar'/>
              <div className='bar'/>
              <div className='bar'/>
              <div className='bar'/>
              <div className='bar'/>
              <div className='bar'/>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default VoiceModal