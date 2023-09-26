import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { firebase } from '@react-native-firebase/database';

GoogleSignin.configure({
    webClientId: '155337950601-7ejc8dt5a6p645oul0a3t9h7ga0bb01b.apps.googleusercontent.com',
});

export const rtDatabase = firebase.database();
