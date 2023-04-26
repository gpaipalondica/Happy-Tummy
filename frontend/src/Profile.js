import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Profile = ({authToken}) => {

  document.getElementById("nav2").classList.remove('show')
  
    const [userData, setUserData] = useState({})

    useEffect(() => {
        console.log(authToken);
        axios.get("http://127.0.0.1:8000/api/get-user", {
            headers: {
              "Authorization": 'Token ' + authToken
            }
          }).then(res => {
            console.log(res);
            setUserData(res.data.user)
        }).catch(err => console.log(err))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(userData);
        axios.post('http://127.0.0.1:8000/api/update/profile', userData,
        {
            headers: {
                "Authorization": 'Token ' + authToken
            }
        }).then(
            res => {
                console.log(res);
            }
        ).catch(err => {
            console.log(err);
        })

    }

    // pt-2 col-md-4

    return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',flexDirection:'column'}}>
        <h2>Profile</h2>
        <form className="profle-form" style={{width:'60%'}} onSubmit={handleSubmit} >
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input type="text" className="form-control" id="first_name" placeholder="Enter first name" value={userData.first_name} disabled  required/>
          </div>
          <div className="form-group" >
            <label htmlFor="last_name">Last Name</label>
            <input type="text" className="form-control" id="last_name" placeholder="Enter last name" value={userData.last_name} disabled required/>
          </div>
          <div className="form-group" >
            <label htmlFor="username">Username</label>
            <input type="text" className="form-control" id="username" placeholder="Enter username" value={userData.username} disabled required/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="Enter email" value={userData.email} disabled required />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input type="text" className="form-control" id="phone_number" placeholder="Enter phone" value={userData.phone_number} onChange={(e) => {setUserData({...userData, phone_number: e.target.value})}} required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea rows={3} type="textbox" className="form-control" id="address" placeholder="Enter address" value={userData.address} onChange={(e) => {setUserData({...userData, address: e.target.value})}} required/>
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input type="text" className="form-control" id="city" placeholder="Enter city" value={userData.city} onChange={(e) => {setUserData({...userData, city: e.target.value})}} required />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <select name="selectState" id="state" style={{marginLeft:'20px'}} required>
                <option value="AL" selected={"AL" == userData.state }>AL</option>
                <option value="AK" selected={"AK" == userData.state }>AK</option>
                <option value="AZ" selected={"AZ" == userData.state }>AZ</option>
                <option value="AR" selected={"AR" == userData.state }>AR</option>
                <option value="CA" selected={"CA" == userData.state }>CA</option>
                <option value="CO" selected={"CO" == userData.state }>CO</option>
                <option value="CT" selected={"CT" == userData.state }>CT</option>
                <option value="DE" selected={"DE" == userData.state }>DE</option>
                <option value="FL" selected={"FL" == userData.state }>FL</option>
                <option value="GA" selected={"GA" == userData.state }>GA</option>
                <option value="HI" selected={"HI" == userData.state }>HI</option>
                <option value="ID" selected={"ID" == userData.state }>ID</option>
                <option value="IL" selected={"IL" == userData.state }>IL</option>
                <option value="IN" selected={"IN" == userData.state }>IN</option>
                <option value="IA" selected={"IA" == userData.state }>IA</option>
                <option value="KS" selected={"KS" == userData.state }>KS</option>
                <option value="KY" selected={"KY" == userData.state }>KY</option>
                <option value="LA" selected={"LA" == userData.state }>LA</option>
                <option value="ME" selected={"ME" == userData.state }>ME</option>
                <option value="MD" selected={"MD" == userData.state }>MD</option>
                <option value="MA" selected={"MA" == userData.state }>MA</option>
                <option value="MI" selected={"MI" == userData.state }>MI</option>
                <option value="MN" selected={"MN" == userData.state }>MN</option>
                <option value="MS" selected={"MS" == userData.state }>MS</option>
                <option value="MO" selected={"MO" == userData.state }>MO</option>
                <option value="MT" selected={"MT" == userData.state }>MT</option>
                <option value="NE" selected={"NE" == userData.state }>NE</option>
                <option value="NV" selected={"NV" == userData.state }>NV</option>
                <option value="NH" selected={"NH" == userData.state }>NH</option>
                <option value="NJ" selected={"NJ" == userData.state }>NJ</option>
                <option value="NM" selected={"NM" == userData.state }>NM</option>
                <option value="NY" selected={"NY" == userData.state }>NY</option>
                <option value="NC" selected={"NC" == userData.state }>NC</option>
                <option value="ND" selected={"ND" == userData.state }>ND</option>
                <option value="OH" selected={"OH" == userData.state }>OH</option>
                <option value="OK" selected={"OK" == userData.state }>OK</option>
                <option value="OR" selected={"OR" == userData.state }>OR</option>
                <option value="PA" selected={"PA" == userData.state }>PA</option>
                <option value="RI" selected={"RI" == userData.state }>RI</option>
                <option value="SC" selected={"SC" == userData.state }>SC</option>
                <option value="SD" selected={"SD" == userData.state }>SD</option>
                <option value="TN" selected={"TN" == userData.state }>TN</option>
                <option value="TX" selected={"TX" == userData.state }>TX</option>
                <option value="UT" selected={"UT" == userData.state }>UT</option>
                <option value="VT" selected={"VT" == userData.state }>VT</option>
                <option value="VA" selected={"VA" == userData.state }>VA</option>
                <option value="WA" selected={"WA" == userData.state }>WA</option>
                <option value="WV" selected={"WV" == userData.state }>WV</option>
                <option value="WI" selected={"WI" == userData.state }>WI</option>
                <option value="WY" selected={"WY" == userData.state }>WY</option>
            </select>
            
          </div>
          <div className="form-group">
            <label htmlFor="zipcode">Zipcode</label>
            <input type="text" className="form-control" id="zipcode" placeholder="Enter zipcode"  value={userData.zipcode} onChange={(e) => {setUserData({...userData, zipcode: e.target.value})}} required/>
          </div>
          <br/>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div >
    );
};

export default Profile;