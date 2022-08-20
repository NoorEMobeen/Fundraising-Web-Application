import React,{useState,useContext} from 'react';
import { auth } from "../firebase/config";
import { signOut } from "@firebase/auth";
import { Redirect } from "react-router";
import {Nav,NavLink, Bars, NavMenu} from './NavbarElements';
import { Context } from '../../Store';

const StudentNavbar = (props) => {
  const [state,setState] = useContext(Context)
    return (
    <div>
        <Nav className="position-sticky">
        <NavLink exact to='/'>
            <img src={require('./logo.png').default} alt='AFS' style={{height:'170px', width:'150px'}}/>
        </NavLink>
        <NavMenu>
            <NavLink to='/dashboard' activeStyle>
            Dashboard
            </NavLink>
            <NavLink to='/request' activeStyle>
            Campaigns
            </NavLink>
            <NavLink to='/transaction' activeStyle>
            Transactions
            </NavLink>
            <NavLink to='/userProfile' activeStyle>
            Account
            </NavLink>
            {/*Second Nav*/}
            { <button type="button" class="btn btn-light" onClick={()=>{
              if(window.confirm('Are you sure you want to Logout?')){
                setState({...state,userSignedIn:false,role:'student',uid:''});
              //   signOut(auth)
              //   .then(()=>{
              //     setState({...state,userSignedIn:false,role:'student',uid:''});
              //   }).catch((error) => {
              //     // An error happened.
              //     //console.log('User Sign-Out Error: ',error.code,error.message);
              // });
              }
            }}> <span class="glyphicon glyphicon-log-out"></span>logout</button> }
        </NavMenu>
        
        </Nav>
    </div>
    );
};

export default StudentNavbar
