import {
  SET_SOCKET,
  SET_USER,
  SET_USER_DATA,
  SET_USER_PROFILE_LIST,
} from "./actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  socket: null, // Start as null or a default value
};

const userInitialState = {
  user: null, // Start with a default value (null)
};
const userDataInitialState = {
  userdata: [], // Start with a default value (null)
};
const profileListInitialState = {
  profileList: [], // Start with a default value (null)
};

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SOCKET:
      return { ...state, socket: action.payload };
    default:
      return state;
  }
};

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
const userDataReducer = (state = userDataInitialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return { ...state, userdata: action.payload };
    default:
      return state;
  }
};
// Profile List Reducer
const profileListReducer = (state = profileListInitialState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE_LIST:
      // Ensure the payload is an array, if it's not, default it to an empty array
      const newProfiles = Array.isArray(action.payload) ? action.payload : [];

      return {
        ...state,
        profileList: [
          ...state.profileList,
          ...newProfiles
            .filter(
              (newProfile) =>
                !state.profileList.some(
                  (existingProfile) => existingProfile.id === newProfile.id
                ) // Ensure no duplicates based on 'id'
            )
            .map((newProfile) => ({
              id: newProfile.id,
              image: newProfile.image, // Ensure id and image are stored correctly
            })),
        ],
      };
    default:
      return state; // Return unchanged state if action type doesn't match
  }
};

export { socketReducer, userReducer, userDataReducer, profileListReducer };
