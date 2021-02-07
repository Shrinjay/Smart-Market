import React, {Component} from 'react';
import {Button, Spinner} from 'react-bootstrap'
import Draft from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios'

const BarStyling = {width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem"};

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      spinny: false
    };
    this.sendPrompt = this.sendPrompt.bind(this);
  }

  updateKey(value) {
    this.setState({keyword: value})
  }

  sendPrompt() {
    this.setState({spinny: true})
    axios.get(`http://localhost:5000/getPhrases?prompt=${this.state.keyword}`)
    .then(res => {
      const suggestion = res.data[0]
      this.props.onEditorChange(Draft.EditorState.createWithContent(Draft.ContentState.createFromText(suggestion)))
      this.setState({spinny: false})
    })
  }
  
  render() {
    return (
      <div>
        <input 
       style={BarStyling}
       key="random1"
       placeholder={"Search Keyword"}
       onChange={(e) => this.updateKey(e.target.value)}
      />
      <Button type="button" onClick={this.sendPrompt}>Submit</Button>
      <br />
      {this.state.spinny ? <Spinner animation="border" /> : null}
      <br /><br />
      <h3>Your suggestion will show up here: </h3>
      <div style={{border: 'dotted'}}>
        <Editor editorState={this.props.editorState} onEditorStateChange={this.props.onEditorChange} />
      </div>
      </div>
    );
  }
}

export default SearchBar