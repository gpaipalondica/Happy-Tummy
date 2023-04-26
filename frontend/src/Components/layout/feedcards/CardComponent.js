import React from 'react'

import { useState } from 'react'

import  Card  from '../feedcards/Card';
const CardComponent = () => {
    const [food, setfood] = useState(
        [
           
        ]);
    return (
        <div >
            {
                food.map((foods) => (
                    <Card key={foods.id} props={foods} />
                ))
            }
        </div>
    )
}

export default CardComponent