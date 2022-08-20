import '../App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Footer from '../components/Footer';
import Login from '../pages/login/Login';
import Account from '../pages/account/Account';
import Donation from '../pages/donation/Donation';
import Logout from '../pages/login/Logout';
import DonorDashboard from '../pages/dashboard/DonorDashboard';
import DonorNavbar from '../components/Navbar/DonorNavbar';
import ConfirmPayment from '../pages/easypaisa/ConfirmPayment';
import DonorAccount from '../pages/account/DonorAccount';


const DonorRoutes=(props)=>{

    return (<Router>
                <DonorNavbar/>
                <Switch>
                    <Route path='/' exact component={DonorDashboard}/>
                    <Route path='/dashboard' component={DonorDashboard}/>
                    <Route path='/donation' component={Donation} />
                    <Route path='/account' component={Account} />
                    <Route path='/logout' component={Logout}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/confirm_payment' component={ConfirmPayment}/>
                </Switch>
                <Footer/>
            </Router>);
}

export default DonorRoutes;