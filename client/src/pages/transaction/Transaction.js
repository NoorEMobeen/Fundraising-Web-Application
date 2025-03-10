import React,{useState,useEffect} from 'react';
import './../../components/constants/style.css';
import { MDBDataTable } from 'mdbreact';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { auth } from '../../components/firebase/config';
import { SERVER_NAME } from '../../components/config/config';
import { DateRange } from 'react-date-range';


const Transaction = () =>{

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [withdraws, setWithdraws] = useState({});

    const [pickDate, setPickDate] = useState([
      {
        startDate: new Date(),
        endDate: null,
        key: 'selection'
      }
    ]);

    const [filterData, setFilterData] = useState([]);
    const [masterWithdrawData, setMasterWithdrawData] = useState([]);


    useEffect(() => {
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
            axios.get(SERVER_NAME+'/student/withdraws',data).then(
              //responces is received successfully
              (snap)=>{
                  if(snap.data.errorMessage){   
                    console.log(snap.data);
                        alert(snap.data.errorMessage);                            
                      return;
                  }
                  //snap is the received data from server
                  var tempArray=[]
                  var tempFilterdata=[]
                  
                  for(let data in snap.data){

                      //Remaining field values
                      let requestObject=snap.data[data];

                      tempFilterdata.push(requestObject);
                      console.log(requestObject);
                      requestObject={...requestObject};

                      //Push in temporary array
                      tempArray.push({...requestObject,approved:requestObject.approved?'Approved':'Pending'});
                  }

                  const data = {
                    columns: [
                      {
                        label: 'Amount Rs',
                        field: 'Amount',
                        sort: 'asc',
                        width: 100
                      },
                      {
                        label: 'Campaign Title',
                        field: 'RequestTitle',
                        sort: 'asc',
                        width: 150
                      },
                      {
                        label: 'Approved',
                        field: 'approved',
                        sort: 'asc',
                        width: 100
                      },
                      {
                        label: 'Approval Time@Date',
                        field: 'approved_at',
                        sort: 'asc',
                        width: 100
                      },
                      {
                        label: 'Creation Time@Date',
                        field: 'created_at',
                        sort: 'asc',
                        width: 100
                      },
                    ],
                    rows: tempArray
                  };
                  setWithdraws(data);
                   setFilterData(tempFilterdata);
                    console.log(tempFilterdata);
                    setMasterWithdrawData(tempFilterdata);
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
    },[])

    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;

    
    const [filter, setFilter] = useState();


    // const filterHandler=()=>{
    //   switch (filter) {
    //       case "amount":
    //             auth.currentUser.getIdToken()
    //               .then(currentTokken=>{
    //                   const data={
    //                       headers:{authorization:currentTokken}
    //                   }
    //                   axios.get(SERVER_NAME+'/student/transactions/completed',data)
    //                   .then(res=>{
    //                       console.log(res.data);
    //                   }).catch(err=>{
    //                   })                
    //               }).catch(err=>{
    //               })
    //       break;
    //       case "dateandtime":
    //               auth.currentUser.getIdToken()
    //               .then(currentTokken=>{
    //                   const data={
    //                       headers:{authorization:currentTokken}
    //                   }
    //                   axios.get(SERVER_NAME+'/student/transactions/completed',data)
    //                   .then(res=>{
    //                       console.log(res.data);
    //                   }).catch(err=>{
      
    //                   })                
    //               }).catch(err=>{
    //               })
    //       break;
    //       default:
    //           break;
    //   }
    // }
    // const onFilterChange=(e)=>{
    //   setFilter(e.target.value);
    // }

    const [ price, setPrice ] = useState(4000);
    const handleInput = (e)=>{
        setPrice( e.target.value*1000);

        //1: get data from masterDonations (objects)
        //2: apply filter on masterDonation and save in filterData
        setFilterData(masterWithdrawData.filter(donation=>parseInt(donation.Amount)<=(parseInt(e.target.value)*1000) && donation.created_at ));
        console.log("Master Data: ",masterWithdrawData);
        console.log("Filter Data: ",filterData);
        //3: make cards from filterData
        var tempArray = [];
        filterData.forEach((donation,i)=>{
            tempArray.push({...donation});
            console.log("forEach: "+donation);
        })
        const data = {
          columns: [
            {
              label: 'Amount Rs',
              field: 'Amount',
              sort: 'asc',
              width: 100
            },
            {
              label: 'Campaign Title',
              field: 'RequestTitle',
              sort: 'asc',
              width: 150
            },
            {
              label: 'Approved',
              field: 'approved',
              sort: 'asc',
              width: 100
            },
            {
              label: 'Approval Time@Date',
              field: 'approved_at',
              sort: 'asc',
              width: 100
            },
            {
              label: 'Creation Time@Date',
              field: 'created_at',
              sort: 'asc',
              width: 100
            },
          ],
          rows: tempArray
        };
        
        //4: store cards in DonationData
            setWithdraws(data);
      }


      
    useEffect(()=>{
        
      setFilterData(masterWithdrawData.filter(donation=> {
          let date= donation?.created_at?.split('@')[1];
          date=date?.split('/')
          let day= date[0]
          let month=date[1]
          let year=day[2]

      date=`${month}/${day}/${year}`;
      console.log("Printing Date "+ date);
      date=new Date(date);
      
      if(pickDate.startDate?.getTime()>= date?.getTime() && pickDate.endDate?.getTime()<=date?.getTime()){
             
          return donation;
      }

      } ));

           //3: make cards from filterData
           var tempArray = [];
           filterData.forEach((donation,i)=>{
            tempArray.push({...donation});
            console.log("forEach: "+donation);
        })

           const data = {
            columns: [
              {
                label: 'Amount Rs',
                field: 'Amount',
                sort: 'asc',
                width: 100
              },
              {
                label: 'Campaign Title',
                field: 'RequestTitle',
                sort: 'asc',
                width: 150
              },
              {
                label: 'Approved',
                field: 'approved',
                sort: 'asc',
                width: 100
              },
              {
                label: 'Approval Time@Date',
                field: 'approved_at',
                sort: 'asc',
                width: 100
              },
              {
                label: 'Creation Time@Date',
                field: 'created_at',
                sort: 'asc',
                width: 100
              },
            ],
            rows: tempArray
          };

         setWithdraws(data);

      console.log(pickDate[0].startDate, pickDate[0].endDate);


  },[pickDate]);

return (
 <div className='some-page-wrapper'>
    <div className='row'>
        <div className='column'>
            <div className="card item-align-center" >
                <div className="card-body">
                  <div className="d-flex flex-column text-left">
                    <form>
                    <div className="d-flex flex-column text-left">
                            <DateRange
                            editableDateInputs={true}
                            onChange={item => setPickDate([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={pickDate}
                            />
                     </div>
                    {/* <div>
                    <label>
                        Start Date:
                    </label>
                        <DatePicker selected={startDate} selectsStart startDate={startDate} endDate={endDate} onChange={date => setStartDate(date)} />
                        <br></br>
                    <label>
                        End Date:
                    </label>
                        <DatePicker selected={endDate} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} onChange={date => setEndDate(date)}/>
                    </div> */}
                    <br></br>
                    <label>
                        Sort By
                    </label>
                        <div>

                        <br></br>

                      <input type="range" onInput={ handleInput } />
                      <br></br>
                      <h4>Min Amount: { price }</h4>
                                {/* <input value="amount" type="radio" checked={filter=="amount"} /> Amount
                            <br></br>
                                <input value="dateandtime" type="radio" checked={filter=="dateandtime"}/> Datetime */}
                           </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div className='triple-column'>
            <div className="card" style={{marginLeft:'5px', height:'100%'}}>
                <div>
                    <MDBDataTable 
                      striped 
                      bordered
                      small
                      data={withdraws}
                    />
                </div>              
            </div>
        </div>
    </div>
</div>
    )
};

export default Transaction;
