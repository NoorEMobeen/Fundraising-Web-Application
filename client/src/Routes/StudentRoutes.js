import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
//import dashboard from '../pages/dashboard/dashboard';
import CreateRequest from '../pages/request/CreateRequest';
import Footer from '../components/Footer';
import Login from '../pages/login/Login';
import Transaction from '../pages/transaction/Transaction';
import Account from '../pages/account/Account';
//import PaymentForm from './pages/payment/PaymentForm';
import Logout from '../pages/login/Logout';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import UserProfile from '../pages/user/UserProfile';
import StudentNavbar from '../components/Navbar/StudentNavbar';

const StudentRoutes=(props)=>{
 
    return (
    <Router>
        <StudentNavbar/>
        <Switch>
        <Route path='/' exact component={StudentDashboard}/>
        <Route path='/dashboard' component={StudentDashboard}/>
        <Route path='/request' component={CreateRequest} />
        <Route path='/transaction' component={Transaction} />
        <Route path='/logout' component={Logout}/>
        <Route path='/login' component={Login} />
        <Route path='/userProfile' component={UserProfile} />
        </Switch>
        <Footer/>
    </Router>);
}

export default StudentRoutes;