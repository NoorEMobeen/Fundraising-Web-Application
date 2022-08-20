import React, { useEffect  } from "react";
import { auth } from "../../components/firebase/config";
import { signOut } from "@firebase/auth";
import { Redirect } from "react-router";
import { connect } from 'react-redux';
import { setUserSignIn } from "../../Actions/UserAction";

const mapStateToProp=(state)=>{
    return{
        userSignedIn:state.userSignedIn
    }
}

const Logout=()=> {

    useEffect(() => {
        if (window.confirm('Are you sure you want to Logout?')) {
            // Signout
            signOut(auth).then(() => {
                window.name='/';
                // Sign-out successful.
                console.log('window.name',window.name);
                console.log('User Sign-Out Successful!');
                setUserSignIn(false);
                window.location.reload(false);
                return <Redirect to='/login'/>
            }).catch((error) => {
                // An error happened.
                console.log('User Sign-Out Error: ',error.code,error.message);
                //setUserSignIn(false);
                window.location.reload(false);
                return <Redirect to='/login'/>
            });
          } else {
            // Redirect to dashboard
          }
    });
    
    return (
        <div>
            <h3>User Logging out...</h3>
        </div>
    );
}

export default connect(mapStateToProp)(Logout);
