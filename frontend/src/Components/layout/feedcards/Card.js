import React, { useEffect } from 'react'
import heart from '../../../Assets/heart.png'
import share from '../../../Assets/share.png'
import './CardComponent.css'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

const Card = ({data, authToken}) => {

    const navigate = useNavigate()
    const [likes, setLikes] = useState(0)

   const [showShare, setShowShare] = useState(false)

    const toggle = (e) => {
        const button = e.target
        if (button.classList.contains("liked")) {
            button.classList.remove("liked");
            axios.post("http://127.0.0.1:8000/api/unlike-post", {
                post_id: data.post_id
            }, {
                headers: {
                    "Authorization": 'Token ' + authToken
                }
            }).then(res => {
                console.log(res)
                setLikes(like => like - 1)
            }).catch(err => console.log(err))
        } else {
            button.classList.add("liked");
            axios.post("http://127.0.0.1:8000/api/like-post", {
                post_id: data.post_id
            }, {
                headers: {
                    "Authorization": 'Token ' + authToken
                }
            }).then(res => {
                console.log(res)
                setLikes(like => like + 1)
            }).catch(err => console.log(err))
        }
    }

    const showDetails = () => {
        navigate('/feed/'+data.slug)
    }

    useEffect(() => {
        setLikes(data['likes'])
        axios.get("http://127.0.0.1:8000/api/post/liked", {
            headers: {
                "Authorization": 'Token ' + authToken
            },
            params: {
                post: data["post_id"]
            }               
        }).then(res => {
            // console.log(data['recipe_name'], res.data['has_liked']);
        console.log(data["post_id"], data["recipe_name"], res.data['has_liked']);

            const liked = res.data['has_liked']
            const btn = document.getElementById("heart"+data["post_id"])

            if (liked){
                btn.classList.add("liked");
                console.log("added", btn.classList);
            }
            else{
                if (btn.classList.contains("liked")) {
                    btn.classList.remove("liked");
                    console.log("removed", btn.classList);
                }
            }

            console.log(btn.classList);

        }).catch(err => console.log(err))
    }, [])

    // const [userData, setUserData] = useState({})
    // useEffect(() => {
    //     console.log(authToken);
    //     axios.get("http://127.0.0.1:8000/api/get-user", {
    //         headers: {
    //           "Authorization": 'Token ' + authToken
    //         }
    //       }).then(res => {
    //         console.log('HELLO ',res.data.user.username);
    //         setUserData(res.data.user)
    //     }).catch(err => console.log(err))
    // }, [])

    const copyLink = () => {
        var copyText = document.getElementById("share-url"+data.post_id);

        console.log(copyText.innerText);
        navigator.clipboard.writeText(copyText.innerText);

        document.getElementById("show-copy-msg"+data.post_id).style.display = 'block'
        document.getElementById("show-copy-msg"+data.post_id).innerHTML = "Link Copied!"; 
        
        setTimeout(function () {
            document.getElementById("show-copy-msg"+data.post_id).innerHTML = '';
            document.getElementById("show-copy-msg"+data.post_id).style.display = 'none'
        }, 2000);

        setShowShare(false);
        
    }

    return (
        <div style={{maxWidth:'400px', position:'relative', margin:'auto'}}>
           
           <div className='container-card' style={{}} >
                <a href={'/feed/user/' + data.user_id} className='feedName' style={{display:'flex', justifyContent:'center'}}> 
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path></svg> 
                    <p style={{marginLeft:'7px'}}> {data.username} </p>
                </a>
                
                <img className='feed-img' src={data.image_url} alt="" />
                <h5 className='feed-heading' style={{textAlign: "center"}} >{data.recipe_name}</h5>
                {/* <p>{data.location}</p> */}
                <div style={{display: "flex", justifyContent: "space-around" , marginTop: "20px"}} >
                    <div style={{display: "flex"}}>
                    <div className='heart-border'>
                        <span className="heart" id={"heart"+data.post_id} onClick={toggle} style={{transform: "scaleX(0.5) scaleY(0.5) rotate(-45deg)"}} ></span>
                    </div>
                        <p>{likes}</p>
                    </div>
                    <div className='share-border'>
                    <img className="share" src={share} style={{height: "25px", position: "inherit", padding:'2px 15px'}} onClick={() => {setShowShare(true)}} />
                    </div>
                    <button className='btn btn-secondary' onClick={showDetails} style={{}} >View details</button>
                </div>

                { showShare && <div style={{position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", background: "#fff", padding: "10px", borderRadius: "10px", opacity: "90%" }} >
                   <div style={{display: 'flex'}}>
                        <h5 style={{textAlign: "center", width:'100%'}} >Share this link</h5>
                        <button id='close-share' style={{position:'absolute', top:5, right:5}} onClick={() => setShowShare(false)} >X</button>
                   </div>
                    <div>
                        <p id={'share-url'+data.post_id} style={{marginBottom: "5px", border:'1px solid gray', padding:'0 10px' }}>{"localhost:3000/feed/" + data.slug}</p>
                    </div>
                    <button className='btn btn-primary'  style={{display: "block", margin: "10px auto 0 auto", padding: "2px 20px"}} onClick={() => copyLink()} >Copy Link</button>
                </div>}
                   <p id={'show-copy-msg'+data.post_id} style={{textAlign:'center', position: 'absolute', top: '300px', opacity: '0.9', left: '50%', transform: 'translateX(-50%)', padding: '1px 20px', backgroundColor: 'white', borderRadius: '20px', display:'none'}}></p>
            </div>
        </div>
    )
}
export default Card