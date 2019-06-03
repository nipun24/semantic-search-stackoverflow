import React, {Component} from 'react';
import './App.css';

class App extends Component {

  state = {
    text: ""
  }

  onSearch = () => {
    console.log(this.state.text)
  }

  render() {
    return(
      <div className="container">
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
