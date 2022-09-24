import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import { blue } from '@mui/material/colors';
import logo from '../assets/profile-pic.jpg';
import Header from "./Header";
import {
    Body,
    Section,
    Container,
    Card,
    Content,
    ImgBx,
    Image,
    Head3,
    Span1,
    UnorderList,
    OrderList,
    IconLink
} from '../styles/About-Styles';
import { UserContext } from '../App.js';
import { useEffect, useState, createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';

//export function onSignOut(e) {
//    localStorage.removeItem('auth');
//    //alert('auth value false and log out value true');
//    localStorage.setItem('logged-out', true);
//};

const AboutRishi = () => {

    var user = useContext(UserContext);
    if (user.id == null || user.userDetails == null) {
        user.id = localStorage.getItem('LoggedInUserId');
        user.userDetails = localStorage.getItem('LoggedInUserDetails');
    }

    var userDetailsData = JSON.parse(user.userDetails);
    var userName = userDetailsData.name;
    var city = userDetailsData.city;
    var email = userDetailsData.email;        
    
    //let history = useHistory();

    const notify = () => toast("Welcome to about page. I'm the architect and owner of this website", {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    function pull_state(data) {
    } 

    //const [finishStatus, setfinishStatus] = useState(false);

    //const onBackButtonEvent = (e) => {
    //    e.preventDefault();
    //    if (!finishStatus) {
    //        if (window.confirm('Do you want to go back. Login form will be re-submitted again')) {
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

    //useEffect(() => {
    //    notify();
    //    window.history.pushState(null, null, window.location.pathname);
    //    window.addEventListener('popstate', onBackButtonEvent);
    //    return () => {
    //        window.removeEventListener('popstate', onBackButtonEvent);
    //    };
    //    //localStorage.removeItem('initApp');
    //}, []);

    useEffect(() => {
        notify();
    }, []);

    return (
        <React.Fragment>
            <Header render={pull_state} />
            {/*{user.id.length > 0 ? <h2>{`Length is greater than 0 Hello ${user.id} again!`}</h2> : <h1>{`Length is less than 0 Hello ${user.id} again!`}</h1>}*/}
            {/*{user.userDetails.length > 0 ? <h2>{`Length is greater than 0 Hello ${user.userDetails} again!`}</h2> : <h1>{`Length is less than 0 Hello ${user.userDetails} again!`}</h1>}*/}
            <Body>
                <Section>
                    <Container>
                        <Card>
                            <Content>
                                <ImgBx>
                                    <Image src={logo} alt='Logo' />
                                </ImgBx>
                                <div className='contentBx'>
                                    <Head3>Rishi<br /><Span1>rishi22raj94@gmail.com</Span1></Head3>
                                </div>
                            </Content>
                            <UnorderList>
                                <OrderList style={{ '--i': '1' }}>
                                    <IconLink aria-label="Linkedin" href="https://www.linkedin.com/in/busanellirishi/">
                                        <LinkedInIcon fontSize='small' sx={{ color: blue[500] }} />
                                    </IconLink>
                                </OrderList>
                                <OrderList style={{ '--i': '2' }}>
                                    <IconLink aria-label="Twitter" href="https://twitter.com/rishi22raj94">
                                        <TwitterIcon fontSize='small' sx={{ color: blue[500] }} />
                                    </IconLink>
                                </OrderList>
                                <OrderList style={{ '--i': '3' }}>
                                    <IconLink aria-label="Mail" href='https://mail.google.com/mail/'>
                                        <LocalPostOfficeIcon fontSize='small' sx={{ color: blue[500] }} />
                                    </IconLink>
                                </OrderList>
                            </UnorderList>
                        </Card>
                    </Container>
                </Section>
            </Body>
        </React.Fragment>
        //    <section>
        //        <div className='container'>
        //            <div className='card'>
        //                <div className='content'>
        //                    <div className='imgBx'>
        //                        <img src={logo} alt='Logo'/>
        //                    </div>
        //                    <div className='contentBx'>
        //                        <h3>Rishi<br /><span>Software Developer</span></h3>
        //                    </div>
        //                </div>
        //                <ul className='sci'>
        //                    <li style={{ '--i': '1' }}>
        //                        <a href='#'><LinkedInIcon fontSize='small' sx={{ color: blue[500] }} /></a>
        //                    </li>
        //                    <li style={{ '--i': '2' }}>
        //                        <a href='#'><TwitterIcon fontSize='small' sx={{ color: blue[500] }} /></a>
        //                    </li>
        //                    <li style={{ '--i': '3' }}>
        //                        <a href='#'><LocalPostOfficeIcon fontSize='small' sx={{ color: blue[500] }} /></a>
        //                    </li>
        //                </ul>
        //            </div>
        //        </div>
        //</section>       
    );
}

//const mapStateToProps = state => ({
//    loginList: state.login.login
//})

//const mapActionToProps = {
//    login: actions.post
//}

/*export default withRouter(connect(mapStateToProps, mapActionToProps)(AboutRishi));*/

export default AboutRishi;