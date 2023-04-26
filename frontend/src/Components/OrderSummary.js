import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Payment from './Payment';

const OrderSummary = ({authToken}) => {

    const location = useLocation()
    const navigate = useNavigate()

    console.log(location.state);
    let recTitle = location.state[1]

    const [ingredients, setIngredients] = useState([...location.state[0]]);
    const [priceData, setPriceData] = useState([]);


    // const placeOrder = () => {
    //     if(authToken === ''){
    //         navigate("/signin")
    //     }
        
    //     else{
            
    //         console.log(ingredients, authToken);

    //             axios.post("http://127.0.0.1:8000/api/order", {
    //                 Ingredients: ingredients
    //             }, {
    //                 headers: {
    //                 "Authorization": 'Token ' + authToken
    //             }}).then(res => {
    //                 console.log(res);
    //                 const order_id = res.data.order_id
    //                 navigate('/my-orders/'+order_id) 
    //             }).catch(err => console.log(err))
    //     }
    // }

    const getSummary = () => {
        axios.post("http://127.0.0.1:8000/api/get/total-cost", ingredients, {
            headers: {
            "Authorization": 'Token ' + authToken
        }}).then(res => {
            console.log(res);
            setPriceData(res.data)
        }).catch(err => console.log(err))
    } 

    useEffect(() => {
        getSummary()
    }, [])

    return (
        <>
        {priceData.brake_up &&
        <div>
            <h4 style={{textAlign: "center", marginTop: "20px"}} >Order Summary</h4>
            <div className="order-container" >
                <h4 style={{margin: '20px 0', fontWeight:'bold'}}>{recTitle} </h4>
                {Object.entries(priceData.brake_up).map(([id, ing]) => {
                    console.log(ing);
                    return (
                        <div className='ing-container' key={id} >
                            <p className='ing-desc' style={{textTransform:'capitalize'}} >Name: {ing.name}</p>
                            <p className='ing-desc'>Quantity: {ing.quantity + " " + ing.unit} </p>
                            <p className='ing-desc'>Price: ${ing.price}</p>
                        </div>
                    )
                })}
                <h6 style={{fontWeight:'bold'}}>Grand Total: ${priceData.total_cost}</h6>
                <Payment authToken={authToken} ingredients={ingredients} amount={priceData.total_cost} title={recTitle} />
                {/* <button className='center-btn btn btn-success' onClick={() => placeOrder()} style={{margin:"5px auto"}} >Place Order</button>     */}
            </div>
            
        </div>
        }
        </>
    );
};

export default OrderSummary;