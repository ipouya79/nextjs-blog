import { AppWrapper } from '../src/Context/context';
import '../styles/globals.css'
import React ,{useEffect} from 'react'
import PropTypes from 'prop-types';
import { QueryClient, QueryClientProvider } from 'react-query'

import HeaderWrapper from '../src/Global/Header/HeaderWrapper/HeaderWrapper';
import NavigationWrapper from '../src/Global/Navigation/NavigationWrapper/NavigationWrapper';

export default function MyApp({ Component, pageProps }) {

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnmount: false,
        refetchOnReconnect: false,
        retry: false,
       
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper>
        <HeaderWrapper />
        <NavigationWrapper />
        <Component {...pageProps}></Component>
      </AppWrapper>
    </QueryClientProvider>

  );
}
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};