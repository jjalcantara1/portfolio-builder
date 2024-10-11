import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import '../css/EmailVerification.css';                  

const EmailVerification = () => {
  const [resendEmail, setResendEmail] = useState(false);
  const [message, setMessage] = useState(''); // For showing messages
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const checkEmailVerified = () => {
          user.reload().then(() => {
            if (user.emailVerified) {
              navigate('/edit'); 
            }
          });
        };

        checkEmailVerified(); 
      }
    });

    return () => unsubscribe(); 
  }, [navigate]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.emailVerified) {
      sendEmailVerification(currentUser)
        .then(() => {
          setMessage('A verification email has been sent. Please check your inbox.');
        })
        .catch((error) => {
          console.error('Error sending email verification: ', error);
          setMessage('Error sending verification email. Please try again.');
        });
    }
  }, []);

  const handleResendEmail = () => {
    if (!resendEmail) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          setMessage('Verification email resent. Please check your inbox.');
          setResendEmail(true);
        })
        .catch((error) => {
          console.error('Error resending email verification: ', error);
          setMessage('Error resending verification email. Please try again.');
        });
    } else {
      setMessage('Please wait before requesting another email.');
    }
  };

  return (
    <div id="email-verification">
      <div id="ver-emailcon">
        <FaEnvelope id="ver-icon" />
        <h1 id="ver-title">Verify Your Email</h1>
        <p id="ver-message">
          A verification email has been sent to your email address. Please check your inbox and click the verification link to activate your account.
        </p>
        {message && <p className="ver-error-message">{message}</p>}
        <button id="ver-resend-button" onClick={handleResendEmail} disabled={resendEmail}>
          Resend Verification Email
        </button>
        <button id="ver-login-button" onClick={() => navigate('/login')}>
          Go to Login Page
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
