import React,{useEffect,useState} from 'react';
import './../constants/style.css';
import ReactRoundedImage from "react-rounded-image";
import moment from 'moment';
import { Modal,Button } from 'react-bootstrap';

const DonationCard=(props)=>{
    const [RemainingHours, setRemainingHours] = useState(0);
    const [RemainingDays, setRemainingDays] = useState(0);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showMakeDonationModal, setShowMakeDonationModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState({});
    const [donationAmount, setDonationAmount] = useState(0);
    const [donationErrorMessage, setDonationErrorMessage] = useState('')
    const handleRequestModalClose = () => setShowRequestModal(false);
    const handleRequestModalShow = () => setShowRequestModal(true);
    const handleMakeDonationModalClose = () => setShowMakeDonationModal(false);
    const handleMakeDonationModalShow = () => setShowMakeDonationModal(true);

    const cardClickHandler=(requestData)=>{
        setSelectedRequest(requestData);
        handleRequestModalShow();
    }

    return(
        <>
            <div className='some-page-wrapper' style={props.users.clickableCard && {cursor:'pointer'}} onClick={props.users.clickableCard && (()=>cardClickHandler(props.users))}>
                <div className='row rowbg'>
                    <p className="text-danger" style={{cursor:'pointer', float:'right',position:'absolute'}}><b>{props.users.DeleteButton?'X':''}</b></p>               
                    <div className='card-body' style={{height:'auto',textAlign:'center'}}>{props.users.RequestTitle?<h5 className="text-secondary">{props.users.RequestTitle}</h5>:<h5 className="text-secondary">No Request Title Provided</h5>}</div>      
                    {/* Colume 1 */}
                    <div className='column'>
                        <div className="subcard" style={{height:'auto',alignItems:'center',alignContent:'center'}} >    
                            <div className="card-body" >
                                {props.users.to?<h5 className="text-secondary">Donated to <b>{props.users.to}</b></h5>:''}
                                {props.users.RunningTime?<h6 className="text-secondary">Running Time <b><span style={{color:'black'}}>{props.users.RunningTime}</span></b> hours</h6>:''}
                           </div>
                        </div>
                    </div>
                    {/* Colume 2 */}
                    <div className='column'>
                        <div className="subcard" style={{ height:'auto', width:'100%'}} >
                            <div className="card-body">
                                {props.users.datetime?<h6 className="text-secondary">Donation Time@Date <b>{props.users.datetime}</b></h6>:''}
                            </div>
                        </div>
                    </div>
                    {/* Colume 3 */}
                    <div className='column'>
                        <div className="subcard" style={{height:'auto'}} >
                            <div className="card-body">
                                {props.users.Amount?<h6 className="text-secondary">Amount <b>{props.users.Amount}</b></h6>:''}</div>
                        </div>
                    </div>
                </div>
            </div>
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
            
        </>
    )
}

export default DonationCard;