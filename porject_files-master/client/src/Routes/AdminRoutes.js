import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
//import dashboard from '../pages/dashboard/dashboard';
import Approval from '../pages/approval/Approval';
import Footer from '../components/Footer';
import Login from '../pages/login/Login';
import Account from '../pages/account/Account';
import AdminAccount from '../pages/account/AdminAccount'; 
import Report from '../pages/report/Report';
import Logout from '../pages/login/Logout';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import AdminNavbar from '../components/Navbar/AdminNavbar';


const AdminRoutes=(props)=>{
    return(
        <Router>
            <AdminNavbar/> 
                <Switch>
                <Route path='/' exact component={AdminDashboard}/>
                <Route path='/dashboard' component={AdminDashboard}/>
                <Route path='/approval' component={Approval} />
                <Route path='/report' component={Report} />
                <Route path='/account' component={AdminAccount} />
                <Route path='/login' component={Login}/>
                <Route path='/logout' component={Logout}/>
                </Switch>
                <Footer/>
        </Router>
    );
}

export default AdminRoutes;