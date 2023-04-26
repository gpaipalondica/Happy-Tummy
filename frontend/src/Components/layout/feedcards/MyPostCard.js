import React, { useEffect } from 'react'
import heart from '../../../Assets/heart.png'
import share from '../../../Assets/share.png'
import './CardComponent.css'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Card from './Card'

const MyPostCard = ({data, authToken}) => {

    const navigate = useNavigate()
    const [likes, setLikes] = useState(0)
    const [showPopup, setShowPopup] = useState(false)

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
                console.log("unliked");
                console.log(res.data)
                setLikes(like => like-1)
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
                console.log("liked");
                setLikes(like => like+1)
                console.log(res.data)
            }).catch(err => console.log(err))
        }
    }

    const showDetails = () => {
        navigate('/feed/'+data.slug)
    }

    const changeVisibility = (e) => {
        const check = e.target.checked
        console.log(check);
        if (check) {

            document.getElementById('check-msg'+data.post_id).style.display = "block"
            document.getElementById('check-msg'+data.post_id).innerHTML = "Added to Feed"
            setTimeout(function () {
                document.getElementById("check-msg"+data.post_id).innerHTML = '';
                document.getElementById('check-msg'+data.post_id).style.display = "none"
            }, 2000);

            axios.post("http://127.0.0.1:8000/api/post/access-all", {
                post_id: data.post_id
            },{
                headers: {
                    "Authorization": 'Token ' + authToken
                }
            }).then(res => {
                console.log(res.data);
            }).catch(err => console.log(err))
        }
        else{

            document.getElementById('check-msg'+data.post_id).style.display = "block"
            document.getElementById('check-msg'+data.post_id).innerHTML = "Removed from Feed"
            setTimeout(function () {
                document.getElementById("check-msg"+data.post_id).innerHTML = '';
                document.getElementById('check-msg'+data.post_id).style.display = "none"
            }, 2000);

            axios.post("http://127.0.0.1:8000/api/post/access-link", {
                post_id: data.post_id
            },{
                headers: {
                    "Authorization": 'Token ' + authToken
                }
            }).then(res => {
                console.log(res.data);
            }).catch(err => console.log(err))
        }
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

        const checkbox = document.getElementById("checkbox"+data["post_id"])
        if(data["link_only"]){
            checkbox.checked = false
        }
        else{
            checkbox.checked = true
        }

        

    }, [])

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

        setShowPopup(false);
        
    }

    

    return (
        
        <div style={{maxWidth:'400px', position:'relative', margin:'auto'}}>
            <div className='container-card'>
            <img className='feed-img' src={data.image_url} alt="" />
            <h5 className='feed-heading' style={{textAlign: "center"}} >{data.recipe_name}</h5>
            <div style={{display: "flex", justifyContent: "space-around" , marginTop: "20px"}} >
                <div style={{display: "flex"}}>
                    <div className='heart-border'>
                        <span className="heart" id={"heart"+data.post_id} onClick={toggle} style={{transform: "scaleX(0.5) scaleY(0.5) rotate(-45deg)"}} ></span>
                    </div>
                    <p>{likes}</p>
                </div>

                <div className='share-border'>
                <img className="share" onClick={() => setShowPopup(true) } src={share} style={{height: "25px", position: "inherit", padding:'2px 15px'}} />
                    </div>


                <div style={{display: "flex", marginLeft:"10px"}} >
                        <p style={{marginLeft:"5px", fontSize:"20px"}} >Show all</p>
                        <input id={"checkbox"+data.post_id} onChange={changeVisibility} style={{height: "25px", width: "25px", marginLeft: "5px"}} type="checkbox" name="accept" /> 
                </div>
                <button className='btn btn-secondary' onClick={showDetails} style={{}} >View details</button>
            
            </div>
            <p id={'check-msg'+data.post_id} style={{textAlign:'center', position: 'absolute', top: '250px', opacity: '0.9', left: '50%', transform: 'translateX(-50%)', padding: '1px 20px', backgroundColor: 'white', borderRadius: '20px', display:'none', fontSize:'17px'}}></p>

            {/* {showPopup &&
            <div className='popup' >
                <p style={{marginBottom: "10px"}} >{'http://localhost:3000/feed/'+data.slug}</p>
                <button onClick={(e) => setShowPopup(false)} className='btn btn-secondary' >Ok</button>
            </div>} */}

            { showPopup && <div style={{position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", background: "#fff", padding: "10px", borderRadius: "10px", opacity: "90%" }} >
                   <div style={{display: 'flex'}}>
                        <h5 style={{textAlign: "center", width:'100%'}} >Share this link</h5>
                        <button id='close-share' style={{position:'absolute', top:5, right:5}} onClick={() => setShowPopup(false)} >X</button>
                   </div>
                    <div>
                        <p id={'share-url'+data.post_id} style={{marginBottom: "5px", border:'1px solid gray', padding:'0 10px' }}>{"localhost:3000/feed/" + data.slug}</p>
                    </div>
                    <button className='btn btn-primary'  style={{display: "block", margin: "10px auto 0 auto", padding: "2px 20px"}} onClick={() => copyLink()} >Copy Link</button>
                </div>}
                   <p id={'show-copy-msg'+data.post_id} style={{textAlign:'center', position: 'absolute', top: '260px', opacity: '0.9', left: '50%', transform: 'translateX(-50%)', padding: '1px 20px', backgroundColor: 'white', borderRadius: '20px', display:'none'}}></p>
            </div>
        </div>
    )
}
export default MyPostCard