import React,{useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckDouble, faSmile} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { SERVER_NAME } from "../../components/config/config";

export const WithdrawSuccess = () => {
  useEffect(() => {
    const url=window.location.href.replace(`http://localhost:3000/withdraw-success/`,'');
    if(url.length>10){
      ///donor/transaction/create
      //${amount}-${uid}-${RequestTitle}-${DeadlineDay}-${RequestUID}
      let [Amount,uid,RequestTitle,DeadlineDay,created_at,docId]=url.split('_');
      RequestTitle=RequestTitle.replace(/;/g,' ');
      axios.post(SERVER_NAME+'/withdraws/approve',{Amount,uid,RequestTitle,DeadlineDay,created_at,docId})
        .then(res=>{
            console.log(res.data);
        }).catch(err=>{

        })
      
    }
  }, [])

  return (
    <>
        <div style={{marginTop:'10%',color:'green',justifyContent:'center',textAlign:'center'}}>
            <FontAwesomeIcon style={{height:"100px", width:"100px"}} icon={faCheckDouble} />
            <h5>Thank you for trusting AFS</h5>
            <p>Have a nice day!</p>
            <FontAwesomeIcon style={{height:"30px", width:"30px"}} icon={faSmile} />
        </div>
        <h5 style={{textAlign:'center',color:'skyblue',marginTop:'10%'}}>You can close this Tab</h5>
    </>
  )
}
