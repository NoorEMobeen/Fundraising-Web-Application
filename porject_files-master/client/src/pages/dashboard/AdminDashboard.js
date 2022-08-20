import React from 'react';
import {useState} from 'react';
import Header from './../../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUserGraduate, faDonate, faExclamationTriangle, faUsers, faSync} from '@fortawesome/free-solid-svg-icons';
import { Button, Card,  Table, Container, Row, Col, Form, OverlayTrigger, Tooltip,} from "react-bootstrap";
import { Line, Doughnut,Bar } from 'react-chartjs-2';
import { useEffect } from 'react';
import axios, { Axios } from 'axios';
import { auth } from '../../components/firebase/config';
import { SERVER_NAME } from '../../components/config/config';

function AdminDashboard() {

    const [totalActiveRequestAmount, setTotalActiveRequestAmount] = useState('');
    const [totalPendingRequestAmount, setTotalPendingRequestAmount] = useState('');
    const [rolesUserCount, setRolesUserCount] = useState({student:0,donor:0,admin:0});
    const [atciveRequests, setAtciveRequests] = useState({});
    const [pendingRequests, setPendingRequests] = useState([])
    const [totalDonationAmount, setTotalDonationAmount] = useState(0);
     
    //Random rgba color generator
    function random_rgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }
    //Creating an array all the requests from data
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
                //get all request amount from server with data
                let tempTotalActiveRequestAmount=0;
                let tempTotalPendingRequestAmount=0;
                let tempTotalDonationAmount=0;
                //active requests amount
                axios.get(SERVER_NAME+'/requests/active',data).then(
                    //responces is received successfully
                    (snap)=>{
                        if(snap.errorMessage){
                            alert(snap.errorMessage);
                            return;
                        };
                    //{labels:[],data:[],backgroundColor:[],borderColor:[]}
                    let tempLabels=[]
                    let tempData=[]
                    let tempBackgroundColor=[]
                    let tempBorderColor=[]
                    let tempActiveRequests=[];
                    Object.keys(snap.data).forEach(key=>{
                        tempTotalActiveRequestAmount+= parseInt(snap.data[key].RequestAmount?snap.data[key].RequestAmount:0)
                        tempLabels.push(snap.data[key].RequestTitle);
                        tempData.push(snap.data[key].RequestAmount);
                        tempBackgroundColor.push(random_rgba().toString());
                        tempBorderColor.push(random_rgba().toString());
                        tempActiveRequests.push(snap.data[key]);
                    })
                    const dataDoughnutSample = {
                        labels: tempLabels,
                        datasets: [
                          {
                            label: 'Active Campaigns Collection',
                            data: tempData,
                            backgroundColor:tempBackgroundColor,
                            borderColor: tempBorderColor,
                            borderWidth: 1,
                          },
                        ],
                    };
                    setAtciveRequests(dataDoughnutSample);
                    console.log("Total Pending Amount: "+tempTotalActiveRequestAmount);
                    setTotalActiveRequestAmount(tempTotalActiveRequestAmount);
                    }
                ).catch(
                    //Error in receiving responce
                    (err)=>{
                        
                        //get error message from err.message
                        console.log(err.message)
                    }
                );
            
                //pending requests amount
                axios.get(SERVER_NAME+'/requests/pending',data).then(
                    //responces is received successfully
                    (snap)=>{
                        if(snap.errorMessage){
                            alert(snap.errorMessage);
                            return;
                        };
                    //console.log(snap.data);
                    let tempPendingRequets=[];
                    Object.keys(snap.data).forEach(key=>{
                        tempTotalPendingRequestAmount+= parseInt(snap.data[key].RequestAmount?snap.data[key].RequestAmount:0)
                        tempPendingRequets.push(
                            <a href='approval'>
                                <tr style={{textDecoration:'none', color:'black'}}>
                                    <td>{snap.data[key].RequestTitle}</td>
                                    <td>Rs {snap.data[key].RequestAmount}/-</td>
                                </tr>
                            </a>
                        );
                    })
                    setPendingRequests(tempPendingRequets);
                    console.log("Total Donated Amount: "+tempTotalPendingRequestAmount);
                    setTotalPendingRequestAmount(tempTotalPendingRequestAmount);
                    }
                ).catch(
                    //Error in receiving responce
                    (err)=>{
                        
                        //get error message from err.message
                        console.log(err.message)
                    }
                );
                //donation transactions amount
                axios.get(SERVER_NAME+'/transactions/donation',data)
                .then((snap)=>{
                        if(snap.errorMessage){
                            alert(snap.errorMessage);
                            return;
                        };
                        Object.keys(snap.data).forEach(key=>{
                            tempTotalDonationAmount+= parseInt(snap.data[key].Amount?snap.data[key].Amount:0)
                        })
                    //console.log("Total Donated Amount: "+tempTotalActiveRequestAmount);
                    setTotalDonationAmount(tempTotalDonationAmount);
                    }
                ).catch((err)=>{
                        //get error message from err.message
                        console.log(err.message)
                    }
                );
                //registered users/students/donors
                axios.get(SERVER_NAME+'/users/count').then((snap)=>{
                    Object.keys(snap.data).forEach(key=>{
                        let roleName=Object.keys(snap.data[key])[0];
                        if(roleName=='student'){
                            setRolesUserCount(prev=>{return {...prev,student:Object.values(snap.data[key])[0]}});
                        }else if(roleName=='donor'){
                            setRolesUserCount(prev=>{return {...prev,donor:Object.values(snap.data[key])[0]}});
                        }else if(roleName=='admin'){
                            setRolesUserCount(prev=>{return {...prev,admin:Object.values(snap.data[key])[0]}});
                        }
                    })
                }).catch(err=>console.log(err));

        }).catch((err)=>{
            alert('Error!\n Session Expired.\nYou need to sign-in again.');
        })

    }, [])
    
    return (
        <div>
                <>
                    <Container fluid style={{width:"95%"}}>
                        <br/><br/>
                        <Row>
                        <Col lg="3" sm="6">
                            <Card className="card-stats">
                            <Card.Body className="bg-success">
                                <Row>
                                <Col xs="5">
                                    <FontAwesomeIcon style={{height:"70px", width:"70px"}} icon={faUserGraduate} />
                                </Col>
                                <Col xs="7">
                                    <div className="numbers">
                                    <h6 className="card-category text-light"><b>Active<br/>Campaigns</b></h6>
                                    <Card.Title as="h4">Rs<br/>{totalActiveRequestAmount}</Card.Title>
                                    </div>
                                </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                                <hr></hr>
                                <div className="stats">
                                <a href="/"><FontAwesomeIcon style={{height:"20px", width:"20px"}} icon={faSync} />Update Now</a>
                                </div>
                            </Card.Footer>
                            </Card>
                        </Col>
                        <Col lg="3" sm="6">
                            <Card className="card-stats">
                            <Card.Body className="bg-warning">
                                <Row>
                                <Col xs="5">
                                <FontAwesomeIcon style={{height:"70px", width:"70px"}} icon={faExclamationTriangle} />
                                </Col>
                                <Col xs="7">
                                    <div className="numbers">
                                    <h6 className="card-category text-light"><b>Pending<br/> Requests</b></h6>
                                    <Card.Title as="h4">Rs<br/> {totalPendingRequestAmount}</Card.Title>
                                    </div>
                                </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                                <hr></hr>
                                <div className="stats">
                                <a href="/"><FontAwesomeIcon style={{height:"20px", width:"20px"}} icon={faSync} />Update Now</a>
                                </div>
                            </Card.Footer>
                            </Card>
                        </Col>
                        <Col lg="3" sm="6">
                            <Card className="card-stats">
                            <Card.Body className="bg-info">
                                <Row>
                                <Col xs="5">
                                <FontAwesomeIcon style={{height:"70px", width:"70px"}} icon={faDonate} />
                                </Col>
                                <Col xs="7">
                                    <div className="numbers">
                                    <h6 className="card-category text-light"><b>Total<br/>Donations</b></h6>
                                    
                                    <Card.Title as="h4">Rs<br/>{totalDonationAmount}</Card.Title>
                                    </div>
                                </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                                <hr></hr>
                                <div className="stats">
                                <a href="/"><FontAwesomeIcon style={{height:"20px", width:"20px"}} icon={faSync} />Update now</a>
                                </div>
                            </Card.Footer>
                            </Card>
                        </Col>
                        <Col lg="3" sm="6">
                            <Card className="card-stats">
                            <Card.Body className="bg-light">
                                <Row>
                                <Col xs="5">
                                <FontAwesomeIcon style={{height:"70px", width:"70px"}} icon={faUsers} />
                                </Col>
                                <Col xs="7">
                                    <div className="numbers">
                                        <h6 className="card-category  text-secondary"><b>Active Accounts</b></h6>
                                        
                                        <Card.Title as="h4">{[rolesUserCount.student]} students<br/>{[rolesUserCount.donor]} donors<br/></Card.Title>
                                    </div>
                                </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer>
                                <hr></hr>
                                <div className="stats">
                                <a href="/"><FontAwesomeIcon style={{height:"20px", width:"20px"}} icon={faSync} />Update Now</a>
                                </div>
                            </Card.Footer>
                            </Card>
                        </Col>
                        </Row>
                        <br/>
                        <Row>
                        <Col md="6">
                            <Card className="card-tasks">
                            <Card.Header>
                                <Card.Title as="h4">Tasks</Card.Title>
                                <p className="card-category">Pending Campaign Approvals</p>
                            </Card.Header>
                            <Card.Body>
                                <div className="table-full-width">
                                <Table>
                                    <tbody>
                                        {pendingRequests}
                                    </tbody>
                                </Table>
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <hr></hr>
                                <div className="stats">
                                <i className="now-ui-icons loader_refresh spin"></i>
                                Updated just now
                                </div>
                            </Card.Footer>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h4">Campaigns Statistics</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <div
                                    className="ct-chart ct-perfect-fourth"
                                    id="chartPreferences"
                                    >
                                    {totalActiveRequestAmount > 0 ? <Doughnut data={atciveRequests} /> : <div>No data</div>}
                                    </div>
                                    <div className="legend">
                                    <i className="fas fa-circle text-info"></i>
                                    <a href="/"><FontAwesomeIcon style={{height:"20px", width:"20px"}} icon={faSync} />Update Now</a>
                                    </div>
                                    <hr></hr>
                                    <div className="stats">
                                    <i className="far fa-clock"></i>
                                    Total/Active Campaigns
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        </Row>
                        <br/>
                        <Row>
                        {/* <Col md="6">
                            <Card>
                            <Card.Header>
                                <Card.Title as="h4">Year 2021 Statistics</Card.Title>
                                <p className="card-category">Request-Donation relation by month</p>
                            </Card.Header>
                            <Card.Body>
                                <div className="ct-chart" id="chartActivity">
                                    <Bar data={dataBar} options={optionsBar} />
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <div className="legend">
                                <i className="fas fa-circle text-info"></i>
                                Year Closing Status 
                                </div>
                                <hr></hr>
                                <div className="stats">
                                <i className="fas fa-check"></i>
                                Year Closing Remarks
                                </div>
                            </Card.Footer>
                            </Card>
                        </Col> */}
                        {/* <Col md="5">
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h4">Users Behavior</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <div className="ct-chart" id="chartHours">
                                        <Line data={dataLine} options={optionsLine} />
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <div className="legend">
                                    <a href="/"><FontAwesomeIcon style={{height:"20px", width:"20px"}} icon={faSync} />Update Now</a>
                                    </div>
                                    <hr></hr>
                                    <div className="stats">
                                    <i className="fas fa-history"></i>
                                    Updated 3 minutes ago
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col> */}
                        
                        </Row>
                    </Container>
                </>
        </div>
    )
}

export default AdminDashboard;