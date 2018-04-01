export default function authReducer(state = [], data) {

    switch(data.type) {
      case 'AUTH_LOGIN': {
        return {
          ...state,
          userLoggedIn: true,
          text: data.user,
          token: data.token,
          PHPSESSID: data.PHPSESSID,
          updateUserState: false
        };
      }
      case 'AUTH_LOGOUT': {
        return {
          ...state,
          userLoggedIn: false,
          updateUserState: true,
          text: null
        };
      }
      default:
        return {
          ...state
        };
    }

};
