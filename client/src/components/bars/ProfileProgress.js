import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { getStorage, listAll, ref as storageRef} from 'firebase/storage';
import { auth } from '../firebase/config';
import axios from 'axios';
import { SERVER_NAME } from '../config/config';

const ProfileProgress=(props)=>{
    const [progress,setProgress]=useState(0);
    useEffect(() => {
        setProgress(0);
        auth.currentUser.getIdToken()
        .then((currentToken)=>{
            const data ={
                headers:{
                    authorization:currentToken
                }
            }
            axios.get(SERVER_NAME+'/student/profile',data)
            .then((res)=>{
                setProgress(prev=>prev+(Object.values(res.data).filter((item)=>{if(item){return item}}).length*1.48));
            }).catch((err)=>console.log(err));
        }).catch((err)=>console.log(err));
        
        //get number of images
        listAll(storageRef(getStorage(), auth.currentUser.uid+'/images'))
        .then((res) => {
            console.log(res)
            setProgress(prev=>prev+(res.items.length*2.94));
        })
        .catch((error) => {
            // Handle any errors
            console.log('Error finding images:'+error.message);
        });

        listAll(storageRef(getStorage(), auth.currentUser.uid+'/profile'))
        .then((res) => {
            setProgress(prev=>prev+(res.items.length*2.94));
        })
        .catch((error) => {
            // Handle any errors
            console.log('Profile image not found:'+error.message);
        });
    }, []);

    return(
        <div class="progress">
            <ProgressBar now={progress.toFixed(2)} label={`${progress.toFixed(2)}% Profile Completed`} style={{width:`${props.width?props.width:'200px'}`}} />
        </div>
    )
}

export default ProfileProgress;