import React from 'react'
import Settings from '../forms/Settings'

/**
 * The SettingsModal class contains the modal for the settings form
 * The SettingsModal gets the users colour theme preference and sound
 * preference. The user can update either of the details which will be
 * saved in localstorage for later user
 *
 * @author - Alex Thompson, W19007452
 */

class SettingsModal extends React.Component {
  sound = (localStorage.getItem('sound') === 'true')
  colourTheme = (localStorage.getItem('theme') === null) ?
    'dark' : localStorage.getItem('theme')

  constructor(props) {
    super(props)

    this.state = {
      soundChecked: (localStorage.getItem('sound') === 'true'),
      colourTheme: (localStorage.getItem('theme') === null) ?
        'dark' : localStorage.getItem('theme')
    }
  }

  /**
   * Handle change when the user checked the sound checkbox.
   * The sound is a boolean and can therefore only be set to
   * true or false
   */
  handleChange = () => {
    if (this.state.soundChecked) {
      localStorage.setItem('sound', false)
    } else {
      localStorage.setItem('sound', true)
    }
    this.setState({
      soundChecked: !this.state.soundChecked
    })
  }

  /**
   * Handle change when the user checked the colourTheme checkbox.
   * The colourTheme can currently hold two string values, light or dark.
   */
  changeColourTheme = () => {
    // Change to light theme
    if (this.state.colourTheme === 'dark') {
      this.setState({colourTheme: 'light'})
      localStorage.setItem('theme', 'light')
      // Change to dark theme
    } else {
      this.setState({colourTheme: 'dark'})
      localStorage.setItem('theme', 'dark')
    }
  }

  /**
   * Closes the settings modal and displays an updated settings notification
   * if the user has updated either of there settings
   */
  closeModal = () => {
    let message = document.getElementById('success-message')
    let notification = document.getElementById('notification')

    if (
      this.colourTheme !== this.state.colourTheme ||
      this.sound !== this.state.soundChecked
    ) {
      message.innerText = `Settings Updated`
      notification.classList.add('is-success')
      notification.classList.remove('is-hidden')

      setTimeout(() => {
        message.innerText = ''
        notification.classList.add('is-hidden')
        notification.classList.remove('is-success')
      }, 3000)
    }

    this.props.closeModal()
  }

  render() {
    return (
      <div className='modal is-active'>
        <div className='modal-background'/>
        <div className='modal-card modal-card-width'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>
              Settings
            </p>
            <button
              className='delete'
              aria-label='close'
            />
          </header>
          <section className='modal-card-body'>
            <Settings
              changeColourTheme={this.changeColourTheme}
              colourTheme={this.state.colourTheme}
              colourThemeChecked={this.state.colourTheme === 'dark'}
              handleChange={this.handleChange}
              isChecked={this.state.soundChecked}
            />
          </section>
          <footer className='modal-card-foot'>
            <button
              className='button is-success'
              onClick={this.closeModal}
            >
              Apply
            </button>
          </footer>
        </div>
      </div>
    )
  }
}

export default SettingsModal