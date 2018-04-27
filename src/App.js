
//Dependencies
import React, { Component } from 'react';
import reactDOM from 'react-dom';
import firebase from 'firebase';

import logo from './logo.svg';
import './App.css';

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAEwYPIhCriAo54ViyDDST65yhw40CC-7w",
    authDomain: "fir-react-95d08.firebaseapp.com",
    databaseURL: "https://fir-react-95d08.firebaseio.com",
    projectId: "fir-react-95d08",
    storageBucket: "fir-react-95d08.appspot.com",
    messagingSenderId: "845978504187"
  };
  firebase.initializeApp(config);

class App extends Component {

  constructor()
  {
    super();
    this.state = {
     /* user: {
        prenom: 'Leo',
        nom: 'Medel'
      }*/
      user: []
    }
  }

  componentWillMount()
  {
    console.log("Methode componentWillMount");
    const nameRef = firebase.database().ref().child('object');

    nameRef.on('value', (snapshot) =>{
      
      this.setState ({
        user: snapshot.val()
      });
      //console.log(snapshot.val());
      for (var i = 1; i < this.state.user.length; i++) { 
        console.log(this.state.user[i]);
      }
      
    });
  }

  handleUpload(event)
  {
    console.log("Methode handleUpload");
    console.log(event);
    console.log("  ");

    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/CV/${ file.name }`);
    const task = storageRef.put(file);
    //const newKeyID = storageRef.put().key;
    //console.log("New Key ID File CV "+ newKeyID);

    task.on('state_changed', snapshot => {
      
      let porcentage = (snapshot.bytesTransfered / snapshot.totalBytes) * 100;
      
    }, error => {
      console.log(error.message)
    },() => {
      /*
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };
      */
      const newKeyID = task.snapshot.downloadURL;
      console.log('Id CV file '+ newKeyID);
      const dbRef = firebase.database().ref('object').child('2').child('cv');
      console.log("Reference a firebase"+dbRef);
      const newCV = dbRef.push();
      newCV.set(newKeyID);
    });
  }



  render() {

    console.log("Render APP");

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Bonjour 
        </p>
        <ul>
          {
            this.state.user.map((user, key) =>(
              <div key={key}>
                <li> { user.prenom } { user.nom }</li>
                <input type="file" onChange={ this.handleUpload } />
                <a href={user.cv}>Regarder CV</a>
              </div>
              
            ))
          }
        </ul>
      </div>
    );
  }
}

export default App;
