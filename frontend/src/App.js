import React, {Component} from 'react';

class App extends Component {

  onSearch = () => {
    fetch('google.com')
    .then(res => console.log(res))
  }

  render() {
    return(
      <div>
        <h1>StackOverflow Search</h1>
        <input />
        <button onClick={this.onSearch}>Search</button>
      </div>
    );
  }
}

export default App;
