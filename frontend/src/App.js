import React, {Component} from 'react';
import './App.css';
import URL from './constants';
import loading from './assets/loading.gif';
import search from './assets/search.png';
import link from './assets/link.png';
import info from './assets/info.png';

class App extends Component {

  state = {
    text: "",
    screen: 'search',
    results: []
  }

  onSearch = () => {
    this.setState({screen: 'loading'})    
    // fetch(`${URL}/`, {
    //   method: 'post',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({
    //     query: this.state.text
    //   })
    // })
    // .then(res => res.json())
    // .then(json => {
    //   if(json){
    //     json[0].map((item, index) => {
    //       json[1][index].probability = item.probability
    //     })
    //     json[1].sort((a ,b) => {
    //       return b.probability - a.probability
    //     })
    //     this.setState({screen: 'results', results: json[1]})
    //   }
    //   else {
    //     this.setState({screen: 'results'})
    //   }
    // })
    fetch("https://raw.githubusercontent.com/nipun24/json-repo/master/result.json")
    .then(res => res.json())
    .then(json => {
      if(json){
        json[0].map((item, index) => {
          json[1][index].probability = item.probability
        })
        json[1].sort((a ,b) => {
          return b.probability - a.probability
        })
        this.setState({screen: 'results', results: json[1]})
      }
      else {
        this.setState({screen: 'results'})
      }
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
          <a href="#" className="goto" onClick={this.goBack}>GO TO SEARCH</a>
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
                return(
                  <div className="items">
                    <h3 style={{margin: 0}} key={index}>
                      {item.title}
                    </h3>
                    <div>
                      <img className="link" src={link} onClick={()=> window.open(item.link, "_blank")}/>
                      <img className="link" src={info} />
                    </div>
                  </div>
                );
              })
            }
          </div>
          <a href="#" className="goto" onClick={this.goBack}>GO TO SEARCH</a>
        </div>
      );
    }
  }
}

export default App;