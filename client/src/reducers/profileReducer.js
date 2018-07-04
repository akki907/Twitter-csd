import {
    GET_PROFILE,
    GET_All_PROFILES,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
    GET_INDIVIDUAL_PROFILE
  } from "../actions/types";
  
  const initialState = {
    profile: null,
    profiles: null,
    loading: false,
    individual :null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case PROFILE_LOADING:
        return {
          ...state,
          loading: true
        };
      case GET_PROFILE:
        return {
          ...state,
          profile: action.payload,
          loading: false
        };
      case GET_All_PROFILES:
        return {
          ...state,
          profiles: action.payload,
          loading: false
        };
      case GET_INDIVIDUAL_PROFILE:
        return {
          ...state,
          individual: action.payload,
          loading: false
        };
      case CLEAR_CURRENT_PROFILE:
        return {
          ...state,
          profile: null
        };
      default:
        return state;
    }
  }