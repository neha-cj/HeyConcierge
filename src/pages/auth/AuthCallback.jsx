import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Processing...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setMessage('Error: ' + error.message);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (data.session) {
          setMessage('Email confirmed successfully! Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setMessage('No session found. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setMessage('An error occurred. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h2>Email Confirmation</h2>
        <p>{message}</p>
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
} 