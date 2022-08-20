import { auth } from "../firebase/config";
import { signOut } from "@firebase/auth";
import { Redirect } from "react-router";
import { setRole, setUserSignIn } from "../../Actions/UserAction";
import { useContext } from "react";
import { Context } from "../../Store";


export const Logout=(props)=>{
    const [state,setState] = useContext(Context);
    console.log("Logout--role:"+state.role);
    console.log("Logout--usersignedIn:"+state.userSignedIn);
    return;
    if (window.confirm('Are you sure you want to Logout?')) {
      // Signout
      signOut(auth).finally(() => {
          // Sign-out successful.
          
         // props.dispatch(setRole('student'));
          //props.dispatch(setUserSignIn(false));
          
          //localStorage.removeItem('userSignedIn');
          window.location.reload(false);
          return <Redirect to='/login'/>
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

export default Logout