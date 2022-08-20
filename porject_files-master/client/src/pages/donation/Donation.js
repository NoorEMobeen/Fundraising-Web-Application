import React,{useState,useEffect} from 'react';
import RequestCard from '../../components/cards/RequestCard';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { auth } from '../../components/firebase/config';
import { SERVER_NAME } from '../../components/config/config';
import DonationCard from '../../components/cards/DonationCard';
import {PuffLoader} from 'react-spinners/PuffLoader';
import { DateRange } from 'react-date-range';

function Donation () {
    const [DonationData, setDonationData] = useState([]);
    const [showLoader, setShowLoader] = useState(false)
    const [filterData, setFilterData] = useState([]);
    const [masterData, setMasterData] = useState([]);
    
   

    //Creating an array of Request cards with dummy data
    useEffect(() => {
        setShowLoader(true)
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
                axios.get(SERVER_NAME+'/donor/transactions',data)
                .then((snap)=>{
                        if(snap.data.errorMessage){
                            alert(snap.data.errorMessage);                            
                            return;
                        }
                        //snap is the received data from server
                        var tempArray=[]
                        var tempFilterdata=[]
                        for(let data in snap.data){
                            //Remaining field values
                            let donationObject=snap.data[data];

                            console.log("Created At: "+donationObject.datetime);
                            //Push in temporary array
                            tempFilterdata.push(donationObject);
                            tempArray.push(<DonationCard key={data} users={donationObject}/>);
                        }
                        setDonationData(tempArray);
                        setShowLoader(false)
                        setFilterData(tempFilterdata);
                        console.log(tempFilterdata);
                        setMasterData(tempFilterdata);
                }).catch((err)=>{
                    setShowLoader(false)
                        //Show a polite error alert
                        //get error message from err.message
                        console.log(err.message);
                    }
                );
            }).catch((err)=>{
                setShowLoader(false)
                alert('Error!\n Session Expired.\nYou need to sign-in again.');
            })
        }, [])

    const [ price, setPrice ] = useState(4000);
    const handleInput = (e)=>{
        setPrice( e.target.value);
        var tempArray = [];
        masterData.forEach((donation,i)=>{
            if(parseInt(donation.Amount)<=(e.target.value*1000)){
                tempArray.push(<DonationCard key={i} users={donation}/>);
            }
        } );
        setDonationData(tempArray);
      }

    const [pickDate, setPickDate] = useState([
        {
          startDate: new Date(),
          endDate: null,
          key: 'selection'
        }
      ]);

    useEffect(()=>{
        var tempArray = [];
        masterData.forEach((donation,i)=> {
            const date= donation?.datetime?.split('@')[1];
            const day= date?.split('/')[0];
            const month=date?.split('/')[1];
            const year=date?.split('/')[2];

            const formatedDate=`${month}/${day}/${year}`;
            const d=new Date(formatedDate); 
            if(pickDate[0].startDate?.getTime() <= d?.getTime() && pickDate[0].endDate?.getTime() >= d?.getTime()){
                tempArray.push(<DonationCard key={i} users={donation}/>);
            }

        });
        setDonationData(tempArray);
    },[pickDate[0].endDate]);

    const handleRemoveFilters =()=>{
        var tempArray = [];
        masterData.forEach((donation,i)=>{
            tempArray.push(<DonationCard key={i} users={donation}/>);
        });
        setDonationData(tempArray);
    }

    return (
        <div className='some-page-wrapper'>
            <div className='row'>
                <div className='column'>
                    <div className="card" style={{marginLeft:'5px', height:'100%'}}>
                        <div className="card-body">
                            <div className="d-flex flex-column text-center" >
                                <h3>Apply Filter </h3>
                                <input type='button' value={`Remove filters`} onClick={handleRemoveFilters}/>
                            </div>
                            <hr></hr>
                            <div className="d-flex flex-column text-left">
                            <DateRange
                            editableDateInputs={true}
                            onChange={item => setPickDate([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={pickDate}
                            />
                            </div>
                            <br></br>

                            <input type="range" onInput={ handleInput } />
                            <br></br>
                            <h6>Min Amount: Rs <b>{ price }</b>K</h6>
                        </div>
                    </div>
                </div>
                <div className='triple-column'>
                    <div className="card" style={{marginLeft:'5px', height:'100%'}} >
                        <div className="d-flex flex-column text-center" >
                            <h3>Donations</h3>
                        </div>  
                        <div className="card-body">
                            {DonationData}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Donation
