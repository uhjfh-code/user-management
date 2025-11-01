import React from 'react';
import './App.css';
import UsersList from './pages/UsersList';
import { Routes, Route } from 'react-router-dom';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';

function App() {
  return (
    <Routes>
      <Route path='/' element={<UsersList/>}/>
      <Route path='/add-user' element={<AddUser/>}/>
      <Route path='/edit-user/:id' element={<EditUser />} />
    </Routes>
  );
}

export default App;
