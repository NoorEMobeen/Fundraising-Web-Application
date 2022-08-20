import React from "react";

function TransactionInfoAlert(props){
    return(
        <div style={{height: '400px', marginTop:'200px'}}>
            <center>
                <form className='some-page-wrapper' style={{ margin: '100px auto', padding: '40px', width: '30%',borderRadius: '5px'}}>
                    <h4>Information</h4>
                    <div>
                        <label>Whenever user Click on Row, here User Data will be Shown! </label>    
                    </div>
                    <div style={{overflow:'auto'}}>
                        <div style={{alignItems:'center' }}>
                            <input style={{marginTop:'30px', backgroundColor:'rgb(0,0,0,0.8)' }} type="submit" className="btn btn-dark" value="OK"/>
                        </div>
                    </div>
                </form>
            </center>
        </div>

        // <div class="bg-secondary" >
        //     <h4 class="alert-heading">Well done!</h4>
        //     <p>Aww yeacontent.</p>
        //     <hr/>
        //     <p class="mb-0">Whenever things nice and tidy.</p>
        // </div>
    )
}

export default TransactionInfoAlert;