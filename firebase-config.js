// Firebase Configuration for XeetFlow
// This file contains the Firebase config that will be used for global data storage

const firebaseConfig = {
    // Firebase configuration for XeetFlow
    // This is safe to publish - API keys are public identifiers
    apiKey: "AIzaSyD7E-NeU5FTKNvGLz4ce7g3651U4YxOc78",
    authDomain: "xeetflow.firebaseapp.com",
    databaseURL: "https://xeetflow-default-rtdb.firebaseio.com",
    projectId: "xeetflow",
    storageBucket: "xeetflow.firebasestorage.app",
    messagingSenderId: "646769495389",
    appId: "1:646769495389:web:ddb0872fee9541f61c2cb4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get database reference
const database = firebase.database();

// Export for use in other files
window.firebaseDatabase = database;
