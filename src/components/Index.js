import React, { Component } from 'react';
import axios from '../axios';
import fileDownload from 'react-file-download';

class Index extends Component {
  state = {
  }
  InputData = event => {
    event.preventDefault();
    let file = event.target.files[0];
    this.setState({ data: file })
    console.log('success')
  }

  SendFile = event => {
    event.preventDefault();
    var formData = new FormData();
    formData.append("data", this.state.data);
    axios.post("https://ptsp-backend-fifo.herokuapp.com/api/fifo", formData,{ responseType: 'arraybuffer' } , { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(response => {
      console.log(response.data)
      fileDownload(response.data, 'Data.xlsx')
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <form >
        <label className="custom-file">
          <input onChange={this.InputData} type="file" className="custom-file-input" id="customFile" />
          <label className="custom-file-label">Choose file</label>
        </label>
        <button onClick={this.SendFile} id="button" className="btn btn-primary" type="button" name="button">Send</button>
      </form >
    );
  }
}

export default Index;