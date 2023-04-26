import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading'

const OrderDetails = ({authToken}) => {
    const [orderData, setOrderData] = useState([])
    const [date, setDate] = useState()
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (authToken == ''){
            navigate('/')
        }

        console.log(id);
        // id = 

        console.log("authToken", authToken);
        axios.get("http://127.0.0.1:8000/api/get/user-orders-all", {
            headers: {
            "Authorization": 'Token ' + authToken
        }})
        .then(res => {
            console.log(res.data.orders, id)
            console.log(res.data.orders[id])
            setOrderData(res.data.orders[id])
            setDate(new Date(res.data.orders[id].created_at))
        })
        .catch(err => console.log(err))
    }, [])

    const timeFormatted = (e) =>{
        let date = e
        // console.log(date);
        let getYear = date.getFullYear();
        let getMonth = date.getMonth()+1;
        if (getMonth<10){
            getMonth = '0'+getMonth
        }
        let getDate = date.getDate()
        if (getDate<10){
            getDate = '0'+getDate
        }
        let getHours = date.getHours()
        if(getHours<10){
            getHours = '0'+getHours
        }
        let getMinutes = date.getMinutes()
        if (getMinutes<10){
            getMinutes = '0'+getMinutes
        }


        let format = getMonth+'-'+getDate+'-'+getYear+', '+getHours+':'+getMinutes;

        return format
    }

    // function showStatus(ss){
    //     let ss2 = ss;
    //     let ss3
    //     console.log('st', ss2);
    //     if(ss2 == "order_placed"){
    //         ss3 = "Order Placed";
    //     }
    //     else if(ss2 == "processing"){
    //         ss3 = "Processing";
    //     }
    //     else if(ss2 == "out_for_delivery"){
    //         ss3 = "Out for Delivery";
    //     }
    //     else if(ss2 == "delivered"){
    //         ss3 = "Delivered";
    //     }

    //     return ss3
    // }

    return (
        <>
        {date !== undefined ?
        <div key={id} className="order-container" >
             
            <div style={{display:'flex', justifyContent : "space-between" }} >
                <h6 style={{textAlign: "center"}} >Order Id: {id}</h6>
                {/* <p style={{textAlign: "center",fontWeight:'bold'}} >Status: {showStatus(orderData.order_status)}</p> */}
                <p style={{textAlign: "center"}} >{timeFormatted(date)}</p>
            </div>
         
            {orderData.Ingredients.map(ing => {
                return (
                    <div className='ing-container' >
                        <p className='ing-desc' >Name: {ing.name}</p>
                        <p className='ing-desc'>Quantity: {ing.quantity + " " + ing.unit} </p>
                        <p className='ing-desc'>Price: {ing.price}</p>
                    </div>
                )
            })}
            <div style={{display:'flex', justifyContent:"space-between"}}>
            <h6 style={{fontWeight:'bold'}}>Grand Total: ${orderData.total_cost}</h6>
            <a href='/my-orders'><h6>Go to My Orders <span>&#8594;</span> </h6></a>
            </div>
        </div>
        : 
        <ReactLoading type={"spin"} width={"20%"} />
        }
        </>
    );
};

export default OrderDetails;