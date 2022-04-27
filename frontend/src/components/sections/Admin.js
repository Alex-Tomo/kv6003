import React from 'react'

import ArrowDownBlack from "../../assets/arrow_down_black.svg"
import ArrowDownWhite from "../../assets/arrow_down_white.svg"
import ArrowUpBlack from "../../assets/arrow_up_black.svg"
import ArrowUpWhite from "../../assets/arrow_up_white.svg"
import ClearWhite from "../../assets/clear_white.svg"

/**
 * TODO: Remove incorrect messages
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
    }
  }

  componentDidMount() {
    this.getUnknownMessages()
    this.getIncorrectMessages()
  }

  getUnknownMessages = () => {
    let formData = new FormData()
    formData.append('unknown', "true")

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).then(r => {
      return r.json()
    }).then((r) => {
      this.setState({unknownResults: r})
    }).catch(err => {
      console.log("could not add message")
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

  removeUnknownMessage = (id) => {
    let formData = new FormData()
    formData.append('unknown', "true")
    formData.append('remove', "true")
    formData.append('id', id)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).then(r => {
      console.log("removed message")
      let arr = this.state.unknownResults
      arr = arr.filter(r => r.id !== id)
      console.log(arr)
      this.setState({unknownResults: arr})
    }).catch(err => {
      console.log("could not remove message")
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
      console.log("removed message")
      let arr = this.state.incorrectResults
      arr = arr.filter(r => r.id !== id)
      console.log(arr)
      this.setState({incorrectResults: arr})
    }).catch(err => {
      console.log("could not remove message")
    })
  }

  render() {
    let unknownResults = ""

    if (this.state.unknownResults.length > 0) {
      unknownResults = this.state.unknownResults.map((result, i) => {
        return (
            <tr key={i} className={localStorage.getItem("theme")}>
              <td><p style={{width: "80%", textAlign: "start", margin: "2.5px 5px"}}>{result.message}</p></td>
              <td><button style={{width: "fit-content", margin: "2.5px 2.5px 2.5px 0"}} className="button is-danger" onClick={() => this.removeUnknownMessage(result.id)}>
                <img src={ClearWhite} alt="Delete Icon" />
              </button></td>
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
            <td><button style={{width: "fit-content", margin: "2.5px 2.5px 2.5px 0"}} className="button is-danger" onClick={() => this.removeIncorrectMessage(result.id)}>
              <img src={ClearWhite} alt="Delete Icon" />
            </button></td>
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
          <div
            style={{cursor: "pointer", padding: "10px", display: "flex", justifyContent: "center"}}
             onClick={() => {
               if (document.getElementById("unknown-responses-table").classList.contains("is-hidden")) {
                 document.getElementById("unknown-responses-table").classList.remove("is-hidden")
                 document.getElementById("incorrect-responses-table").classList.add("is-hidden")

                 document.getElementById("unknown-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowUpWhite : ArrowUpBlack
                 document.getElementById("incorrect-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
               } else {
                 document.getElementById("unknown-responses-table").classList.add("is-hidden")

                 document.getElementById("unknown-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
               }
             }}>
            <h2>
              Unknown Responses
            </h2>
            <img id="unknown-response-arrow" src={(localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack} alt="Dropdown Icon" />
          </div>

          <div
            id="unknown-responses-table"
            className="is-hidden"
            style={{height: "max-content", overflowY: "scroll"}}
          >
            <hr
              style={{margin: "0"}}
            />
            <table className="table" style={{margin: "0"}}>
              <thead>
              <tr>
                <th style={{position: "sticky", top: "0", background: "#EAEAEA", zIndex: "100"}}>User Message</th>
                <th style={{position: "sticky", top: "0", background: "#EAEAEA", zIndex: "100"}}>Remove</th>
              </tr>
              </thead>
              <tbody>
                {unknownResults}
              </tbody>
            </table>
          </div>
          <hr
            style={{margin: "0"}}
          />

          <div
            style={{cursor: "pointer", padding: "10px", display: "flex", justifyContent: "center"}}
              onClick={() => {
                if (document.getElementById("incorrect-responses-table").classList.contains("is-hidden")) {
                  document.getElementById("incorrect-responses-table").classList.remove("is-hidden")
                  document.getElementById("unknown-responses-table").classList.add("is-hidden")

                  document.getElementById("incorrect-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowUpWhite : ArrowUpBlack
                  document.getElementById("unknown-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
                } else {
                  document.getElementById("incorrect-responses-table").classList.add("is-hidden")

                  document.getElementById("incorrect-response-arrow").src = (localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack
                }
              }}>
            <h2>
              Incorrect Response
            </h2>
            <img id="incorrect-response-arrow" src={(localStorage.getItem("theme") === "dark") ? ArrowDownWhite : ArrowDownBlack} alt="Dropdown Icon" />
          </div>

          <div
            id="incorrect-responses-table"
            className="is-hidden"
            style={{height: "max-content", overflowY: "scroll"}}>
            <hr
              style={{margin: "0"}}
            />
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
          </div>
          <hr
            style={{margin: "0"}}
          />
        </div>
      )
  }
}

export default Admin