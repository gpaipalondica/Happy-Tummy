import React from 'react'
import logo from '../../Assets/logo.png'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import $ from 'jquery';


const Navbar = ({userData, authToken, setAuthToken, setUserData, isAdmin}) => {

  const navigate = useNavigate();

   window.onload = () => {
    if (localStorage.getItem('nav-store')){
      let getActive=localStorage.getItem('nav-store');
      console.log('active? ',getActive)
      document.getElementById(getActive).classList.add('active');
    }
  }

  $(document).ready(function(){ 
    $('.nav-item').on("click", function(){
    $('.nav-item').removeClass('active');
    $(this).addClass('active');
    let test2 = document.getElementsByClassName('active')[0].id
    // console.log(test2);
    localStorage.setItem('nav-store', test2)
    });
    });

  const clearActive = () => {
    $(document).ready(function(){ 
      $('.nav-item').removeClass('active');
      });
    localStorage.removeItem('nav-store')
  }

  //toggle icon
  const myFunction = () => {
    console.log('btn pressed')

    let nav2 = document.getElementById("nav2");
    nav2.classList.toggle('show');

  }

  const logout = () => {
    axios.post("http://127.0.0.1:8000/api/logout", "", {
        headers: {
        "Authorization": 'Token ' + authToken
      }
    }).then(
      res => {
      console.log(res);
      setAuthToken('')
      setUserData({})
      localStorage.clear()
      navigate('/')
    }
    ).catch(err => console.log(err))
  }

  // const makeActive = () =>{
  //   document.getElementById('nav-adminmyorders').classList.add('active')
  // }

  return (
    <header>    

    <div className='toggle-btn' onClick={myFunction}>
        <span></span>
        <span></span>
        <span></span>
    </div>
    
    {/* left part */}
    <div className='logo'>
          <Link to="/" onClick={clearActive} >
            <img src={logo} height="70" alt="ht-logo" />
          </Link>
    </div>

    {/* right part */}

    <nav id='nav2'>
    
        <ul style={{float:'left'}}>
          <li >
            <Link to="/recipes" className='nav-item' id='nav-recipe'>Recipe</Link>
          </li>
          <li >
            <Link to="/aboutus" className='nav-item' id='nav-aboutus' >About Us</Link>
          </li>
          { !isAdmin && <li >
            <Link to="/support"  className='nav-item' id='nav-support'>Support</Link>
          </li>}
        </ul>
        
        {
          userData.user_name === undefined ?
          <ul className='nav-part2' style={{float:'right'}}>
          <li >
            <Link to="/signIn" className='nav-item' id='nav-login' >Login </Link>
          </li>
          <li >
            <Link to="/signUp"  className='nav-item' id='nav-signup' >Sign Up</Link>
          </li>
        </ul> :
        <ul className='nav-part2' style={{float:'right'}} >
          <li >
            <Link to="/feed"  className='nav-item' id='nav-feed'>Feed</Link>
          </li>

          <li >
            <Link to="/my-orders"  className='nav-item' id='nav-myorders' >My Order</Link>
          </li>

          { isAdmin &&
            <li >
              <Link to="/admin/orders" className='nav-item' id='nav-adminmyorders' >All Orders</Link>
            </li>
          }

          <li>
            <Link to="/my-posts"  className='nav-item' id='nav-myposts' >My Posts</Link>
          </li>

          <li >
            <Link to="/profile"  className='nav-item' id='nav-profile' >Profile</Link>
          </li>

          <li  >
            <Link onClick={logout}  className='nav-item' >Logout</Link>
          </li> 
          
          <div>
          <li style={{padding: 0, margin: 0, display: 'block'}}>
            <h6 className='userName'>Welcome, {userData.user_name}!</h6>
          </li>
          </div>
          
        </ul>
       
        } 

        </nav>
    
    </header >
  )
}

export default Navbar;
