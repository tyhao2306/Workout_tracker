import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(){
    const [username, setUsername ] = useState();
    const [password, setPassword ] = useState();
    const [error, setError ] = useState();
    const [loading, setLoading ] = useState();

    const navigate = useNavigate();

    const validateForm = () => {
        if (!username || !password ){
            setError("Username and password is required.");
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!validateForm()) return;
        setLoading(true);

        const formDetails = new URLSearchParams();
        formDetails.append('username', username);
        formDetails.append('password', password);
        
        try {
            const response = await fetch('http://localhost:8000/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDetails,
            });

            setLoading(false);

            if(response.ok){
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                navigate('/protected');
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Authentication failed!');
            }
        } catch (error) {
            setLoading(false);
            setError('Error occured');
        }
    };

    const handleCreateUser = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            setLoading(false);

            if (response.ok) {
                alert('User created! You can now log in.');
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Failed to create user.');
            }
        } catch (error) {
            setLoading(false);
            setError('Error occurred during user creation.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5'
        }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    width: '300px'
                }}
            >
                <h2 style={{ textAlign: 'center' }}>Login</h2>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', marginBottom: '1rem' }}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', marginBottom: '1rem' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <button
                    type="button"
                    onClick={handleCreateUser}
                    disabled={loading}
                    style={{
                        width: '100%',
                        marginTop: '0.5rem',
                        backgroundColor: '#eee',
                        border: '1px solid #ccc'
                    }}
                >
                    {loading ? 'Creating...' : 'Create Account'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;