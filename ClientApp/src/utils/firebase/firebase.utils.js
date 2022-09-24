import { initializeApp } from 'firebase/app';
import {
    getAuth,    
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAQxiK85PLEMueDGKW0vzKuVWOASmZAMGY",
    authDomain: "rrr-stocks.firebaseapp.com",
    projectId: "rrr-stocks",
    storageBucket: "rrr-stocks.appspot.com",
    messagingSenderId: "610964943445",
    appId: "1:610964943445:web:aba5fbc1112034646d1adc"
};

const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

//export const db = getFirestore();

//export const createUserDocumentFromAuth = async (userAuth) => {
//    const userDocRef = doc(db, 'users', userAuth.uid);

//    const userSnapshot = await getDoc(userDocRef);

//    if (!userSnapshot.exists()) {
//        const { displayName, email } = userAuth;
//        const createdAt = new Date();

//        try {
//            await setDoc(userDocRef, {
//                displayName,
//                email,
//                createdAt,
//            });
//        } catch (error) {
//            console.log('error creating the user', error.message);
//        }
//    }

//    return userDocRef;
//};