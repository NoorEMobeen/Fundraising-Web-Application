import React from 'react'
import { connect } from 'react-redux';
import { setRole } from '../../Actions/UserAction';
import Login from '../login/Login';

const mapStateToProp=(state)=>{
    return{
        role:state.role,
        userSignedIn:state.userSignedIn
    }
}

function Home(props) {

    return (

        <div>
            <Login>
                <button onClick={()=>{props.dispatch(setRole('student')); window.name='student'; console.log('student')}}>Login as Student</button>
                <button onClick={()=>{props.dispatch(setRole('donor')); window.name='donor'; console.log('donor')}}>Login as Donor</button>
                <button onClick={()=>{props.dispatch(setRole('admin')); window.name='admin'; console.log('admin')}}>Login as Admin</button>
            </Login>
        </div>
    )
}

export default connect(mapStateToProp)(Home)