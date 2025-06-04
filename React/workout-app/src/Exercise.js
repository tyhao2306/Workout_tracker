import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Exercise =() =>{
    const navigate = useNavigate();

    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]= useState('');
    const [success, setSuccess]= useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        muscle_group: ''
    });

    // Fetch exercises
    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const response = await api.get('/exercise');
            setExercises(response.data);
            setError('');
        } catch (err){
            setError('Failed to fetch');
            console.error('Error fetching:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()){
            setError('Exercise name is required');
            return
        }

        try {
            setLoading(true);
            setError('');

            const response = await api.post('/exercise', formData);

            setExercises(prev => [response.data, ...prev]);

            setFormData({
                name: '',
                category: '',
                description: '',
                muscle_group: ''
            });

            setSuccess('Exercise created successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err){
            setError(err.response?.data?.detail || 'Failed to create exercise');
            console.error('Error creating exercise:', err);
        } finally {
            setLoading(false);
        }
    };

    // Back button handler
    const handleBack = () => {
        navigate('/protected');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Create New Exercise</h2>
    
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
    
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    name="name"
                    placeholder="Exercise Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="muscle_group"
                    placeholder="Muscle Group"
                    value={formData.muscle_group}
                    onChange={handleInputChange}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Create Exercise'}
                </button>
            </form>
    
            <h3>Existing Exercises</h3>
            {loading ? (
                <p>Loading exercises...</p>
            ) : (
                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Muscle Group</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exercises.map((ex) => (
                            <tr key={ex.id}>
                                <td>{ex.name}</td>
                                <td>{ex.category}</td>
                                <td>{ex.muscle_group}</td>
                                <td>{ex.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Back Button */}
            <button onClick={handleBack} style={{ marginTop: '20px' }}>Back</button>
        </div>
    );
};

export default Exercise;