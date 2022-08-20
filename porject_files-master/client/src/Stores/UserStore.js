import { createStore } from "redux";
import userReducer from "../Reducers/UserReducer";

const userStore=createStore(userReducer);

export default userStore;