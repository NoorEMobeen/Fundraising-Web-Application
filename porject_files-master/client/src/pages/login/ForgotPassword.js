import React, { Component } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default class ForgotPassword extends Component {

    constructor(props){
        super(props);
        this.state={
            email:'',
        }
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]:e.target.value})
    }

    submitHandler = (e) => {
        e.preventDefault();

        // const auth = getAuth();
        // sendPasswordResetEmail(auth,this.state.email)
        // .then(() => {
        //     alert("A password reset email is sent to",this.state.email);
        //     // Password Reset Email Sent
        //     console.log("A password reset email is sent to",this.state.email);
        // })
        // .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     console.log("Password reset Error: ",errorCode,errorMessage);
        //     alert("Error: ",errorMessage);
        // });

        
        // const auth = getAuth();
        // signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        // .then((userCredential) => {
        //     // Signed in 
        //     const user = userCredential.user;
        //     // ...
        //     console.log("User has signed in Successfully!");
        // })
        // .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     console.log("User has signed in Error: ",errorCode,errorMessage);
        // });
        // axios.post("http://localhost:5000/signup",this.state).then(res=>{
        //         console.log('Here is ',res);
        // })
    }

    render() {
        return (
            <div style={{marginTop:"100px", borderRadius:"20px"}} className="offset-4 w-25 p-3 shadow-lg p-3 mb-5 bg-white">
                <form onSubmit={this.submitHandler}>
                    <center>
                        <h3>Password Recovery</h3>
                    </center>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" name="email" onChange={this.changeHandler} className="form-control" placeholder="Enter email address" required/>
                    </div>
                    <div><br></br></div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Send Email</button>
                    </div>
                    <p className="forgot-password text-right">
                        go to <a href="login">Login</a>
                    </p>
                </form>
            </div>
        );
    }
}
