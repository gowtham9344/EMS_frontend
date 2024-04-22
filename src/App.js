import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './shared/components/navbar';
import Welcome from './welcome/welcome';
import ListEmployees from './employees/pages/listEmployees';
import ListTeams from './teams/pages/listTeam';
import TeamMainPage from './teams/pages/teamMainPage';
import EmployeeMainPage from './employees/pages/employeeMainPage';
import UserMainPage from './users/pages/userMainPage';
import { useAuth } from './shared/hooks/authHook';
import { AuthContext } from './shared/context/authContext';
import Login from './users/pages/login';
import EditPassword from './users/pages/editPassword';
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"


function App() {
 const {token, login, logout, userId, isAdmin} = useAuth();

 const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }

  return (
    <>
      
      <AuthContext.Provider value={{isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId, isAdmin: isAdmin, toastOptions:toastOptions}}>
      <NavBar></NavBar>
      <Routes>
        <Route path='/' element={<Welcome />} />
        {token ? (
          <>
            <Route path='employees' element={<EmployeeMainPage />}>
              <Route index element={<ListEmployees />} />
            </Route>
            <Route path='teams' element={<TeamMainPage />}>
              <Route index element={<ListTeams />} />
            </Route>
            <Route path='users' element={<UserMainPage />}>
              <Route path='editPassword' element={<EditPassword />} />
            </Route>
          </>
        ) : (
            !!token ?
              <Route path='*' element={<Navigate to='/login' replace/>} />
            :
              <Route path='*' element={<Navigate to='/' replace />} />
        )}
        <Route path='/login' element={<Login />} />
      </Routes>
      </AuthContext.Provider>
      <ToastContainer>
      </ToastContainer>
    </>
  );
}

export default App;
