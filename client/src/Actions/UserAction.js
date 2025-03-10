//import { FIREBASE_CONFIG_VAR } from "firebase-admin/lib/app/lifecycle";

const SET_ROLE='SET_ROLE';
const SET_USER_SIGN_IN='SET_USER_SIGN_IN';
const SET_USER_ID='SET_USER_ID'

export function setRole(newRole) {
    return {type:SET_ROLE,newRole:newRole}
}

export function setUserSignIn(userSignedIn) {
    return {type:SET_USER_SIGN_IN,userSignedIn:userSignedIn}
}

export function setUID(uid) {
    return {type:SET_USER_ID,uid:uid}
}