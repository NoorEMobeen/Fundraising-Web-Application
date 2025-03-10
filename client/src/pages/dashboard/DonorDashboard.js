import React,{useEffect,useState} from 'react';
import Header from './../../components/Header';
import RequestCard from '../../components/cards/RequestCard';
import ProfileCard from '../../components/cards/ProfileCard';
import SocialLinksCard from '../../components/cards/SocialLinksCard';
import { auth } from '../../components/firebase/config';
import {SERVER_NAME} from '../../components/config/config';
import axios from 'axios';
function DonorDashboard() {
    const [requests, setRequests] = useState([]);
    const [MasterRequests, setMasterRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    //Creating an array of Request cards with dummy data
    useEffect(() => {
        //Fetching data from server

        //Getting Current user's id tokken from firebase
        auth.currentUser.getIdToken().then(
            //When we receive the tokken
            (currentTokken)=>{
                //Data to send with request
                const data ={
                    //tokken is assigned to authorization in headers
                    headers:{
                        authorization:currentTokken
                    }
                }
                
                //get active request to server with data
                axios.get(SERVER_NAME+'/requests/active',data).then(
                    //responces is received successfully
                    (snap)=>{
                        if(snap.data.errorMessage){                        
                            alert(snap.data.errorMessage);                            
                            return;
                        }
                        //snap is the received data from server
                        var tempArray=[]
                        console.log(snap.data)
                        var tempRawArray=[]
                        Object.keys(snap.data).forEach(key=>{
                            tempRawArray.push({...snap.data[key],donateButton:true,clickableCard:true});
                            tempArray.push(<RequestCard key={data} users={{...snap.data[key],donateButton:true,clickableCard:true}}/>);
                        })
                        setMasterRequests(tempRawArray);
                        setRequests(tempArray);
                    }
                ).catch(
                    //Error in receiving responce
                    (err)=>{
                        //Show a polite error alert
                        //get error message from err.message
                        console.log(err.message);
                    }
                );

        }).catch((err)=>{
            alert('Error!\n Session Expired.\nYou need to sign-in again.');
        })
    }, []);

    useEffect(() => {
        if(searchTerm === ''){
            var tempArray=[]
            setRequests(MasterRequests.map((request,i)=>{
                return <RequestCard key={i} users={request}/>
            }))
            return;
        }
        var tempArray = [];
        MasterRequests.forEach((request,i)=>{
            if(request.RequestTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.created_at?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.RequestAmount?.toLowerCase().includes(searchTerm.toLowerCase())
            ){
                tempArray.push(<RequestCard key={i} users={request}/>);
            }
        } );
        setRequests(tempArray);
    }, [searchTerm])
    
    return (
        <div>
            <div className='some-page-wrapper'>
                <div className='row'>
                    
                    <div className='column'>
                        <ProfileCard />
                        <SocialLinksCard/>
                    </div>

                    <div className='triple-column'>
                        <div className="card" style={{marginLeft:'5px', height:'100%'}} >
                            <div className="card-body" >
                                <div>
                                <input className='searchBar' type='text' placeholder='Search...' onChange={event=>{setSearchTerm(event.target.value)}}/>
                                </div>
                                {requests} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DonorDashboard;