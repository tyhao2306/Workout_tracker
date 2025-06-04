import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedPage(){
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            
            try {
                const response = await fetch('http://localhost:8000/verify-token/${token}');
                if(!response.ok) {
                    throw new Error('Token verification failed');
                }
            } catch (error) {
                localStorage.removeItem('token');
                navigate('/');
            }
        };

        verifyToken();
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Welcome to the Dashboard</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '30px' }}>
            <button onClick={() => navigate('/exercise')} style={buttonStyle}>Exercise</button>
            <button onClick={() => navigate('/workout')} style={buttonStyle}>Workout</button>
            <button onClick={() => navigate('/profile')} style={buttonStyle}>Profile</button>
            <button onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }} style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}>Logout</button>
          </div>
        </div>
      );
}

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

export default ProtectedPage;