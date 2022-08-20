import React,{useState,useEffect} from 'react';
import { Modal,Button } from 'react-bootstrap';
import Header from './../../components/Header';
import './../../components/constants/style.css';
import { Table } from 'react-bootstrap';
import RequestCard from '../../components/cards/RequestCard';
import axios from 'axios';
import { SERVER_NAME } from "../../components/config/config";
import { auth } from '../../components/firebase/config';
import PuffLoader from "react-spinners/PuffLoader";
import { ref,get,child, getDatabase } from 'firebase/database';
import imageNames from '../../components/constants/imageNames';
import { getDownloadURL,getStorage, ref as refStorage } from 'firebase/storage';
import { Easypaisa } from '../easypaisa/Easypaisa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faSync } from '@fortawesome/free-solid-svg-icons';

const Approval=(props)=>{
    const [userId, setUserId] = useState('i0f6slKPycPUIDvdp2LPcIakXFU2');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [requests, setRequests] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [withdraws, setWithdraws] = useState([]);
    const [approvedProfiles, setApprovedProfiles] = useState([]);
    const [ApprovedRequests, setApprovedRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState({});
    const [selectedProfile, setSelectedProfile] = useState({});
    const [imageURLs, setImageURLs] = useState({});
    const [updateScreen, setUpdateScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [masterRequests, setMasterRequests] = useState([]);
    const [masterProfiles, setMasterProfiles] = useState([]);
    const [masterWithdraws, setMasterWithdraws] = useState([]);
    
    const [filter, setFilter] = useState("requests");

    const handleProfileModalClose = () => setShowProfileModal(false);
    const handleProfileModalShow = () => setShowProfileModal(true);
    const handleRequestModalClose = () => setShowRequestModal(false);
    const handleRequestModalShow = () => setShowRequestModal(true);

    const showProfileDetail=(request)=>{
        if(!request){
            return;
        }
        setShowLoader(true);
        setSelectedProfile({});
        //getting student form data for profile
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const data={
                headers:{authorization:currentTokken}
            }
            //Custome alert box with data
            axios.post(SERVER_NAME+'/profile/data',{userId:request.uid},data)
            .then((res)=>{
                console.log(res.data)
                setShowLoader(false);
                const restData=res.data;
                setSelectedProfile(prev=>({...prev,restData}));
                console.log(selectedProfile)
                handleProfileModalShow();
            }).catch(err=>{
                setShowLoader(false)
            })
            setShowLoader(true);
            //getting full name for profile
            const dbRef = ref(getDatabase());
            get(child(dbRef, 'profileData/'+request.uid))
            .then((snapshot) => {
                if (snapshot.exists()) {

                    setSelectedProfile(prev=>({...prev,FullName:snapshot.val().fullName}));
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

            //download images////////////////////////////////////////////////////
            imageNames.forEach(imageName=>{
                const storageRef =  refStorage(getStorage(), request.uid+'/images/'+imageName+'.jpg');
                getDownloadURL(storageRef)
                .then(url=>{
                    setImageURLs(prev=>({...prev,[imageName]:url}))
                }).catch(err=>console.log(err))
            })

        /////////////////////////////////////////////////////////////////////////////////


        }).catch(err=>{
        })
        console.log(selectedProfile)
    }

    const showRequestDetails=(request)=>{
        if(!request){
            return;
        }
        setSelectedRequest(request);
        handleRequestModalShow(); 
    }

    const callWithdrawAPI=(body)=>{
        axios.post(SERVER_NAME+"/create-withdraw-session",body,{headers: {"Content-Type": "application/json"}})
        .then(res=>{
            if(res.data){
                console.log(res.data)
                window.open(res.data.url, "_blank");
            }
        }).catch(err=>{
             console.log(err)
        })
    }

    const handleApprove=(request)=>{
        switch (filter) {
            case "requests":
                if(window.confirm('Are you sure you want to APPROVE this request?\nYou cannot revert it once you approve.')){
                    auth.currentUser.getIdToken()
                    .then(currentTokken=>{
                        const data={
                            headers:{
                                authorization:currentTokken,
                                docId:request.docId
                            }
                        }
                        console.log('headers--->',data)
                        axios.post(SERVER_NAME+'/requests/pending/approve',request,data)
                        .then(res=>{
                            console.log(res.data);
                        }).catch(err=>{
        
                        })                
                    }).catch(err=>{
                    })
                }
            break;
            case "profiles":
                if(window.confirm('Are you sure you want to APPROVE this profile?\nYou cannot revert it once you approve.')){
                    auth.currentUser.getIdToken()
                    .then(currentTokken=>{
                        const data={
                            headers:{authorization:currentTokken}
                        }
                        axios.post(SERVER_NAME+'/profile/approve',{userId:request.uid},data)
                        .then(res=>{
                            console.log(res.data);
                        }).catch(err=>{
        
                        })                
                    }).catch(err=>{
                    })
                }
            break;
            case "withdraws":
                if(window.confirm('Are you sure you want to APPROVE this Withdrwa?\nYou cannot revert it once you approve.')){
                    if(!request.stripeKey || !request.uid || !request.Amount || !request.RequestTitle || !request.DeadlineDay || !request.created_at || !request.docId){
                        alert('There is some problem with this Request! \nContact the developers.')
                        return;
                    }
                    auth.currentUser.getIdToken()
                    .then(currentTokken=>{
                        const data={
                            headers:{authorization:currentTokken}
                        }
                        //get withdraw request data
                        const body={
                            stripeKey:request.stripeKey,
                            Amount:request.Amount,
                            uid:request.uid,
                            RequestTitle:request.RequestTitle,
                            DeadlineDay:request.DeadlineDay,
                            created_at:request.created_at,
                            docId:request.docId
                        }

                        ///// Call Withdraw API with that data
                        callWithdrawAPI(body);                
                    }).catch(err=>{
                    })
                }
            break;
            default:
                break;
        }
    }

    const handleReject=(request)=>{
        switch (filter) {
            case "requests":
                if(window.confirm('Are you sure you want to REJECT this request?\nYou cannot revert it once you reject.')){
                    auth.currentUser.getIdToken()
                    .then(currentTokken=>{
                        const data={
                            headers:{
                                authorization:currentTokken,
                                docId:request.docId
                            }
                        }
                        axios.post(SERVER_NAME+'/requests/pending/reject',request,data)
                        .then(res=>{
                            console.log(res.data);
                            setUpdateScreen(prev=>!prev);
                        }).catch(err=>{
        
                        })                
                    }).catch(err=>{
                    })
                }
            break;
            case "profiles":
                if(window.confirm('Are you sure you want to REJECT this request?\nYou cannot revert it once you reject.')){
                    auth.currentUser.getIdToken()
                    .then(currentTokken=>{
                        const data={
                            headers:{authorization:currentTokken}
                        }
                        axios.post(SERVER_NAME+'/profile/reject',{userId:request.uid},data)
                        .then(res=>{
                            console.log(res.data);
                            setUpdateScreen(prev=>!prev);
                        }).catch(err=>{
        
                        })                
                    }).catch(err=>{
                    })
                }
            break;
            case "withdraws":
                if(window.confirm('Are you sure you want to REJECT this Withdraw request?\nYou cannot revert it once you reject.')){
                    auth.currentUser.getIdToken()
                    .then(currentTokken=>{
                        const data={
                            headers:{authorization:currentTokken}
                        }
                        axios.post(SERVER_NAME+'/withdraws/reject',request,data)
                        .then(res=>{
                            console.log(res.data);
                            setUpdateScreen(prev=>!prev);
                        }).catch(err=>{
        
                        })                
                    }).catch(err=>{
                    })
                }
            break;
            default:
                break;
        }
        
    }

    //Loading pending requests
    useEffect(() => {
        setShowLoader(true);
      //get data for all approvals
      //pending requests
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const data={
                headers:{
                    authorization:currentTokken
                }
            }
            axios.get(SERVER_NAME+'/requests/pending',data)
            .then((snap)=>{
                if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                snap.data.forEach(element => {
                    tempArray.push(element)
                    console.log('element--->',element)
                });
                //console.log(tempArray)
                setRequests(tempArray);
                setMasterRequests(tempArray)
                setShowLoader(false);
            }).catch((err)=>{
                    //Show a polite error alert
                    //get error message from err.message
                    setShowLoader(false)
            });

        }).catch(err=>{
            console.log(err);
            setShowLoader(false)
        })

    }, [updateScreen])

    //Loading unapproved student profiles
    useEffect(() => {
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const data={
                headers:{
                    authorization:currentTokken
                }
            }
          //pending profile approvals
          axios.get(SERVER_NAME+'/profile/unapproved',data)
          .then(snap=>{
              if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                if(snap.data.length>1){
                    for(let data in snap.data){
                        //Remaining field values
                        let profileObject=snap.data[data];
                        const dbRef = ref(getDatabase());
                        get(child(dbRef, 'profileData/'+profileObject.uid))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                profileObject={...profileObject,FullName:snapshot.val().fullName}; 
                                //Push in temporary array
                                tempArray.push(profileObject);
                            } else {
                                console.log("No data available");
                            }
                        }).catch((error) =>console.error(error));
                    }
                    setProfiles(tempArray);
                    setMasterProfiles(tempArray)
                    
                }else{
                    const dbRef = ref(getDatabase());
                    let profileObject=snap.data[0];
                    get(child(dbRef, 'profileData/'+profileObject.uid))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            profileObject={...profileObject,FullName:snapshot.val().fullName}; 
                            let temp=[]
                            temp.push(profileObject);
                            //Push in temporary array
                            setProfiles(temp);
                        } else {
                            console.log("No data available");
                        }
                    });
                }
          }).catch(err=>console.log(err));
        })
    }, [updateScreen])

    //Loading unapproved student withdraw requests
    useEffect(() => {
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const data={
                headers:{
                    authorization:currentTokken
                }
            }
          //pending profile approvals
          axios.get(SERVER_NAME+'/withdraws/unapproved',data)
          .then(snap=>{
              if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                console.log(snap.data);
                if(snap.data.length>1){
                    for(let data in snap.data){
                        //Remaining field values
                        
                        let withdrawObject=snap.data[data];
                        const dbRef = ref(getDatabase());
                        get(child(dbRef, 'profileData/'+withdrawObject.uid))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                withdrawObject={...withdrawObject,FullName:snapshot.val().fullName}; 
                                //Push in temporary array
                                tempArray.push(withdrawObject);
                            } else {
                                console.log("No data available");
                            }
                        }).catch((error) =>console.error(error));
                    }
                    setWithdraws(tempArray);
                    setMasterWithdraws(tempArray)
                }else{
                    const dbRef = ref(getDatabase());
                    let withdrawObject=snap.data[0];
                    get(child(dbRef, 'profileData/'+withdrawObject.uid))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            withdrawObject={...withdrawObject,FullName:snapshot.val().fullName}; 
                            let temp=[]
                            temp.push(withdrawObject);
                            //Push in temporary array
                            setWithdraws(temp);
                        } else {
                            console.log("No data available");
                        }
                    });
                }
          }).catch(err=>console.log(err));
        })
    }, [updateScreen])
    ///////////////////////////////////
    //Loading approved data
    //Loading approved requests
    useEffect(() => {
        setShowLoader(true);
      //get data for all approvals
      //pending requests
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const data={
                headers:{
                    authorization:currentTokken
                }
            }
            axios.get(SERVER_NAME+'/requests/approved',data)
            .then((snap)=>{
                if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                for(let index=0;index<snap.data.length;index++){
                    if(snap.data[index]){
                        for(let data in snap.data[index]){
                            //Remaining field values
                            let requestObject=snap.data[index][data];
                            
                            requestObject={...requestObject};
                            Object.keys(requestObject).forEach(key=>{
                                //Push in temporary array
                                tempArray.push(requestObject[key]);
                            })
                        }
                    }
                }
                //
                //console.log(tempArray)
                
                setApprovedRequests(tempArray);
                //setShowLoader(false);
            }).catch((err)=>{
                    //Show a polite error alert
                    //get error message from err.message
                    setShowLoader(false)
            });
        }).catch(err=>{
            console.log(err);
            setShowLoader(false)
        })

    }, [updateScreen])

    //Loading approved student profiles
    useEffect(() => {
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const data={
                headers:{
                    authorization:currentTokken
                }
            }
          //approved profiles
          axios.get(SERVER_NAME+'/profile/approved',data)
          .then(snap=>{
              if(snap.data.length===0){
                  return;
              }
              if(snap.data.errorMessage){
                    alert(snap.data.errorMessage);
                    return;
                }
                //snap is the received data from server
                var tempArray=[]
                if(snap.data.length>1){
                    for(let data in snap.data){
                        //Remaining field values
                        let profileObject=snap.data[data];
                        const dbRef = ref(getDatabase());
                        get(child(dbRef, 'profileData/'+profileObject.uid))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                profileObject={...profileObject,FullName:snapshot.val().fullName}; 
                                //Push in temporary array
                                tempArray.push(profileObject);
                            } else {
                                console.log("No data available");
                            }
                        }).catch((error) =>console.error(error));
                    }
                    setApprovedProfiles(tempArray);
                    
                }else{
                    const dbRef = ref(getDatabase());
                    let profileObject=snap.data[0];
                    get(child(dbRef, 'profileData/'+profileObject.uid))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            profileObject={...profileObject,FullName:snapshot.val().fullName}; 
                            let temp=[]
                            temp.push(profileObject);
                            //Push in temporary array
                            setApprovedProfiles(temp);
                        } else {
                            console.log("No data available");
                        }
                    });
                }
          }).catch(err=>console.log(err));
        })
    }, [updateScreen])

    //////////////////////////////
    const onFilterChange=(e)=>{
        setFilter(e.target.value);
    }

    useEffect(() => {
        if(searchTerm === ''){
            var tempArray=[]
            setRequests(masterRequests.map(request=>{
                return request
            }));
            setProfiles(masterProfiles.map(profile=>{
                return profile
            }));
            setRequests(masterRequests.map(withdraw=>{
                return withdraw
            }));
            return;
        }
        if(filter==='requests'){
            var tempArray=[]
            masterRequests.forEach((request,i)=>{
                if(request.RequestTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.created_at?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.RequestAmount?.toLowerCase().includes(searchTerm.toLowerCase())
                ){
                    tempArray.push(request);
                }
            } );
            setRequests(tempArray);
        } else if(filter==='profiles'){
            var tempArray=[]
            masterProfiles.forEach((profile,i)=>{
                if(profile.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.created_at?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.employementStatus?.toLowerCase().includes(searchTerm.toLowerCase())
                ){
                    tempArray.push(profile);
                }
            } );
            setProfiles(tempArray);
        } else if(filter==='withdraws'){
            var tempArray=[]
            masterWithdraws.forEach((withdraw,i)=>{
                if(withdraw.RequestTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                withdraw.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                withdraw.created_at?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                withdraw.Amount?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                ){
                    tempArray.push(withdraw);
                }
            } );
            setWithdraws(tempArray);
        }
        
        // if(searchTerm === ''){
        //     var tempArray=[]
        //     setCreateRequestWithData(masterRequests.map((request,i)=>{
        //         return <RequestCard key={i} users={request}/>
        //     }))
        //     return;
        // }
        // var tempArray = [];
        // masterRequests.forEach((request,i)=>{
        //     if(request.RequestTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //         request.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //         request.created_at?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        //         request.RequestAmount?.toLowerCase().includes(searchTerm.toLowerCase())
        //     ){
        //         tempArray.push(<RequestCard key={i} users={request}/>);
        //     }
        // } );
        // setCreateRequestWithData(tempArray);
    }, [searchTerm])

    return (
        <div>
            <div className='some-page-wrapper'>
                <div className='row'>
                    <div className='column'>
                        <div className="card item-align-center" >
                            <div className="card-body">
                                <h3 className="text-secondary">Filter</h3>
                                <div onChange={onFilterChange}>
                                    <input type="radio" value="requests" name="filter" checked={filter==="requests"} /> Campaigns
                                    <br/>
                                    <input type="radio" value="profiles" name="filter" checked={filter==="profiles"} /> Profiles
                                    <br/>
                                    <input type="radio" value="withdraws" name="filter" checked={filter==="withdraws"}/> Withdraws
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='triple-column'>
                        <div className="card" style={{marginLeft:'5px', height:'100%'}} >
                            <div className="card-body" >
                                <div>
                                    <input className='searchBar' type='text' placeholder='Search...' onChange={event=>{setSearchTerm(event.target.value)}}/>
                                    <FontAwesomeIcon icon={faSync} style={{marginLeft:'65%', cursor:'pointer'}} onClick={()=>setUpdateScreen(prev=>!prev)}/>
                                </div>
                                <br/>
                                <div>
                                    {showLoader &&
                                        <div style={{ marginLeft:'45%'}}>
                                            <PuffLoader size={100}/>
                                        </div>
                                    }
                                    {(filter==="requests" && requests) &&
                                        <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Amount</th>
                                                <th>Detail</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {   
                                                requests.length===0 &&
                                                <div style={{marginLeft:'30%', marginTop:'10%'}}>
                                                    <h4>No Campaign Approvals</h4>
                                                </div>
                                            }
                                            {requests.length>1 &&
                                                requests.map((request,index)=> {
                                                    return (
                                                        <tr key={index}>
                                                            <td>Rs {request.RequestAmount}/-</td>
                                                            <td style={{cursor:'pointer'}} onClick={()=>showRequestDetails(request)}>{request.RequestTitle}</td>
                                                            <td>
                                                                <button className="btn btn-success" onClick={()=>handleApprove(request)} type="button" value="Approve">Approve</button>
                                                                {' '}
                                                                <button className="btn btn-danger" onClick={()=>handleReject(request)} type="button" value="Reject">Reject</button>
                                                                {' '}
                                                                <button className="btn btn-secondary" onClick={approvedProfiles?()=>showProfileDetail(approvedProfiles.findIndex(p=>p.uid===request.uid)===-1?null:request):null} type="button" value="Profile">Profile</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            {requests.length===1 &&
                                                <tr>
                                                <td>{requests[0].RequestAmount}</td>
                                                <td>{requests[0].RequestTitle}</td>
                                                <td>
                                                    <button className="btn btn-success" onClick={()=>handleApprove(requests[0])} type="button" value="Approve">Approve</button>
                                                    {' '}
                                                    <button className="btn btn-danger" onClick={()=>handleReject(requests[0])} type="button" value="Reject">Reject</button>
                                                    {' '}
                                                    <button className="btn btn-secondary" onClick={()=>showProfileDetail(requests[0])} type="button" value="Profile">Profile</button>
                                                </td>
                                                </tr>
                                            } 
                                        </tbody>
                                        </Table>
                                    }
                                    {(filter==="profiles" && profiles) &&
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Creation (Time@Date)</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {   
                                                    profiles.length===0 &&
                                                    <div style={{marginLeft:'30%', marginTop:'10%'}}>
                                                        <h4>No Profile Approvals</h4>
                                                    </div>
                                                }
                                                {profiles.length>1 &&
                                                    profiles.map((profile,index)=> {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{profile.FullName}</td>
                                                                <td>{profile.created_at}</td>
                                                                <td>
                                                                    <button className="btn btn-success" onClick={()=>handleApprove(profile)} type="button" value="Approve">Approve</button>
                                                                    {' '}
                                                                    <button className="btn btn-danger" onClick={()=>handleReject(profile)} type="button" value="Reject">Reject</button>
                                                                    {' '}
                                                                    <button className="btn btn-secondary" onClick={()=>showProfileDetail(profile)} type="button" value="Profile">Profile</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                {profiles.length===1 &&
                                                    <tr>
                                                    <td>{profiles[0].FullName}</td>
                                                    <td>{profiles[0].created_at}</td>
                                                    <td>
                                                        <button className="btn btn-success" onClick={()=>handleApprove(profiles[0])} type="button" value="Approve">Approve</button>
                                                        {' '}
                                                        <button className="btn btn-danger" onClick={()=>handleReject(profiles[0])} type="button" value="Reject">Reject</button>
                                                        {' '}
                                                        <button className="btn btn-secondary" onClick={()=>showProfileDetail(profiles[0])} type="button" value="Profile">Profile</button>
                                                    </td>
                                                    </tr>
                                                }
                                                    
                                            </tbody>
                                        </Table>
                                    }
                                    {(filter==="withdraws" && withdraws) &&
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Amount</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {withdraws.length>1 &&
                                                    withdraws.map((withdraw,index)=> {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{withdraw.FullName}</td>
                                                                <td style={{cursor:'pointer'}} onClick={ApprovedRequests && (()=>showRequestDetails(ApprovedRequests.findIndex(r=>r.RequestTitle===withdraw.RequestTitle)===-1?null:ApprovedRequests[ApprovedRequests.findIndex(r=>r.RequestTitle===withdraw.RequestTitle)])) }>Rs {withdraw.Amount}/-</td>
                                                                <td>
                                                                    <button className="btn btn-success" onClick={()=>handleApprove(withdraw)} type="button" value="Approve">Approve</button>
                                                                    {' '}
                                                                    <button className="btn btn-danger" onClick={()=>handleReject(withdraw)} type="button" value="Reject">Reject</button>
                                                                    {' '}
                                                                    <button className="btn btn-secondary" onClick={approvedProfiles && (()=>showProfileDetail(approvedProfiles.findIndex(profile=>profile.uid===withdraw.uid)===-1?null:approvedProfiles[approvedProfiles.findIndex(profile=>profile.uid===withdraw.uid)]))} type="button" value="Profile">Profile</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                {withdraws.length===1 &&
                                                    <tr>
                                                        <td>{withdraws[0].FullName}</td>
                                                        <td style={{cursor:'pointer'}} onClick={ApprovedRequests && (()=>showRequestDetails(ApprovedRequests.findIndex(r=>r.RequestTitle===withdraws[0].RequestTitle)===-1?null:ApprovedRequests[ApprovedRequests.findIndex(r=>r.RequestTitle===withdraws[0].RequestTitle)])) }>Rs {withdraws[0].Amount}/-</td>
                                                        <td>
                                                            <button className="btn btn-success" onClick={()=>handleApprove(withdraws[0])} type="button" value="Approve">Approve</button>
                                                            {' '}
                                                            <button className="btn btn-danger" onClick={()=>handleReject(withdraws[0])} type="button" value="Reject">Reject</button>
                                                            {' '}
                                                            <button className="btn btn-secondary" onClick={approvedProfiles && (()=>showProfileDetail(approvedProfiles.findIndex(profile=>profile.uid===withdraws[0].uid)===-1?null:approvedProfiles[approvedProfiles.findIndex(profile=>profile.uid===withdraws[0].uid)]))} type="button" value="Profile">Profile</button>
                                                        </td>
                                                    </tr>
                                                }
                                                {
                                                    withdraws.length===0 &&
                                                    <div style={{marginLeft:'30%', marginTop:'10%'}}>
                                                        <h4>No Withdraw Request</h4>
                                                    </div>
                                                }
                                                    
                                            </tbody>
                                        </Table>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Profile Data */}
            <Modal show={showProfileModal} onHide={handleProfileModalClose} size='lg' aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{selectedProfile.FullName}</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                {selectedProfile.restData?
                    <div>
                        <h2>Personal</h2>
                        <p><b>Date of Birth:</b> {selectedProfile.restData.dateOfBirth}</p>
                        <p><b>Gender:</b> {selectedProfile.restData.gender}</p>
                        <p><b>Employment Status: </b>{selectedProfile.restData.employementStatus}</p>
                        <label>NIC front<br/><img onClick={()=>window.open(imageURLs.nicPassportFront, "_blank")} src={imageURLs.nicPassportFront} style={{cursor:'pointer', maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label>NIC back<br/><img onClick={()=>window.open(imageURLs.nicPassportBack, "_blank")} src={imageURLs.nicPassportBack } style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/><br/>
                        <h2>Education</h2>
                        <p><b>Current Institute Name:</b> {selectedProfile.restData.instituteName}</p>
                        <p><b>Current Class/Level:</b> {selectedProfile.restData.currentClass}</p>
                        <p><b>Recent Grade:</b> {selectedProfile.restData.recentGrade}</p>
                        <p><b>School fee per month:</b> {selectedProfile.restData.schoolFeePerMonth}</p>
                        <p><b>Current fee Concession: </b>{selectedProfile.restData.feeConcessions}</p>
                        <label>institution Affiliation Proof Document<br/><img onClick={()=>window.open(imageURLs.institutionAffiliationDocument, "_blank")} src={imageURLs.institutionAffiliationDocument } style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label>Grades Proof Document / Result Card / Transcript<br/><img onClick={()=>window.open(imageURLs.gradeProofDocument, "_blank")} src={imageURLs.gradeProofDocument} style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label>Paid School fee Receipt (concessions mentioned)<br/><img onClick={()=>window.open(imageURLs.paidSchoolFeeReceipt, "_blank")} src={imageURLs.paidSchoolFeeReceipt} style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/><br/>
                        <h2>Finance</h2>
                        <p><b>Guardian Name:</b> {selectedProfile.restData.guardianName}</p>
                        <p><b>Guardian Contact#:</b> {selectedProfile.restData.cellPhoneGuardian}</p>
                        <p><b>House Ownership Status:</b> {selectedProfile.restData.houseOwnership}</p>
                        <p><b>Total Family Income:</b> {selectedProfile.restData.totalFamilyIncome}</p>
                        <label>Income Proof Document<br/><img onClick={()=>window.open(imageURLs.incomeDocumentProof, "_blank")} src={imageURLs.incomeDocumentProof } style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label>House Ownership/Rented proof Document<br/><img onClick={()=>window.open(imageURLs.houseOwnershipRentedProof, "_blank")} src={imageURLs.houseOwnershipRentedProof } style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label>Last 3 month Electricity bills<br/><img onClick={()=>window.open(imageURLs.electricityBill01, "_blank")} src={imageURLs.electricityBill01} style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label><br/><img onClick={()=>window.open(imageURLs.electricityBill02, "_blank")} src={imageURLs.electricityBill02} style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label><br/><img onClick={()=>window.open(imageURLs.electricityBill03, "_blank")} src={imageURLs.electricityBill03 } style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label>Last 3 month Gas bills<br/><img onClick={()=>window.open(imageURLs.gassBill01, "_blank")} src={imageURLs.gassBill01} style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label><br/><img onClick={()=>window.open(imageURLs.gassBill02, "_blank")} src={imageURLs.gassBill02 } style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label><br/><img onClick={()=>window.open(imageURLs.gassBill03, "_blank")} src={imageURLs.gassBill03 } style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label>Last 3 month Telephone bills<br/><img onClick={()=>window.open(imageURLs.telephoneBill01, "_blank")} src={imageURLs.telephoneBill01} style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label><br/><img onClick={()=>window.open(imageURLs.telephoneBill01, "_blank")} src={imageURLs.telephoneBill01 } style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/>
                        <label><br/><img onClick={()=>window.open(imageURLs.telephoneBill01, "_blank")} src={imageURLs.telephoneBill01 } style={{cursor:'pointer',maxHeight:'300px', maxWidth:'300px'}} alt='np'/></label>
                        <br/><br/>
                        <h2>Family</h2>
                        <p><b>Family Head Name(Relation): </b>{selectedProfile.restData.familyHeadName}({selectedProfile.restData.familyHeadRelation})</p>
                        <p><b>No. of Family Members:</b> {selectedProfile.restData.totalFamilyMembers}</p>
                        <p><b>No. of Employed Family Members:</b> {selectedProfile.restData.employedMembers}</p>
                        <p><b>No. of Sibling Studying: </b>{selectedProfile.restData.siblingsStudying}</p>
                        <p><b>Total Family Education Expenditure: </b>{selectedProfile.restData.totalEducationExpenditure}</p>
                        <p><b>Total Family Expenditure including Education:</b> {selectedProfile.restData.totalFamilyExpenditure}</p>
                        <p><b>Additional Expenditures:</b> {selectedProfile.restData.additionalExpenditureTitles}</p>
                        <p><b>Additional Expenditures Details:</b> {selectedProfile.restData.additionalExpenditureDetail}</p>
                        <p><b>Additional Expenditure Amount: </b>{selectedProfile.restData.additionalExpenditureRupees}</p>
                        <h2>Bank</h2>
                        <p><b>Account Number:</b> {selectedProfile.restData.accountNumber}</p>
                        <p><b>Account Owner:</b> {selectedProfile.restData.accountOwner}</p>
                        <p><b>Associated Contact #: </b>{selectedProfile.restData.associatedContactNumber}</p>
                        <p><b>Bank Name:</b> {selectedProfile.restData.bankName}</p>
                        <p><b>Branch Code:</b> {selectedProfile.restData.branchCode}</p>
                            <br/><br/>
                            <p><b>Creation Time@Date:</b> {selectedProfile.restData.created_at}</p>
                            <p><b>Last Updated Time@Date: </b>{selectedProfile.restData.updated_at}</p>
                    </div>
                    :
                    <h2>No Data Available</h2>
                }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleProfileModalClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleProfileModalClose}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal Request Data */}
            <Modal show={showRequestModal} onHide={handleRequestModalClose}>
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
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleRequestModalClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleRequestModalClose}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
      );
}

  export default Approval;