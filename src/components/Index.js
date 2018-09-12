import React, { Component } from 'react';
import axios from '../axios';
import fileDownload from 'react-file-download';
import loading from '../images/Bars-1s-200px.gif'
import logo_vcbs from '../images/vcbs-la-gi.jpg'

class Index extends Component {
  state = {
  }
  InputData_CF0079 = event => {
    event.preventDefault();
    let fileCF0079 = event.target.files[0];
    this.setState({ data_CF0079: fileCF0079 })
    console.log(fileCF0079)
  }
  InputData_OD0024 = event => {
    event.preventDefault();
    let fileOD0024 = event.target.files[0];
    this.setState({ data_OD0024: fileOD0024 })
    console.log(fileOD0024)
  }
  SendFile = event => {
    event.preventDefault();
    this.setState({ fetch: true }, function () {
      var formData = new FormData();
      formData.append("CF0079", this.state.data_CF0079);
      formData.append("OD0024", this.state.data_OD0024);
      axios.post("https://ptsp-backend-fifo.herokuapp.com/api/CF44", formData, { responseType: 'arraybuffer' }, { headers: { 'Content-Type': 'multipart/form-data' } })
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
          <h3 className="description text-center font-text-bold" >Báo cáo Môi giới</h3>
          <label className="custom-file">
            <input onChange={this.InputData_CF0079} type="file" className="custom-file-input" id="customFile" />
            <label className="custom-file-label">Choose file (CF0079)</label>
          </label>
          {(this.state.data_CF0079)
            ? <div className="text-center" >
              File: {this.state.data_CF0079.name}
            </div>
            : <div className="text-center no-data">Chưa có Data</div>
          }
          <label className="custom-file">
            <input onChange={this.InputData_OD0024} type="file" className="custom-file-input" id="customFile" />
            <label className="custom-file-label">Choose file (OD0024)</label>
          </label>
          {(this.state.data_OD0024)
            ? <div className="text-center" >
              File: {this.state.data_OD0024.name}
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