import React, { useContext,useState,useEffect } from 'react';
import Header from './../../components/Header';
import './../../components/constants/style.css';
import { Table } from 'react-bootstrap';
import RequestCard from '../../components/cards/RequestCard';
import {useFormik} from 'formik';
import axios from 'axios';
import { SERVER_NAME } from '../../components/config/config';
import { getStorage, listAll, ref as storageRef} from 'firebase/storage';
import { auth } from '../../components/firebase/config';
import PuffLoader from "react-spinners/PuffLoader";
import ProfileProgress from '../../components/bars/ProfileProgress';


const CreateRequest =(props)=>{
    const [showError, setShowError] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState({});
    const [CreateRequestWithData, setCreateRequestWithData] = useState([]);
    const [progress,setProgress]=useState(0);
    const [updateScreen, setUpdateScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [masterRequests, setMasterRequests] = useState([]);

    const initialValues={
        RequestTitle:selectedRequest?.RequestTitle || '',
        RequestAmount:selectedRequest?.RequestAmount || '',
        DeadlineDay:selectedRequest?.DeadlineDay || '',
        DeadlineTime:selectedRequest?.DeadlineTime || '',
        ReasonDetail:selectedRequest?.ReasonDetail || ''
    }
    const validate=values=>{
        const errors = {};
        if (!values.RequestTitle || !values.RequestAmount || !values.DeadlineDay || !values.DeadlineTime || !values.ReasonDetail) {
            setShowError(true);
        } else {
            setShowError(false);
        }
        
        return errors;
    }

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

    useEffect(() => {
        setCreateRequestWithData([])
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
                //get request to server with data
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
                            
                            requestObject={...requestObject,RequestTitle:requestObject.RequestTitle.replace(/^/g,' '),CancelButton:'1',editButton:'1'};
                            tempRawArray.push(requestObject);
                            //Push in temporary array
                            tempArray.push(<RequestCard key={data} users={requestObject} setRequest={setSelectedRequest}/>);
                        }
                         setCreateRequestWithData((oldArray) => [...oldArray,tempArray]);
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
                            
                            requestObject={...requestObject,PauseButton:'1',CancelButton:'1',WithdrawButton:'1'};
                            tempRawArray.push(requestObject);
                            //Push in temporary array
                            tempArray.push(<RequestCard key={data} users={requestObject} setRequest={setSelectedRequest}/>);
                        }
                        setCreateRequestWithData((oldArray) => [...oldArray,tempArray]);
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
                            
                            requestObject={...requestObject,ResumeButton:'1',CancelButton:'1'};
                            tempRawArray.push(requestObject);
                            //Push in temporary array
                            tempArray.push(<RequestCard key={data} users={requestObject} setRequest={setSelectedRequest}/>);
                        }
                        setCreateRequestWithData((oldArray) => [...oldArray,tempArray]);
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
                            tempArray.push(<RequestCard key={data} users={requestObject} setRequest={setSelectedRequest}/>);
                        }
                        setCreateRequestWithData((oldArray) => [...oldArray,tempArray]);
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
    }, [updateScreen])
    //Get data from API here
    //use axios to get requests of all types i.e pending, active, fulfilled and cancelled

    //populate the requestsArray with fetched requests
    //you need to set all the attributes with data from fetched request
    //e.g) <RequestCard clickableCard={false} requestDate={} runningTime={} campaignButton='Pause Campaign' editButton='1' requestedAmount={} collectedAmount={} donersParticipated={} remainingAmount={requested-collected} remainingHours={} activeStatus={} deleteButton='1'/>
    //How to populate array? see example in StudentDashboard.js

    //Create Request form 'Formik' functions
  
    const onSubmit=(values,{resetForm})=>{
        if(!values.RequestTitle || !values.RequestAmount || !values.DeadlineDay || !values.DeadlineTime || !values.ReasonDetail){
            alert('Error! \nPlease fill all the fields first.')
            return;
        }
        setShowLoader(true);
        const requestData={
            RequestTitle:values.RequestTitle,
            RequestAmount:values.RequestAmount,
            DeadlineDay:values.DeadlineDay,
            DeadlineTime:values.DeadlineTime,
            ReasonDetail:values.ReasonDetail,
            docId:selectedRequest.docId || ''
        }
        auth.currentUser.getIdToken().then((currentToken)=>{
            console.log(currentToken);
            axios.post(SERVER_NAME+'/student/create/request',requestData,{
                headers:{
                    Authorization:currentToken
                }
            }).then((res)=>{
                alert('Success!\nRequest send to Admin for approval.');
                setShowLoader(false);
                setUpdateScreen(prev=>!prev);
                resetForm();
            })
            .catch((err)=>{
                console.log('ERROR: '+err)
                setShowLoader(false)
            })
        });  
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validate,
        onSubmit
    });
    
    useEffect(() => {
        if(searchTerm === ''){
            var tempArray=[]
            setCreateRequestWithData(masterRequests.map((request,i)=>{
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
        setCreateRequestWithData(tempArray);
    }, [searchTerm])

    return (
        window.name==="admin"?
        <div>
            <div className='some-page-wrapper'>
                <div className='row'>
                    <div className='column'>
                        <div className="card item-align-center" >
                            <div className="card-body">
                                <h2 className="text-secondary">Archived</h2>
                                <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Requester</th>
                                                <th>Detail</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                [
                                                    { requester: 'Hassan', detail: "Withdraw Rs 10000" },
                                                    { requester: 'Aqib', detail: "Create fund post" },
                                                    { requester: 'Sania', detail: "Start Campaign" }
                                                ].map((item, index)=>
                                                    (
                                                        <tr>
                                                            <td>{index+1}</td>
                                                            <td>{item.requester}@gmail.com</td>
                                                            <td style={{cursor:'pointer'}} onClick={this.showDetail}>{item.detail}</td>
                                                            <td>
                                                                <button className="btn btn-success" type="button" value="Approve">A</button>
                                                                {' '}
                                                                <button className="btn btn-danger" type="button" value="Reject">R</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                                
                                        </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                    
                    <div className='triple-column'>
                        <div className="card" style={{marginLeft:'5px', height:'100%'}} >
                            <div className="card-body" >
                                <div>
                                    <input className='searchBar' type='text' placeholder='Search...' /*onChange={event=>{setSearchTerm(event.target.value)}}*//>
                                </div>
                                <br/>
                                <div>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Requester</th>
                                                <th>Detail</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                [
                                                    { requester: 'Clark', detail: "Withdraw Rs 10000" },
                                                    { requester: 'Bruce', detail: "Create fund post" },
                                                    { requester: 'Diana', detail: "Start Campaign" },
                                                    { requester: 'Barry', detail: "Withdraw Rs 5000" },
                                                    { requester: 'Alfred', detail: "Create fund post" }
                                                ].map((item, index)=>
                                                    (
                                                        <tr>
                                                            <td>{index+1}</td>
                                                            <td>{item.requester}@gmail.com</td>
                                                            <td style={{cursor:'pointer'}} onClick={this.showDetail}>{item.detail}</td>
                                                            <td>
                                                                <button className="btn btn-success" type="button" value="Approve">Approve</button>
                                                                {' '}
                                                                <button className="btn btn-danger" type="button" value="Reject">Reject</button>
                                                                {' '}
                                                                <button className="btn btn-secondary" type="button" value="Archive">Archive</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                                
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        :
        <div>
            <div className='some-page-wrapper'>
                <div className='row'> 
                    <div className='column'>
                        <div className="card item-align-center" >
                            <div className="card-body">
                                <div className="d-flex flex-column text-center" >
                                    <h3>Create Campaign</h3>
                                    <div>
                                     <form onSubmit={formik.handleSubmit} >        
                                            <label>
                                            Campaign Title:
                                            <input id="RequestTitle" name='RequestTitle' value={formik.values.RequestTitle} onChange={formik.handleChange}  type="text" placeholder="To pay school fee and ..."   /> </label>
                                            <br/><br/>
                                            <label>
                                            Request Amount:
                                            <input id="RequestAmount" name='RequestAmount'  value={formik.values.RequestAmount} onChange={formik.handleChange} type="text" placeholder="10000"   /> </label>
                                            <br/>
                                            <label>
                                            Deadline:
                                            <input id="DeadlineDay" name='DeadlineDay'  value={formik.values.DeadlineDay} onChange={formik.handleChange} style={{marginTop:'30px', marginBottom:'30px'}} type="date"  /> </label>
                                            <br/>
                                            <label>
                                            Time of day: (hh:mm PM/AM)
                                            <input id="DeadlineTime" name='DeadlineTime'  value={formik.values.DeadlineTime} onChange={formik.handleChange} style={{marginBottom:'30px'}} type="time"   /> </label>
                                            <br/>
                                            <label>
                                            Reason/Details:
                                            <br/>
                                            <textarea id="ReasonDetail" name='ReasonDetail'  value={formik.values.ReasonDetail} onChange={formik.handleChange} placeholder="Type here..."  />       </label>
                                            <br/>
                                            <center>
                                                <ProfileProgress width='300px'/>
                                                {progress<70 && <p>Please complete profile first.</p>}
                                                {showLoader?<PuffLoader size={50}/>:''}
                                            </center>
                                            <br/>
                                            {showError && <p style={{color:'red'}}>All the fields are required</p>}
                                            {(progress>70 && !showError) && 
                                            <>
                                                <input style={{marginTop:'30px', backgroundColor:'rgb(0,0,0,0.8)' }} type="submit" className="btn btn-dark" value="Submit"/>
                                                {selectedRequest?.RequestTitle && <input style={{marginTop:'30px'}} onClick={()=>setSelectedRequest({})} type="button" className="btn btn-secondary" value="Clear"/>}
                                            </>
                                            }
                                     </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='triple-column'>
                        <div className="card" style={{marginLeft:'5px', height:'100%'}} >
                            <div className="card-body" >
                                <div>
                                    <input className='searchBar' type='text' placeholder='Search...' onChange={event=>{setSearchTerm(event.target.value)}}/>
                                </div>     
                                {CreateRequestWithData}                          
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
}

// class CreateRequest extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {value: ''};
//       this.handleChange = this.handleChange.bind(this);
//       this.handleSubmit = this.handleSubmit.bind(this);
//       this.getCurrentDate=this.getCurrentDate.bind(this);
//     }

//     getCurrentDate(separator=''){

//         let newDate = new Date()
//         let date = newDate.getDate();
//         let month = newDate.getMonth() + 1;
//         let year = newDate.getFullYear();
        
//         return `${date}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
//     }

//     handleChange(event) {    this.setState({value: event.target.value});  }

//     handleSubmit(event) {
//         console.log(window.name);
//         var confirm=true;
//         if(document.getElementById('RequestAmount').value===""){
//             document.getElementById('RequestAmount').style.borderColor='red';
//             confirm=false;
//         }
//         else{
//             document.getElementById('RequestAmount').style.borderColor='transparant';
//         }
//         if(document.getElementById('Deadline').value===""){
//             document.getElementById('Deadline').style.borderColor='red';
//             confirm=false;
//         }
//         else{
//             document.getElementById('Deadline').style.borderColor='transparant';
//         }
//         if(document.getElementById('Time').value===""){
//             document.getElementById('Time').style.borderColor='red';
//             confirm=false;
//         }
//         else{
//             document.getElementById('Time').style.borderColor='transparant';
//         }
//         if(document.getElementById('Detail').value===""){
//             document.getElementById('Detail').style.borderColor='red';
//             confirm=false;
//         }
//         else{
//             document.getElementById('Detail').style.borderColor='transparant';
//         }

//         if(confirm){
//             const confirmBox = window.confirm(
//                 "Do you really want to send this Request?"
//               )
//               if (confirmBox === true) {
//                // handleDeleteCrumb(bookmark)
//               }
//         }
        
//       event.preventDefault();
//     }

//     handleDeleteClick(event) {
//         const confirmBox = window.confirm(
//             "Do you really want to Delete this Request?"
//           )
//           if (confirmBox === true) {
//            // handleDeleteCrumb(bookmark)
//           }
//       event.preventDefault();
//     }

//     showDetail(event){
//         alert("clicked");
//     }

//     render() {
//       return (
//         window.name==="admin"?
//         <div>
//             <Header header={{text:'Pending Approvals'}}/>
//             <div className='some-page-wrapper'>
//                 <div className='row'>
                    
//                     <div className='column'>
//                         <div className="card item-align-center" >
//                             <div className="card-body">
//                                 <h2 className="text-secondary">Archived</h2>
//                                 <Table striped bordered hover>
//                                         <thead>
//                                             <tr>
//                                                 <th>#</th>
//                                                 <th>Requester</th>
//                                                 <th>Detail</th>
//                                                 <th>Actions</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {
//                                                 [
//                                                     { requester: 'Hassan', detail: "Withdraw Rs 10000" },
//                                                     { requester: 'Aqib', detail: "Create fund post" },
//                                                     { requester: 'Sania', detail: "Start Campaign" }
//                                                 ].map((item, index)=>
//                                                     (
//                                                         <tr>
//                                                             <td>{index+1}</td>
//                                                             <td>{item.requester}@gmail.com</td>
//                                                             <td style={{cursor:'pointer'}} onClick={this.showDetail}>{item.detail}</td>
//                                                             <td>
//                                                                 <button className="btn btn-success" type="button" value="Approve">A</button>
//                                                                 {' '}
//                                                                 <button className="btn btn-danger" type="button" value="Reject">R</button>
//                                                             </td>
//                                                         </tr>
//                                                     )
//                                                 )
//                                             }
                                                
//                                         </tbody>
//                                 </Table>
//                             </div>
//                         </div>
//                     </div>
                    
//                     <div className='triple-column'>
//                         <div className="card" style={{marginLeft:'5px', height:'100%'}} >
//                             <div className="card-body" >
//                                 <div>
//                                     <input className='searchBar' type='text' placeholder='Search...' /*onChange={event=>{setSearchTerm(event.target.value)}}*//>
//                                 </div>
//                                 <br/>
//                                 <div>
//                                     <Table striped bordered hover>
//                                         <thead>
//                                             <tr>
//                                                 <th>#</th>
//                                                 <th>Requester</th>
//                                                 <th>Detail</th>
//                                                 <th>Actions</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {
//                                                 [
//                                                     { requester: 'Clark', detail: "Withdraw Rs 10000" },
//                                                     { requester: 'Bruce', detail: "Create fund post" },
//                                                     { requester: 'Diana', detail: "Start Campaign" },
//                                                     { requester: 'Barry', detail: "Withdraw Rs 5000" },
//                                                     { requester: 'Alfred', detail: "Create fund post" }
//                                                 ].map((item, index)=>
//                                                     (
//                                                         <tr>
//                                                             <td>{index+1}</td>
//                                                             <td>{item.requester}@gmail.com</td>
//                                                             <td style={{cursor:'pointer'}} onClick={this.showDetail}>{item.detail}</td>
//                                                             <td>
//                                                                 <button className="btn btn-success" type="button" value="Approve">Approve</button>
//                                                                 {' '}
//                                                                 <button className="btn btn-danger" type="button" value="Reject">Reject</button>
//                                                                 {' '}
//                                                                 <button className="btn btn-secondary" type="button" value="Archive">Archive</button>
//                                                             </td>
//                                                         </tr>
//                                                     )
//                                                 )
//                                             }
                                                
//                                         </tbody>
//                                     </Table>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         :
//         <div>
//             <Header header={{text:'Fund Requests'}}/>
//             <div className='some-page-wrapper'>
//                 <div className='row'> 
//                     <div className='column'>
//                         <div className="card item-align-center" >
//                             <div className="card-body">
//                                 <div className="d-flex flex-column text-center" >
//                                     <h3>Create Request</h3>
//                                     <div>

//                                      <form onSubmit={this.handleSubmit} >        
//                                             <label>
//                                             Request Title:
//                                             <input id="RequestTitle"  type="text" placeholder="Title"   /> </label>
//                                             <br/><br/>
//                                             <label>
//                                             Request Amount:
//                                             <input id="RequestAmount"  type="text" placeholder="Rs /-"   /> </label>
//                                             <br/>
//                                             <label>
//                                             Deadline:
//                                             <input id="Deadline" style={{marginTop:'30px', marginBottom:'30px'}} type="date"  /> </label>
//                                             <br/>
//                                             <label>
//                                             Time of day: (hh:mm PM/AM)
//                                             <input id="Time" style={{marginBottom:'30px'}} type="time"   /> </label>
//                                             <br/>
//                                             <label>
//                                             Reason/Details:
//                                             <br/>
//                                             <textarea id="Detail" placeholder="Type here..."  />       </label>
//                                             <br/>
//                                             <input style={{marginTop:'30px', backgroundColor:'rgb(0,0,0,0.8)' }} type="submit" className="btn btn-dark" value="Submit"/>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className='triple-column'>
//                         <div className="card" style={{marginLeft:'5px', height:'100%'}} >
//                             <div className="card-body" >
//                                 <div>
//                                     <input className='searchBar' type='text' placeholder='Search...' /*onChange={event=>{setSearchTerm(event.target.value)}}*//>
//                                 </div>                               
//                                 <RequestCard clickableCard={false} requestDate={()=>this.getCurrentDate('/')} runningTime={4} campaignButton='Pause Campaign' editButton='1' requestedAmount={2000} collectedAmount={1200} donersParticipated={2} remainingAmount={2000-1200} remainingHours={6} activeStatus="Active" deleteButton='1'/>
//                                 <RequestCard clickableCard={false} requestDate={()=>this.getCurrentDate('/')} runningTime={6} campaignButton='Pause Campaign' editButton='1' requestedAmount={5000} collectedAmount={1000} donersParticipated={2} remainingAmount={5000-1000} remainingHours={11} activeStatus="Active" deleteButton='1'/>
//                                 <RequestCard clickableCard={false} requestDate={()=>this.getCurrentDate('/')} runningTime={2} campaignButton='Start Campaign' editButton='1' requestedAmount={10000} collectedAmount={4000} donersParticipated={3} remainingAmount={10000-4000} remainingHours={28} deleteButton='1'/>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//       );
//     }
//   }

export default CreateRequest;
