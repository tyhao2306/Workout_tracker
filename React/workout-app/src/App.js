import React, {useState, useEffect} from "react";
import api from './api';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './Login';
import ProtectedPage from "./Protected";
import Exercise from "./Exercise";
import Workout from "./Workout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/protected' element={<ProtectedPage/>}/>
        <Route path='/exercise' element={<Exercise/>}/>
        <Route path='/workout' element={<Workout/>}/>
      </Routes>
    </Router>
  )
}
export default App;
