import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading'

const AdminOrderDetails = ({authToken, isAdmin}) => {
    const [orderData, setOrderData] = useState([])
    const [date, setDate] = useState()
    const [orderStatus, setOrderStatus] = useState(null)

    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (authToken == '' || !isAdmin ){
            navigate('/')
        }

        console.log(id);

        console.log("authToken", authToken);
        axios.get("http://127.0.0.1:8000/adminsite/get/orders", {
            headers: {
                Authorization: "Token " + authToken,
            },
            params: {
                status: "all",
            },
        })
        .then((res) => {
            console.log(res.data.orders, id);
            console.log(res.data.orders[id]);
            setOrderData(res.data.orders[id]);
            setDate(new Date(res.data.orders[id].created_at));
            setOrderStatus(res.data.orders[id].order_status);
        })
        .catch((err) => console.log(err));
    }, [])

    useEffect(() => {
        if (orderStatus !=  null) {
            console.log(orderStatus);
            axios.post("http://127.0.0.1:8000/adminsite/update/order_status", {
                "order_id": id,
                "order_status": orderStatus
            }, 
            {
                headers: {
                    "Authorization": 'Token ' + authToken
                  },
                
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [orderStatus])

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

    return (
        <>
        {date !== undefined ?
        <div key={id} className="order-container" >
            <div style={{display:'flex', justifyContent : "space-between" }} >
                <h6 style={{textAlign: "center"}} >Order Id: {id}</h6>
                {/* <h6>Username: {}</h6> */}
                <p style={{textAlign: "center"}} >{timeFormatted(date)}</p>

            </div>

            <div style={{display:'flex'}} >
                <h6>Order Status: </h6>
                <select style={{marginLeft: "10px"}} value={orderStatus} onChange={e => setOrderStatus(e.target.value)} >
                    <option value="order_placed">Order Placed</option>
                    <option value="processing">Processing</option>
                    <option value="out_for_delivery">Out For Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div> 
            

            {orderData.Ingredients.map(ing => {
                return (
                    <div className='ing-container' >
                        <p className='ing-desc' >Name: {ing.name}</p>
                        <p className='ing-desc'>Quantity: {ing.quantity + " " + ing.unit} </p>
                        <p className='ing-desc'>Price: ${ing.price}</p>
                    </div>
                )
            })}
            <h6 style={{fontWeight:'bold'}}>Grand Total: ${orderData.total_cost}</h6>
            
        </div>
        : 
        <div style={{display:'flex', justifyContent:'center'}}>
            <ReactLoading type={"spin"} width={"20%"} color='blue'/>
        </div>
        }
        </>
    );
};

export default AdminOrderDetails;