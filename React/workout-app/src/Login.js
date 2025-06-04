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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                      type = "text"
                      value = {username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                      type = "text"
                      value = {password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...': 'Login'}
                </button>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;