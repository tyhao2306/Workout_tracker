import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Workout =() =>{
    const navigate = useNavigate();
    
    const [workout, setWorkout] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]= useState('');
    const [success, setSuccess]= useState('');
    const [workoutExercises, setWorkoutExercises] = useState([]);

    const [selectedWorkoutId, setSelectedWorkoutId] = useState('');

     // Form state
    const [formData, setFormData] = useState({
        name: '',
        user_id: '',
        scheduled_date: ''
    });

    const [exerciseData, setExerciseData] = useState({
        exercise_id: '',
        sets: '',
        reps: '',
        weight: ''
    });

    // Fetch exercises
    useEffect(() => {
        fetchWorkouts();
    }, []);    

    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/workout');
            setWorkout(response.data);
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

    const handleExerciseChange = (e) => {
        const { name, value } = e.target;
        setExerciseData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()){
            setError('Workout name is required');
            return
        }

        try {
            setLoading(true);
            setError('');

            const response = await api.post('/workout', formData);
            const createdWorkout = response.data;

            setWorkout(prev => [response.data, ...prev]);

            setFormData({
                name: '',
                user_id: '',
                scheduled_date: ''
            });

            setSuccess('Workout created successfully!');
            console.log('Workout response:', response.data);
            console.log('Created workout ID:', workout.id);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err){
            setError(err.response?.data?.detail || 'Failed to create workout');
            console.error('Error creating workout:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWorkoutSelect = async (e) => {
        const id = e.target.value;
        setSelectedWorkoutId(id);
    
        if (id) {
          try {
            const res = await api.get(`/workoutexercise/${id}`);
            setWorkoutExercises(res.data);
            setError('');
          } catch (err) {
            setError('Failed to load exercises');
            setWorkoutExercises([]);
          }
        } else {
          setWorkoutExercises([]);
        }
      };

    const handleAddExercises = async () => {
        if (!selectedWorkoutId){
            setError('Please create workout first');
            return;
        }

        try{
            setLoading(true);
            setError('');

            const payload ={
                workout_id: selectedWorkoutId,
                ...exerciseData
            };

            await api.post('/workoutexercise', payload);

            setSuccess('Exercise added to workout!');
            setExerciseData({
                exercise_id: '',
                sets: '',
                reps: '',
                weight: ''                
            });
            const res = await api.get(`/workoutexercise/${selectedWorkoutId}`);
            setWorkoutExercises(res.data);

            setTimeout(() => setSuccess(''), 3000);
        } catch(err) {
            setError(err.response?.data?.detail || 'Failed to add exercise');
        } finally {
            setLoading(false);
        }
    };

    // Back button handler
    const handleBack = () => {
        navigate('/protected');
    };

    return (
        <div>
            <h2>Create Workout</h2>

            <form onSubmit={handleSubmit}>
                <h4>Workout Info</h4>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Workout Name"
                />
                <input
                    type="text"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    placeholder="User ID"
                />
                <input
                    type="date"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleInputChange}
                    placeholder="Scheduled Date"
                />
                <button type="submit">Create Workout</button>
            </form>

            <hr />

            <h3>Select a Workout</h3>
            <select value={selectedWorkoutId} onChange={handleWorkoutSelect}>
              <option value="">-- Select Workout --</option>
              {workout.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.scheduled_date})
                </option>
              ))}
            </select>

            {selectedWorkoutId && (
              <>
                <h4>Exercises in Workout #{selectedWorkoutId}</h4>
                {workoutExercises.length === 0 ? (
                  <p>No exercises added yet.</p>
                ) : (
                  <ul>
                    {workoutExercises.map((ex, i) => (
                      <li key={i}>
                        Exercise ID: {ex.exercise_id}, Sets: {ex.sets}, Reps: {ex.reps}, Weight: {ex.weight}
                      </li>
                    ))}
                  </ul>
                )}

                <h4>Add Exercise to Workout #{selectedWorkoutId}</h4>
                <input
                  type="text"
                  name="exercise_id"
                  value={exerciseData.exercise_id}
                  onChange={handleExerciseChange}
                  placeholder="Exercise ID"
                />
                <input
                  type="number"
                  name="sets"
                  value={exerciseData.sets}
                  onChange={handleExerciseChange}
                  placeholder="Sets"
                />
                <input
                  type="number"
                  name="reps"
                  value={exerciseData.reps}
                  onChange={handleExerciseChange}
                  placeholder="Reps"
                />
                <input
                  type="number"
                  name="weight"
                  value={exerciseData.weight}
                  onChange={handleExerciseChange}
                  placeholder="Weight"
                />
                <button onClick={handleAddExercises}>Add Exercise</button>
              </>
            )}

            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Loading...</p>}

            <button onClick={handleBack} style={{ marginTop: '20px' }}>Back</button>
        </div>
    );
};

export default Workout;