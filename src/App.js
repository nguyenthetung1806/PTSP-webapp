import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import axios from './axios';
import Container from "./components/LoginPage/Container";
import Home from "./containers/Home/Home";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: {
        friendRequests: [],
        friendRequestSended: []
      }
    }
    axios.get("https://yeuxa-api.herokuapp.com/api/auth/")
      .then(response => {
        if (response.data) {
          console.log(response.data)
          let object = response.data;
          if(this.state.room) object.room = this.state.room;
          this.setState({ userInfo: object });
          return axios.get("https://yeuxa-api.herokuapp.com/api/friend/list-invitation", {
          })
        }
      })
      .then(lists => this.onLoginDone(lists))
      .catch(err => console.log(err));
  }
  changeWarning = (warning) => {
    this.setState({ warning: warning })
  }
  changeStatefetch = () => {
    this.setState({ fetchInProgress: true })
  }
  onLoginDone = (lists) => {
    let newFriendRequests = lists.data.filter((list => list.receiver === this.state.userInfo.username));
    let newFriendRequestSended = lists.data.filter((list => list.sender === this.state.userInfo.username));
    let request = {
      friendRequests: newFriendRequests,
      friendRequestSended: newFriendRequestSended
    }
    this.setState({
      request: request,
      fetchInProgress: false
    })
    console.log(this.state)
  }



  onSignIn = (username, password) => {
    this.setState({ fetchInProgress: true }, function () {
      axios.post("https://yeuxa-api.herokuapp.com/api/auth/", {
        username: username,
        password: password,
      })
        .then(response => {
          this.setState({
            fetchInProgress: false,
            userInfo: response.data
          });
          return axios.get("https://yeuxa-api.herokuapp.com/api/friend/list-invitation", {})
        })
        .then(lists => this.onLoginDone(lists))
        .catch(error => {
          this.setState({
            fetchInProgress: false,
            warning: "Incorrect Username or Password !"
          });

        });

    });
  }

  clearWarning = () => {
    this.setState({ warning: undefined });
  }
  setWarning = (warning) => {
    this.setState({ warning: warning })
  }
  onSignUp = (avatar, name, username, password, onSignIn) => {
    this.setState({ fetchInProgress: true }, function () {
      var formData = new FormData();
      formData.append("avatar", avatar);
      formData.append("fullname", name);
      formData.append("username", username);
      formData.append("password", password);
      axios.post("https://yeuxa-api.herokuapp.com/api/users/", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => this.onSignIn(username, password))
        .catch(err => {
          this.setState({
            fetchInProgress: false,
            warning: 'Username already exists !'
          });
        });
    });
  }

  onLogOut = () => {
    console.log('logout');
    axios.delete('https://yeuxa-api.herokuapp.com/api/auth');
    this.setState({
      userInfo: undefined,
      request: {
        friendRequests: [],
        friendRequestSended: []
      }
    });
  }
  onAceptInvite = (id, sender, receiver) => {
    this.setState({ fetchInProgress: true }, function () {
      axios.put('https://yeuxa-api.herokuapp.com/api/friend/accept-invitation', { id })
        .then(response => {
          let newUserInfo = this.state.userInfo;
          newUserInfo['room'] = response.data._id;
          this.setState({
            room: response.data._id,
            request: {
              friendRequests: [],
              friendRequestSended: []
            },
            userInfo: newUserInfo,
            fetchInProgress: false
          });
          console.log(response.data)
          console.log(this.state)
        })
        .catch(err => {
          console.log(err);
          this.setState({
            fetchInProgress: false
          })
        }); 
    });
  }

  onDeclineInvite = (id) => {
    axios.put('https://yeuxa-api.herokuapp.com/api/friend/reject-invitation', { id })
      .then(response => {
        if (this.state.request.friendRequests.length > 1) {
          let newFriendRequests = [...this.state.request.friendRequests];
          let newFriendRequestSended = [...this.state.request.friendRequestSended];
          newFriendRequests.splice(0, 1);
          let object = {
            request: {
              friendRequests: newFriendRequests,
              friendRequestSended: newFriendRequestSended
            },
          }
          this.setState({ request: object })
        } else {
          this.setState({
            request: {
              friendRequests: [],
              friendRequestSended: []
            }
          });
        }
      })
      .catch(err => console.log(err));
  }

  onsendRequest = (username) => {
    this.setState({ fetchInProgress: true }, function () {
      axios.post('https://yeuxa-api.herokuapp.com/api/friend/add-friend', {
        username: username
      })
        .then(response => {
          let object = this.state.request;
          object.friendRequestSended = username
          this.setState({
            fetchInProgress: false,
            friendRequestSended: object
          })
        })
        .catch(err => {
          this.setState({
            fetchInProgress: false,
            warning: "Username does not exist !"
          })
        })
    });
  }

  render() {
    return (
      <div className="App">
        <div className="body" >
          {(this.state.userInfo && this.state.userInfo.room)
            // ? <div onClick={this.onLogOut} >123213213</div>
            ? <Home
              onLogOut={this.onLogOut}
              userInfo={this.state.userInfo}
            />
            : <Container
              changeWarning={this.changeWarning}
              changeStatefetch={this.changeStatefetch}
              onLoginDone={this.onLoginDone}
              setWarning={this.setWarning}
              clearWarning={this.clearWarning}
              warning={this.state.warning}
              fetchInProgress={this.state.fetchInProgress}
              getData={this.getData}
              onDeclineInvite={this.onDeclineInvite}
              onAceptInvite={this.onAceptInvite}
              onLogOut={this.onLogOut}
              onCancelInvite={this.onCancelInvite}
              onSignIn={this.onSignIn}
              onSignUp={this.onSignUp}
              onsendRequest={this.onsendRequest}
              userInfo={this.state.userInfo}
              request={this.state.request} />}
        </div>
      </div>
    );
  }
}




export default App;
