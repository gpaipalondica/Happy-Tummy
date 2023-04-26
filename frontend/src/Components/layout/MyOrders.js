import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import "./myorders.css"

const MyOrders = ({authToken}) => {

    document.getElementById("nav2").classList.remove('show')
    // const [showCancel, setShowCancel] = useState(false)

    const cancelId = useParams()

    
    const [orderData, setOrderData] = useState([])
    const [orderStatus, setOrderStatus] = useState("order_placed")

    const navigate = useNavigate()
    
    useEffect(() => {
        if (authToken == ''){
            navigate('/')
        }
        console.log("authToken", authToken);
        axios.get("http://127.0.0.1:8000/api/get/user-orders-all", {
            headers: {
            "Authorization": 'Token ' + authToken
        }})
        .then(res => {
            console.log(res.data.orders)
            console.log("HEY",res.data.orders[Object.keys(res.data.orders)[0]].order_id)
            reverseData(res.data.orders)
            // setOrderData(res.data.orders)
        })
        .catch(err => console.log(err))
    }, [])
    
    var revData = []
    const reverseData = (data) => {

        let varIndex = []
        let dataLen = Object.keys(data).length;
        for(let i=0;i<dataLen;i++){
            varIndex.push(data[Object.keys(data)[i]].order_id)
        }

        // console.log(varIndex);
        varIndex.sort((a,b) => {
            return a < b ? 1 : -1
        })
        
        // console.log(varIndex); //index sorted in desc
        // console.log(varIndex[0], varIndex[1]);
        
        for(let i=0; i < dataLen; i++){
            // console.log(varIndex[i])
            revData.push(data[Object.keys(data)[i]]);
        }

        // console.log("rev", revData);
        
        revData.sort((a,b) => {
            return a.order_id < b.order_id ? 1 : -1
        })
        
        // console.log("rev2", revData);

        setOrderData(revData)
    }

    const viewOrderDetails = (orderId) => {
        navigate("/my-orders/"+orderId)
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


    function showStatus(ss){
        let ss2 = ss;
        let ss3
        // console.log('st', ss2);
        if(ss2 == "order_placed"){
            ss3 = "Order Placed";

        }
        else if(ss2 == "processing"){
            ss3 = "Processing";
        }
        else if(ss2 == "out_for_delivery"){
            ss3 = "Out for Delivery";
        }
        else if(ss2 == "delivered"){
            ss3 = "Delivered";
        }
        else if(ss2 == "cancelled"){
            ss3 = "Cancelled";
        }

        return ss3
    }
 
    
    function cancelOrder(orderId){
       let num = orderId
       console.log(num);
       
       let popup = document.querySelector('.sureOrderCancel')
       popup.style.display = 'block';
       document.querySelector('.sureText').innerHTML = "Are you sure you want to cancel Order "+num+'?'
       
       document.getElementById('yesCancel').onclick = function(){
           console.log("YESSSSS");
           document.querySelector('.sureOrderCancel').style.display = 'none';
           console.log("2NUM",num);

           //if ADMIN
           axios.post("http://127.0.0.1:8000/adminsite/update/order_status", {
                "order_id": num,
                "order_status": "cancelled"
            }, 
            {
                headers: {
                    "Authorization": 'Token ' + authToken
                  },
                
            }).then(res => {
                console.log(res);
                setTimeout(()=>{
                    window.location.reload()
                },1000)
            }).catch(err => {
                console.log(err);
            })
           
       }

    }


    // useEffect(() => {
    //     if (orderStatus !=  null) {
    //         console.log("OS",orderStatus);

    //         let id = localStorage.getItem('cancelId')
    //         console.log("OSID", id);
            
            // axios.post("http://127.0.0.1:8000/adminsite/update/order_status", {
            //     "order_id": id,
            //     "order_status": orderStatus
            // }, 
            // {
            //     headers: {
            //         "Authorization": 'Token ' + authToken
            //       },
                
            // }).then(res => {
            //     console.log(res);
            // }).catch(err => {
            //     console.log(err);
            // })
    //     }
    // }, [reqCancelOrder.onClick])

    function closePopup(){
        document.querySelector('.sureOrderCancel').style.display = 'none';
    }

    return (
        <div style={{padding: "20px"}} >
            <h3 style={{textAlign: "center"}} >Order History</h3>
            <div style={{marginTop: "10px"}} >
                {
                    Object.keys(orderData).map(orderId => {
                        const date = new Date(orderData[orderId].created_at)
                        return (
                        <div key={orderId} className="order-container" >
                            <div style={{display:'flex',justifyContent : "space-between" }} >
                                <h6 style={{textAlign: "center"}} >Order Id: {orderData[orderId].order_id}</h6>
                                <p style={{textAlign: "center"}} >{timeFormatted(date)}</p>
                            </div>
                            <div style={{display:'flex', justifyContent : "space-between",alignItems: 'center'}} >
                            <h6 style={{fontWeight:'bold'}}>Grand Total: ${orderData[orderId].total_cost}</h6>
                            <h6 style={{fontWeight:'bold'}} >Status: {showStatus(orderData[orderId].order_status)}</h6>
                            </div>
                            <div style={{width:'100%',textAlign:'center', display:'flex', justifyContent:'center', gap:'1rem'}}>
                            <button onClick={() => viewOrderDetails(orderData[orderId].order_id)} >View Details</button>
                            {
                                orderData[orderId].order_status == 'order_placed' ?
                                <button id='cancelButton' onClick={() => cancelOrder(orderData[orderId].order_id)} style={{background:'#007bff', color:'white'}}>Cancel Order</button> : <></>
                            }   
                            </div>

                       <div className='sureOrderCancel' style={{display:'none', position:'fixed', top:'50%', left:'50%', transform: 'translate(-50%, -50%)'}}>
                        <div style={{backgroundColor:'lightgray', zIndex:'5' ,display:'flex', gap:'1rem',flexDirection:'column', justifyContent:'center' ,width:'550px', height:'200px',border: '2px solid #bbb', borderRadius: '20px', boxShadow:'0 5px 3px #bbb'}}>
                            <h4 className='sureText' style={{textAlign:'center'}}></h4>
                            <div style={{display:'flex', justifyContent:'center', gap:'1rem'}}>
                                <button style={{width:'80px'}} id='yesCancel'>Yes</button>
                                <button style={{width:'80px', background:'#007bff', color:'white'}} className='noCancel' onClick={() => closePopup()}>No</button>
                            </div>
                        </div>
                        </div>
                        
                    </div>)
                    })
                }
            </div>

            

        </div>
    );
};

export default MyOrders;