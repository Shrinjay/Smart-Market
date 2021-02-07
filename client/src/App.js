import { RaisedButton } from 'material-ui';
import {Container, Row, Col, Button} from 'react-bootstrap'
import React, { useState } from 'react';
import './App.css';
import { Banner } from './banner';
import DateTimePicker from 'react-datetime-picker';
import SearchBar from './search';
import {EditorState} from 'draft-js';
import axios from 'axios';

function App() {

  const [dateValue, onChange] = useState(new Date());
  const [editorState, onEditorChange] = useState(EditorState.createEmpty())

  function sendPhrase() {
    const message = editorState.getCurrentContent().getPlainText('\u0001')
    const date = {
      year: dateValue.getFullYear(),
      month: dateValue.getMonth()+1,
      date: dateValue.getDate(),
      hours: dateValue.getHours(),
      minutes: dateValue.getMinutes()
    }
    console.log(date)
    console.log(message)
    axios.post('http://localhost:5000/savePhrases', {
      content: message,
      year: date.year,
      month: date.month,
      date: date.date,
      hour: date.hours,
      minute: date.minutes
    })
    .then(res => console.log(res))
  }


  return (
    <div className="App">
    <Container>
    <Banner/>
    <h1>Welcome Back!</h1>
    <h3>Enter a prompt, like "We're an organic cookie shop"</h3>
    <Row>
      <Col xs={{offset: 2, span: 8}}>
        <SearchBar editorState={editorState} onEditorChange={onEditorChange}/>
      </Col>
    </Row>
    
    <h3>Schedule your post: </h3>
    <DateTimePicker
      onChange={onChange}
      value={dateValue}
    />
    <br /><br />
    <Button type="button" onClick={sendPhrase}>Submit</Button>
    </Container> 
    </div>
  );
}


export default App;