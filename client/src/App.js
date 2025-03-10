import React from 'react';
// import { Provider } from 'react-redux';
// import userStore from './Stores/UserStore'
//import Routes from './Routes';
import Login from './pages/login/Login';
//import Cookies from 'universal-cookie';
import Store from './Store';
import { Success } from './pages/stripe/Success';
import { Cancel } from './pages/stripe/Cancel';
import { WithdrawSuccess } from './pages/stripe/WithdrawSuccess';
import { WithdrawCancel } from './pages/stripe/WithdrawCancel';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; 

function App() {
  return(
    <Store>
      {window.location.href.includes(`http://localhost:3000/withdraw-success`)?
        <WithdrawSuccess/>
        :
        window.location.href.includes(`http://localhost:3000/success`)?
          <Success/>
        :
          window.location.href.includes(`http://localhost:3000/cancel`)?
            <Cancel/>
          :
            window.location.href.includes(`http://localhost:3000/withdraw-cancel`)?
              <WithdrawCancel/>
              :
              <Login/>
        
      }
    </Store>
  );
}

export default App;