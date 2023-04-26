import axios from 'axios';
import React, {useState} from 'react'
import { Cardreceipe } from './receipecards';

const SearchBar = ({setCardsData}) => {
    
    const search = () => {
        var input1 = document.getElementById('searchbar').value
        input1 = input1.toLowerCase();
        console.log(input1);
        setCardsData([])
        axios.post("http://localhost:8000/api/query-recipes", {query:input1})
        .then(res => {
            console.log("SHOW",res);
            setCardsData(res.data.recipes)
            
        })
        .catch(err => console.log(err))
        }

    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem', width: '60%'}}>
            <div id='search-box' style={{ display: 'flex', height: '40px', width: '100%', margin: '10px', }}>
                <input id='searchbar' type="text" placeholder='search... ' style={{ flex: '4 1 0%' , borderRadius: '12px', padding: '10px', zIndex: "1" }} />
                <button onClick={search} style={{ width:100, marginLeft: '10px', backgroundColor: '#0275d8', color: '#fff', borderRadius: '12px', border: '1px solid black',zIndex: "1" }} >Enter</button>
            </div>
        </div>



    )
        }

export default SearchBar