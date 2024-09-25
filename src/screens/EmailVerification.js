import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Ensure correct Firebase imports
import { sendEmailVerification } from 'firebase/auth';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [resendEmail, setResendEmail] = useState(false);
  const [message, setMessage] = useState(''); // For showing messages
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Check if email is verified every time auth state changes
        const checkEmailVerified = () => {
          user.reload().then(() => {
            if (user.emailVerified) {
              // Redirect to /edit page if email is verified
              navigate('/edit'); 
            }
          });
        };

        checkEmailVerified(); // Check email verification status immediately
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
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
    <Container className="mt-5">
      <h1>Verify Your Email</h1>
      <p>
        A verification email has been sent to your email address. Please check your inbox and click the verification link to activate your account.
      </p>
      {message && <p>{message}</p>} {/* Show message to user */}
      <Button onClick={handleResendEmail} disabled={resendEmail}>
        Resend Verification Email
      </Button>
      <br /><br />
      <Button onClick={() => navigate('/login')}>
        Go to Login Page
      </Button>
    </Container>
  );
};

export default EmailVerification;
