// import React,{Component} from "react";

// //import axios from "axios";
// import admin from "../../components/firebase/config";
// import { createUserWithEmailAndPassword } from "@firebase/auth";
// import { ref,set } from "@firebase/database";
// import {useFormik} from 'formik';


// const initialValues={
//     fullName:'',
//     email:'',
//     password:'',
//     password_2:'',
//     role:''
// };

// const onSubmit=values=>{
//     const auth=admin.auth();
//     auth.createUserWithEmailAndPassword(values.email,values.password)
//     .then(({user})=>{
//         return user.getIdToken().then((idToken)=>{
//             return fetch('/sessionLogin',{
//                 method:'POST',
//                 headers:{
//                     "Accept":'application/json',
//                     "Content-Type":'application/json'
//                 },
//                 body:JSON.stringify({idToken})
//             })
//         })
//     }).then(()=>{
//         return auth.signOut();
//     }).then(()=>{
//         console.log('in final promis @ signup page');
//         //Can perform page redirection here
//     }).catch((error)=>{
//         console.log('ERROR:'+error.message);
//     })

// };

// const validate=values=>{
//     let errors={}
//     if(!values.fullName){
//         errors.fullName='Fullname is not set';
//     }
//     if(!values.email){
//         errors.email='Email is required';
//     }
//     if(!values.password){
//         errors.password='Password is required';
//     }
//     if(!values.password_2){
//         errors.password_2='Please confirm the password';
//     }
//     return errors;
// }

// const SignUp =(props)=>{

//     const formik=useFormik({
//         initialValues,
//         onSubmit,
//         validate
//     });

//     return (
//         <div style={{marginTop:"20px", borderRadius:"20px"}} className="offset-4 w-25 p-3 shadow-lg p-3 mb-5 bg-white">
//             <form onSubmit={formik.handleSubmit}>
//                 <center>
//                     <h3>Sign Up</h3>
//                 </center>
//                 <div className="form-group">
//                     <label>Full name</label>
//                     <input type="text" value={formik.values.fullName} onChange={formik.handleChange} name="fullName" id="fullName" className="form-control" placeholder="Full name" required/>
//                     {formik.touched.fullName && formik.errors.fullName?<span style={{color:'red'}}>{formik.errors.fullName}</span>:null}
//                     <br/>
//                 </div>
//                 <div className="form-group">
//                     <label>Email address</label>
//                     <input type="email" value={formik.values.email} onChange={formik.handleChange} name="email" id="email" className="form-control" placeholder="Enter email" required/>
//                     {formik.touched.email && formik.errors.email?<span style={{color:'red'}}>{formik.errors.email}</span>:null}
//                     <br/>
//                 </div>
//                 <div className="form-group">
//                     <label>Password</label>
//                     <input type="password" value={formik.values.password} onChange={formik.handleChange} name="password" id="password" className="form-control" placeholder="Enter password" required min='6'/>
//                     {formik.touched.password && formik.errors.password?<span style={{color:'red'}}>{formik.errors.password}</span>:null}
//                 </div>
//                 <div className="form-group">
//                     <input type="password" value={formik.values.password_2} onChange={formik.handleChange} name="password_2" id="password_2" className="form-control" placeholder="Confirm password" required min='6'/>
//                     {formik.touched.password_2 && formik.errors.password_2?<span style={{color:'red'}}>{formik.errors.password_2}</span>:null}
//                     <br/>
//                 </div>
//                 <div className="form-group">
//                 <label>Select Role</label><br/>
//                 <select name="role" className="btn btn-primary" onChange={formik.handleChange}>
//                     <option selected value="student">Student</option>
//                     <option value="donor">Donor</option>                        
//                 </select><br/><br/>
//                 </div>
//                 <div className="text-center">
//                     <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
//                     <br/>
//                 </div>
//                 <p className="forgot-password text-right">
//                     Already registered <a href="login">sign in?</a>
//                 </p>
//                 <p id='message'></p>
//             </form>
//         </div>
//     );
// }

// // class SignUp extends Component {

// //     constructor(props){
// //         super(props);
// //         this.state={
// //             fullName:'',
// //             email:'',
// //             password:'',
// //             role:'student',
// //         }
// //         this.passwordConfirmCheck=this.passwordConfirmCheck.bind();
// //         this.changeHandler=this.changeHandler.bind();
// //         this.submitHandler=this.submitHandler.bind();
// //     }

// //     passwordConfirmCheck(e) {
// //         if (this.state.password ===
// //             e.target.value) {
// //             document.getElementById('message').style.color = 'green';
// //             document.getElementById('message').innerHTML = 'matching';
// //         } else {
// //             document.getElementById('message').style.color = 'red';
// //             document.getElementById('message').innerHTML = 'not matching';
// //         }
// //     }

// //     //   handleSubmit(e){
// //     //       const res=fetch("http://localhost:5000/signup",
// //     //       {
// //     //           method:"POST",
// //     //           headers:{'Content-type':'application/json',},
// //     //           body:JSON.stringify(e),
// //     //       })
// //     //     return res.json();
// //     //   }

// //     changeHandler = (e) => {
// //         this.setState({[e.target.name]:e.target.value})
// //     }

// //     submitHandler = (e) => {
// //         e.preventDefault();
        
// //         // createUserWithEmailAndPassword(auth, this.state.email,this.state.password)
// //         //   .then((userCredential) => {
// //         //     // Signed in 
// //         //     var user = userCredential.user;
// //         //     console.log('User Signed up successfully');
// //         //     // ...
// //         //     // Creating role
        
// //         //     set(ref(realtimeDB, '/roles/' + this.state.role +'/'+ user.uid), {
// //         //         fullName: this.state.fullName,
// //         //         email: this.state.email
// //         //       });
// //         //       console.log('New Role Added successfully');
// //         //       alert("Signup Successful!\nPlease goto Sign-in..")
// //         //   })
// //         //   .catch((error) => {
// //         //     var errorCode = error.code;
// //         //     var errorMessage = error.message;
// //         //     console.log('User Signed up Error',errorCode,errorMessage);
// //         //     alert("ERROR:"+errorMessage.replace("Firebase:", ""));
// //         //     // ..
// //         //   });
// //     }

// //     render() {
// //         //const {fullName,email,password,role}= this.state;

        
// //     }
// // }

// export default SignUp;

import axios from "axios";
import { useState,useEffect } from "react";
import { SERVER_NAME } from "../../components/config/config";

const SignUp=(props)=>{
    
    const [customers, setCustomers] = useState("");

    useEffect(() => {
            fetchData();
    }, [])

    const fetchData=async()=>{
        axios.get(SERVER_NAME+"/api/customers",{
            headers:{
                Authorization:'Bearer'+'hi'
            }
        })
        .then((res)=>{
            console.log(res);
            var c='';
            res.data.forEach(cust => {
                c+=cust.firstName+' '
            });
            setCustomers(c);
        })
        
    }

    return(
        <>
            <p>{customers}</p>
        </>
    )
}

export default SignUp