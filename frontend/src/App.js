import React, {Component} from 'react';
import './App.css';
import URL from './constants';

class App extends Component {

  state = {
    text: ""
  }

  onSearch = () => {
    console.log(this.state.text)
    fetch(`${URL}/`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        text: this.state.text
      })
    })
  }

  handleEnter = (e) => {
    if(e.key === "Enter"){
      this.onSearch()
    }
  }

  render() {
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
}

export default App;
