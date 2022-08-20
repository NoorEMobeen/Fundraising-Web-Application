import axios from "axios";
//import  { Redirect  } from 'react-router-dom'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import firebase from 'firebase/compat/app';
// import {auth, realtimeDB } from "../../components/firebase/config";
import { getDatabase, ref, set, update } from "firebase/database";
import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from "react";
import GoogleButton from 'react-google-button';
import PuffLoader from "react-spinners/PuffLoader";
import { SERVER_NAME } from "../../components/config/config";
import { auth } from "../../components/firebase/config";
import AdminRoutes from '../../Routes/AdminRoutes';
import DonorRoutes from '../../Routes/DonorRoutes';
//import { connect } from 'react-redux';
//import {setRole, setUserSignIn} from '../../Actions/UserAction';
import StudentRoutes from '../../Routes/StudentRoutes';
import { Context } from "../../Store";
import useWindowDimensions from "../../components/config/windows_screen_size";
import classes from "./style/style";
//import Cookies from 'universal-cookie';
//import Toaster from '../../components/toasts/Toaster';

// const mapStateToProp=(state)=>{
//     return{
//         role:state.role,
//         userSignedIn:state.userSignedIn,
//         uid:state.uid
//     }
// }

 function getDatetime() {
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    return time_At_date;
 }

const Login =(props)=>{
    const [state,setState] = useContext(Context);
    //Local states
    const [showLoader, setShowLoader] = useState(false);//whether to show loader
    const [signupPage, setSignupPage] = useState(false);//whether to show signup screen
    const [email, setEmail] = useState('');//Login form local state
    const [password, setPassword] = useState('');//login form local state
    const [forgotPasswordPage, setForgotPasswordPage] = useState(false);
    /////////////Signup screen content////////////////////
    //initial signup form field values
    const initialValues={
        fullName:'',
        email:'',
        password:'',
        password_2:'',
        cnic:'',
        role:'student'
    };
    //signup on submit handler
    const onSubmit=values=>{
        createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          // Signed in 
          set(ref(getDatabase(), '/roles/' + values.role +'/'+ userCredential.user.uid), {
                active_status: true,
                created_at:getDatetime(),
                fullName: values.fullName,
                email: values.email,
                cnic:values.cnic
          });
          set(ref(getDatabase(), '/profileData/' + userCredential.user.uid), {
            fullName: values.fullName,
            email: values.email,
            cnic:values.cnic,
            active_status: true,
            created_at:getDatetime()
      });
                console.log('New Role Added successfully');
                alert("Signup Successful!")
          setSignupPage(false);
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert('ERROR: '+errorMessage);
        });
    };
    //signup form fields validations
    const validate=values=>{
        let errors={}
        if(!values.fullName){
            errors.fullName='Fullname is not set';
        }
        if(!values.email){
            errors.email='Email is required';
        }
        if(!values.password){
            errors.password='Password is required';
        }
        if(!values.password_2){
            errors.password_2='Please confirm the password';
        }
        if(!values.cnic){
            errors.cnic='CNIC or Passport number is required';
        }
        if(values.password !== values.password_2){
            errors.password_2='Passwords did not match!';
        }
        if(values.password.length <= 5){
            errors.password='Password must be at least 6 characters long';
        }
        return errors;
    }
    //formik for signup form
    const formik=useFormik({
        initialValues,
        onSubmit,
        validate
    });
    //////////////END - Signup///////////////////
   
   //////////////Login screen content////////////////////
    //Login form submit handler
    const loginSubmitHandler =async (e) => {
        e.preventDefault();
        setShowLoader(true);

        //handleGoogleSignIn();
        try{
        let userCredential=await signInWithEmailAndPassword(auth, email, password);
        // Signed in 
        let currentToken=await userCredential.user.getIdToken();
        console.log(currentToken)
        setState(prev=>{return {...state,token:currentToken}});
        let res=await axios.get(SERVER_NAME+'/users/role',{headers:{authorization:currentToken}});
        if(res.data){
            let response=await update(ref(getDatabase(), '/roles/' + await res.data.role +'/'+ await res.data.uid), {
                last_login_at:getDatetime()
            });
            setShowLoader(false);
            return setState(prev=>{ return {...prev,role:res.data.role,userSignedIn:true}});
        }else{
            alert('Invalid Login Credentials!');
        }
        }catch(e){
            alert(e.toString().replaceAll('Firebase','').split('.')[0]);
            setShowLoader(false)
        }
    }

    //useEffect hook to get already logged in user
    useEffect(() => {
        setShowLoader(true);
        onAuthStateChanged(auth,(userCredential)=>{
            if(userCredential){
                userCredential.getIdToken()
                .then(async(token)=>{
                    let res=await axios.get(SERVER_NAME+'/users/role',{headers:{authorization:token}});
                    if(res){
                        setShowLoader(false);
                        console.log(token);
                    }
                    return setState(prev=>{ return {...prev,role:res.data.role,userSignedIn:true}});
                }).catch(err=>setShowLoader(false))
            }
            else{
                setShowLoader(false)
            }
        })
    }, []);

    //Google sign-in handler
    const handleGoogleSignIn=()=>{
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((userCredential)=>{
            userCredential.user.getIdToken()
            .then((currentToken)=>{
                console.log(props.role+' '+currentToken)
                
                fetchRole(currentToken);
            })
        })
    }
    //checks whether logged-in user exists in user selected role in database
    const fetchRole=async(t)=>{
        setShowLoader(true);
        //console.log("Role in fetch start:"+props.role)
        //props.dispatch(setRole(props.role))
        axios.get(SERVER_NAME+"/login",{
            headers:{
                Authorization:state.role+' '+t
            },
        })
        .then((res)=>{
            console.log(res);
            //get res.data.errormessae || successMessage || message and perform operations according to role
            if(res.data.successMessage){
                //windows.name=props.role;
                setShowLoader(false);
                return setState({...state,userSignedIn:true});
            }
            else{
                alert("User Authentication Error");
                console.log("Error message: "+res.data.errorMessage+" \n message: "+res.data.message)
            }
            setShowLoader(false);
            
        }).catch((error)=>{
            console.log("ERROR: "+error.message);
            setShowLoader(false);
        })
        //console.log('Role in fetch end:'+props.role)
    }

    const forgetPasswordHandler=(e)=>{
        e.preventDefault();
        auth.fetchSignInMethodsForEmail(email)
        .then(signInMethod=>{
            if(signInMethod.length){
                auth.sendPasswordResetEmail(email)
                .then(()=>{
                    alert('A password reset email is sent at '+email+'\nPlease check spam folder too!');
                    setForgotPasswordPage(false);
                })
                .catch(err=>console.log(err));
                return;
            }
            alert('User does not exist!\nPlease Signup first.')
        }).catch(()=>alert('User does not exist!\nPlease Signup first.'))
        
    }
    console.log('final role:'+state.role)
    return (
        showLoader?
        <div style={{marginTop:'10%', marginLeft:'45%'}}>
            <PuffLoader size={100}/>
        </div>
        :
        state.userSignedIn?
            state.role==='admin'?
                <AdminRoutes/>
            :
                state.role==='donor'?
                    <DonorRoutes/>
                :
                    <StudentRoutes/>
        :
        ( 
            signupPage?
            <div className="d-flex justify-content-center" style={classes.signupBackgroundImage}>
                <div style={classes.signupCard} className="w-25 p-3 shadow-lg text-light">
                <form onSubmit={formik.handleSubmit}>
                    <center>
                        <h3>Sign Up</h3>
                    </center>
                    <div className="form-group">
                    <label>As: </label>
                    <select name="role" className="btn btn-primary" onChange={formik.handleChange}>
                        <option selected value="student">Student</option>
                        <option value="donor">Donor</option>                        
                    </select><br/><br/>
                    </div>
                    <div className="form-group">
                        <label>Full name</label>
                        <input type="text" value={formik.values.fullName} onChange={formik.handleChange} name="fullName" id="fullName" className="form-control" placeholder="Full name" required/>
                        {formik.touched.fullName && formik.errors.fullName?<span style={{color:'red'}}>{formik.errors.fullName}</span>:null}
                        <br/>
                    </div>
                    <div className="form-group">
                        <label>CNIC/Passport number</label>
                        <input type="text" value={formik.values.cnic} onChange={formik.handleChange} name="cnic" id="cnic" className="form-control" placeholder="CNIC or Passport Number" required/>
                        {formik.touched.cnic && formik.errors.cnic?<span style={{color:'red'}}>{formik.errors.cnic}</span>:null}
                        <br/>
                    </div>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" value={formik.values.email} onChange={formik.handleChange} name="email" id="email" className="form-control" placeholder="Enter email" required/>
                        {formik.touched.email && formik.errors.email?<span style={{color:'red'}}>{formik.errors.email}</span>:null}
                        <br/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={formik.values.password} onChange={formik.handleChange} name="password" id="password" className="form-control" placeholder="Enter password" required min='6'/>
                        {formik.touched.password && formik.errors.password?<span style={{color:'red'}}>{formik.errors.password}</span>:null}
                    </div>
                    <div className="form-group">
                        <input type="password" value={formik.values.password_2} onChange={formik.handleChange} name="password_2" id="password_2" className="form-control" placeholder="Confirm password" required min='6'/>
                        {formik.touched.password_2 && formik.errors.password_2?<span style={{color:'red'}}>{formik.errors.password_2}</span>:null}
                        <br/>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                        <br/>
                    </div>
                    <p onClick={()=>setSignupPage(false)} role='button' className="link-light">Login here</p>
                    <p id='message'></p>
                </form>
                </div>
            </div>
            :
            <div className="d-flex" style={classes.loginBackgroundImage}>
                <div style={{height:'600px'}}>
                    <div style={classes.loginCard} className="m-5 p-3 shadow-lg text-light">
                        
                        {forgotPasswordPage?
                        <form onSubmit={forgetPasswordHandler}>
                            <center>
                                <h3>Password Recovery</h3>
                            </center>
                            <div className="form-group">
                                <label>Email address</label>
                                <input type="email" name="email" onChange={(e)=>setEmail(e.target.value)} className="form-control" placeholder="Enter email address" required/>
                            </div>
                            <div><br></br></div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Send Email</button>
                                <button type="button" onClick={()=>setForgotPasswordPage(false)} className="btn btn-secondary">Cancel</button>
                            </div>
                            
                        </form>
                        :
                        
                        <form onSubmit={loginSubmitHandler}>
                            <center>
                                <h3>Login</h3>
                            </center>
                        {/* <div className="form-group">
                            <select name="role" className="btn btn-primary" onChange={(e)=>{
                                setState({...state,role:e.target.value})
                                }}>
                                <option value="student">Student</option>
                                <option value="donor">Donor</option> 
                                <option value="admin">Admin</option>                        
                            </select>
                            </div>*/}
                            <div className="form-group">
                                <label>Email address</label>
                                <input type="email" name="email" onChange={(e)=>setEmail(e.target.value)} className="form-control" placeholder="Enter email" required/>
                            </div>
                            <div><br></br></div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)} className="form-control" placeholder="Enter password" required/>
                            </div>
                            <div><br></br></div>

                            <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" disabled className="custom-control-input" id="customCheck1" />
                                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                                </div>
                            </div>
                            <div><br></br></div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <br/><br/>
                            </div>
                            <p style={{cursor:'pointer'}} onClick={()=>{setForgotPasswordPage(true)}}>Forgot password?</p>
                            <p onClick={()=>setSignupPage(true)} role='button'  className="link-light">New here?</p>
                        </form>
                        }
                    </div>
                </div>
            </div>
        )
    );
}

export default Login;//connect(mapStateToProp)(Login)