import React from 'react'

import ArrowDownBlack from '../../assets/arrow_down_black.svg'
import ArrowDownWhite from '../../assets/arrow_down_white.svg'
import ArrowUpBlack from '../../assets/arrow_up_black.svg'
import ArrowUpWhite from '../../assets/arrow_up_white.svg'
import ClearWhite from '../../assets/clear_white.svg'
import IntentsModal from '../modals/IntentModal'
import {Spinner} from 'react-bootstrap'

/**
 * The Admin page is only available to admin users, this stores
 * and displays messages with unknown or incorrect responses.
 *
 * @author - Alex Thompson, W19007452
 */

class Admin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      unknownResults: [],
      incorrectResults: [],
      training: false,
      intents: [],
      modal: <></>,
      models: []
    }
  }

  /**
   * Gets the nlu intention data from the chatbot
   */
  getIntentions = () => {
    fetch('http://localhost:5005/webhooks/recievefiles/webhook', {
      method: 'POST',
      body: JSON.stringify({
        metadata: {file: 'nlu'}
      })
    }).then(data => {
      return data.json()
    }).then(data => {
      this.setState({intents: data.data.nlu})
    }).catch(error => {
      console.log(error)
    })
  }

  /**
   * Gets all the messages deemed incorrect by the user
   */
  getIncorrectMessages = () => {
    let formData = new FormData()
    formData.append('incorrect', 'true')

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).then(r => {
      return r.json()
    }).then((r) => {
      this.setState({incorrectResults: r})
    }).catch(err => {
      console.log('could not add message')
    })
  }

  /**
   * Deletes the incorrect messages from the database
   *
   * @param id -> The id of the message used to remove the message
   */
  removeIncorrectMessage = (id) => {
    let formData = new FormData()
    formData.append('incorrect', 'true')
    formData.append('remove', 'true')
    formData.append('id', id)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).then(() => {
      let arr = this.state.incorrectResults
      arr = arr.filter(r => r.id !== id)
      this.setState({incorrectResults: arr})
    }).catch(() => {
      console.log('could not remove message')
    })
  }

  /**
   * Sends a request view to the chatbot to retain the model
   */
  retrainModel = () => {
    if (this.state.training) {
      alert('already training')
      return
    }

    if (!window.confirm('Are you sure you want to retrain the model?'))
      return

    this.setState({training: true})
    fetch('http://localhost:5005/webhooks/retrainmodel/webhook', {
      method: 'POST'
    }).then(() => {
      this.setState({training: false})
    }).catch(error => {
      console.log(error)
      this.setState({training: false})
    })
  }

  /**
   * Replaces the current model with the selected model
   * The model_file path should not be stated here. Only displayed
   * here for ease
   *
   * @param modelFileName -> the model file name to be loaded
   */
  replaceModel = (modelFileName) => {
    if (!window.confirm(`Are you sure you want to load ${modelFileName}?`))
      return

    fetch('http://localhost:5005/model', {
      method: 'PUT',
      body: JSON.stringify({
        // Use it on the frontend for now as it will not work on the backend
        model_file: `/Users/alex/desktop/Uni Third Year/KV6003 Individual Computing Project/chatbot/rasa_individual/rasa/models/${modelFileName}`
      })
    }).catch(error => {
      console.log(error)
    })
  }

  /**
   * Adds a close modal listener when the modal is opened
   */
  addCloseModalListener = () => {
    document.querySelectorAll(('' +
      '.modal-background, .modal-close, .modal-card-head' +
      ' .delete, .modal-card-foot .cancel') || [])
      .forEach((close) => {

      close.addEventListener('click', () => {
        this.setState({modal: <></>})
      })

    })
  }

  /**
   * Gets all the model filenames from the chatbot server
   */
  loadModels = () => {
    fetch('http://localhost:5005/webhooks/get_models/webhook', {
      method: 'POST'
    }).then(data => {
      return data.json()
    }).then(data => {
      this.setState({models: data.filenames})
    }).catch(error => {
      console.log(error)
    })
  }

  /**
   * Closes all the tables
   */
  closeAllTables = () => {
    const modelsTable = document.getElementById('models-table')
    const modelsArrow = document.getElementById('models-arrow')
    const incorrectResponsesTable =
      document.getElementById('incorrect-responses-table')
    const incorrectResponsesArrow =
      document.getElementById('incorrect-response-arrow')
    const intentsTable = document.getElementById('intents-table')
    const intentsArrow = document.getElementById('intents-arrow')

    modelsTable.classList.add('is-hidden')
    incorrectResponsesTable.classList.add('is-hidden')
    intentsTable.classList.add('is-hidden')

    modelsArrow.src =
      (localStorage.getItem('theme') === 'dark') ?
        ArrowDownWhite : ArrowDownBlack

    incorrectResponsesArrow.src =
      (localStorage.getItem('theme') === 'dark') ?
        ArrowDownWhite : ArrowDownBlack
    intentsArrow.src =
      (localStorage.getItem('theme') === 'dark') ?
        ArrowDownWhite : ArrowDownBlack
  }

  /**
   * Opens the selected table
   *
   * @param tableName -> table element id
   * @param tableArrow -> table arrow element id
   */
  openTable = (tableName, tableArrow) => {
    const table = document.getElementById(tableName)
    const arrow = document.getElementById(tableArrow)

    table.classList.remove('is-hidden')
    arrow.src =
      (localStorage.getItem('theme') === 'dark') ?
        ArrowUpWhite : ArrowUpBlack
  }

  render() {
    let models = ''

    if (this.state.models.length > 0) {
      models = this.state.models.map((model, i) => {
        return (
          <tr
            key={i}
            className={localStorage.getItem('theme')}
          >
            <td>
              <p className='admin-model-table-p'>
                {model}
              </p>
            </td>
            <td>
              <button
                className='button'
                onClick={() => {
                  this.replaceModel(model)
                }}>
                Run Model
              </button>
            </td>
          </tr>
        )
      })
    }

    let intents = ''

    if (this.state.intents.length > 0) {
      intents = this.state.intents.map((intent, i) => {
        return (
          <tr key={i} className={`${localStorage.getItem('theme')} admin-tr-intent-row`}
              onClick={async () => {
                await this.setState({
                  modal: <IntentsModal
                    title={intent.intent}
                    intents={intent.examples}
                  />
                })
                await this.addCloseModalListener()
              }}
          >
            <td>
              <p className='admin-model-table-p'>
                {intent.intent}
              </p>
            </td>
          </tr>
        )
      })
    }

    let incorrectResults = ''

    if (this.state.incorrectResults.length > 0) {
      incorrectResults = this.state.incorrectResults.map((result, i) => {
        return (
          <tr
            key={i}
            className={localStorage.getItem('theme')}
          >
            <td>
              <p>
                {result.user_message}
              </p>
            </td>
            <td>
              <p>
                {result.bot_message}
              </p>
            </td>
            <td>
              <button
                className='button is-danger admin-incorrect-button'
                onClick={() => this.removeIncorrectMessage(result.id)}
              >
                <img
                  src={ClearWhite}
                  alt='Delete Icon'
                />
              </button>
            </td>
          </tr>
        )
      })
    }

    return (
      <div id='admin'>
        <button
          onClick={this.retrainModel}
          disabled={this.state.training}
          className='button admin-retrain-button'
        >
          {(this.state.training) ?
            'Training' : 'Retrain model'}
        </button>

        <hr className='admin-hr' />
        <div
          className='admin-table-container'
          onClick={() => {
            if (document.getElementById('models-table')
              .classList.contains('is-hidden')
            ) {
              this.closeAllTables()
              this.openTable('models-table', 'models-arrow')
              this.loadModels()
            } else {
              this.closeAllTables()
            }
          }}>

          <h2>
            Models
          </h2>
          <img
            id='models-arrow'
            src={(localStorage.getItem('theme') === 'dark') ?
              ArrowDownWhite : ArrowDownBlack}
            alt='Dropdown Icon'
          />
        </div>

        <div
          id='models-table'
          className='is-hidden'
        >
          <hr className='admin-hr' />
          {(models) ?
            <table className='table'>
              <thead>
              <tr>
                <th className='admin-table-head'>Model Name</th>
                <th className='admin-table-head'>Run Model</th>
              </tr>
              </thead>
              <tbody>
              {(models) ? models: null}
              </tbody>
            </table>
            :
            <div>
              <Spinner
                animation='border'
                role='status'
              />
              <span>Loading Models...</span>
            </div>
          }

        </div>

        <hr className='admin-hr' />

        <div
          className='admin-table-container'
          onClick={() => {
            if (document.getElementById('intents-table')
              .classList.contains('is-hidden')
            ) {
              this.closeAllTables()
              this.openTable('intents-table', 'intents-arrow')
              this.getIntentions()
            } else {
              this.closeAllTables()
            }
          }}>
          <h2>
            Recognised User Intentions
          </h2>
          <img
            id='intents-arrow'
            src={(localStorage.getItem('theme') === 'dark') ?
              ArrowDownWhite : ArrowDownBlack}
            alt='Dropdown Icon'
          />
        </div>

        <div
          id='intents-table'
          className='is-hidden'
        >
          <hr className='admin-hr' />

            {(intents) ?
              <table className='table'>
                <thead>
                <tr>
                  <th className='admin-table-head'>
                    Recognised Intentions (Click to add more data)
                  </th>
                </tr>
                </thead>
                <tbody>
                {intents}
                </tbody>
              </table>
              :
              <div>
                <Spinner
                  animation='border'
                  role='status'
                />
                <span>Loading Intentions...</span>
              </div>
            }

        </div>
        <hr className='admin-hr' />

        <div
          className='admin-table-container'
          onClick={() => {
            if (document.getElementById('incorrect-responses-table')
              .classList.contains('is-hidden')
            ) {
              this.closeAllTables()
              this.openTable('incorrect-responses-table', 'incorrect-response-arrow')
              this.getIncorrectMessages()
            } else {
              this.closeAllTables()
            }
          }}>
          <h2>
            Incorrect Responses
          </h2>
          <img
            id='incorrect-response-arrow'
            src={(localStorage.getItem('theme') === 'dark') ?
              ArrowDownWhite : ArrowDownBlack}
            alt='Dropdown Icon'
          />
        </div>

        <div
          id='incorrect-responses-table'
          className='is-hidden'
        >
          <hr className='admin-hr' />

            {(incorrectResults) ?
              <table className='table'>
                <thead>
                <tr>
                  <th className='admin-table-head'>User Message</th>
                  <th className='admin-table-head'>Bot Message</th>
                  <th className='admin-table-head'>Remove</th>
                </tr>
                </thead>
                <tbody>
                {incorrectResults}
                </tbody>
              </table>
              :
              <div>
                <Spinner
                  animation='border'
                  role='status'
                />
                <span>Loading Incorrect Results...</span>
              </div>
            }
        </div>
        <hr className='admin-hr' />
        {this.state.modal}
      </div>
    )
  }
}

export default Admin