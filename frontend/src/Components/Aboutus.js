import React from 'react'
import dp1 from '../Assets/dp1.png'
import dp2 from '../Assets/dp2.png'
import dp3 from '../Assets/dp3.jpeg'
import dp4 from '../Assets/dp4.jpg'


const AboutUs = () => {

  document.getElementById("nav2").classList.remove('show')

  return (
    <div>
        <h3 className="text-center" style={{marginTop: '20px'}}>About Us</h3>
        <br />
   

      <div className='contactCardContainer'>

          <div className="contactCard">
            <a href='https://www.linkedin.com/in/abhigna-reddy'>
            <img src={dp1} alt="Abhigna" />
            <br />
            <p style={{fontSize:28, textDecoration: 'none', color: 'black', marginTop:20}}>Abhigna</p>
            <p style={{fontSize:18, textDecoration: 'none', color: 'gray'}}>Graduate Student</p>
            <p style={{fontSize:15, textDecoration: 'none', color: 'black'}}>Indiana State University</p>
            <br />
            </a>
          </div> 
          <div className="contactCard">
            <a href='https://www.linkedin.com/in/gaurang-pai-palondicar'>
            <img src={dp2} alt="Gaurang"/>
            <br />
            <p style={{fontSize:28, textDecoration: 'none', color: 'black', marginTop:20}}>Gaurang</p>
            <p style={{fontSize:18, textDecoration: 'none', color: 'gray'}}>Graduate Student</p>
            <p style={{fontSize:15, textDecoration: 'none', color: 'black'}}>Indiana State University</p>
            <br />
            </a>
          </div>
          <div className="contactCard">
            <a href='https://www.linkedin.com/in/mounika-sure'>
            <img src={dp3} alt="Mounika" />
            <br />
            <p style={{fontSize:28, textDecoration: 'none', color: 'black', marginTop:20}}>Mounika</p>
            <p style={{fontSize:18, textDecoration: 'none', color: 'gray'}}>Graduate Student</p>
            <p style={{fontSize:15, textDecoration: 'none', color: 'black'}}>Indiana State University</p>
            <br />
            </a>
          </div>
          <div className="contactCard">
            <a href='https://www.linkedin.com/in/mgopisainath7'>
            <img src={dp4} alt="Sainath"  />
            <br />
            <p style={{fontSize:28, textDecoration: 'none', color: 'black', marginTop:20}}>Sainath</p>
            <p style={{fontSize:18, textDecoration: 'none', color: 'gray'}}>Graduate Student</p>
            <p style={{fontSize:15, textDecoration: 'none', color: 'black'}}>Indiana State University</p>
            <br />
            </a>
          </div>

      </div>
      
        <br/>
        {/* <h4 className="text-center">We are the Students of Indiana State University</h4> */}

    </div>   
    
  )
  
}

export default AboutUs
