import React,{useContext} from 'react';
import { auth } from "../firebase/config";
import { signOut } from "@firebase/auth";
import {Nav,NavLink, Bars, NavMenu} from './NavbarElements';
import { Context } from '../../Store';


// const logoutUser=(props)=>{
//   if (window.confirm('Are you sure you want to Logout?')) {
//     // Signout
//     signOut(auth).then(() => {
//         //window.name='/';
//         //const cookies = new Cookies();
//         //cookies.remove('role',{path:'/'});
//         // Sign-out successful.
//         console.log('window.name',window.name);
//         console.log('User Sign-Out Successful!');
//         props.dispatch(setRole('student'));
//         props.dispatch(setUserSignIn(false));
//         //localStorage.removeItem('userSignedIn');
//         //window.location.reload(false);
//         //return <Redirect to='/login'/>
//     }).catch((error) => {
//         // An error happened.
//         console.log('User Sign-Out Error: ',error.code,error.message);
//         //setUserSignIn(false);
//         //window.location.reload(false);
//         //return <Redirect to='/login'/>
//     });
//   } else {
//     // Redirect to dashboard
//   }
// }

const DonorNavbar = (props) => {
    const [state,setState] = useContext(Context)
    return (
    <div>
        <Nav>
        <NavLink exact to='/'>
        <img src={require('./logo.png').default} alt='AFS' style={{height:'170px', width:'150px'}}/>
        </NavLink>
        <NavMenu>
            <NavLink to='/dashboard' activeStyle>
            Dashboard
            </NavLink>
            <NavLink to='/donation' activeStyle>
            Donations
            </NavLink>
            <NavLink to='/account' activeStyle>
            Account
            </NavLink>
            {/* Second Nav */}
            { <button type="button" class="btn btn-light" onClick={()=>{
              if(window.confirm('Are you sure you want to Logout?')){
                setState({...state,userSignedIn:false,role:'student',uid:''});
                // signOut(auth)
                // .then(()=>{
                //   setState({...state,userSignedIn:false,role:'student',uid:''});
                // }).catch((error) => {
                // // An error happened.
                // //console.log('User Sign-Out Error: ',error.code,error.message);
                // });
              }
            }}> <span class="glyphicon glyphicon-log-out"></span>logout</button> }
        </NavMenu>
        
        </Nav>
    </div>
    );

};

export default DonorNavbar
