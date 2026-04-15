import React, { useEffect, useCallback } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '../context/GoogleAuthContext';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const { handleGoogleLoginSuccess, handleGoogleLoginError, loading } = useGoogleAuth();

  // Log component mount
  useEffect(() => {
    console.log('[GoogleLoginButton] Component mounted');
    return () => {
      console.log('[GoogleLoginButton] Component unmounted');
    };
  }, []);

  // Memoize callback functions to prevent unnecessary re-renders
  const onGoogleSuccess = useCallback((credentialResponse) => {
    console.log('[GoogleLoginButton] Login success callback triggered');
    handleGoogleLoginSuccess(credentialResponse);
    if (onSuccess) {
      onSuccess(credentialResponse);
    }
  }, [handleGoogleLoginSuccess, onSuccess]);

  const onGoogleError = useCallback((error) => {
    console.log('[GoogleLoginButton] Login error callback triggered');
    handleGoogleLoginError(error);
    if (onError) {
      onError(error);
    }
  }, [handleGoogleLoginError, onError]);

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={onGoogleSuccess}
        onError={onGoogleError}
        useOneTap
        auto_select={false}
        theme="filled_blue"
        text="signin_with"
        shape="rectangular"
        width="300"
        logo_alignment="left"
        disabled={loading}
      />
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(GoogleLoginButton);
