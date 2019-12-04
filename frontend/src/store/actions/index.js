import * as actionTypes from "./actionTypes";
import axios from "axios";
import {BACKEND_URL} from '../../utils'

export const storeLogin = () => async dispatch => {
  const res = await axios.get(BACKEND_URL + "/api/current_user");
  dispatch({ type: actionTypes.FETCH_USER, user: res.data });
};

// manage card token for payment
export const handleToken = (request) => async dispatch => {
  const res = await axios.post(BACKEND_URL + "/api/stripe", request);
  dispatch({ type: actionTypes.FETCH_RENT, request: res.data });
};

// manage requests
export const fetchRequests = () => async dispatch => {
  const res = await axios.get(BACKEND_URL + '/api/request');
  dispatch({type: actionTypes.FETCH_REQUEST, payload: res.data})
}

export const completeRequest = (id) => async dispatch => {
  const res = await axios.put(BACKEND_URL + '/api/request/complete/' + id);
  dispatch(fetchRequests())
}

export const updateRequest = (id) => async dispatch => {
  const res = await axios.put(BACKEND_URL + '/api/request/pickup/' + id);
  dispatch(fetchRequests())
}


export const deleteRequest = (id) => async dispatch => {
  const res = await axios.delete(BACKEND_URL + '/api/request/' + id);
  // delete picture
  dispatch(fetchRequests())
}