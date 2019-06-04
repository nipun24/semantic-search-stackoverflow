import React, {Component} from 'react';
import './App.css';
import URL from './constants';
import loading from './loading.gif'

class App extends Component {

  state = {
    text: "",
    screen: 'search',
    results: []
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
      this.setState({screen: 'results', results: json})
    })
  }

  handleEnter = (e) => {
    if(e.key === "Enter"){
      this.onSearch()
    }
  }

  goBack = () => {
    this.setState({screen: 'search'})
  }

  render() {
    if (this.state.screen === 'search'){
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
    else if (this.state.screen === 'loading') {
      return(
        <div className="container">
          <h2>Searching...</h2>
          <img src={loading} style={{maxHeight: "100px"}} />
          <h2>Please wait this may take some time</h2>
        </div>
      );
    }
    else if (this.state.screen === 'results' && this.state.results.length === 0){
      return(
        <div className="container">
          <h1>
            No Results found
          </h1>
          <div style={{display: "flex", alignItems: "center" }}>
            <p>click</p>
            <a href="#" style={{marginLeft: "5px", marginRight: "5px"}} onClick={this.goBack}>here</a>            
            <p>to go back to search</p>
          </div>
        </div>
      );
    }
    else if (this.state.screen === 'results') {
      return(
        <div className="container3">
          <h1>Top 5 results:</h1>
          <div>
            {
              this.state.results.map((item, index) => {
                return <h2 className="items" key={index}>{item}</h2>
              })
            }
          </div>
          <div style={{display: "flex", alignItems: "center" }}>
            <p>click</p>
            <a href="#" style={{marginLeft: "5px", marginRight: "5px"}} onClick={this.goBack}>here</a>            
            <p>to go back to search</p>
          </div>
        </div>
      );
    }
  }
}

export default App;