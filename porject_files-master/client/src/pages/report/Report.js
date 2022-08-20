import React from 'react'
import { Table } from 'react-bootstrap';
import './../../components/constants/style.css';
import {useState,useEffect} from 'react';
import axios, { Axios } from 'axios';
import { auth } from '../../components/firebase/config';
import { SERVER_NAME } from '../../components/config/config';
import { ref,get,child, getDatabase } from 'firebase/database';
import { Modal,Button } from 'react-bootstrap';
import {Tab,Tabs} from 'react-bootstrap';
import { DateRange } from 'react-date-range';
import {CSVLink} from 'react-csv';
function Report() {

    //create hook for all request data
    const [requests, setRequests] = useState([]);
    const [activeRequests, setActiveRequests]= useState([]);
    const [cancelRequests,setCancelRequests]=useState([]);
    const [pauseRequests,setPauseRequests]=useState([]);
    const [fulfilledRequests,setFulfilledRequests]=useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [donations, setDonations] = useState([]);
    const [students, setStudents] = useState([]);
    const [donors, setDonors] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [withdraws, setWithdraws] = useState([]);
    const [filter, setFilter] = useState("requests");

    //master data
    const [masterRequests, setMasterRequests] = useState([]);
    const [masterActiveRequests, setMasterActiveRequests]= useState([]);
    const [masterCancelRequests,setMasterCancelRequests]=useState([]);
    const [masterPauseRequests,setMasterPauseRequests]=useState([]);
    const [masterFulfilledRequests,setMasterFulfilledRequests]=useState([]);
    const [masterRejectedRequests, setMasterRejectedRequests] = useState([]);
    const [masterDonations, setMasterDonations] = useState([]);
    const [masterStudents, setMasterStudents] = useState([]);
    const [masterDonors, setMasterDonors] = useState([]);
    const [masterAdmins, setMasterAdmins] = useState([]);
    const [masterWithdraws, setMasterWithdraws] = useState([]);

    const [showLoader, setShowLoader] = useState(false);
    const [showRequests, setShowRequests] = useState('');
    const [selectedProfile, setSelectedProfile] = useState({});
    const [showRequestModal,setShowRequestModal]=useState(false);
    const [showReportModal,setShowReportModal]=useState(false);
    const [selectedRequest, setSelectedRequest]=useState({})

    const [pickDate, setPickDate] = useState([
        {
          startDate: new Date(),
          endDate: null,
          key: 'selection'
        }
      ]);

    const showRequestModalHandler=(request)=>{
        setSelectedRequest(request);
        setShowRequestModal(true);
    }

    const closeRequestModalHandler=()=>{
        setShowRequestModal(false);
    }
    // const showReportModalhandler=()=>{setShowReportModal(true)}

    // const closeReportModalhandler=()=>{setShowReportModal(false)}

    useEffect(()=>{
        
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
            //getting requests data
            axios.get(SERVER_NAME+'/requests/pending',data)
            .then((snap)=>{
                if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                for(let data in snap.data){
                    //Remaining field values
                    tempArray.push(snap.data[data]);
                }
                //console.log(tempArray)
                setRequests(tempArray)
                setMasterRequests(tempArray)
                setShowLoader(false);
            }).catch((err)=>{
                    //Show a polite error alert
                    //get error message from err.message
                    setShowLoader(false)
            });

            axios.get(SERVER_NAME+'/requests/active',data)
            .then((snap)=>{
                if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                for(let data in snap.data){
                    //Remaining field values
                    tempArray.push(snap.data[data]);
                }
                //console.log(tempArray)
                setActiveRequests(tempArray);
                setMasterActiveRequests(tempArray)
                setShowLoader(false);
            }).catch((err)=>{
                    //Show a polite error alert
                    //get error message from err.message
                    setShowLoader(false)
            });

            axios.get(SERVER_NAME+'/requests/cancelled',data)
            .then((snap)=>{
                if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                for(let data in snap.data){
                    //Remaining field values
                    tempArray.push(snap.data[data]);
                }
                //console.log(tempArray)
                setCancelRequests(tempArray);
                setMasterCancelRequests(tempArray)
                setShowLoader(false);
            }).catch((err)=>{
                    //Show a polite error alert
                    //get error message from err.message
                    setShowLoader(false)
            });

            axios.get(SERVER_NAME+'/requests/fulfilled',data)
            .then((snap)=>{
                if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                for(let data in snap.data){
                    //Remaining field values
                    tempArray.push(snap.data[data]);
                }
                //console.log(tempArray)
                setFulfilledRequests(tempArray);
                setMasterFulfilledRequests(tempArray)
                setShowLoader(false);
            }).catch((err)=>{
                    //Show a polite error alert
                    //get error message from err.message
                    setShowLoader(false)
            });

            axios.get(SERVER_NAME+'/requests/rejected',data)
            .then((snap)=>{
                if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                console.log(snap.data)
                var tempArray=[]
                for(let data in snap.data){
                    //Remaining field values
                    tempArray.push(snap.data[data]);
                }
                //console.log(tempArray)
                setRejectedRequests(tempArray);
                setMasterRejectedRequests(tempArray)
                setShowLoader(false);
            }).catch((err)=>{
                    //Show a polite error alert
                    //get error message from err.message
                    setShowLoader(false)
            });

            axios.get(SERVER_NAME+'/requests/paused',data)
            .then((snap)=>{
                if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                for(let data in snap.data){
                    //Remaining field values
                    tempArray.push(snap.data[data]);
                }
                //console.log(tempArray)
                setPauseRequests(tempArray);
                setMasterPauseRequests(tempArray)
                setShowLoader(false);
            }).catch((err)=>{
                    //Show a polite error alert
                    //get error message from err.message
                    setShowLoader(false)
            });

            //getting donations data
            axios.get(SERVER_NAME+'/transactions/donation',data)
            .then((snap)=>{
                let tempDonations=[];
                    if(snap.errorMessage){
                        alert(snap.errorMessage);
                        return;
                    };
                    Object.keys(snap.data).forEach(key=>{
                        tempDonations.push(snap.data[key]);
                    });
                setDonations(tempDonations);
                setMasterDonations(tempDonations)
                }
            ).catch((err)=>{
                    //get error message from err.message
                    console.log(err.message)
                }
            );

            //getting user emails and names data
            axios.get(SERVER_NAME+'/users',data)
            .then((snap)=>{
                let tempUsers=[];
                    if(snap.errorMessage){
                        alert(snap.errorMessage);
                        return;
                    };
                    var tempStudents=[];
                    var tempDonors=[];
                    var tempAdmins=[];
                    Object.keys(snap.data).forEach(key=>{
                        switch (key) {
                            case 'student':
                                Object.keys(snap.data[key]).map(k=>{
                                    tempStudents.push(snap.data[key][k]);
                                })
                                
                            break;
                            case 'donor':
                                Object.keys(snap.data[key]).map(k=>{
                                    tempDonors.push(snap.data[key][k]);
                                })
                            break;
                            case 'admin':
                                Object.keys(snap.data[key]).map(k=>{
                                    tempAdmins.push(snap.data[key][k]);
                                })
                            break;
                            default:
                                break;
                        }
                    });
                    console.log('students-->',tempStudents);
                    console.log('donors-->',tempDonors);
                    console.log('admins-->',tempAdmins);

                    setStudents(tempStudents);
                    setMasterStudents(tempStudents)
                    setDonors(tempDonors);
                    setMasterDonors(tempDonors)
                    setAdmins(tempAdmins);
                    setMasterAdmins(tempAdmins)
                }
            ).catch((err)=>{
                    //get error message from err.message
                    console.log(err.message)
                }
            );

            //getting all withdraws
            axios.get(SERVER_NAME+'/withdraws',data)
            .then((snap)=>{
                console.log(snap.data)
                let tempWithdraws=[];
                    if(snap.errorMessage){
                        alert(snap.errorMessage);
                        return;
                    };
                    for(let data in snap.data){
                        
                        //Remaining field values
                        tempWithdraws.push({...snap.data[data],approved:snap.data[data].approved?'Approved':snap.data[data].rejected?'Rejected':'Pending'});
                    }
                    setWithdraws(tempWithdraws);
                    setMasterWithdraws(tempWithdraws)
                }
            ).catch((err)=>{
                    //get error message from err.message
                    console.log(err.message)
                }
            );
        }).catch((err)=>{
            console.log(err);
            setShowLoader(false)
        })
    },[]);

    const onFilterChange=(e)=>{
        setFilter(e.target.value);
    }

    const handleDateChange=(selection)=>{
        // compareDatesProcessing(masterRequests,setRequests);
        setRequests(masterRequests.filter(request=>{
            const date= request?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return request;
            }
        }));
        // compareDatesProcessing(masterActiveRequests,setActiveRequests);
        setActiveRequests(masterActiveRequests.filter(request=>{
            const date= request?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return request;
            }
        }));
        // compareDatesProcessing(masterCancelRequests,setCancelRequests);
        setCancelRequests(masterCancelRequests.filter(request=>{
            const date= request?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return request;
            }
        }));
        // compareDatesProcessing(masterPauseRequests,setPauseRequests);
        setPauseRequests(masterPauseRequests.filter(request=>{
            const date= request?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return request;
            }
        }));
        // compareDatesProcessing(masterFulfilledRequests,setFulfilledRequests);
        setFulfilledRequests(masterFulfilledRequests.filter(request=>{
            const date= request?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return request;
            }
        }));
        // compareDatesProcessing(masterRejectedRequests,setRejectedRequests);
        setRejectedRequests(masterRejectedRequests.filter(request=>{
            const date= request?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return request;
            }
        }));
        // compareDatesProcessing(masterDonations,setDonations);
        setDonations(masterDonations.filter(request=>{
            const date= request?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return request;
            }
        }));
        // compareDatesProcessing(masterStudents,setStudents);
        setStudents(masterStudents.filter(object=>{
            const date= object?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return object;
            }
        }));
        // compareDatesProcessing(masterDonors,setDonors);
        setDonors(masterDonors.filter(object=>{
            const date= object?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return object;
            }
        }));
        // compareDatesProcessing(masterAdmins,setAdmins);
        setAdmins(masterAdmins.filter(object=>{
            const date= object?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return object;
            }
        }));
        // compareDatesProcessing(masterWithdraws,setWithdraws);
        setWithdraws(masterWithdraws.filter(request=>{
            const date= request?.created_at?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(selection[0].startDate?.getTime() <= d?.getTime() &&
            selection[0].endDate?.getTime() >= d?.getTime()
            ){
                return request;
            }
        }));
    }
    
    const handleRemoveFilter=()=>{
        setRequests(masterRequests);
        setActiveRequests(masterActiveRequests);
        setCancelRequests(masterCancelRequests);
        setPauseRequests(masterPauseRequests);
        setFulfilledRequests(masterFulfilledRequests);
        setRejectedRequests(masterRejectedRequests);
        setDonations(masterDonations);
        setStudents(masterStudents);
        setDonors(masterDonors);
        setAdmins(masterAdmins);
        setWithdraws(masterWithdraws);
    }

    const getData=()=>{
        return [
            masterRequests,
            masterActiveRequests,
            masterPauseRequests,
            masterRejectedRequests,
            masterCancelRequests,
            masterFulfilledRequests,
            masterDonations,
            masterWithdraws,
            masterStudents,
            masterDonors,
            masterAdmins
        ]
    }
    const getHeaders=()=>{

    }

    return (
        <div>
            <div className='some-page-wrapper'>
                <div className='row'>
                    <div className='column'>
                        <div className="card" style={{marginLeft:'5px', height:'100%'}}>
                            <div className="d-flex flex-column text-center" >
                                <h3 className="text-secondary">Filter</h3>
                                <input type='button' value={`Remove Filter`} className='btn btn-dark' onClick={handleRemoveFilter}/>
                                <hr></hr>
                            </div>
                            <div className='card-body'>
                                <div onChange={onFilterChange}>
                                    <input type="radio" value="requests" name="filter" checked={filter==="requests"} /> Campaigns
                                    <br/>
                                    <input type="radio" value="donations" name="filter" checked={filter==="donations"} /> Donations
                                    <br/>
                                    <input type="radio" value="users" name="filter" checked={filter==="users"}/> Users
                                    <br/>
                                    <input type="radio" value="withdraws" name="filter" checked={filter==="withdraws"}/> Withdraws
                                </div>
                                <br/>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={item =>{
                                        setPickDate([item.selection])
                                        handleDateChange([item.selection])
                                    }}
                                    moveRangeOnFirstSelection={false}
                                    ranges={pickDate}
                                />
                                <CSVLink
                                     data={[
                                        {Type:"Pending Requests"},
                                       ...requests,
                                       {Type:"Active Requests"},
                                       ...activeRequests,
                                       {Type:"Paused Requests"},
                                       ...pauseRequests,
                                       {Type:"Rejected Requests"},
                                       ...rejectedRequests,
                                       {Type:"Cancelled Requests"},
                                       ...cancelRequests,
                                       {Type:"Fulfilled Requests"},
                                       ...fulfilledRequests,
                                       {Type:"Donations"},
                                       ...donations,
                                       {Type:"Withdraws"},
                                       ...withdraws,
                                       {Type:"Students"},
                                       ...students,
                                       {Type:"Donors"},
                                       ...donors,
                                       {Type:"Admins"},
                                       ...admins
                                   ]}
                                     filename={`Date_Range_Report.csv`}
                                     target="_blank"
                                     style={{ textDecoration: 'none', outline: 'none'}}
                                >
                                    <input type='button' className='btn btn-primary' value='Download Report for Selected Date'/>
                                </CSVLink>
                                <br/><br/>
                                <CSVLink
                                     data={[
                                         {Type:"Pending Requests"},
                                        ...masterRequests,
                                        {Type:"Active Requests"},
                                        ...masterActiveRequests,
                                        {Type:"Paused Requests"},
                                        ...masterPauseRequests,
                                        {Type:"Rejected Requests"},
                                        ...masterRejectedRequests,
                                        {Type:"Cancelled Requests"},
                                        ...masterCancelRequests,
                                        {Type:"Fulfilled Requests"},
                                        ...masterFulfilledRequests,
                                        {Type:"Donations"},
                                        ...masterDonations,
                                        {Type:"Withdraws"},
                                        ...masterWithdraws,
                                        {Type:"Students"},
                                        ...masterStudents,
                                        {Type:"Donors"},
                                        ...masterDonors,
                                        {Type:"Admins"},
                                        ...masterAdmins
                                    ]}
                                     filename={`Master_Report.csv`}
                                     target="_blank"
                                     style={{ textDecoration: 'none', outline: 'none'}}
                                >
                                    <input type='button' className='btn btn-dark' value='Download Master Report'/>
                                </CSVLink>
                            </div>
                        </div>
                    </div>

                    <div className='triple-column'>
                        <div className="card"  style={{marginLeft:'5px', height:'100%'}} >
                            <div >
                                <center>
                                    {filter=='requests' &&
                                        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3" >
                                            <Tab eventKey="home" title="Pending" >
                                            
                                                    <div className='card-body'>
                                                        <div class='requests'>
                                                            <Table striped bordered hover>
                                                                <thead>
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th>Name</th>
                                                                        <th>Detail</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                    requests.map((request,index) => {
                                                                        return (
                                                            
                                                                        <tr key={index} onClick={()=>{showRequestModalHandler(request)}}>
                                                            
                                                                            <td>{index+1}</td>
                                                                            <td>{request.FullName}</td>
                                                                            <td>{request.RequestTitle}</td> 
                                                                            
                                                                        </tr>
                                                                        )
                                                                    }) }        
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>

                                            </Tab>
                                            <Tab eventKey="active" title="Active">
                                                <div className='card-body'>
                                                    <div class='requests'>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Name</th>
                                                                    <th>Detail</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                activeRequests.map((request,index) => {
                                                                    return (
                                                            
                                                                        <tr key={index} onClick={()=>{showRequestModalHandler(request)}}>
                                                            
                                                                        <td>{index+1}</td>
                                                                        <td>{request.FullName}</td>
                                                                        <td>{request.RequestTitle}</td> 
                                                                        
                                                                        </tr>
                                                                    )
                                                                    }) }        
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>


                                            
                                            </Tab>
                                            <Tab eventKey="fulfilled" title="Fulfilled">
                                                <div className='card-body'>
                                                    <div class='requests'>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Name</th>
                                                                    <th>Detail</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                fulfilledRequests.map((request,index) => {
                                                                    return (
                                                            
                                                                        <tr key={index} onClick={()=>{showRequestModalHandler(request)}}>
                                                            
                                                                        <td>{index+1}</td>
                                                                        <td>{request.FullName}</td>
                                                                        <td>{request.RequestTitle}</td> 
                                                                        
                                                                        </tr>
                                                                    )
                                                                    }) }        
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>       
                                            </Tab>
                                            <Tab eventKey="paused" title="Paused">
                                                <div className='card-body'>
                                                    <div class='requests'>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Name</th>
                                                                    <th>Detail</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                pauseRequests.map((request,index) => {
                                                                    return (
                                                            
                                                                        <tr key={index} onClick={()=>{showRequestModalHandler(request)}}>
                                                            
                                                                        <td>{index+1}</td>
                                                                        <td>{request.FullName}</td>
                                                                        <td>{request.RequestTitle}</td> 
                                                                        
                                                                        </tr>
                                                                    )
                                                                    }) }        
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>       
                                            </Tab>
                                            <Tab eventKey="cancelled" title="Cancelled">
                                                <div className='card-body'>
                                                    <div class='requests'>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Name</th>
                                                                    <th>Detail</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                cancelRequests.map((request,index) => {
                                                                    return (
                                                            
                                                                        <tr key={index} onClick={()=>{showRequestModalHandler(request)}}>
                                                            
                                                                        <td>{index+1}</td>
                                                                        <td>{request.FullName}</td>
                                                                        <td>{request.RequestTitle}</td> 
                                                                        
                                                                        </tr>
                                                                    )
                                                                    }) }        
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>               
                                            </Tab>
                                            <Tab eventKey="rejected" title="Rejected">
                                                <div className='card-body'>
                                                    <div class='requests'>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Name</th>
                                                                    <th>Detail</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                rejectedRequests.map((request,index) => {
                                                                    return (
                                                                        <tr key={index} onClick={()=>{showRequestModalHandler(request)}}>
                                                                        <td>{index+1}</td>
                                                                        <td>{request.FullName}</td>
                                                                        <td>{request.RequestTitle}</td> 
                                                                        </tr>
                                                                    )
                                                                    }) }        
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>               
                                            </Tab>
                                        </Tabs>
                                    }
                                    {filter=='donations' &&
                                        <div className='card-body'>
                                            <div >
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>From</th>
                                                            <th>To</th>
                                                            <th>Amount</th>
                                                            <th>Time@Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {donations.map((donation,index) => {
                                                                return (
                                                                <tr key={index} onClick={()=>{showRequestModalHandler(donation)}}>
                                                                    <td>{index+1}</td>
                                                                    <td>{donation.from}</td>
                                                                    <td>{donation.to}</td> 
                                                                    <td>{donation.Amount}</td>
                                                                    <td>{donation.datetime}</td>
                                                                </tr>
                                                                )
                                                            }) 
                                                        }        
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    }
                                    {filter=='users' &&
                                        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3" >
                                            <Tab eventKey="home" title="Students" >
                                                    <div className='card-body'>
                                                        <div class='requests'>
                                                            <Table striped bordered hover>
                                                                <thead>
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Joining</th>
                                                                        <th>Last Login</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        students.map((student,index) => {
                                                                            return (
                                                                            <tr key={index}>
                                                                                <td>{index+1}</td>
                                                                                <td>{student.fullName}</td>
                                                                                <td>{student.email}</td>
                                                                                <td>{student.created_at}</td>
                                                                                <td>{student.last_login_at}</td> 
                                                                            </tr>
                                                                            )
                                                                        }) 
                                                                    }        
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div>

                                            </Tab>
                                            <Tab eventKey="donor" title="Donors">
                                                <div className='card-body'>
                                                    <div class='requests'>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Name</th>
                                                                    <th>Email</th>
                                                                    <th>Joining</th>
                                                                    <th>Last Login</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    donors.map((donor,index) => {
                                                                        return (
                                                                        <tr key={index}>
                                                                            <td>{index+1}</td>
                                                                            <td>{donor.fullName}</td>
                                                                            <td>{donor.email}</td> 
                                                                            <td>{donor.created_at}</td>
                                                                            <td>{donor.last_login_at}</td>
                                                                        </tr>
                                                                        )
                                                                    }) 
                                                                }         
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </Tab>
                                            <Tab eventKey="admin" title="Admins">
                                                <div className='card-body'>
                                                    <div class='requests'>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Name</th>
                                                                    <th>Email</th>
                                                                    <th>Joining</th>
                                                                    <th>Last Login</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    admins.map((admin,index) => {
                                                                        return (
                                                                        <tr key={index}>
                                                                            <td>{index+1}</td>
                                                                            <td>{admin.fullName}</td>
                                                                            <td>{admin.email}</td> 
                                                                            <td>{admin.created_at}</td>
                                                                            <td>{admin.last_login_at}</td>
                                                                        </tr>
                                                                        )
                                                                    }) 
                                                                }          
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>       
                                            </Tab>
                                        </Tabs>
                                    }
                                    {filter=='withdraws' &&
                                        <div className='card-body'>
                                            <div >
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Campaign Title</th>
                                                            <th>Amount</th>
                                                            <th>Creation</th>
                                                            <th>Status</th>
                                                            <th>Approved at</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {withdraws.map((withdraw,index) => {
                                                                return (
                                                                <tr key={index}>
                                                                    <td>{index+1}</td>
                                                                    <td>{withdraw.RequestTitle}</td>
                                                                    <td>{withdraw.Amount}</td> 
                                                                    <td>{withdraw.created_at}</td>
                                                                    <td>{withdraw.approved}</td>
                                                                    <td>{withdraw.approved_at}</td>
                                                                </tr>
                                                                )
                                                            }) 
                                                        }        
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    }
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Modal show={showRequestModal} onHide={closeRequestModalHandler}>
                <Modal.Header closeButton>
                <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p><b>Title: </b>{selectedRequest.RequestTitle}</p>
                        <p><b>Request Amount: </b>{selectedRequest.RequestAmount}</p>
                        <p><b>Collected Amount: </b>{selectedRequest.CollectedAmount}</p>
                        <p><b>Donors Participated: </b>{selectedRequest.DonorsParticipated}</p>
                        <p><b>Deadline Date: </b>{selectedRequest.DeadlineDay}</p>
                        <p><b>Deadline Time: </b>{selectedRequest.DeadlineTime}</p>
                        <p><b>Reason: </b>{selectedRequest.ReasonDetail}</p>
                        <p><b>Creation Time@Date: </b>{selectedRequest.created_at}</p>
                        <p><b>Last Updated: </b>{selectedRequest.updated_at}</p>
                        {selectedProfile.rejected_at!=null && <p><b>Rejected at: </b>{selectedRequest.rejected_at}</p>}
                        {selectedProfile.fulfilled_at!=null && <p><b>Fulfilled at: </b>{selectedRequest.fulfilled_at}</p>}
                        {selectedProfile.cancelled_at!=null && <p><b>Cancelled at: </b>{selectedRequest.cancelled_at}</p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeRequestModalHandler}>
                    Close
                </Button>
                <Button variant="primary" onClick={closeRequestModalHandler}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
            {/* <Modal show={showRequestModal} onHide={closeReportModalhandler}>
                <Modal.Header closeButton>
                <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>


                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeReportModalhandler}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleReportDownload}>
                    Download
                </Button>
                </Modal.Footer>
            </Modal> */}
        </div>
    )
   
}

export default Report
