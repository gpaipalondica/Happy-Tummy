import React, {useEffect, useState} from 'react'
import ReactLoading from 'react-loading'

import { Cardreceipe } from './layout/receipecards'
import SearchBar from './layout/SearchBar'
import image from '../Assets/offer2.png'
import axios from 'axios'

const Recipe = ({cardsData, setCardsData}) => {

  //  cardsData = []
  document.getElementById("nav2").classList.remove('show')

  const [recTable, setRecTable] = useState([])

  let authToken = localStorage.getItem('token')

  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/api/recipetable", {
      headers:{
        "Authorization": 'Token ' + authToken
      }
    }).then(res => {
      // console.log("Recipe Table",res);
      setRecTable(res.data.table)
    }).catch(err => console.log(err))
  }, [])

  console.log("Hehe",recTable);

  for(let i=0; i<recTable.length; i++){
    if(recTable[i].count == 0){
      console.log("Zero", recTable[i]);
      document.getElementsByClassName('card')[i].style.cssText = 'cursor: initial; filter: brightness(.2);'
    }

  }


  if(localStorage.getItem('myCount')){
    let getTitle = localStorage.getItem('myCount');

    const data = { "recipeName": getTitle}

    axios.post("http://127.0.0.1:8000/api/update-recipetable", data,  {
      headers:{
        "Authorization": 'Token ' + authToken,
      }
    }).then(res => {
      console.log("Reduced",res);
      localStorage.removeItem('myCount')
      // setRecTable(res.data.table)
    }).catch(err => console.log(err))
  }
  

  // const countCheck = () =>{

  //   if(!localStorage.getItem('newData')) {

  //   let dataCopy = cardsData
  //   let element = {}
  //   element.id = 'count'
  //   element.quantity = 2

  //   console.log("Check count of all recipes");
  //   for(let i=0; i< dataCopy.length; i++){
  //     dataCopy[i][element.id] = element.quantity
  //   }

  //   console.log("DataCopy", dataCopy);
  
  //   localStorage.setItem('newData', JSON.stringify(dataCopy))
  // }
  //   else{
  //     console.log("PART 2");
  //     let dataBase = JSON.parse(localStorage.getItem('newData'))

  //     if(localStorage.getItem('titleCount')){
  //       let countTitle = localStorage.getItem('titleCount')
  //       console.log("TITLE COUNT MINUS");
  //       for(let i=0; i<dataBase.length; i++){
  //         if (dataBase[i].name == countTitle){
  //           dataBase[i].count = dataBase[i].count - 1;
  //         }
  //       }
  //       localStorage.removeItem('titleCount')
  //     }
      
  //     localStorage.removeItem('newData')
  //     localStorage.setItem('newData', JSON.stringify(dataBase))
      
  //   }
 
  // }




  return (
    <div style={{
      width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0px',
      margin: '0px',
    }}>

      <SearchBar setCardsData={setCardsData} />

      { cardsData.length != 0 ?
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: '0px',
        margin: '2rem 0 0 0',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }} >
        {cardsData.map((x) => (
          <Cardreceipe key={x.name} data={x} />
        ))}
      </div>
      :
          <div style={{marginTop: "5rem"}} >
            <h4 style={{marginBottom: "2rem"}} >Searching best recipes for you</h4>
            <ReactLoading type={"spin"} color={"#000000"} width={'14rem'} />
          </div>
      }
    </div>
  )
}

export default Recipe
