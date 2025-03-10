import { faCross, faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const Cancel = () => {
  return (
    <>
        <div style={{marginTop:'10%',justifyContent:'center',textAlign:'center'}}>
            <FontAwesomeIcon style={{height:"100px",color:'red', width:"100px"}} icon={faExclamation} />
            <h5>Donation Cancelled!</h5>
            <p>Thank you for visiting AFS</p>
        </div>
        <h5 style={{textAlign:'center',color:'skyblue',marginTop:'10%'}}>You can close this Tab</h5>
    </>
  )
}
