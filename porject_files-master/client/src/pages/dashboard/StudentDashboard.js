import React,{useState,useEffect} from 'react';
import Header from './../../components/Header';
import RequestCard from '../../components/cards/RequestCard';
import ProfileCard from '../../components/cards/ProfileCard';
import SocialLinksCard from '../../components/cards/SocialLinksCard';
import axios from 'axios';
import { auth } from '../../components/firebase/config';
import { SERVER_NAME } from '../../components/config/config';

function StudentDashboard() {
    const [RequestCardsWithData, setRequestCardsWithData] = useState([]);
    const [masterRequests, setMasterRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    //Creating an array of Request cards with dummy data
    useEffect(() => {
        setRequestCardsWithData([])
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
                axios.get(SERVER_NAME+'/student/requests/active',data).then(
                    //responces is received successfully
                    (snap)=>{
                        if(snap.data.errorMessage){                        
                            alert(snap.data.errorMessage);                            
                            return;
                        }
                        //snap is the received data from server
                        var tempArray=[]
                        var tempRawArray=[]
                        //console.log(snap.data);
                        for(let data in snap.data){
                            //Remaining field values
                            let requestObject=snap.data[data];
                            //console.log(requestObject);
                            requestObject={...requestObject,CampaignButton:'Pause Campaign'};
                            tempRawArray.push(requestObject);
                            //Push in temporary array
                            tempArray.push(<RequestCard key={data} users={requestObject}/>);
                            
                        }
                        setRequestCardsWithData((oldArray) => [...oldArray,tempArray]);
                        setMasterRequests((oldArray) => [...oldArray,...tempRawArray]);
                    }
                ).catch(
                    //Error in receiving responce
                    (err)=>{
                        //Show a polite error alert
                        //get error message from err.message
                        console.log(err.message);
                    }
                );

                //get pending request to server with data
                axios.get(SERVER_NAME+'/student/requests/pending',data).then(
                    //responces is received successfully
                    (snap)=>{
                        if(snap.data.errorMessage){
                            alert(snap.data.errorMessage);
                            return;
                        }
                        //snap is the received data from server
                        var tempArray=[]
                        var tempRawArray=[]
                        //console.log(snap.data);
                        for(let data in snap.data){
                            //Remaining field values
                            let requestObject=snap.data[data];
                            
                            requestObject={...requestObject};
                            tempRawArray.push(requestObject);
                            //Push in temporary array
                            tempArray.push(<RequestCard key={data} users={requestObject}/>);
                        }
                         setRequestCardsWithData((oldArray) => [...oldArray,tempArray]);
                         setMasterRequests((oldArray) => [...oldArray,...tempRawArray]);
                    }
                ).catch(
                    //Error in receiving responce
                    (err)=>{
                        //Show a polite error alert
                        //get error message from err.message
                        console.log(err.message)
                    }
                );

                //get pause request to server with data
                axios.get(SERVER_NAME+'/student/requests/paused',data).then(
                    //responces is received successfully
                    (snap)=>{
                        if(snap.data.errorMessage){                        
                            alert(snap.data.errorMessage);                            
                            return;
                        }
                        //snap is the received data from server
                        var tempArray=[]
                        var tempRawArray=[]
                        //console.log(snap.data);
                        for(let data in snap.data){
                            //Remaining field values
                            let requestObject=snap.data[data];
                            
                            requestObject={...requestObject,CampaignButton:'Start Campaign'};
                            tempRawArray.push(requestObject);
                            //Push in temporary array
                            tempArray.push(<RequestCard key={data} users={requestObject}/>);
                        }
                        setRequestCardsWithData((oldArray) => [...oldArray,tempArray]);
                        setMasterRequests((oldArray) => [...oldArray,...tempRawArray]);
                    }
                ).catch(
                    //Error in receiving responce
                    (err)=>{
                        //Show a polite error alert
                        //get error message from err.message
                        console.log(err.message)
                    }
                );

                 //get cancelled request to server with data
                axios.get(SERVER_NAME+'/student/requests/cancelled',data).then(
                    //responces is received successfully
                    (snap)=>{
                        if(snap.data.errorMessage){                        
                            alert(snap.data.errorMessage);                            
                            return;
                        }
                        //snap is the received data from server
                        var tempArray=[]
                        var tempRawArray=[]
                        //console.log(snap.data);
                        for(let data in snap.data){
                            //Remaining field values
                            let requestObject=snap.data[data];
                            
                            requestObject={...requestObject};
                            tempRawArray.push(requestObject);
                            //Push in temporary array
                            tempArray.push(<RequestCard key={data} users={requestObject}/>);
                        }
                        setRequestCardsWithData((oldArray) => [...oldArray,tempArray]);
                        setMasterRequests((oldArray) => [...oldArray,...tempRawArray]);
                    }
                ).catch(
                    //Error in receiving responce
                    (err)=>{
                        //Show a polite error alert
                        //get error message from err.message
                        console.log(err.message)
                    }
                );
        }).catch((err)=>{
            alert('Error!\n Session Expired.\nYou need to sign-in again.');
        })
    }, [])

    useEffect(() => {
        if(searchTerm === ''){
            var tempArray=[]
            setRequestCardsWithData(masterRequests.map((request,i)=>{
                return <RequestCard key={i} users={request}/>
            }))
            return;
        }
        var tempArray = [];
        masterRequests.forEach((request,i)=>{
            if(request.RequestTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.created_at?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.RequestAmount?.toLowerCase().includes(searchTerm.toLowerCase())
            ){
                tempArray.push(<RequestCard key={i} users={request}/>);
            }
        } );
        setRequestCardsWithData(tempArray);
    }, [searchTerm])
    return (
        
        <div>
            <div className='some-page-wrapper'>
                <div className='row'>
                    <div className='column'>
                        <ProfileCard/>
                        <SocialLinksCard/>
                    </div>
                    <div className='triple-column'>
                        <div className="card" style={{marginLeft:'5px', height:'100%'}} >
                            <div className="card-body" >
                                <div>
                                    <input className='searchBar' type='text' placeholder='Search...' onChange={(event)=>setSearchTerm(event.target.value)}/>
                                </div>  
                                {RequestCardsWithData}                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard;