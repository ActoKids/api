import React, { Component } from 'react';
import TimeStamp from './TimeStamp';

class App extends Component {
  // PING_ENDPOINT = 'https://f8m8j1183j.execute-api.us-east-1.amazonaws.com/prod/ad440TestFunction';
  PING_ENDPOINT = 'https://flt5sd48q6.execute-api.us-west-2.amazonaws.com/test/pingAPIFunction';
  GET_ENDPOINT = 'https://flt5sd48q6.execute-api.us-west-2.amazonaws.com/test/get';
  POST_ENDPOINT = 'https://flt5sd48q6.execute-api.us-west-2.amazonaws.com/test/postdate';

  state = {
    message: "Wecome!",
    items: []
  }
  
  pingAPI = () => {
    fetch(this.PING_ENDPOINT)
    .then( res => res.json() )
    .then( myJson => {
      this.setState( {
        message: myJson.messageToErik
      })  
      //console.log(myJson);
    })
    .catch(err => console.log(err));
  }

  getItems = () => {
    fetch(this.GET_ENDPOINT)
    .then( res => res.json() )
    .then( myJson => {
        this.setState( {
          items: myJson
        });
        console.log(myJson);
    })
    .catch(err => console.log(err));
  }

  postDate = () => {
    let data = {}
    fetch(this.POST_ENDPOINT, {
        method: "POST", 
        mode: "no-cors", 
        cache: "no-cache",
        credentials: "same-origin", 
        headers:  {
            "Content-type": "application/json"
        },
        redirect: "follow", 
        referrer: "no-referrer",
        body: JSON.stringify(data),
    })
    //.then(response => response.json())
    .then( () => {
      this.setState({message: "Successfully added a new timestamp!"})
      console.log( "SUCCESS!!!" )
    })

    .catch(err => console.log(err));
  }

  clearFetchedData = () => {
    this.setState( {
      message: "Wecome!",
      items: []
    })
  }

  render() {
    return (
      <div className="App container">
        <h1>AD440 Demo App</h1>
        <p>{this.state.message}</p>
          <button className="btn" onClick={this.pingAPI}>PING!</button>
          <button className="btn" onClick={this.getItems}>GET TIMESTAMPS!</button>
          <button className="btn" onClick={this.postDate}>POST NEW TIMESTAMP!</button>
          <button className="btn" onClick={this.clearFetchedData}>CLEAR!</button>
        <TimeStamp stamps={this.state.items}/>
      </div>
    );
  } 
}

export default App;
