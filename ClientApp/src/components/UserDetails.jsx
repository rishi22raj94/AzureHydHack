import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import { blue } from '@mui/material/colors';
import logo from '../assets/profile-pic.jpg';
import logouserprofile from '../assets/Default-UserProfile.png';
import {
    UserDetailsBody,
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

//export function onSignOut(e) {
//    localStorage.removeItem('auth');
//    //alert('auth value false and log out value true');
//    localStorage.setItem('logged-out', true);
//};

const AboutRishi = ({ userName, city, email, imgSrc }) => {

    //let history = useHistory();

    //const notify = () => toast('Welcome To My World', {
    //    position: 'top-center',
    //    autoClose: 5000,
    //    hideProgressBar: false,
    //    closeOnClick: true,
    //    pauseOnHover: true,
    //    draggable: true,
    //    progress: undefined,
    //});



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

    return (
        <React.Fragment>
            <UserDetailsBody>
                <Container>
                    <Card>
                        <Content>
                            <ImgBx>
                                {(imgSrc == "" || imgSrc == "null" || imgSrc == undefined) ?
                                    <Image src={logouserprofile} alt='Img Src got expired. Please sign out and sign in again to get the Img Src' /> : <Image src={imgSrc} alt='Img Src got expired. Please sign out and sign in again to get the Img Src' />
                                }
                            </ImgBx>
                            <div className='contentBx'>
                                <Head3>{userName}<br /><Span1>{city}</Span1><br /><Span1>{email}</Span1></Head3>
                            </div>
                        </Content>
                    </Card>
                </Container>
            </UserDetailsBody>
        </React.Fragment>
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