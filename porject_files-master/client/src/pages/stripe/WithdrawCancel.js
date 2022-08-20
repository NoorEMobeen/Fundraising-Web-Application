import { faCross, faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export const WithdrawCancel = () => {
  return (
    <>
        <div style={{marginTop:'10%',justifyContent:'center',textAlign:'center'}}>
            <FontAwesomeIcon style={{height:"100px",color:'red', width:"100px"}} icon={faExclamation} />
            <h5>Withdraw Cancelled!</h5>
            <p>Thank you for being part of AFS</p>
        </div>
        <h5 style={{textAlign:'center',color:'skyblue',marginTop:'10%'}}>You can close this Tab</h5>
    </>
  )
}
