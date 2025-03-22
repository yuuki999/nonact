'use client';

import { useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import SignupCompleteModal from './SignupCompleteModal';

export interface AuthModalsProps {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  onLoginClose: () => void;
  onSignupClose: () => void;
  openLogin: () => void;
  openSignup: () => void;
}

export default function AuthModals({
  isLoginOpen,
  isSignupOpen,
  onLoginClose,
  onSignupClose,
  openLogin,
  openSignup
}: AuthModalsProps) {
  const [isSignupCompleteOpen, setIsSignupCompleteOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSignupSuccess = (email: string) => {
    setRegisteredEmail(email);
    setIsSignupCompleteOpen(true);
  };

  const closeSignupComplete = () => {
    setIsSignupCompleteOpen(false);
  };

  // ログインモーダルからサインアップモーダルに切り替える
  const switchToSignup = () => {
    onLoginClose();
    openSignup();
  };

  // サインアップモーダルからログインモーダルに切り替える
  const switchToLogin = () => {
    onSignupClose();
    openLogin();
  };

  return (
    <>
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={onLoginClose} 
        onSwitchToSignup={switchToSignup}
      />
      
      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={onSignupClose} 
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={switchToLogin}
      />
      
      <SignupCompleteModal 
        isOpen={isSignupCompleteOpen} 
        onClose={closeSignupComplete} 
        email={registeredEmail}
      />
    </>
  );
}
