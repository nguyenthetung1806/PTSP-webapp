import React, { Component } from 'react';
import axios from '../axios';
import fileDownload from 'react-file-download';
import loading from '../images/Bars-1s-200px.gif'
import logo_vcbs from '../images/vcbs-la-gi.jpg'

class Index extends Component {
  state = {
  }
  InputData = event => {
    event.preventDefault();
    let file = event.target.files[0];
    this.setState({ data: file })
    console.log(file)
  }

  SendFile = event => {
    event.preventDefault();
    this.setState({ fetch: true }, function () {
      var formData = new FormData();
      formData.append("data", this.state.data);
      axios.post("https://ptsp-backend-fifo.herokuapp.com/api/fifo", formData, { responseType: 'arraybuffer' }, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => {
          console.log(response.data);
          fileDownload(response.data, 'FIFO-Result.xlsx');
          this.setState({ fetch: false });
        })
        .catch(err => {
          alert(err)
          this.setState({ fetch: false });
        });
    })
  }

  render() {
    return (
      <div className="box" >
        <form >
          <div>
            <img className="logo_vcbs" src={logo_vcbs} alt='logo' />
          </div>
          <h3 className="description text-center font-text-bold" >Tính toán FIFO</h3>
          <label className="custom-file">
            <input onChange={this.InputData} type="file" className="custom-file-input" id="customFile" />
            <label className="custom-file-label">Choose file</label>
          </label>
          {(this.state.data)
            ? <div className="text-center" >
              File: {this.state.data.name}
            </div>
            : <div className="text-center no-data">Chưa có Data</div>
          }
          {(this.state.fetch)
            ? <div className="btn btn-sm btn-block btn-loading">
              <img className="loading" src={loading} alt='loading' />
            </div>
            : <button onClick={this.SendFile} id="button" className="btn btn-sm btn-block " type="button" name="button">Send</button>
          }
        </form >
      </div>
    );
  }
}

export default Index;