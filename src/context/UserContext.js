import React from "react";
import instance from "../services";
import * as AppURL from "../services/urlAPI";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, loginFailure: null };
    case "LOGIN_FAILURE":
      return { ...state, isAuthenticated: false, loginFailure: action.message };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false, loginFalure: null };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
    loginFailure: null
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

async function loginUser(dispatch, login, password, history, setIsLoading, notify) {
  setIsLoading(true);

  if (!!login && !!password) {
    await instance.post(AppURL.login, { username: login, password })
      .then(res => {
        const status = res?.status;
        console.log("status");
        if (status === 200) {
          const authToken = res?.token;
          localStorage.setItem("id_token", authToken);
          setIsLoading(false)
          dispatch({ type: 'LOGIN_SUCCESS' })
          history.push('/app/dashboard')
        } else if (status === 400) {
          console.log(res)
          const msg = res?.message || 'Username and/or password wrong';
          dispatch({ type: "LOGIN_FAILURE", message: msg });
          notify(msg);
          setIsLoading(true);
        }
      })
      .catch(error => {
        dispatch({ type: "LOGIN_FAILURE" });
        // showError('Something wrong')
        setIsLoading(false);
      })
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    // showError('Something wrong')
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
