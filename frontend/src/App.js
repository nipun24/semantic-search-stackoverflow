import React, {Component} from 'react';
import './App.css';
import URL from './constants';
import loading from './loading.gif'

class App extends Component {

  state = {
    text: "",
    screen: 'search',
    results: {}
  }

  onSearch = () => {
    this.setState({screen: 'loading'})
    fetch(`${URL}/`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        query: this.state.text
      })
    })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      this.setState({screen: 'results', results: json})
    })
  }

  handleEnter = (e) => {
    if(e.key === "Enter"){
      this.onSearch()
    }
  }

  render() {
    if(this.state.screen === 'search'){
      return(
        <div className="container" onKeyPress={this.handleEnter}>
          <h1>StackOverflow Search</h1>
          <div className="container2">
            <input className="field" onChange={e => this.setState({text: e.target.value.toLowerCase()})} />
            <a href="#" className="search" onClick={this.onSearch} >SEARCH</a>
          </div>
        </div>
      );
    }
    else if(this.state.screen === 'loading') {
      return(
        <div className="container">
          <img src={loading} style={{maxHeight: "100px"}} />
        </div>
      );
    }
    else if (this.state.screen === 'results') {
      return(
        <div className="container">
          results
        </div>
      );
    }
  }
}

export default App;
