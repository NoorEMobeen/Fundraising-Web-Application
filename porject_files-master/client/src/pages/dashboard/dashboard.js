import {useState} from 'react';
import './../../components/constants/style.css';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import DonorDashboard from './DonorDashboard';
import Home from '../home/Home';
import { connect } from 'react-redux';

const mapStateToProp=(state)=>{
    return{
        role:state.role
    }
}

// function getCurrentDate(separator=''){

//     let newDate = new Date()
//     let date = newDate.getDate();
//     let month = newDate.getMonth() + 1;
//     let year = newDate.getFullYear();
    
//     return `${date}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
// }

    //Dummy data for Request cards

const Dashboard = (props) => {
    //const {searchTerm,setSearchTerm}=useState('');

    

    // const [data, setData] = useState(dataLine);
    // const [options, setOptions] = useState(optionsLine);
    // const [dataDoughnut, setDataDoughnut] = useState(dataDoughnutSample);
    // const [dataBar, setDataBar] = useState(dataBarSample);
    // const [optionsBar, setOptionsBar] = useState(optionsBarSample);

    return (
        props.role?
            props.role==="admin"?
                <AdminDashboard/>
            :
            props.role==="student"?
                <StudentDashboard/>
                :
                <DonorDashboard/>
        :
        <AdminDashboard/>
    );
}

export default connect(mapStateToProp)(Dashboard);