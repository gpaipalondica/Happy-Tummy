import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from "./Card" ;

const UserFeed = ({authToken}) => {

  document.getElementById("nav2").classList.remove('show')

 
  const [feedData, setFeedData] = useState([])
  const { userid } = useParams()

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/get/user-posts", {
      headers: {
        "Authorization": 'Token ' + authToken
      },
      params: {
        user_id: userid
      }
    }).then(res => {
      setFeedData(res.data)
      console.log("feed data", res.data);
      let uName = res.data.posts[0].username;
      document.getElementById('uName').innerText = "Posts by "+uName
    }).catch(err => {
      console.log(err);
    })
  }, [])

  return (
    <div>
      <h3 id='uName' style={{width:'100%', textAlign:"center", marginTop:'20px'}}></h3>
      <div className='feedArea2' style={{width:'100%'}}>
          {/* post  */}
          <div>
          {   feedData.posts &&
              feedData.posts.map((feed) => (
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

export default UserFeed
