import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from './layout/feedcards/Card';

const Feed = ({authToken}) => {

  document.getElementById("nav2").classList.remove('show')

  const [feedData, setFeedData] = useState([])
  const navigation = useNavigate()
  const location = useLocation()
  const [cuisine, setCuisine] = useState('all')
  const [state, setState] = useState('all')
  const [time, setTime] = useState('all')

  useEffect(() => {
    console.log(location);
  }, [location])

  const handleCreate = () => {
    navigation('/create-post')
  }

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/feed", {
      headers: {
        "Authorization": 'Token ' + authToken
      },
      params: {
        page: 1
      }
    }).then(res => {
      setFeedData(res.data)
      console.log("feed data", res.data);

    }).catch(err => {
      console.log(err);
    })
  }, [])

  const filter = () => {
    axios.get("http://127.0.0.1:8000/api/get/feed/filter", {
      headers: {
        "Authorization": 'Token ' + authToken
      },
      params: {
        cuisine: cuisine,
        location: state,
        time_required: time
      }
    }).then(res => {
      setFeedData(res.data)
      console.log("feed data", res.data);
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div className='lol'>

      
          {/* filter */}
          <div className='filter'>
              <h4 style={{marginTop:'5px', display:'flex', justifyContent:'center', marginTop:'25px', letterSpacing:'2px'}}>Filter</h4>
              
              <div style={{width:"100%", display:'flex', justifyContent:'center', lineHeight:'1.5'}}>
                
                <div style={{marginTop:'15px'}}>
                  <label style={{width: '70px'}}>
                    Cuisine:
                  </label>
                    {/* <input type="text" defaultValue='' /> */}
                    <select style={{width: "7rem", marginLeft: "1rem" }} onChange={(e) => {setCuisine(e.target.value)}} >
                      <option value="all">All</option>
                      <option value="american">American</option>
                      <option value="chinese">Chinese</option>
                      <option value="continental">Continental</option>
                      <option value="indian">Indian</option>
                      <option value="italian">Italian</option>
                    </select>
                  <br />
                  <label style={{width: '70px'}}>
                    Location:
                  </label>
                  <select style={{width: "7rem", marginLeft: "1rem" }}  onChange={(e) => {setState(e.target.value)}}>
                    <option value="all">All</option>
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
                  <br />
                  
                  {/* <label style={{width: '70px'}}>
                    Time:
                  </label>
                  <select style={{width: "7rem", marginLeft: "1rem" }} onChange={(e) => {setTime(e.target.value)}}>
                    <option value="all">All</option>
                    <option value="15" > 15 minute</option>
                    <option value="30"> 30 minute</option>
                    <option value="60"> 60 minute</option>
                    <option value="MoreThanHour"> More than an hour</option>
                  </select> */}
                  
                  <div style={{width:"100%", display:'flex', justifyContent:'center'}}>
                    <button style={{ width:'70px', backgroundColor:'blue', color:'white', marginTop:'10px', marginBottom: "2rem", borderRadius:0, border:'none'}} onClick={filter} >Apply</button>
                  </div>
                </div>
              </div>

            </div>
     
      <div className='feedArea'>
          {/* create  */}
          <div style={{ position:'relative', margin:'auto',maxWidth:'450px', marginTop:'30px', textAlign:'center'}} >
                <button onClick={handleCreate} className='btn btn-primary' style={{ width:'80%', height:'40px'}}>Create New Post</button>
          </div>
          
          {/* post  */}
          <div>
          {   feedData.results &&
              feedData.results.map((feed) => (
                      <div key={feed.post_id}>
                        <Card key={feed.post_id} data={feed} authToken={authToken} />
                      </div>
                    ))
          }
          </div>
          
          
        </div>


    </div>
  );
}

export default Feed
