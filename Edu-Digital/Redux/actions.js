// actions.js

export const SET_SOCKET = "SET_SOCKET";
export const SET_USER = "SET_USER";
export const SET_USER_DATA = "SET_USER_DATA";
export const SET_USER_PROFILE_LIST = "SET_USER_PROFILE_LIST";

export const setSocket = (socket) => ({
  type: SET_SOCKET,
  payload: socket,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});
export const setProfileList = (data) => ({
  type: SET_USER_PROFILE_LIST,
  payload: data,
});
export const setUserData = (data) => ({
  type: SET_USER_DATA,
  payload: data,
});
