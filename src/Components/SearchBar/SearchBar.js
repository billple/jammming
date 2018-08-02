import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);

    this.state = {
      searchTerm: null
    }
  }
  search(){
    this.props.onSearch(this.state.searchTerm);
  }
  handleTermChange(e){
    this.setState({
      searchTerm: e.target.value
    });
  }
  render(){
    return (
        <div className="SearchBar">
      <input placeholder="Enter A Song, Album, or Artist" onClick={this.handleTermChange} />
      <a onClick={this.search}>SEARCH</a>
    </div>
  );
  }
};

export default SearchBar;
