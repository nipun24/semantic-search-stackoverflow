import React, {Component} from 'react';

class App extends Component {

  state = {
    text: ""
  }

  onSearch = () => {
    console.log(this.state.text)
  }

  render() {
    return(
      <div>
        <h1>StackOverflow Search</h1>
        <input onChange={e => this.setState({text: e.target.value.toLowerCase()})} />
        <button onClick={this.onSearch}>Search</button>
      </div>
    );
  }
}

export default App;
