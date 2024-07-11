import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onFailure }) => {
    const handleSuccess = (credentialResponse) => {
        console.log('Google login success:', credentialResponse);
        onSuccess(credentialResponse);
    };

    const handleFailure = (error) => {
        console.error('Google login error:', error);
        onFailure(error);
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleFailure}
        />
    );
};

export default GoogleLoginButton;