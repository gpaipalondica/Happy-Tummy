import React from "react";
import Faq from "react-faq-component";

const data = {
    title: "Frequently Asked Questions",
    rows: [
        {
            title: "How do I place the order for a recipe?",
            content: "Click on Recipe tab in Navigation panel. Select the Recipe section and search for the recipe you are looking for. Click on recipe and check/uncheck the ingredients associated to the recipe and click on Place order.",
        },
        {
            title: "How do I create a recipe?",
            content: "Click on Recipe tab in Navigation panel. Select the Create section. Fill out the details in the form and add pictures and instructions to the recipe and click on Save or Publish.",
        },
        {
          title: "How can I post my recipes on Feed?",
          content: "Once you create the recipe click on Publish for your recipe to be posted on the Feed.",
      },
        {
            title: "How long does it take for your order to reach?",
            content: "The customer has to select time from the available time slots before placing the order and we will show you the estimated delivery time",
        },
       
    ],
};

const styles = {
    titleTextColor: "black",
    rowTitleColor: "grey",
};

const config = {
    animate: true,
    tabFocus: true
};



const Support = () => {

  document.getElementById("nav2").classList.remove('show')

  const handleSubmit = (event) => {
    event.preventDefault();

    const formInputs = Array.from(event.target);
    const formData = {}
    const date = new Date
    let d = date.toLocaleString()
    
    formInputs.forEach( x => {
      //adding timestamp
      formData[["created_at"]] = d
      
      if(x.id != ''){
        formData[x.id] = x.value;
      }
    })

    console.log("Support ticket",formData)
    
  }
  
  return (
    <div>

    <div className='support' style={{maxWidth:'80%', position:'relative', margin:'auto', display:'flex', padding:'40px 20px 40px 20px',alignItems:'center'}}>

      <form className="form" style={{width:'100%'}} onSubmit={handleSubmit}>  
        <h2 style={{marginBottom:'30px'}}>Please submit your query</h2>
          <div className="form-group">
            <label htmlFor="name" >Name</label>
            <input type="text" className="form-control" id="name" placeholder="Enter name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label htmlFor="descr">Description</label>
            <textarea rows={4} type="textbox" className="form-control" id="descr" placeholder="Enter description" required/>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'120px',float:'right'}}>Submit</button>
        </form>

        <div className="faqs" style={{ width:'100%', lineHeight:'30px'}}>
            <Faq
                data={data}
                styles={styles}
                config={config}
                />
        </div>
      
  
      </div>
        <br/>
        <div style={{marginBottom:'50px'}}>
          <h5 className="text-center">You can also email us at: <a href="mailto: support@happytummy.com">support@happytummy.com</a></h5>
        </div>
    </div>   
  )
}

export default Support
