import React,{useState} from 'react'
import { constants, createPublicKey, publicEncrypt } from 'crypto';
import { RSA_PUBLIC_KEY, X_IBM_CLIENT_ID, X_IBM_CLIENT_SECRET,BASE_URL} from './keys';
import axios from 'axios';
import { CLIENT_NAME, SERVER_NAME } from '../../components/config/config';
import certificate from './certificate.cer'
//const MSISDN='03136100930';

const callEncryptionAPI=async(message)=>{
  const encryptedMessage= await axios.post(SERVER_NAME+'/encrypt',{message:message})
  return encryptedMessage.data?encryptedMessage.data.encrypted :encryptedMessage;
}

export const Easypaisa = () => {
  const [msisdn, setmsisdn] = useState('');
  const [pin, setPin] = useState('');

  const handleEasyPaisaPayment=async()=>{
    if(!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(msisdn)) || msisdn.length!=11){
      alert('Enter valid phone number')
      return
    }
    const x_msisdn=await callEncryptionAPI(msisdn)
    generateLoginTokenAndLogin(x_msisdn);
  }
  return (
    <div>
        <input type='number' placeholder='03001234567' onChange={(e)=>setmsisdn(e.target.value)}/>
        <input type='button' value='Donate' className='btn btn-success' onClick={handleEasyPaisaPayment}></input>
    </div>
  )
}


//Generate Login tokken
const generateLoginTokenAndLogin=async(x_msisdn)=>{
    console.log(x_msisdn)
    const urlForToken=BASE_URL+'/LoginAPI/token';
    const urlForLogin=BASE_URL+'/LoginAPI/Login';
    const optionsForToken = {
        headers: {
          'X-IBM-Client-Id': X_IBM_CLIENT_ID,
          'X-IBM-Client-Secret': X_IBM_CLIENT_SECRET,
          'X-Msisdn': x_msisdn,
          'X-Channel': ''
        }
      };
      const tokenResponse=await axios.post(urlForToken,{},optionsForToken);
      if(tokenResponse.data.ResponseCode===0){
        if(tokenResponse.data.Token){
          const encryptedCallbackURL= await callEncryptionAPI(CLIENT_NAME+'/get_credentials')
          if(encryptedCallbackURL){
            const optionsForLogin = {
              headers: {
                'X-IBM-Client-Id': X_IBM_CLIENT_ID,
                'Callback': encryptedCallbackURL,
                'X-Channel': '',
                'Authorization':tokenResponse.data.Token
              }
            };
            const loginResponse=await axios.post(urlForLogin,{},optionsForLogin);
            console.log(loginResponse.data);
            return loginResponse.data
          }
        }
      }else{
        console.log('Easypaisa Response code',tokenResponse.data.ResponseCode);
        console.log('Easypaisa Response Message',tokenResponse.data.ResponseMessage);
        return tokenResponse.data.ResponseMessage
      } 
}

