import React,{useEffect,useState} from 'react';
import './../constants/style.css';
import ReactRoundedImage from "react-rounded-image";
import moment from 'moment';
import { Modal,Button } from 'react-bootstrap';
import { SERVER_NAME } from '../config/config';
import { auth } from '../firebase/config';
import axios from 'axios';
import PuffLoader from "react-spinners/PuffLoader";


const RequestCard=(props)=>{
    const [showLoader, setShowLoader] = useState(false);
    const [RemainingHours, setRemainingHours] = useState(0);
    const [RemainingDays, setRemainingDays] = useState(0);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showMakeDonationModal, setShowMakeDonationModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState({});
    const [donationAmount, setDonationAmount] = useState(0);
    const [donationErrorMessage, setDonationErrorMessage] = useState('')
    const [stripeKey, setStripeKey] = useState('');
    const [usd, setUsd] = useState(0);
    const [role, setRole] = useState('');

    const handleRequestModalClose = () => setShowRequestModal(false);
    const handleRequestModalShow = () => setShowRequestModal(true);
    const handleMakeDonationModalClose = () => setShowMakeDonationModal(false);
    const handleMakeDonationModalShow = () => setShowMakeDonationModal(true);
    const handleWithdrawModalClose = () => setShowWithdrawModal(false);
    const handleWithdrawModalShow = () => {
        pkrToUsd(props.users.CollectedAmount);
        setShowWithdrawModal(true)
    };

    const cardClickHandler=(requestData)=>{
        setSelectedRequest(requestData);
        handleRequestModalShow();
    }

    const pkrToUsd=async(amount)=>{
        const currency = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
        const cur = await currency.json();
        let fromRate = cur.rates.PKR;
        let toRate = cur.rates.USD;
        setUsd(parseInt(((toRate / fromRate) * parseInt(amount)).toFixed(2)));
    }

    useEffect(async() => {
        if(props.users){
            if(props.users.DeadlineDay && props.users.DeadlineTime){
                var today = new Date();
                var admission = moment(today, 'MM-DD-YYYY'); 
                var discharge = moment(props.users.DeadlineDay, 'YYYY-MM-DD');
                var hoursLeft = discharge.diff(admission, 'hours');
                var daysLeft = discharge.diff(admission, 'days');
                
                setRemainingHours(hoursLeft);
                setRemainingDays(daysLeft);
            }
        }
        try{
        const token = await auth.currentUser.getIdToken();
        let res=await axios.get(SERVER_NAME+'/users/role',{headers:{authorization:token}});
        return setRole(res.data.role);
        } catch(err){
            console.log(err);
        }        
    }, []);

    const handlePause=(request)=>{
        if(!request.docId){
            alert('There is some problem with this campaign!')
            return;
        }
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const config ={
                //tokken is assigned to authorization in headers
                headers:{
                    authorization:currentTokken
                }
            }
            const data={
                docId:request.docId,
            }
            axios.post(SERVER_NAME+'/student/pause_campaign',data,config)
            .then(res=>{
                alert('Campaign Paused Successfully!')
                console.log(res)
            }).catch(err=>{
                alert('Error: Cannot Pause the Campaign!')
                console.log(err)
            })
        }).catch(err=>console.log(err))
    }

    const handleResume=(request)=>{
        if(!request.docId){
            alert('There is some problem with this campaign!')
            return;
        }
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const config ={
                    //tokken is assigned to authorization in headers
                    headers:{
                        authorization:currentTokken
                    }
                }
                const data={
                    docId:request.docId,
                }
            axios.post(SERVER_NAME+'/student/resume_campaign',data,config)
            .then(res=>{
                alert('Campaign Resumed Successfully!')
                console.log(res)
            }).catch(err=>{
                alert('Unable to Resume Campaign!')
                console.log(err)
            })
        }).catch(err=>console.log(err))
    }

    const handleCancel=(request)=>{
        if(!request.docId){
            alert('There is some problem with this campaign!')
            return;
        }
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const config ={
                    //tokken is assigned to authorization in headers
                    headers:{
                        authorization:currentTokken
                    }
                }
                const data={
                    docId:request.docId,
                }
            axios.post(SERVER_NAME+'/student/cancel_campaign',data,config)
            .then(res=>{
                alert('Campaign Stopped!')
                console.log(res)
            }).catch(err=>{
                alert('Unable to Resume Campaign!')
                console.log(err)
            })
        }).catch(err=>console.log(err))
    }
    
    const handleDonationAmountChange=(e)=>{
        pkrToUsd(e.target.value);
        if(e.target.value> parseInt()){
            setDonationErrorMessage('Entered Amount > Requested Amount');
        }else{
            setDonationErrorMessage('');
        }
        setDonationAmount(e.target.value);
    }

    const handleStripeKeyChange=(e)=>{
        setStripeKey(e.target.value);
    }

    const handleWithdraw=(request)=>{
        setShowLoader(true)
        auth.currentUser.getIdToken()
        .then(currentTokken=>{
            const body={
                Amount:selectedRequest.CollectedAmount,
                uid:auth.currentUser.uid,
                RequestTitle:selectedRequest.RequestTitle,
                FullName:selectedRequest.FullName,
                DeadlineDay:selectedRequest.DeadlineDay,
                stripeKey:stripeKey,
                docId:selectedRequest.docId,
            }
            axios.post(SERVER_NAME+'/student/withdraws/create',body,{headers:{authorization:currentTokken}})
            .then(res=>{alert('Withdraw Request Sent Successfully.'); setShowLoader(false); handleWithdrawModalClose()})
            .catch(err=>{console.log(err); setShowLoader(false)})
        })
        
    }

    const callDonationAPI=()=>{
        setShowLoader(true);
        const body={
            amount:donationAmount,
            uid:auth.currentUser.uid,
            RequestTitle:selectedRequest.RequestTitle,
            DeadlineDay:selectedRequest.DeadlineDay,
            RequestUID:selectedRequest.uid,
            docId:selectedRequest.docId
        }
        axios.post(SERVER_NAME+"/create-donation-session",body,{headers: {"Content-Type": "application/json"}})
        .then(res=>{
            if(res.data){
                window.open(res.data.url, "_blank");
                setShowLoader(false)
                handleMakeDonationModalClose()
            }
        }).catch(err=>{
             setShowLoader(false);
             console.log(err)
        })
    }

    const handleDonation = ()=>{
        if(window.confirm('Sure to continue?')){
            callDonationAPI();
       }
        
    }

    const handleEdit = (request)=>{

    }

    return(
        <>
            {
                props.users?
                <div className='some-page-wrapper' style={props.users.clickableCard && {cursor:'pointer'}} onClick={props.users.clickableCard && (()=>cardClickHandler(props.users))}>
                    <div className='row rowbg'>
                        <p className="text-danger" style={{cursor:'pointer', float:'right',position:'absolute'}}><b>{props.users.DeleteButton?'X':''}</b></p>               
                        <div className='card-body' style={{height:'auto',textAlign:'center'}}>{props.users.RequestTitle?<h5 className="text-secondary">{props.users.RequestTitle}</h5>:<h5 className="text-secondary">No Request Title Provided</h5>}</div>      
                        {/* Colume 1 */}
                        <div className='column'>
                            <div className="subcard" style={{height:'auto',alignItems:'center',alignContent:'center'}} >    
                                <div className="card-body" >
                                    {props.users.profileImage?<ReactRoundedImage imageWidth="100" imageHeight="100" image={"https://bootdey.com/img/Content/avatar/avatar7.png"} />:''}
                                    {props.users.FullName?<h5 className="text-secondary">By <b>{props.users.FullName}</b></h5>:''}
                                    {props.users.created_at?<h6 className="text-secondary">Publish Time@Date {props.users.created_at}</h6>:''}
                                    {props.users.PauseButton?<button onClick={()=>handlePause(props.users)} className="btn btn-dark" style={{backgroundColor:'rgb(0,0,0,0.8)',marginTop:'10px'}}>Pause Campaign</button>:''}
                                    {props.users.ResumeButton?<button onClick={()=>handleResume(props.users)} className="btn btn-dark" style={{backgroundColor:'rgb(0,0,0,0.8)',marginTop:'10px',marginLeft:'5px'}}>Resume Campaign</button>:''}
                                    <br/>
                                    {props.users.WithdrawButton?<button onClick={()=>{setSelectedRequest(props.users); handleWithdrawModalShow()}} className="btn btn-dark" style={{backgroundColor:'rgb(0,0,0,0.8)',marginTop:'10px'}}>Withdraw</button>:''}
                                    <br/>
                                    {props.users.editButton?<button className="btn btn-dark" style={{backgroundColor:'rgb(0,0,0,0.8)', marginLeft:'10px'}} onClick={()=>props.setRequest(props.users)}>Edit</button>:''}
                                    {props.users.donateButton?<button disabled={RemainingHours<0} className="btn btn-dark" onClick={(e)=>{e.stopPropagation(); setSelectedRequest(props.users); handleMakeDonationModalShow()}} style={{backgroundColor:'rgb(0,0,0,0.8)', marginLeft:'10px'}}>Donate</button>:''}
                                </div>
                            </div>
                        </div>
                        {/* Colume 2 */}
                        <div className='column'>
                            <div className="subcard" style={{ height:'auto', width:'100%'}} >
                                <div className="card-body">
                                    {props.users.RequestAmount?<h6>Requested amount <p className="text-secondary mb-1">Rs <b>{props.users.RequestAmount}</b>/-</p></h6>:''}
                                    {props.users.CollectedAmount?<h6>Collected so far <p className="text-secondary mb-1">Rs<b> {props.users.CollectedAmount}</b>/-</p></h6>:<h6>Collected so far <p className="text-secondary mb-1">Rs<b>0</b>/-</p></h6>}
                                    {role === 'student' && props.users.WithdrawAmount?<h6>Total Withdraw <p className="text-secondary mb-1">Rs<b> {props.users.WithdrawAmount}</b>/-</p></h6>:''}
                                    {role === 'student' && props.users.last_withdraw_at?<h6>Last Withdraw <p className="text-secondary mb-1"><b> {props.users.last_withdraw_at}</b></p></h6>:''}
                                </div>
                            </div>
                        </div>
                        {/* Colume 3 */}
                        <div className='column'>
                            <div className="subcard" style={{height:'auto'}} >
                                <div className="card-body">
                                    {props.users.status?<p className="text-secondary mb-1">Status <b><span className="text-success">{props.users.status}</span></b></p>:<p className="text-secondary mb-1">Status <b><span className="text-danger">Inactive</span></b></p>}
                                    {props.users.RequestAmount?<p className="text-secondary mb-1">Rs <b className='text-dark'>{props.users.CollectedAmount?parseInt(props.users.RequestAmount)-parseInt(props.users.CollectedAmount):0}</b>/- Remaining</p>:''}
                                    {RemainingHours!=0?<p className="text-secondary mb-1"><b><span className="text-danger">{RemainingHours} Hours </span></b> Remaining</p>:<p className="text-secondary mb-1"><b><span className="text-danger">-- hours</span></b> Remaining</p>}
                                    {RemainingDays!=0?<p className="text-secondary mb-1"><b><span className="text-danger">{RemainingDays} Days </span></b> Remaining</p>:<p className="text-secondary mb-1"><b><span className="text-danger">-- days</span></b> Remaining</p>}
                                    {props.users.DonersParticipated?<p className="text-secondary mb-1"><b><span className="text-dark">{props.users.DonersParticipated}</span></b> Donation</p>:''}
                                    {props.users.CancelButton?<button onClick={()=>handleCancel(props.users)} className="btn btn-dark" style={{backgroundColor:'rgb(0,0,0,0.8)',marginTop:'10px'}}>Cancel</button>:''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className='some-page-wrapper' style={props.clickableCard &&{cursor:'pointer'}} onClick={props.clickableCard && (()=>cardClickHandler(props))}>
                    <div className='row rowbg' style={props.clickableCard?{cursor:'pointer'}:{}} onClick={props.clickableCard?()=>cardClickHandler(props):'#'}>
                        <p className="text-danger" style={{cursor:'pointer', float:'right',position:'absolute'}}><b>{props.deleteButton?'X':''}</b></p>
                        {/* Colume 1 */}
                        <div className='column'>
                            <div className="subcard" style={{height:'auto',alignItems:'center',alignContent:'center'}} >
                                <div className="card-body" >
                                    {props.profileImage?<ReactRoundedImage imageWidth="100" imageHeight="100" image={"https://bootdey.com/img/Content/avatar/avatar7.png"} />:''}
                                    {props.requesterName?<h5 className="text-secondary">{props.requesterName}</h5>:''}
                                    {props.requestDate?<h6 className="text-secondary">Publish Date {props.requestDate}</h6>:''}
                                    {props.runningTime?<h6 className="text-secondary">Running Time <b><span style={{color:'black'}}>{props.runningTime}</span></b> hours</h6>:''}
                                    {props.campaignButton?<button className="btn btn-dark" style={{backgroundColor:'rgb(0,0,0,0.8)'}}>{props.campaignButton}</button>:''}
                                    {props.editButton?<button className="btn btn-dark" style={{backgroundColor:'rgb(0,0,0,0.8)', marginLeft:'10px'}}>Edit</button>:''}
                                    {props.amount?<h6 className="mt-3" style={{marginLeft:'40px'}}>Amount<p className="text-secondary mb-1">Rs <b>{props.amount?props.amount:0}</b>/-</p></h6>:''}
                                    {props.donateButton?<button className="btn btn-dark" onClick={(e)=>{e.stopPropagation(); setSelectedRequest(props); handleMakeDonationModalShow()}} style={{backgroundColor:'rgb(0,0,0,0.8)', marginLeft:'10px'}}>Donate</button>:''}
                                </div>
                            </div>
                        </div>
                        {/* Colume 2 */}
                        <div className='column'>
                            <div className="subcard" style={{ height:'auto', width:'100%'}} >
                                <div className="card-body">
                                    {props.requestedAmount?<h6>Requested amount <p className="text-secondary mb-1">Rs <b>{props.requestedAmount}</b>/-</p></h6>:''}
                                    <br />
                                    {props.collectedAmount?<h6>Collected so far <p className="text-secondary mb-1">Rs<b> {props.collectedAmount}</b>/-</p></h6>:''}
                                    {props.status?<h6 className=" mb-1" style={{marginLeft:'60px'}}>Status: <b><span className="text-success">{props.status}</span></b></h6>:<p className="text-secondary mb-1">Status <b><span className="text-danger">Inactive</span></b></p>}  
                                    {props.WithdrawAmount?<h6>Total Withdraw <p className="text-secondary mb-1">Rs<b> {props.WithdrawAmount}</b>/-</p></h6>:''}
                                    {props.last_withdraw_at?<h6>Last Withdraw <p className="text-secondary mb-1"><b> {props.last_withdraw_at}</b>/-</p></h6>:''}               
                                </div>
                            </div>
                        </div>
                        {/* Colume 3 */}
                        <div className='column'>
                            <div className="subcard" style={{height:'auto'}} >
                                <div className="card-body">
                                    {props.status?'':props.activeStatus?<p className="text-secondary mb-1">Status <b><span className="text-success">{props.activeStatus}</span></b></p>:<p className="text-secondary mb-1">Status <b><span className="text-danger">Inactive</span></b></p>}
                                    {props.remainingAmount?<p className="text-secondary mb-1">Rs <b className='text-dark'>{props.remainingAmount}</b>/- Remaining</p>:''}
                                    {props.remainingHours?<p className="text-secondary mb-1"><b><span className="text-danger">{props.remainingHours} hours</span></b> Remaining</p>:''}
                                    {props.donersParticipated?<p className="text-secondary mb-1"><b><span className="text-dark">{props.donersParticipated}</span></b> Doners Participated</p>:''}
                                    {props.viewButton?<button className="btn btn-dark mt-3" style={{backgroundColor:'rgb(0,0,0,0.8)', marginLeft:'120px'}}>View</button>:''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
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
            {/* Modal Make Donation */}
            <Modal show={showMakeDonationModal} onHide={handleMakeDonationModalClose}>
                <Modal.Header closeButton>
                <Modal.Title>Donation Box</Modal.Title>
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
                    <label><b>Enter Donation Amount</b></label>
                    <p style={{color:'orange'}}>Please enter the amount between ($2 - PKR 181800000).</p>
                    <input className='form-control' type='number' placeholder='99999' min={0} maxLength={5} onChange={(e)=>handleDonationAmountChange(e)} />
                    <p className='text-warning'>{donationErrorMessage}</p>
                {(usd>1 && usd<99999)?<Button variant="success" onClick={handleDonation}>
                     {showLoader && <PuffLoader size={20}/>}
                    Donate
                </Button>:<Button variant="success" disabled>Donate</Button>}
                <Button variant="secondary" onClick={handleMakeDonationModalClose}>
                    Cancel
                </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal Withdraw */}
            <Modal show={showWithdrawModal} onHide={handleWithdrawModalClose}>
                <Modal.Header closeButton>
                <Modal.Title>Withdraw</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{color:'red'}}>NOTE: You must enter the Stripe account key to transfer funds to your account. </p>
                    <div>
                        <label>Withdraw amount: Rs <b>{
                            (selectedRequest.WithdrawAmount !=undefined && 
                                (parseInt(selectedRequest.CollectedAmount)-parseInt(selectedRequest.WithdrawAmount??0))>=0)?
                            parseInt(selectedRequest.CollectedAmount)-parseInt(selectedRequest.WithdrawAmount??0)
                            : selectedRequest.CollectedAmount
                        }</b>/-</label>
                        <br/><br/>
                        <label>Enter Stripe Account Key</label>
                        <input className='form-control' type='text' placeholder='Key' onChange={handleStripeKeyChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                {(usd>=2 && usd<100000) &&
                stripeKey.length >100 &&
                (selectedRequest.WithdrawAmount !=undefined &&  ((parseInt(selectedRequest.CollectedAmount)-parseInt(selectedRequest.WithdrawAmount??0))>=0?
                parseInt(selectedRequest.CollectedAmount)-parseInt(selectedRequest.WithdrawAmount??0):parseInt(selectedRequest.CollectedAmount))>200) ?<Button variant="success" onClick={handleWithdraw}>
                     {showLoader && <PuffLoader size={20}/>}
                    Withdraw
                </Button>:<Button variant="success" disabled>Withdraw</Button>}
                <Button variant="secondary" onClick={handleWithdrawModalClose}>
                    Cancel
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RequestCard;