// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const environment = {
	firebase: {
    projectId: 'slack-clone-da',
    appId: '1:135875603663:web:9e5addc58e4248cbd21bba',
    storageBucket: 'slack-clone-da.appspot.com',
    apiKey: 'AIzaSyCRgSI4GSvVWDTFsob_Q0juWjE5aTpbn1k',
    authDomain: 'slack-clone-da.firebaseapp.com',
    messagingSenderId: '135875603663',
  },
  production: false,
  openAIToken: '' // inside the '' add your personal api key from openAI
};
