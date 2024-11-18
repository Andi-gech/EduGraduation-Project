// store.js

import { combineReducers } from "redux";
import {
  socketReducer,
  userReducer,
  userDataReducer,
  profileListReducer,
} from "./reducer";
import { legacy_createStore as createStore } from "redux";

const rootReducer = combineReducers({
  socket: socketReducer,
  user: userReducer,
  userData: userDataReducer,
  profileList: profileListReducer,

  // other reducers can be added here
});

export const store = createStore(rootReducer);
