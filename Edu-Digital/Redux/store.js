// store.js

import { combineReducers } from "redux";
import {
  socketReducer,
  userReducer,
  userDataReducer,
  profileListReducer,
  apiUrlReducer,
} from "./reducer";
import { legacy_createStore as createStore } from "redux";

const rootReducer = combineReducers({
  socket: socketReducer,
  user: userReducer,
  userData: userDataReducer,
  profileList: profileListReducer,
  apiUrl: apiUrlReducer,

  // other reducers can be added here
});

export const store = createStore(rootReducer);
