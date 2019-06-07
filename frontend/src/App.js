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
    // this.setState({screen: 'loading'})    
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

    //for testing purpose

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
        this.setState({screen: 'results', results: json[1], text: "numpy array in python"})
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
    this.setState({screen: 'search', results: []})
  }

  dateFormat = (d) => {
    var date = new Date(d)
    var options = {year: 'numeric', month: 'long', day: 'numeric'}
    return date.toLocaleDateString("en-US", options)
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
                  <div>
                    <div className="items">
                      <h3 style={{margin: 0}} key={index}>
                        {item.title}
                      </h3>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div className="tooltip">
                          <div className="linkProb">{Math.ceil(item.probability*100)}%</div>
                          <div className="tooltiptext">Similarity</div>
                        </div>
                        <div className="tooltip">
                          <img className="link" src={info} />
                          <div className="tooltiptext2">
                            <div style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
                              {item.tags.map(tag => {
                                return(<div className="tags">{tag}</div>)
                              })}
                            </div>
                            <p>Answered: {item.is_answered ? "Yes" : "No"}</p>
                            <p>Number of answers: {item.answer_count ? item.answer_count : "-"}</p>
                            <p>Views: {item.view_count}</p>
                            <p>Accept Rate: {item.owner.accept_rate ? item.owner.accept_rate : "-"}</p>
                            <p>Posted on: {this.dateFormat(item.creation_date)}</p>
                            <p>Last Activity: {this.dateFormat(item.last_activity_date)}</p>
                          </div>
                        </div>
                        <div className="tooltip">
                          <img className="link" src={link} onClick={()=> window.open(item.link, "_blank")}/>
                          <div className="tooltiptext">Go to link</div>
                        </div>
                      </div>
                    </div>
                    <div 
                      className="similar" 
                      style={{background: `linear-gradient(to right, #ff9800 ${item.probability*100}%, #ffffff 1%`}}
                    >
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