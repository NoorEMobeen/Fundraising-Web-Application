const initialState={
    role:'student',
    userSignedIn:false,
    uid:''
}

const userReducer=(state= initialState,action)=>{
    switch (action.type) {
        case 'SET_ROLE':
            return{
                role:action.newRole
            }
        case 'SET_USER_SIGN_IN':
            return{
                userSignedIn:action.userSignedIn
            }
        case 'SET_USER_ID':
            return{
                uid:action.uid
            }
        default:
            return state;
    }
}

export default userReducer;