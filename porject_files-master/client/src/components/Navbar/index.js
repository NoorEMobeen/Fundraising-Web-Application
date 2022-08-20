import React,{useEffect} from 'react';
import { auth } from "../firebase/config";
import { signOut } from "@firebase/auth";
//import { Redirect } from "react-router";
import { setRole, setUserSignIn } from "../../Actions/UserAction";
import {Nav,NavLink, Bars, NavMenu} from './NavbarElements';
import { connect } from 'react-redux';
//import Cookies from 'universal-cookie';

const mapStateToProp=(state)=>{
  return{
      role:state.role,
      userSignedIn:state.userSignedIn,
      uid:state.uid
  }
}

const logoutUser=(props)=>{
  if (window.confirm('Are you sure you want to Logout?')) {
    // Signout
    signOut(auth).then(() => {
        //window.name='/';
        //const cookies = new Cookies();
        //cookies.remove('role',{path:'/'});
        // Sign-out successful.
        console.log('window.name',window.name);
        console.log('User Sign-Out Successful!');
        props.dispatch(setRole('student'));
        props.dispatch(setUserSignIn(false));
        //localStorage.removeItem('userSignedIn');
        //window.location.reload(false);
        //return <Redirect to='/login'/>
    }).catch((error) => {
        // An error happened.
        console.log('User Sign-Out Error: ',error.code,error.message);
        //setUserSignIn(false);
        //window.location.reload(false);
        //return <Redirect to='/login'/>
    });
  } else {
    // Redirect to dashboard
  }
}

const Navbar = (props) => {

    console.log("role::"+props.role);
    console.log("userSignedIn::"+props.userSignedIn);
    console.log("window::"+window.name);

  switch ( props.role) {
    case "student":
      return (
        <div>
          <Nav className="position-sticky">
            <NavLink to='/'>
              <img src={require('./logo.png').default} alt='AFS' style={{height:'60px', width:'100px'}}/>
            </NavLink>
            <Bars />
            <NavMenu>
              <NavLink to='/dashboard' activeStyle>
                Dashboard
              </NavLink>
              <NavLink to='/approval' activeStyle>
                Requests
              </NavLink>
              <NavLink to='/transaction' activeStyle>
                Transactions
              </NavLink>
              <NavLink to='/account' activeStyle>
                Account
              </NavLink>
              {/*Second Nav*/}
              { <button type="button" class="btn btn-light" onClick={logoutUser}> <span class="glyphicon glyphicon-log-out"></span>logout</button> }
            </NavMenu>
            
          </Nav>
        </div>
      );

    case "donor":
      return (
        <div>
          <Nav>
            <NavLink to='/'>
            <img src={require('./logo.png').default} alt='AFS' style={{height:'60px', width:'100px'}}/>
            </NavLink>
            <Bars />
            <NavMenu>
              <NavLink to='/dashboard' activeStyle>
                Dashboard
              </NavLink>
              <NavLink to='/donation' activeStyle>
                Donations
              </NavLink>
              <NavLink to='/tracking' activeStyle>
                Tracking
              </NavLink>
              <NavLink to='/account' activeStyle>
                Account
              </NavLink>
              {/* Second Nav */}
              { <button type="button" class="btn btn-light" onClick={logoutUser}> <span class="glyphicon glyphicon-log-out"></span>logout</button> }
            </NavMenu>
            
          </Nav>
        </div>
      );
    case 'admin':
      return (
        <div>
          <Nav>
            <NavLink to='/'>
            <img src={require('./logo.png').default} alt='AFS' style={{height:'60px', width:'100px'}}/>
            </NavLink>
            <Bars />
            <NavMenu>
              <NavLink to='/' activeStyle>
                Dashboard
              </NavLink>
              <NavLink to='/approval' activeStyle>
                Approvals
              </NavLink>
              <NavLink to='/report' activeStyle>
                Reports
              </NavLink>
              <NavLink to='/account' activeStyle>
                Accounts
              </NavLink>
              {/* Second Nav */}
              { <button type="button" class="btn btn-light" onClick={logoutUser}> <span class="glyphicon glyphicon-log-out"></span>logout</button> }
            </NavMenu>          
          </Nav>
        </div>
      );

    default:
      return(
        <h1>head</h1>
      )
      break;
  }
};

export default connect(mapStateToProp)(Navbar)
