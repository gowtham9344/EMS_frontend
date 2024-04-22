import React, { useEffect, useState, useCallback, useContext } from 'react';
import './editPassword.css';
import {toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { AuthContext } from '../../shared/context/authContext';

function EditPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const auth = useContext(AuthContext);
  

  const handleValidation = () => {
    const errors = {};

    if(password === ''){
      errors.password = "Password can't be empty.";
    }

    if(passwordConfirmation === ''){
      errors.passwordConfirmation = "Password confirmation can't be empty.";
    }

    if (password !== passwordConfirmation) {
      errors.passwordConfirmation = 'Password confirmation does not match.';
    }

    return errors;
  };

  const onSubmitHandler = async() => {
    const token = auth.token;
    try {
      const response = await fetch(`http://localhost:8000/users/editUser/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          "email":email,
          "password":password,
          "password_confirmation":passwordConfirmation
        }),
      });
    
      if (!response.ok) {
        const data1 = await response.json()
        setErrors(JSON.parse(data1[0].message))
        return;
      }
    
      const data = await response.json(); 
      toast.success(data.message,auth.toastOptions);
    } catch (error) {
      toast.error("something went wrong please try again after sometime",auth.toastOptions);
    }
    
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = handleValidation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    else{
      setErrors({});
    }

    await onSubmitHandler()
  };

  const fetchUser = useCallback(async () => {
    const token = auth.token;    
    try {
         const response = await fetch(`http://localhost:8000/users/current`, {
             headers: {
                 'Authorization': `Bearer ${token}`
             }
         });
         if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
         }
         const data = await response.json();
         setEmail(data.email)
     } catch (error) {
        toast.error("Error fetching teams",auth.toastOptions);
        console.error("Error fetching teams:", error);
     }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[auth.token])

 useEffect(()=>{
  fetchUser()
},[fetchUser])

  return (
    <div className="editpassword-container">
      <div className="center-container2">
        <form onSubmit={handleSubmit}>
          <h2 className="h2_container">Edit password</h2>
          <p>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </p>
          <p>
            <label htmlFor="password">New password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </p>
          <p>
            <label htmlFor="passwordConfirmation">Confirm new password</label>
            <input
              type="password"
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
            />
            {errors.passwordConfirmation && (
            <span className="error-message">{errors.passwordConfirmation}</span>
          )}
          </p>
          
          <p className="submit-button">
            <button type="submit">Update password</button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default EditPassword;