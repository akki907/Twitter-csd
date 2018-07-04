import {
    GET_ERRORS,
    PROFILE_LOADING,
    GET_PROFILE,
    CLEAR_CURRENT_PROFILE,
    GET_All_PROFILES,
    GET_INDIVIDUAL_PROFILE
  } from "./types";
  import axios from "axios";
  
  export const getCurrentProfile = () => dispatch => {
    dispatch(setprofileLoading());
    axios
      .get("api/user/profile")
      .then(res => {
        dispatch({
          type: GET_PROFILE,
          payload: res.data.data
        });
      })
      .catch(err =>
        dispatch({
          type: GET_PROFILE,
          payload: {}
        })
      );
  };
  
  export const createProfile = (profileData, history) => dispatch => {
    dispatch(setprofileLoading());
    axios
      .post("api/user/createProfile", profileData)
      .then(res => {
        history.push("/dashboard");
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.message
        })
      );
  };
  
  export const addExperience = (experienceData, history) => dispatch => {
    axios
      .post("api/user/experience", experienceData)
      .then(res => {
        history.push("/dashboard");
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      });
  };
  
  export const addEducation = (educationData, history) => dispatch => {
    axios
      .post("api/user/education", educationData)
      .then(res => {
        history.push("/dashboard");
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      });
  };
  
  // Delete Experience
  export const deleteExperience = (id,history) => dispatch => {
    axios
      .delete(`/api/user/experience/${id}`)
      .then(res => {
        // history.push("/dashboard");
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        })
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };
  
  // Delete Education
  export const deleteEducation = id => dispatch => {
    axios
      .delete(`/api/user/education/${id}`)
      .then(res =>
        dispatch({
          type: GET_PROFILE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };
  
  // Get all profiles
  export const getProfiles = () => dispatch => {
    dispatch(setprofileLoading());
    axios
      .get('/api/user/users')
      .then(res =>{
        dispatch({
          type: GET_All_PROFILES,
          payload: res.data
        })
      }
      )
      .catch(err =>
        dispatch({
          type: GET_All_PROFILES,
          payload: null
        })
      );
  };
  
  export const getProfileByHandle =(handle)=>dispatch => {
    dispatch(setprofileLoading());
    axios
      .get(`/api/user/profile/${handle}`)
      .then(res =>{
        dispatch({
          type: GET_INDIVIDUAL_PROFILE,
          payload: res.data
        })
      }
      )
      .catch(err =>
        dispatch({
          type: GET_PROFILE,
          payload: null
        })
      );
  }
  
  export const setprofileLoading = () => {
    return {
      type: PROFILE_LOADING
    };
  };
  
  export const clearCurrentProfile = () => {
    return {
      type: CLEAR_CURRENT_PROFILE
    };
  };