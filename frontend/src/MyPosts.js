import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Card from './Components/layout/feedcards/Card';
import MyPostCard from './Components/layout/feedcards/MyPostCard';

const MyPosts = ({authToken}) => {

    document.getElementById("nav2").classList.remove('show')

    const [feedData, setFeedData] = useState([])

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/user-posts-all", {
            headers: {
            "Authorization": 'Token ' + authToken
        }})
        .then(res => {
            console.log(res);
            setFeedData(res.data)
        }).catch(err => console.log(err))
    }, [])

    return (
        <div>
            <h3 style={{textAlign: "center", marginTop: "20px"}} >My Posts</h3>
            <div>
            {   feedData.results &&
                feedData.results.map((feed) => (
                    <MyPostCard key={feed.post_id} data={feed} authToken={authToken} />
                ))
      }
            </div>
        </div>
    );
};

export default MyPosts;