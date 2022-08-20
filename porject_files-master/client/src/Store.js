import React, {  createContext,useState } from "react";
import { auth } from "./components/firebase/config";
const initialState={
    role:'student',
    userSignedIn:false,
    uid:'',
    token:''
}

export const Context =createContext();

const Store = ({children}) => {
    const [state, setState] = useState(initialState);

    return (
        <Context.Provider value={[state,setState]}>
            {children}
        </Context.Provider>
    )
}

export default Store;