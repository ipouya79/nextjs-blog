import { createContext, useContext, useEffect, useReducer } from 'react';
import { BASE_URL } from '../BASE_URL/baseUrl';
import { cityInitState, cityReducer } from './reducer/cityReducer';
import { userReducer, userInitState } from './reducer/userReducer';

const AppContext = createContext();

const AppWrapper = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, userInitState);
  const [cities, setCities] = useReducer(cityReducer, cityInitState);

  useEffect(async () => {
    let controller = new AbortController();

    async function getUserData() {
      const userData = await fetch(`${BASE_URL}/api/user/info`, {
        credentials: 'include',
        signal: controller.signal,
      });

      if (userData.status == 200) {
        const { user, role, mongoId } = await userData.json();

        dispatch({
          type: 'change',
          payload: {
            ...user,
            role: role.role,
            roleType: role.roleType,
            mongoId,
          },
        });
      }
    }

    getUserData();

    return () => controller.abort();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, changer: dispatch, cities, dispatchCity: setCities }}
    >
      {children}
    </AppContext.Provider>
  );
};

const UseAppContext = () => {
  return useContext(AppContext);
};

module.exports = {
  AppWrapper,
  UseAppContext,
};
