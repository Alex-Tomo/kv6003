import React from 'react'

import ArrowDownBlack from "../../assets/arrow_down_black.svg"
import ArrowDownWhite from "../../assets/arrow_down_white.svg"
import ArrowUpBlack from "../../assets/arrow_up_black.svg"
import ArrowUpWhite from "../../assets/arrow_up_white.svg"
import ClearWhite from "../../assets/clear_white.svg"
import IntentsModal from "../Modals/IntentModal";
import {Spinner} from "react-bootstrap";

/**
 * TODO: Store messages of many types
 * TODO: Needs cleaning up
 *
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

  getIntentions = () => {
    fetch("http://localhost:5005/webhooks/recievefiles/webhook", {
      method: 'POST',
      body: JSON.stringify({
        metadata: {file: "nlu"}
      })
    }).then(data => {
      return data.json()
    }).then(data => {
      this.setState({intents: data.data.nlu})
    }).catch(error => {
      console.log(error)
    })
  }

  getIncorrectMessages = () => {
    let formData = new FormData()
    formData.append('incorrect', "true")

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).then(r => {
      return r.json()
    }).then((r) => {
      this.setState({incorrectResults: r})
    }).catch(err => {
      console.log("could not add message")
    })
  }

  removeIncorrectMessage = (id) => {
    let formData = new FormData()
    formData.append('incorrect', "true")
    formData.append('remove', "true")
    formData.append('id', id)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).then(r => {
      let arr = this.state.incorrectResults
      arr = arr.filter(r => r.id !== id)
      this.setState({incorrectResults: arr})
    }).catch(err => {
      console.log("could not remove message")
    })
  }

  retrainModel = () => {
    if (this.state.training) {
      alert("already training")
      return
    }

    if (prompt("Are you sure you want to retrain the model?") === null) return

    this.setState({training: true})
    fetch("http://localhost:5005/webhooks/retrainmodel/webhook", {
      method: 'POST'
    }).then(data => {
      this.setState({training: false})
    }).catch(error => {
      console.log(error)
      this.setState({training: false})
    })
  }

  replaceModel = (modelFileName) => {
    if (prompt("Are you sure you want to load " + modelFileName + "?") === null) return

    fetch("http://localhost:5005/model", {
      method: 'PUT',
      body: JSON.stringify({
        // Use it on the frontend for now as it will not work on the backend
        model_file: `/Users/alex/desktop/Uni Third Year/KV6003 Individual Computing Project/chatbot/rasa_individual/rasa/models/${modelFileName}`
      })
    }).catch(error => {
      console.log(error)
    })
  }

  addCloseModalListener = () => {
    document.querySelectorAll(('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .cancel') || []).forEach((close) => {
      close.addEventListener('click', () => {
        this.setState({modal: <></>})
      })
    })
  }

  render() {
    let models = ""

    if (this.state.models.length > 0) {
      models = this.state.models.map((model, i) => {
        return (
          <tr key={i} className={localStorage.getItem("theme")}>
            <td>
              <p style={{width: "80%", textAlign: "start", margin: "2.5px 5px"}}>
                {model}
              </p>
            </td>
            <td>
              <button
                className="button"
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

    let intents = ""

    if (this.state.intents.length > 0) {
      intents = this.state.intents.map((intent, i) => {
        return (
          <tr key={i} className={localStorage.getItem("theme")}
              onClick={async () => {
                await this.setState({modal: <IntentsModal title={intent.intent} intents={intent.examples}/>})
                await this.addCloseModalListener()
              }}
              style={{cursor: "pointer"}}
          >
            <td>
              <p style={{width: "80%", textAlign: "start", margin: "2.5px 5px"}}>
                {intent.intent}
              </p>
            </td>
          </tr>
        )
      })
    }

    let incorrectResults = ""

    if (this.state.incorrectResults.length > 0) {
      incorrectResults = this.state.incorrectResults.map((result, i) => {
        return (
          <tr key={i} className={localStorage.getItem("theme")}>
            <td><p>{result.user_message}</p></td>
            <td><p>{result.bot_message}</p></td>
            <td>
              <button style={{width: "fit-content", margin: "2.5px 2.5px 2.5px 0"}} className="button is-danger"
                      onClick={() => this.removeIncorrectMessage(result.id)}>
                <img src={ClearWhite} alt="Delete Icon"/>
              </button>
            </td>
          </tr>
        )
      })
    }

    return (
      <div id="admin" style={{
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
        height: "100%",
        alignItems: "stretch"
      }}>
        <button
          onClick={this.retrainModel}
          disabled={this.state.training}
          className="button"
          style={{width: "25%", margin: "20px auto", padding: "10px"}}
        >
          {(this.state.training) ? "Training" : "Retrain model"}
        </button>

        <hr
          style={{margin: "0"}}
        />
        <div
          style={{cursor: "pointer", padding: "10px", display: "flex", justifyContent: "center"}}
          onClick={() => {
            if (document.getElementById("models-table").classList.contains("is-hidden")) {
              fetch("http://localhost:5005/webhooks/get_models/webhook", {
                method: 'POST'
              }).then(data => {
                return data.json()
              }).then(data => {
                this.setState({models: data.filenames})
              }).catch(error => {
                console.log(error)
              })

              document.getElementById("models-table").classList.remove("is-hidden")
              document.getElementById("incorrect-responses-table").classList.add("is-hidden")
              document.getElementById("intents-table").classList.add("is-hidden")

              document.getElementById("models-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowUpWhite : ArrowUpBlack
              document.getElementById("incorrect-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
            } else {
              document.getElementById("models-table").classList.add("is-hidden")

              document.getElementById("models-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
              document.getElementById("intents-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
            }
          }}>
          <h2>
            Models
          </h2>
          <img id="models-arrow" src={(localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack}
               alt="Dropdown Icon"/>
        </div>

        <div
          id="models-table"
          className="is-hidden"
          style={{height: "max-content", overflowY: "scroll"}}
        >
          <hr
            style={{margin: "0"}}
          />
          {(models) ?
            <table className="table" style={{margin: "0"}}>
              <thead>
              <tr>
                <th style={{position: "sticky", top: "0", background: "#EAEAEA", zIndex: "100"}}>Model Name</th>
                <th style={{position: "sticky", top: "0", background: "#EAEAEA", zIndex: "100"}}>Run Model</th>
              </tr>
              </thead>
              <tbody>
              {(models) ? models: null}
              </tbody>
            </table>
            :
            <Spinner animation="border" role="status">
              <span>Loading Models...</span>
            </Spinner>
          }

        </div>
        <hr
          style={{margin: "0"}}
        />

        <div
          style={{cursor: "pointer", padding: "10px", display: "flex", justifyContent: "center"}}
          onClick={() => {
            if (document.getElementById("intents-table").classList.contains("is-hidden")) {
              this.getIntentions()

              document.getElementById("intents-table").classList.remove("is-hidden")
              document.getElementById("incorrect-responses-table").classList.add("is-hidden")
              document.getElementById("models-table").classList.add("is-hidden")

              document.getElementById("intents-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowUpWhite : ArrowUpBlack
              document.getElementById("incorrect-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
              document.getElementById("models-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
            } else {
              document.getElementById("intents-table").classList.add("is-hidden")

              document.getElementById("intents-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
            }
          }}>
          <h2>
            Recognised User Intentions
          </h2>
          <img id="intents-arrow" src={(localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack}
               alt="Dropdown Icon"/>
        </div>

        <div
          id="intents-table"
          className="is-hidden"
          style={{height: "max-content", overflowY: "scroll"}}
        >
          <hr
            style={{margin: "0"}}
          />

            {(intents) ?
              <table className="table" style={{margin: "0"}}>
                <thead>
                <tr>
                  <th style={{position: "sticky", top: "0", background: "#EAEAEA", zIndex: "100"}}>Recognised Intentions
                    (Click to add more data)
                  </th>
                </tr>
                </thead>
                <tbody>
                {intents}
                </tbody>
              </table>
              :
              <Spinner animation="border" role="status">
                <span>Loading Intentions...</span>
              </Spinner>
            }

        </div>
        <hr
          style={{margin: "0"}}
        />

        <div
          style={{cursor: "pointer", padding: "10px", display: "flex", justifyContent: "center"}}
          onClick={() => {
            if (document.getElementById("incorrect-responses-table").classList.contains("is-hidden")) {
              this.getIncorrectMessages()

              document.getElementById("incorrect-responses-table").classList.remove("is-hidden")
              document.getElementById("intents-table").classList.add("is-hidden")
              document.getElementById("models-table").classList.add("is-hidden")

              document.getElementById("incorrect-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowUpWhite : ArrowUpBlack
              document.getElementById("intents-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
            } else {
              document.getElementById("incorrect-responses-table").classList.add("is-hidden")

              document.getElementById("incorrect-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
              document.getElementById("models-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
            }
          }}>
          <h2>
            Incorrect Responses
          </h2>
          <img id="incorrect-response-arrow"
               src={(localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack} alt="Dropdown Icon"/>
        </div>

        <div
          id="incorrect-responses-table"
          className="is-hidden"
          style={{height: "max-content", overflowY: "scroll"}}>
          <hr
            style={{margin: "0"}}
          />

            {(incorrectResults) ?
              <table className="table" style={{margin: "0"}}>
                <thead>
                <tr>
                  <th style={{position: "sticky", top: "0", background: "#EAEAEA", zIndex: "100"}}>User Message</th>
                  <th style={{position: "sticky", top: "0", background: "#EAEAEA", zIndex: "100"}}>Bot Message</th>
                  <th style={{position: "sticky", top: "0", background: "#EAEAEA", zIndex: "100"}}>Remove</th>
                </tr>
                </thead>
                <tbody>
                {incorrectResults}
                </tbody>
              </table>
              :
              <Spinner animation="border" role="status">
                <span>Loading Incorrect Results...</span>
              </Spinner>
            }

        </div>
        <hr
          style={{margin: "0"}}
        />

        {this.state.modal}
      </div>
    )
  }
}

export default Admin