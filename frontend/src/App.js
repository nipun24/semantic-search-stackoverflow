import React, {Component} from 'react';
import './App.css';
import URL from './constants';
import loading from './loading.gif';
import search from './search.png';

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
          <div className="container2">
            <input className="field" placeholder="What are you looking for?" onChange={e => this.setState({text: e.target.value.toLowerCase()})} />
            <img src={search} className="icon" onClick={this.onSearch} />
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
          <h1 className="error">
            404
          </h1>
          <h2>Oops! No results were found for "{this.state.text}"</h2>
          <div className="link">
            <p>click</p>
            <a href="#" style={{marginLeft: "5px", marginRight: "5px"}} onClick={this.goBack}>here</a>            
            <p>to search again</p>
          </div>
        </div>
      );
    }
    else if (this.state.screen === 'results') {
      return(
        <div className="container3">
          <h1 className="resultHeading">
            "{this.state.text}"
          </h1>
          <div>
            {
              this.state.results.map((item, index) => {
                return <h3 className="items" key={index}>{item}</h3>
              })
            }
          </div>
          <div className="link">
            <p>click</p>
            <a href="#" style={{marginLeft: "5px", marginRight: "5px"}} onClick={this.goBack}>here</a>            
            <p>to search again</p>
          </div>
        </div>
      );
    }
  }
}

export default App;