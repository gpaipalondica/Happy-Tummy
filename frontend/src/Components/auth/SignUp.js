import React, { Component } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SignUp = ({setAuthToken, setUserData}) => {

  const navigate = useNavigate();
  console.log(setUserData);

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

    axios.post("http://127.0.0.1:8000/api/register", data)
    .then(res => {
      console.log(res.data)
      setAuthToken(res.data.token)
      setUserData(res.data.user)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user_data", JSON.stringify(res.data.user))
      navigate('/recipes')
    }).catch(err => console.log(err))
  }
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',flexDirection:'column'}}>
        <h2>Register</h2>
        <form className="pt-2 col-md-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input type="text" className="form-control" id="first_name" placeholder="Enter first name" required/>
          </div>
          <div className="form-group" >
            <label htmlFor="last_name">Last Name</label>
            <input type="text" className="form-control" id="last_name" placeholder="Enter last name" required/>
          </div>
          <div className="form-group" >
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" id="username" placeholder="Enter username" required/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input type="text" className="form-control" id="phone_number" placeholder="Enter phone" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Enter password" required />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input type="password" className="form-control" id="password2" placeholder="Enter password again" required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea rows={3} type="textbox" className="form-control" id="address" placeholder="Enter address" required/>
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input type="text" className="form-control" id="city" placeholder="Enter city" required />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <select name="selectState" id="state" style={{marginLeft:'20px'}} required>
                <option value="">Select</option>
                <option value="AL">AL</option>
                <option value="AK">AK</option>
                <option value="AZ">AZ</option>
                <option value="AR">AR</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DE">DE</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="IA">IA</option>
                <option value="KS">KS</option>
                <option value="KY">KY</option>
                <option value="LA">LA</option>
                <option value="ME">ME</option>
                <option value="MD">MD</option>
                <option value="MA">MA</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MS">MS</option>
                <option value="MO">MO</option>
                <option value="MT">MT</option>
                <option value="NE">NE</option>
                <option value="NV">NV</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>
                <option value="NY">NY</option>
                <option value="NC">NC</option>
                <option value="ND">ND</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VT">VT</option>
                <option value="VA">VA</option>
                <option value="WA">WA</option>
                <option value="WV">WV</option>
                <option value="WI">WI</option>
                <option value="WY">WY</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="zipcode">Zipcode</label>
            <input type="text" className="form-control" id="zipcode" placeholder="Enter zipcode" required/>
          </div>
          <br/>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div >
  );
};

export default SignUp;