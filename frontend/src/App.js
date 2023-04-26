import React, { element, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/layout/Navbar';
import Footer from './Components/layout/Footer';
import Home from './Components/Home';
import Support from './Components/Support';
import Recipe from './Components/Recipe';
import Feed from './Components/Feed';
import Aboutus from './Components/Aboutus';
import SignIn from './Components/auth/SignIn';
import SignUp from './Components/auth/SignUp';
import Receipes from './Receipes';
import data from "./initial_data"
import MyOrders from './Components/layout/MyOrders';
import OrderDetails from './Components/layout/OrderDetails';
import OrderSummary from './Components/OrderSummary';
import CreatePost from './CreatePost';
import PostDetails from './PostDetails';
import MyPosts from './MyPosts';
import Profile from './Profile';
import './App.css';
import './media.css';
import './Components/Aboutus.css';
import UserFeed from './Components/layout/feedcards/UserFeed';
import AdminOrders from './Components/layout/AdminOrders';
import axios from 'axios';
import AdminOrderDetails from './Components/layout/AdminOrderDetails';

const App = () => {

  const [authToken, setAuthToken] = useState('')
  const [userData, setUserData] = useState({})
  const [cardsData, setCardsData] = useState(data)
  const [isAdmin, setIsAdmin] = useState(false)

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const data = localStorage.getItem("user_data")
    if(token){
      setAuthToken(token)
    }
    if(data){
      setUserData(JSON.parse(data))
    }

    setLoaded(true)
  }, [])

  useEffect(() => {
    authToken && axios.get("http://127.0.0.1:8000/adminsite/get/is_admin", {
      headers: {
      "Authorization": 'Token ' + authToken
    }}).then((res) => {
      console.log("isadmin", res);
      if (res.data.is_admin){
        setIsAdmin(true)
      }
    })
  }, [authToken])

  return (
    <BrowserRouter>
        <div>
          <Navbar userData={userData} authToken={authToken} setAuthToken={setAuthToken} setUserData={setUserData} isAdmin={isAdmin} />
          
          { loaded && <div style={{width:'100%',backgroundColor:'#fff'}}>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/recipes' element={<Recipe cardsData={cardsData} setCardsData={setCardsData} />} />
              <Route exact path='/feed' element={<Feed authToken={authToken} />} />
              <Route exact path='/feed/:id' element={<PostDetails authToken={authToken} />} />
              <Route exact path='/feed/user/:userid' element={<UserFeed authToken={authToken} />} />
              <Route exact path='/support' element={<Support />} />
              <Route exact path='/aboutus' element={<Aboutus />} />
              <Route exact path='/profile' element={<Profile authToken={authToken} />} />
              <Route path='/signIn' element={<SignIn setAuthToken={setAuthToken} setUserData={setUserData} />} />
              <Route exact path='/signUp' element={<SignUp setAuthToken={setAuthToken}  setUserData={setUserData} />} />
              <Route exact path="/my-orders" element={<MyOrders authToken={authToken} />} />
              <Route exact path="/my-posts" element={<MyPosts authToken={authToken} />} />
              <Route exact path="/order-summary" element={<OrderSummary authToken={authToken} />} />
              <Route path='/my-orders/:id' element={<OrderDetails authToken={authToken}/>} />
              <Route path="/create-post" element={<CreatePost authToken={authToken} />} />
              <Route exact path='/receipes/:id' element={<Receipes authToken={authToken} cardsData={cardsData} />} />
              <Route exact path='/admin/orders' element={<AdminOrders authToken={authToken} isAdmin={isAdmin} />} />
              <Route path='/admin/orders/:id' element={<AdminOrderDetails authToken={authToken} isAdmin={isAdmin} />} />
            </Routes>
          </div>}
        </div>
      </BrowserRouter>
  );
};

export default App;