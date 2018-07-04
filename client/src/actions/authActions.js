// Register

import {GET_ERRORS} from './types'
import { SET_CURRENT_USER} from './types'
import axios from "axios";
import setAuthToken from './../utility/setAuthToken'
import jwt_decode from 'jwt-decode'
export const registeruser = (userData,history)=> dispatch =>{
     axios
      .post("/api/auth/register", userData)
      .then(user => history.push('/login'))
      .catch(err => {
        dispatch({
          type:GET_ERRORS,
          payload:err.response.data.message
        })
      });
}


export const loginUser = (userData,history)=> dispatch =>{
  axios
   .post("/api/auth/login", userData)
   .then(res => {
     const token  = res.data.token
     localStorage.setItem('jwtToken',token)
    //@ set this to header for Header for future purpose
    setAuthToken(token)
    const decoded = jwt_decode(token)
    console.log('==========',decoded)
    dispatch(setCurrentUser(decoded))
   }
  )
   .catch(err => {
     dispatch({
       type:GET_ERRORS,
       payload:err.response.data.message
     })
   });
}

export const setCurrentUser = decoded =>{
  return {
    type: SET_CURRENT_USER,
    payload:decoded
  }
}

export const logoutUser = ()=>dispatch=>{

  localStorage.removeItem('jwtToken');

  setAuthToken(false);

  dispatch(setCurrentUser({}))
}