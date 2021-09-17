const userInitState = {
  username: '',
  avatar: '',
  role: '',
  roleType: '',
  userType: '',
  isRestricted: '',
  emailVerified: '',
  mobileVerified: '',
  id: '',
  mobile: '',
  email: '',
  mongoId: '',
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'change':
      return { ...action.payload };

    case 'sign':
      return {
        ...state,
        username: action.payload.username,
        email: action.payload.email,
        mobile: action.payload.mobile,
      };

    case 'verify':
      return {
        ...state,
        emailVerified: action.payload.emailVerified,
        mobileVerified: action.payload.mobileVerified,
      };

    default:
      return state;
  }
};

module.exports = { userReducer, userInitState };
