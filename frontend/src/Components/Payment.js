import React, { useState, useEffect } from "react" ;
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Payment = ({authToken, ingredients, amount , title}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const title2 = title

    const [show, setShow] = useState(true);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);

    const CLIENT_ID = "ATGI8M3ehzTHJ39dnbKdN4C094mZg_KYiiw7HnKyA__2zDha_Hzn0yM2U-zPuQJOyOt-fFlF9SEMW3Xw"

    const placeOrder = () => {
        axios.post("http://127.0.0.1:8000/api/order", {
            Ingredients: ingredients
        }, {
            headers: {
            "Authorization": 'Token ' + authToken
        }}).then(res => {
            console.log(res);
            const order_id = res.data.order_id
            localStorage.setItem('myCount', title2)
            navigate('/my-orders/'+order_id) 
        }).catch(err => console.log(err))
    }

    // creates a paypal order
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "Checkout",
                    amount: {
                        currency_code: "USD",
                        value: amount,
                    },
                },
            ],
        }).then((orderID) => {
                setOrderID(orderID);
                return orderID;
            });
    };

    // check Approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            console.log("payment approved");
            setSuccess(true);
            placeOrder()
        });
    };

    //capture likely error
    const onError = (data, actions) => {
        setErrorMessage("An Error occured with your payment ");
    };

    useEffect(() => {
        if (success) {
            console.log('Order successful . Your order id is--', orderID);
        }
    },[success]);

    return (
        <PayPalScriptProvider options={{ "client-id": CLIENT_ID }}>
            <div className="paymentContainer">
                {show ? (
                    <PayPalButtons
                        style={{ layout: "vertical"}}
                        createOrder={createOrder}
                        onApprove={onApprove}
                    />
                ) : null}
            </div>
        </PayPalScriptProvider>
    );
}

export default Payment