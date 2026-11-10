// Firebase client configuration. Public web-app identifiers, not administrator credentials.
import {getAuth,connectAuthEmulator} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator} from 'firebase/firestore';
const useEmulators=import.meta.env.VITE_FIREBASE_EMULATORS==='true';
export const firebaseConfig = {
  apiKey: 'AIzaSyBcmT4HagqGYpo_ZfizIReEIvDPG-LtsJs',
  authDomain: 'my-gorithm.firebaseapp.com',
  projectId: 'my-gorithm',
  storageBucket: 'my-gorithm.firebasestorage.app',
  messagingSenderId: '844754199331',
  appId: '1:844754199331:web:2adf2f89e4cf45e188e296',
  measurementId: 'G-SEVD6WLTHP'
};
if(useEmulators)Object.assign(firebaseConfig,{projectId:'demo-mamgorithm-merge',authDomain:'localhost',apiKey:'demo-key'});
const connectedAuth=new WeakSet(),connectedDb=new WeakSet();
export function Cv(app){
  const auth=getAuth(app);
  if(useEmulators&&!connectedAuth.has(auth)){connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});connectedAuth.add(auth);}
  if(useEmulators)window.__mamgorithmEmulatorAuth=auth;
  return auth;
}
export function f_(app){
  const db=getFirestore(app);
  if(useEmulators&&!connectedDb.has(db)){connectFirestoreEmulator(db,'127.0.0.1',8080);connectedDb.add(db);}
  return db;
}
// Aliases match the recovered current deployed UI. Initialization and observers are in script.js.
export { initializeApp as Df } from 'firebase/app';
export { doc as yu, setDoc as Rm, getDoc as C_ } from 'firebase/firestore';
export { onAuthStateChanged as oI, signInAnonymously as Ym,
  GoogleAuthProvider as yn, signInWithPopup as TI, signOut as aI } from 'firebase/auth';
