import React, { Component} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Home from '../Home';

const SignIn = ({setAuthToken, setUserData}) => {

  document.getElementById("nav2").classList.remove('show')

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const inputs = Array.from(event.target);
    const data ={}
    inputs.forEach(ele => {
      // console.log(ele.id, ele.value);
      if(ele.id !== ''){
        data[ele.id] = ele.value
      }
    })
    console.log(data);

    axios.post("http://127.0.0.1:8000/api/login", data)
    .then(res => {
      console.log(res.data)
      setAuthToken(res.data.token)
      setUserData(res.data.user)

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user_data", JSON.stringify(res.data.user))
      navigate('/recipes')

      document.getElementById('nav-feed').classList.remove("active") //was getting active by default.
      document.getElementById('nav-recipe').classList.add("active")
    }).catch(err => console.log(err))
  }

  return (
    <div style={{display:'flex',flexDirection:'column',padding:'20px',justifyContent:'center',alignItems:'center'}}>
        <h2>Login</h2>
        <form className="pt-2 col-md-5" onSubmit={handleSubmit} >
          <div className="form-group">
            <label htmlFor="username">Email / Username</label>
            <input type="username" className="form-control" id="username" placeholder="Enter username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Enter password" required />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <br/>
        <a href='/signup' style={{display:'block'}}>Don't have an Account? Register Now !</a>
      </div>
  );
};

export default SignIn;
