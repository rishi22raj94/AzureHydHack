////import * as React from 'react';
////import Avatar from '@mui/material/Avatar';
////import Button from '@mui/material/Button';
////import CssBaseline from '@mui/material/CssBaseline';
////import TextField from '@mui/material/TextField';
////import FormControlLabel from '@mui/material/FormControlLabel';
////import Checkbox from '@mui/material/Checkbox';
////import Link from '@mui/material/Link';
////import Paper from '@mui/material/Paper';
////import Box from '@mui/material/Box';
////import Grid from '@mui/material/Grid';
////import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
////import Typography from '@mui/material/Typography';
////import { createTheme, ThemeProvider } from '@mui/material/styles';
////import { connect } from 'react-redux';
////import { useFormik } from 'formik';
////import * as yup from 'yup';
////import * as actions from "../actions/Login";
////import { Link as RRDLink, useHistory } from 'react-router-dom';
////import { useToasts } from "react-toast-notifications";

////export default function Home(props) {
////    return (
////        <div>
////            Home Page
////        </div>
////    );
////}


import React from 'react';
import { connect } from 'react-redux';
//import { createStructuredSelector } from 'reselect';
//import { auth } from '../../firebase/firebase.utils';
//import CartIcon from '../cart-icon/cart-icon.component';
//import CartDropdown from '../cart-dropdown/cart-dropdown.component';
//import { selectCartHidden } from '../../redux/cart/cart.selectors';
//import { selectCurrentUser } from '../../redux/user/user.selectors';


import { ReactComponent as Logo } from '../assets/crown.svg';
import Footer from './Footer';

import { HeaderContainer, LogoContainer, OptionsContainer, OptionLink, FooterContainer } from '../styles/HomePage-Styles.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import * as actions from "../actions/Login";
import { withRouter, useHistory } from 'react-router-dom';
import Profile from "./Profile";
import Header from "./Header";
import HomePageContent from "./HomePageContent";
import CustomImageList from "./CustomImageList";
import { isMobile } from 'react-device-detect';

export function onSignOut(reload=false) {
    localStorage.removeItem('auth');
    localStorage.removeItem('LoggedInUserId');
    localStorage.removeItem('LoggedInUserDetails');  
    localStorage.removeItem('LoggedInUserImageSrc');
    //localStorage.removeItem('LoggedInUserUpdatedData');
    localStorage.setItem('logged-out', true);
    if (reload) {
        window.location.reload();
    }    
};

const HomePage = ({ ...props }) => {

    //let history = useHistory();

    const notify = () => toast('Welcome To My World', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    function pull_state(data) {
    } 

    const [finishStatus, setfinishStatus] = useState(false);

    //const onBackButtonEvent = (e) => {
    //    e.preventDefault();
    //    if (!finishStatus) {
    //        if (window.confirm("Do you want to go back. Login form will be re-submitted again")) {                
    //            setfinishStatus(true);
    //            localStorage.clear();
    //            localStorage.setItem('back', true);
    //            history.push('/login');                
    //        } else {
    //            window.history.pushState(null, null, window.location.pathname);
    //            setfinishStatus(false)
    //        }
    //    }
    //}    

    useEffect(() => {
        /*notify();*/                       
    }, []);

    let deviceRender = null;

    if (isMobile) {
        deviceRender = (            
            /*Mobile component goes here*/            
            <CustomImageList/>               
        );
    }
    else {
        deviceRender = (
            /*Desktop component goes here*/
            <HomePageContent />
        );
    }

    return (
        <React.Fragment>
            <Header render={pull_state} />            
            {deviceRender} 
        </React.Fragment>
    );
}

//const mapStateToProps = createStructuredSelector({
//    currentUser: selectCurrentUser,
//    hidden: selectCartHidden
//});

/*export default connect(mapStateToProps)(Header);*/


const mapStateToProps = state => ({
    loginList: state.login.login
})

const mapActionToProps = {
    login: actions.post
}

export default withRouter(connect(mapStateToProps, mapActionToProps)(HomePage));