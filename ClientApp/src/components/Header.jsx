import React from 'react';
import { connect } from 'react-redux';
import { ReactComponent as Logo } from '../assets/Rishi-Icon.svg';
import { HeaderContainer, LogoContainer, OptionsContainer} from '../styles/HomePage-Styles.jsx';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import * as actions from "../actions/Login";
import { withRouter, useHistory } from 'react-router-dom';
import Profile from "./Profile";

const Header = ({ ...props }) => {

    let history = useHistory();

    //const notify = () => toast('Welcome To My World', {
    //    position: "top-center",
    //    autoClose: 5000,
    //    hideProgressBar: false,
    //    closeOnClick: true,
    //    pauseOnHover: true,
    //    draggable: true,
    //    progress: undefined,
    //});    

    const [finishStatus, setfinishStatus] = useState(false);

    const onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!finishStatus) {
            if (window.confirm("Do you want to go back. Login form will be re-submitted again")) {                
                setfinishStatus(true);
                localStorage.clear();
                localStorage.setItem('back', true);
                history.push('/login');                
            } else {
                window.history.pushState(null, null, window.location.pathname);
                setfinishStatus(false)
            }
        }
    }    

    useEffect(() => {
        /*notify(); */              
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };        
    }, []);

    return (
        <React.Fragment>
        <HeaderContainer>
            <LogoContainer to='/'>
                <Logo className='logo' />
            </LogoContainer>            
            <OptionsContainer>                
                   <Profile renderToChild={props.render} />
                </OptionsContainer>
            </HeaderContainer>            
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    loginList: state.login.login
})

const mapActionToProps = {
    login: actions.post
}

export default withRouter(connect(mapStateToProps, mapActionToProps)(Header));