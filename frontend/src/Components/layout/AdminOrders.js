import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../media.css"
import "./myorders.css"

const AdminOrders = ({authToken, isAdmin}) => {

    document.getElementById("nav2").classList.remove('show')

    
    const [orderData, setOrderData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [filterStatus, setFilterStatus] = useState("all")

    const navigate = useNavigate()

    const [sortBy, setSortBy] = useState("timedesc")

    const filter = () => {
        var data = []
        if (filterStatus == "all") {
            data = [...orderData]
        }
        else {
            orderData.forEach(order => {
                if(order.order_status == filterStatus){
                    data.push(order)
                }
            })
        }
        // console.log("i'm", data);
        if (sortBy == "priceasc" ) {
            data.sort((a,b) => {
                return a.total_cost > b.total_cost ? 1 : -1
            })
        }
        else if (sortBy == "pricedesc") {
            data.sort((a,b) => {
                return a.total_cost < b.total_cost ? 1 : -1
            })
        }
        else if (sortBy == "timeasc") {
            data.sort((a,b) => {
                return a.created_at > b.created_at ? 1 : -1
            })
        }
        else if (sortBy == "timedesc") {
            data.sort((a,b) => {
                return a.created_at < b.created_at ? 1 : -1
            })
        }

        setFilterData(data)
    }

    useEffect(() => {
        if (authToken == '' || !isAdmin ){
            navigate('/')
        }
        console.log("authToken", authToken);
        navigate('/admin/orders')
        axios.get("http://127.0.0.1:8000/adminsite/get/orders", {
            headers: {
            "Authorization": 'Token ' + authToken
            },
            params: {
                'status': "all"
            }
        })
        .then(res => {
            console.log(res.data)
            setOrderData(Object.values(res.data.orders))
            setFilterData(Object.values(res.data.orders))
        })
        .catch(err => console.log(err))
    }, [])

    const viewOrderDetails = (orderId) => {
        console.log("order id", orderId);
        navigate("/admin/orders/"+orderId)
    }

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
        <div style={{padding: "20px"}} >
            <div className='filter'>
              <h4 style={{marginTop:'5px', display:'flex', justifyContent:'center', marginTop:'25px', letterSpacing:'2px'}}>Filter</h4>
              
              <div style={{width:"100%", display:'flex', justifyContent:'center', lineHeight:'1.5'}}>
                
                <div style={{marginTop:'15px'}}>
                  <label style={{width: '70px'}}>
                    Sort by
                  </label>
                    <select style={{width: "9rem", marginLeft: "1rem" }} onChange={(e) => {setSortBy(e.target.value)}} >
                      <option value="all">All</option>
                      <option value="timedesc">Latest First</option>
                      <option value="timeasc">Oldest First</option>
                      <option value="pricedesc">Max Price First</option>
                      <option value="priceasc">Lowest Price First</option>
                    </select>
                  <br />
                  <label style={{width: '100px', marginLeft:"-30px"}}>
                    Order Status
                  </label>
                  <select style={{width: "9rem", marginLeft: "1rem" }}  onChange={(e) => {
                    setFilterStatus(e.target.value)
                    }}>
                    <option value="all">All</option>
                    <option value="order_placed">Order Placed</option>
                    <option value="processing">Processing</option>
                    <option value="out_for_delivery">Out For Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <br />
                  
                  <div style={{width:"100%", display:'flex', justifyContent:'center'}}>
                    <button style={{ width:'70px', backgroundColor:'blue', color:'white', marginTop:'10px', marginBottom: "2rem", borderRadius:0, border:'none'}} onClick={filter} >Apply</button>
                  </div>
                </div>
              </div>

            </div>
            
            <div className='allOrders'>
            <h3 style={{textAlign: "center"}} >All Orders</h3>
            <div style={{marginTop: "10px"}} >
                {
                    filterData.map(order => {
                        const date = new Date(order.created_at)
                        return (
                        <div key={order.order_id} className="order-container" >
                            <div style={{display:'flex', justifyContent : "space-between" }} >
                                <h6 style={{textAlign: "center"}} >Order Id: {order.order_id}</h6>
                                <h6 >Username: {order.username}</h6>
                                <p style={{textAlign: "center"}} >{timeFormatted(date)}</p>
                            </div>
                            
                            <div style={{display:'flex', justifyContent : "space-between" }} >
                                <h6>Grand Total: ${order.total_cost}</h6>
                                <p style={{textAlign: "center", textTransform: "capitalize"}} >{order.order_status.split("_").join(" ")}</p>
                            </div>
                            
                            <div style={{width:'100%',textAlign:'center'}}>
                            <button onClick={() => {
                                viewOrderDetails(order.order_id)
                                }} style={{margin:"5px auto"}} >View Details</button>    
                            </div>
                        </div>)
                    })
                }
            </div>
            </div>
        </div>
    );
};

export default AdminOrders;