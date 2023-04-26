import React from 'react'
import '../src/Components/layout/Receipes.css'
import Form from './Components/layout/Form';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetails = ({authToken}) => {

    const location = useLocation()
    const navigate = useNavigate()
    const {id} = useParams()

    const [recipeDetail, setRecipeDetail] = useState([])

    const [ingredients, setIngredients] = useState([]);
    const [instruction, setInstruction] = useState([]);
    const [showAddField, setShowAddField] = useState(false)

    const [ingredientName, setIngredientName] = useState('')
    const [ingredientQuantity, setIngredientQuantity] = useState(0)

    // const addIngredient = () => {
    //     if (ingredientName !== '' && ingredientQuantity !== 0){
    //         setIngredients(old => [...old, {name: ingredientName, quantity: ingredientQuantity, unit: "g", userAdded: true}])
    //         setIngredientName('')
    //         setIngredientQuantity(0)
    //         setShowAddField(false)
    //     }
    // }

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/happy-tummy/user-posts", {
          headers: {
            "Authorization": 'Token ' + authToken
          },
          params: {
            slug: id
          }
        }).then(res => {
            console.log(id, res.data.post[0]);
            const recipe = res.data.post[0]
          setRecipeDetail(recipe)
          setIngredients(recipe.ingredients)
          setInstruction(recipe.instructions)
          console.log("feed data", res.data);
    
        }).catch(err => {
          console.log(err);
        })
      }, [])

    const placeOrder = () => {
        if(authToken === ''){
            navigate("/signin")
        }
        
        else{
            const quantities = document.getElementsByTagName('input')
            var order_ingredients = []
            for (let i = 0; i < quantities.length; i++) {
                if(quantities[i].value){
                    const q = parseFloat(quantities[i].value)
                    if(q !== 0){
                    console.log(ingredients[i].name, q);
                    order_ingredients.push({name: ingredients[i].name.trim(), quantity: q})
                    }
                }
            }}

            navigate("/order-summary", {state: order_ingredients})
        }



    return (
        <div>
            <div className='banner-1'>
                <div className='card-1' >
                    <img src={recipeDetail.image_url} className='detail-image' alt="" style={{}} />
                </div>
                <div className='sidebar'>
                    <h1 id='heading'>{recipeDetail.name}</h1>
                    <h1 id='receipes'>Receipe Instructions</h1>
                    {
                        instruction.map((i, k) => (
                            <div className='instructions' key={k} >
                                <h1 className='instructions-heading'>{i.heading}</h1>
                                <p className='instructions-text'>{i.text}</p>
                            </div>
                        ))
                    }
                    <h1 id='ingredients'>Ingredients</h1>
                    {
                        ingredients.map((i, k) => {
                            
                            return <div className='ingredients' key={k} >
                                <h6 className='ingredients-heading'><b>Name:- </b> {i.name}</h6>
                                {!i.userAdded ?
                                    <>  
                                    <h6 className='ingredients-heading'><b>Quantity:-</b> {i.quantity + " " + i.unit}</h6>
                                    {/* <h6 className='ingredients-subheading' for={i+ " quantity"} >Select how much you require</h6>
                                    <div>
                                        <input className='ingredients-subheading' style={{width: "16rem"}} id={k+ " quantity"} name={k+ " quantity"} type="number" placeholder="Enter 0 if you don't need" />
                                        <p className='ingredients-subheading' style={{display: "inline-block", marginLeft: "5px"}} > {i.unit.replace(/[{()}]/g, '')}</p>
                                    </div> */}
                                    </>
                                : 
                                <div>
                                    <input style={{width: "16rem"}} id={k+ " quantity"} name={k+ " quantity"} type="number" value={i.quantity} disabled placeholder="Enter 0 if you don't need" />
                                    <p style={{display: "inline-block", marginLeft: "5px"}} > {i.unit.replace(/[{()}]/g, '')}</p>
                                </div>
                                }
                                
                            </div>
                        })
                    }

                    {showAddField && <div className='ingredients' >
                        <h6 >Name</h6>
                        <div>
                            <input style={{width: "16rem"}} id="add-name" name="add-name" type="text" placeholder="Enter name" onChange={(val) => setIngredientName(val.target.value)} />
                            <p style={{display: "inline-block", marginLeft: "5px"}} > {}</p>
                        </div >
                        <h6 style={{marginTop: "10px"}} >Select how much you require</h6>
                        <div>
                            <input style={{width: "16rem"}} id="add-quantity" name="add-quantity" type="number" placeholder="Enter 0 if you don't need" onChange={(val) => setIngredientQuantity(val.target.value)} />
                            <p style={{display: "inline-block", marginLeft: "5px"}} > {}</p>
                        </div>
                    </div> }

                    
                    {/* { */}
                        {/* showAddField ?  */}
                        {/* <button onClick={addIngredient}>Submit</button> */}
                        {/* :  */}
                        {/* <div> */}
                            {/* <button onClick={() => {setShowAddField(true)}}>Add Ingredients</button> */}
                            {/* {authToken === "" ?  */}
                            {/* <button className='btn btn-info' onClick={() => navigate("/signin")} style={{marginLeft:"12px"}} >Login to place order</button> */}
                            {/* :<button className='btn btn-success' onClick={placeOrder} style={{marginLeft:"12px"}} >Place Order</button> */}
                            {/* } */}
                        {/* </div> */}
                    {/* } */}

                </div>
            </div>
        </div>

    )
}

export default PostDetails
