import React from 'react'
import './Cardreceipe.css'
import image from '../../../Assets/offer2.png'

import { Link, useNavigate } from 'react-router-dom'

const Cardreceipe = ({data}) => {


  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/receipes/${data.name}`, {state: data})
  }
  return (
    <a onClick={handleClick} >
      <div className='container' >
        <div className='card' >
          <img className='card_img' src={data.imageUrl} alt="" />
          <h6>{data.name}</h6>
        </div>
      </div>
    </a>
  )
}


export default Cardreceipe