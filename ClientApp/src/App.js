import React, { useState } from 'react';
//import Learning from './components/Learning';
import { useIsMountedRef } from './components/Login';
//import Home from "./components/HomePage";
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { lazy, Suspense, useEffect, createContext, useContext } from 'react';
import PuffLoader from "react-spinners/PuffLoader";
import { css } from "@emotion/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionTimeout from './components/SessionTimeout';
import { onSignOut } from './components/HomePage';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from './context/ColorModeContext';


const Learning = lazy(() => import('./components/Learning'));
const Login = lazy(() => import('./components/Login'));
const Home = lazy(() => import('./components/HomePage'));
const Profile = lazy(() => import('./components/Profile'));
const About = lazy(() => import('./components/About'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const PageNotFound = lazy(() => import('./components/PageNotFound'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const ForgotPasswordWithEmail = lazy(() => import('./components/ForgotPasswordWithEmail'));

export const UserContext = createContext();

const App = ({ ...props }) => {
    //const [loading, setLoading] = useState(false);
    //useEffect(() => {
    //    setLoading(true);
    //    setTimeout(() => {
    //        setLoading(false);
    //    }, 8000);
    //}, []);

    const isMountedRef = useIsMountedRef();

    // Define theme settings
    const theme = createTheme({
        palette: {
            type: 'light'
        }
    });

    let authValue = false;
    let id = null;
    let userDetails = null;
    let imageSrc = null;
    
    //localStorage.clear();
    //alert("1--> In App method");
    if (isMountedRef.current) {
        //alert("2--> In Login isMountedRef");
        authValue = props.auth;
        id = props.id;
        userDetails = props.userDetails;
        imageSrc = props.imageSrc;
        
        if (authValue) {
            localStorage.setItem('auth', true);
            //alert("auth value true");
        }
        else {
            localStorage.removeItem('auth');
            //alert("auth value false");
        }

        if (id != null && id != undefined) {
            localStorage.setItem('LoggedInUserId', id);
        }
        else {
            localStorage.removeItem('LoggedInUserId');
        }

        if (userDetails != null && userDetails != undefined) {
            localStorage.setItem('LoggedInUserDetails', userDetails);                       
        }
        else {
            localStorage.removeItem('LoggedInUserDetails');            
        }

        if (imageSrc != null && imageSrc != undefined) {            
            localStorage.setItem('LoggedInUserImageSrc', imageSrc);
        }
        else {            
            localStorage.removeItem('LoggedInUserImageSrc');
        }
    }

    const user = {
        id: id,
        userDetails: userDetails,
        imgSrc: imageSrc
    }

    if (performance.navigation.type === 1) {
        //alert("This page is reloaded");
        let sessionDataOnRefresh = localStorage.getItem('auth');
        if (sessionDataOnRefresh) {
            authValue = true;
        }
        else {
            authValue = false;
        }
    }

    let sessionData = localStorage.getItem('auth');
    //localStorage.setItem('initApp', true);
    if (sessionData) {
        authValue = true;
        //localStorage.removeItem('initApp');
    }
    else {
        authValue = false;
    }

    //const [isAuthenticated, setAuth] = useState(false);
    
    //const handleClick = () => {
    //    setAuth(!isAuthenticated);
    //}    
    

    let routes = (
        <Switch>            
            <Route path='/learning' component={Learning} />
            <Route path='/ForgotPassword' component={ForgotPassword} />
            <Route path='/ForgotPasswordWithEmail' component={ForgotPasswordWithEmail} />
            <Route path='/login' component={Login} />
            <Route path='/home' component={Login} />
            <Route path='/about' component={Login} />
            <Route path='/ProfilePage' component={Login} />            
            <Route path='/profile' component={Login} />
            <Redirect from='/' to='/login' exact />            
            <Route path='*' component={PageNotFound} />            
        </Switch>
    );

    if (authValue) {
        //const notify = () =>toast('🦄 Wow so easy!', {
        //    position: "top-center",
        //    autoClose: 5000,
        //    hideProgressBar: false,
        //    closeOnClick: true,
        //    pauseOnHover: true,
        //    draggable: true,
        //    progress: undefined,
        //});
        //<ToastContainer
        //    position="top-center"
        //    autoClose={5000}
        //    hideProgressBar={false}
        //    newestOnTop={false}
        //    closeOnClick
        //    rtl={false}
        //    pauseOnFocusLoss
        //    draggable
        //    pauseOnHover
        ///>
        routes = (
            <UserContext.Provider value={user}>
            <Switch>                
                <Route path='/home' component={Home} />
                <Route path='/learning' component={Learning} />
                <Route path='/ForgotPassword' component={ForgotPassword} />
                <Route path='/ForgotPasswordWithEmail' component={ForgotPasswordWithEmail} />
                <Route path='/login' component={Login} />
                <Route path='/profile' component={Profile} />
                <Route path='/about' component={About} />
                <Route path='/ProfilePage' component={ProfilePage} />  
                <Redirect from='/' to='/home' exact />  
                <Route path='*' component={PageNotFound} />                               
            </Switch>
            </UserContext.Provider>
        );
    }       
            

    const override = css`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;    

    //if (authValue)
    //    addToast("Login successful", { appearance: 'success', autoDismiss: true })
  

    return (
        <BrowserRouter>
            <div>
                <div className="container px-3 mx-auto">
                    {/*<Switch>*/}
                    {/*    <Route*/}
                    {/*        exact*/}
                    {/*        path='/'*/}
                    {/*        render={() => authValue ? (<Home />) : (<Login />)} />*/}
                    {/*    <Route*/}

                    {/*        path='/Home'*/}
                    {/*        render={() => authValue ? (<Home />) : (<Login />)} />*/}
                    {/*    <Route*/}

                    {/*        path='/Login'*/}
                    {/*        render={() => authValue ? (<Home />) : (<Login />)} />*/}
                    {/*    <Route*/}

                    {/*        path='/Learning'*/}
                    {/*        render={() => authValue ? (<Home />) : (<Learning />)} />*/}
                    {/*</Switch>*/}
                    <Suspense fallback={<PuffLoader color={'#000000'} size={150} css={override} loading={true} />}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            {routes}
                        </ThemeProvider>
                    </Suspense>
                    <ToastContainer />
                </div>
            </div>
            <SessionTimeout isAuthenticated={authValue} logOut={() => onSignOut(true)} />
        </BrowserRouter>

    );
}

const mapStateToProps = state => ({
    auth: state.login.auth,
    id: state.login.id,
    userDetails: state.login.userDetails,
    imageSrc: state.login.imageSrc
})

export default connect(mapStateToProps, null)(App);

