import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDabQ_4sXJUHmZ8eZFUR_ZYF1RcOMJqZD4",
  authDomain: "odaymarkt-342af.firebaseapp.com",
  databaseURL: "https://odaymarkt-342af.firebaseio.com",
  projectId: "odaymarkt-342af",
  storageBucket: "odaymarkt-342af.appspot.com",
  messagingSenderId: "633129312714"
};
firebase.initializeApp(config);

const Firebase = firebase;

export default Firebase;