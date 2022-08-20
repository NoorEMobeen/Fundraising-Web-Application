// import React,{useState,useEffect} from 'react';
// import './App.css';
// import Navbar from './components/Navbar';
// import { BrowserRouter as Router, Switch, Route,Redirect } from 'react-router-dom';
// import dashboard from './pages/dashboard/dashboard';
// import CreateRequest from './pages/request/CreateRequest';
// import Footer from './components/Footer';
// import Login from './pages/login/Login';
// import Signup from './pages/signup/Signup';
// import Transaction from './pages/transaction/Transaction';
// import Account from './pages/account/Account';
// import Donation from './pages/donation/Donation';
// import Tracking from './pages/donation/Tracking';
// import Report from './pages/report/Report';
// //import PaymentForm from './pages/payment/PaymentForm';
// import UserProfile from './pages/user/UserProfile';
// import ForgotPassword from './pages/login/ForgotPassword';
// import Logout from './pages/login/Logout';
// import Home from './pages/home/Home';
// import { connect } from 'react-redux';

// const mapStateToProp=(state)=>{
//     return{
//         role:state.role,
//         userSignedIn:state.userSignedIn
//     }
// }

// const Routes=(props)=>{
//     const noUser=()=>{
//         return <Switch>
//                 <Route path='/login' component={Login}/>
//                 <Route path='/signup' component={Signup}/>
//                 <Route path='/forgot_password' component={ForgotPassword}/>
//                 <Route path='/adminlogin' component={Login} />
//                 <Route path='/' exact component={Home} />
//                 </Switch>
//     }
    

//     const student=()=>{
//         return (<Router>
//                     <Navbar/>
//                     <Switch>
//                     <Route path='/' exact component={dashboard}/>
//                     <Route path='/dashboard' component={dashboard}/>
//                     <Route path='/request' component={CreateRequest} />
//                     <Route path='/transaction' component={Transaction} />
//                     <Route path='/account' component={Account} />
//                     <Route path='/logout' component={Logout}/>
//                     <Route path='/login' component={Login} />
//                     <Route path='/userProfile' component={UserProfile} />
//                     </Switch>
//                     <Footer/>
//                 </Router>);
//     }

//     const donor=()=>{
//         return (<Router>
//                     <Navbar className="position-sticky"/>
//                     <Switch>
//                     <Route path='/' exact component={dashboard}/>
//                     <Route path='/dashboard' component={dashboard}/>
//                     <Route path='/donation' component={Donation} />
//                     <Route path='/tracking' component={Tracking} />
//                     <Route path='/account' component={Account} />
//                     <Route path='/logout' component={Logout}/>
//                     <Route path='/login' component={Login}/>
//                     </Switch>
//                     <Footer/>
//                 </Router>);
//     }

//     const admin=()=>{
//         return <>
//                     <Navbar /> 
//                     <Switch>
//                     <Route path='/' exact component={dashboard}/>
//                     <Route path='/dashboard' component={dashboard}/>
//                     <Route path='/request' component={CreateRequest} />
//                     <Route path='/report' component={Report} />
//                     <Route path='/account' component={Account} />
//                     <Route path='/login' component={Login}/>
//                     <Route path='/logout' component={Logout}/>
//                     </Switch>
//                     <Footer/>
//                 </>
//     }

//     // const [allowedRoutes, setAllowedRoutes] = useState(student)
//     // useEffect(() => {
//     //     if(props.role=='student'){
//     //         setAllowedRoutes(student)
//     //     }
//     //     else if(props.role=='donor'){
//     //         setAllowedRoutes(donor)
//     //     }
//     //     else if(props.role=='admin'){
//     //         setAllowedRoutes(admin)
//     //     }
//     // }, [props.role]);

//     if(props.role=='student'){
//         return (<Router>
//             <Navbar/>
//             <Switch>
//             <Route path='/' exact component={dashboard}/>
//             <Route path='/dashboard' component={dashboard}/>
//             <Route path='/request' component={CreateRequest} />
//             <Route path='/transaction' component={Transaction} />
//             <Route path='/account' component={Account} />
//             <Route path='/logout' component={Logout}/>
//             <Route path='/login' component={Login} />
//             <Route path='/userProfile' component={UserProfile} />
//             </Switch>
//             <Footer/>
//         </Router>);
//     }
//     else if(props.role=='donor'){
//         return (<Router>
//                     <Navbar className="position-sticky"/>
//                     <Switch>
//                     <Route path='/' exact component={dashboard}/>
//                     <Route path='/dashboard' component={dashboard}/>
//                     <Route path='/donation' component={Donation} />
//                     <Route path='/tracking' component={Tracking} />
//                     <Route path='/account' component={Account} />
//                     <Route path='/logout' component={Logout}/>
//                     <Route path='/login' component={Login}/>
//                     </Switch>
//                     <Footer/>
//                 </Router>);
//     }
//     else if(props.role=='admin'){
//         return(
//             <Router>
//                 <Navbar/>
//                     <Switch>
//                     <Route path='/' exact component={dashboard}/>
//                     <Route path='/dashboard' component={dashboard}/>
//                     <Route path='/donation' component={Donation} />
//                     <Route path='/tracking' component={Tracking} />
//                     <Route path='/account' component={Account} />
//                     <Route path='/logout' component={Logout}/>
//                     <Route path='/login' component={Login}/>
//                     </Switch>
//                     <Footer/>
//             </Router>
//         );
//     }

// }

// export default connect(mapStateToProp)(Routes);