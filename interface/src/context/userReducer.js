// import Cookie from "js-cookie"
// export const userReducer = (state = Cookie.get("user") ? JSON.parse(Cookie.get("user")) : null, action) => {
//     switch (action.type) {
//         case "LOGIN":
//             return action.payload;
//     }
//     return state;
// }

// import Cookie from "js-cookie";

// const initialState = {
//     emailUser: null,
//     metamaskUser: null,
// };


import Cookie from 'js-cookie';
// import { LOGIN_SUCCESS, LOGOUT } from './userActions';

// Retrieve the token from the cookie (if it exists)
const initialToken = Cookie.get('User');

const initialState = {
    emailUser: null,
    metamaskUser: null,
    token: initialToken,
};

export const userReducer = (state = initialState.token ? initialState : null, action) => {
    switch (action.type) {
        case 'LOGIN':
            if (action.payload.loginMethod === 'email') {
                console.log(action.payload.user)
                return {
                    ...state,
                    emailUser: action.payload.user,
                    metamaskUser: null, // Reset metamaskUser when emailUser logs in
                };
            } else if (action.payload.loginMethod === 'web3') {
                return {
                    ...state,
                    emailUser: null, // Reset emailUser when metamaskUser logs in
                    metamaskUser: action.payload.user,
                };
            }
            break;
        case 'LOGOUT':
            // Clear the token from the cookie when the user logs out
            Cookie.remove('User');
            return {
                ...state,
                emailUser: null,
                metamaskUser: null,
                token: null,
            };
        default:
            return state;
    }
    return state;
};