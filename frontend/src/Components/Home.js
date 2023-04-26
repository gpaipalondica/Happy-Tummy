import React, { useState, useEffect } from 'react'
import SimpleImageSlider from "react-simple-image-slider";
import offer from "../Assets/offer.png"
import offer2 from "../Assets/offer2.png"
import offer3 from "../Assets/offer3.png"
import offer4 from "../Assets/offer4.jpg"
import offer5 from "../Assets/offer5.jpg"
import { Link } from 'react-router-dom'


const Home = () => {

  // document.getElementById("nav2").classList.remove('show')

  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const images = [
    offer, offer4, offer2, offer5, offer3
  ];

  useEffect(() => {  
    const id = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 4000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [currentIndex, images.length]);

  const handleDotClick = (index) => {
    clearInterval(intervalId);
    setCurrentIndex(index);
  };

  const previousImage = () => {
    setCurrentIndex((currentIndex + images.length - 1) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };
  

  return (
    <div style={{ textAlign: '-webkit-center', marginTop: '2rem' }}>
      <h3 className="text-center" style={{ marginTop: "30px" }}>Welcome to Happy Tummy</h3>
      <p className="text-center">We deliver Ingredients along with Recipes to your Doorstep </p>
      <br />

      <div style={{maxWidth:'900px', position:'relative', margin:'auto'}}>

          <div className="image-slider">
              <img className='fade2' src={images[currentIndex]} alt="slider" style={{width:'100%'}} />
                <div className="dots">
                  {images.map((image, index) => (
                    <span
                      key={image}
                      className={index === currentIndex ? 'active' : ''}
                      onClick={() => handleDotClick(index)}
                    ></span>
                  ))}
                </div>

              <button className='prevBtn' onClick={previousImage}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#fff" strokeWidth="1" points="7 2 17 12 7 22" transform="matrix(-1 0 0 1 24 0)"></polyline></svg></button>
              <button className='nextBtn' onClick={nextImage}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#fff" strokeWidth="1" points="7 2 17 12 7 22"></polyline></svg></button> 
          </div>

      </div>

      <br />

      <div>
      
      {
        localStorage.getItem('user_data') ?
        <Link to="/recipes" id='home-recipes' className="btn btn-secondary" >View Recipes <span>&#8594;</span></Link>
        :
      <Link to="/signin" id='home-signin' className="btn btn-primary">Get Started <span>&#8594;</span></Link>
      }
    
      
      </div>

    </div>
  )
}



export default Home

