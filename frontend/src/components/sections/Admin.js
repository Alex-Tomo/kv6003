import React from 'react'

class Admin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      results: []
    }
  }

  componentDidMount() {
    this.getUnknownMessages()
  }

  getUnknownMessages = () => {
    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST'
    }).then(r => {
      return r.json()
    }).then((r) => {
      this.setState({results: r})
    }).catch(err => {
      console.log("could not add message")
    })
  }

  removeUnknownMessage = (id) => {
    let formData = new FormData()
    formData.append('remove', "true")
    formData.append('id', id)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).then(r => {
      console.log("removed message")
      let arr = this.state.results
      arr = arr.filter(r => r.id !== id)
      console.log(arr)
      this.setState({results: arr})
    }).catch(err => {
      console.log("could not remove message")
    })
  }

  render() {
    let result = ""

    console.log(this.state.results)

    if (this.state.results.length > 0) {
      result = this.state.results.map((result, i) => {
        console.log(result)
        return (
            <div key={i} className={localStorage.getItem("theme")}
              style={{
                border: (localStorage.getItem("theme") === "dark") ? "1px solid #FFFFFF" : "1px solid #17141D",
                borderRadius: "5px",
                width: "80%",
                margin: "5px auto",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <p style={{width: "80%", textAlign: "start", margin: "2.5px 5px"}}>{result.message}</p>
              <button style={{width: "150px", margin: "2.5px 2.5px 2.5px 0"}} className="button is-danger" onClick={() => this.removeUnknownMessage(result.id)}>Delete</button>
            </div>
        )
      })
    }

    return (
        <div id="admin" style={{
          overflowY: "scroll"
        }}>
          <h1>Admin page</h1>
          <hr />
          <h2>Unknown Responses</h2>
          <div style={{
            overflowY: "scroll", height: "40%"
          }}>
            {result}
          </div>
        </div>
      )
  }
}

export default Admin