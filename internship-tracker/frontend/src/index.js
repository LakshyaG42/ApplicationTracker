import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="854392932175-a79ndhc4uc09bnipvf0a0088q8kgubjb.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>

  </React.StrictMode>
);
// <App /> is wrapped in <GoogleOAuthProvider> to provide Google OAuth functionality


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
