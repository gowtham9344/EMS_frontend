import React, { useState,useContext } from 'react';
import './login.css'
import { AuthContext } from "../../shared/context/authContext";
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

function Login() {
 const [email,setEmail] = useState('');
 const [password, setPassword] = useState('');
 const auth = useContext(AuthContext);
 const navigate = useNavigate()
 const [errors, setErrors] = useState({});

 const handleValidation = () => {
  const errors = {};

  if(password === ''){
    errors.password = "Password can't be empty.";
  }

  if (email === '') {
    errors.email = "Email can't be empty.";
  }

  return errors;
};

  const handleSubmit = async(event) => {
    console.log(email,password)
    event.preventDefault();
    const validationErrors = handleValidation();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {

        const response = await fetch('http://localhost:8000/users/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        })

        if(!response.ok) {
            const data = await response.json();
            toast.error(data[0].message, auth.toastOptions);
            return;
        }

        const data = await response.json();
        auth.login(data.id, data.accessToken,data.isAdmin);
        navigate('/');
        toast.success("you have signed in",auth.toastOptions)
    } catch (err) {
      toast.error("something went wrong please try again after sometime", auth.toastOptions);
    }
  };

  return (
    <div className="login-container">
      <div className="center-container2">
        <form onSubmit={handleSubmit}>
          <h2 className="h2_container">Sign in</h2>
          <p>
            <label htmlFor="email">Email <span className="required">*</span></label><br />
            <input type="email" id="email" name="email" autoFocus autoComplete="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}  />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </p>
          <p className="field">
            <label htmlFor="password">Password <span className="required">*</span></label><br />
            <input type="password" id="password" name="password" autoComplete="current-password" value={password} onChange={(e)=>{setPassword(e.target.value)}}  />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </p>
          <div className="submit-button">
            <button type="submit">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
