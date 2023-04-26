import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({authToken}) => {

    const [instructions, setInstructions] = useState([])
    const [ingredients, setIngredients] = useState([])
    const navigate = useNavigate()

    const addIntructions = (e) => {
        e.preventDefault()
        const heading = document.getElementById("instruction-heading")
        const description = document.getElementById("instruction-description")
        if(heading.value !== '' && description.value !== ''){
        setInstructions(old => [...old, {heading:heading.value, text:description.value}])
        }
    }

    const addIngredients = (e) => {
        e.preventDefault()
        const name = document.getElementById("ingredient-name")
        const quantity = document.getElementById("ingredient-quantity")
        const unit = document.getElementById("unit")
        const unit_text = unit.options[unit.selectedIndex].text
        if(name.value !== '' && quantity.value !== ''){
        setIngredients(old => [...old, {name:name.value, quantity:quantity.value, unit:unit_text}])
        }
    }

    const createPost = (e) => {
        e.preventDefault()
        console.log("accept value: ", document.getElementById("accept").checked);
        const link_only = document.getElementById("accept").checked
        // const link_only = 'true'    //by default NOT to put on feed
        const image_url = document.getElementById("image").value
        const post = {
            name : document.getElementById("name").value,
            timeRequired: document.getElementById("time").value,
            instructions,
            ingredients,
            link_only,
            image_url,
        }

        console.log("post", post);

        axios.post("http://127.0.0.1:8000/api/post", post, {
                headers: {
                "Authorization": 'Token ' + authToken
            }}).then(res => {
                console.log(res);
                // const order_id = res.data.order_id
                // navigate('/my-orders/'+order_id)
                const slug = res.data.post['slug']
                navigate('/feed/'+slug)
                 
            }).catch(err => console.log(err))
        
        
    }

    useEffect(() => {
        const heading = document.getElementById("instruction-heading")
        const description = document.getElementById("instruction-description")
        
        try {
            
        heading.value = ''
        description.value = ''
        }
        catch (TypeError) {
        }
    }, [instructions])

    useEffect(() => {
        const name = document.getElementById("ingredient-name")
        const quantity = document.getElementById("ingredient-quantity")
        const unit = document.getElementById("unit")

        try{
        name.value = ''
        quantity.value = ''
        // unit.value = 1
        }
        
        catch (TypeError) {

        }
    }, [ingredients])

    return (
        <div style={{marginTop:'5px', padding:'10px 30px 50px'}} >
            <form style={{width: '70%', margin: 'auto'}} >
                <label htmlFor='name' className='create-label' >Recipe Name</label>
                <input className='create-input' type='text' id='name' placeholder='Enter recipe name' />

                <label htmlFor='time' className='create-label' >Time Required</label>
                <input className='create-input' type='text' id='time' placeholder='Enter time required in minutes' />

                <label htmlFor='image' className='create-label' >Image URL</label>
                <input className='create-input' type='text' id='image' placeholder='Enter Image URL' />

                <label htmlFor='instructions' className='create-label' >Instructions</label>
                <div>
                    {instructions.map((instruction, i) => {
                        return <div key={i} >
                            <h6 className='create-label' >{instruction.heading}</h6>
                            <p>{instruction.text}</p>
                        </div>
                    })}
                    <label htmlFor='instruction-heading' className='create-label' >Heading</label>
                    <input className='create-input' type='text' id='instruction-heading' placeholder='Enter section heading' />
                    <label htmlFor='instruction-description' className='create-label' >Description</label>
                    <textarea className='create-input' rows="10" cols="100" id="instruction-description" ></textarea>
                    <button className='center-btn btn btn-primary' style={{margin: "10px auto"}} onClick={addIntructions} >Click to add </button>
                </div>

                <label htmlFor='ingredients' className='create-label' >Ingredients</label>
                <div style={{marginTop: "20px"}} >
                    {ingredients.map((ingredient, i) => {
                        return <div key={i} >
                            <p className='show-ingred' >{ingredient.name}</p>
                            <p className='show-ingred' >{ingredient.quantity}</p>
                        </div>
                    })}
                    <label htmlFor='ingredient-name' className='create-label' >Ingredient Name</label>
                    <input type='text' className='create-ingredient' id="ingredient-name" placeholder='Ingredient name' />
                    <label htmlFor='ingredient-quantity' className='create-label' >Ingredient Quantity</label>
                    <input type='number' className='create-ingredient' id='ingredient-quantity' placeholder='Ingredient quantity' style={{display: "inline-block"}} />
                    <select className='create-ingredient' name="selectState" id="unit" style={{marginLeft:'20px', display: "inline-block"}} required>
                        <option value="">Select Unit</option>
                        <option value="AL">ml</option>
                        <option value="AK">g</option>
                        <option value="AZ">teaspoon</option>
                        <option value="AZ">tablespoon</option>
                        <option value="AZ">cups</option>
                        <option value="AZ">unit</option>
                    </select>
                    <button className='btn btn-primary' style={{margin: "20px auto", display: "block"}} onClick={addIngredients} >Click to add </button>
        
                </div>

                <label for="accept" className='create-label' >
                    Private Post <input style={{height: "20px", width: "20px", marginLeft: "20px"}} type="checkbox" id="accept" name="accept" /> 
                </label>

                <button className='btn btn-success create-btn center-btn' style={{}} onClick={createPost} >Submit Post</button>

            </form>
        </div>
    );
};

export default CreatePost;