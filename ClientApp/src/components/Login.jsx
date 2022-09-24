import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as actions from "../actions/Login";
import { Link as RRDLink, useHistory } from 'react-router-dom';
import { useToasts } from "react-toast-notifications";
import { useEffect, useState, useRef } from "react";
import Home from "./HomePage";
import googleLogo from "../assets/Google-Logo.png";
import { signInWithGooglePopup } from '../utils/firebase/firebase.utils';

export function useIsMountedRef() {
    const isMountedRef = useRef(null);
    useEffect(() => {
        isMountedRef.current = true;
        return () => isMountedRef.current = false;
    });
    return isMountedRef;
}

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://www.linkedin.com/in/busanellirishi/">
                Rishi
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

const SignInSide = ({ ...props }) => {

    //toast msg.
    const { addToast } = useToasts();

    let history = useHistory();

    const [rememberme_checked, setRememberme_Checked] = useState(false);
    const [open, setOpen] = useState(false);
    const [submitDisable, setSubmitDisable] = useState(false);
    const [googleDisable, setGoogleDisable] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    

    const onSuccess = () => {
        setSubmitDisable(false);
        formik.resetForm();
        if (rememberme_checked)
            setRememberme_Checked(!rememberme_checked)
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            rememberme: false
        },
        validationSchema: yup.object({
            username: yup.string().max(20, 'UserName should not exceed 20 characters').required('Please Enter UserName'),
            password: yup.string().required('No password provided.').min(8, 'Password is too short - should be 8 chars minimum.').matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
        }),
        onSubmit: values => {
            setSubmitDisable(true);            
            props.login(values, onSuccess);
        }
    });

    const handleToggle = () => {
        if ((formik.touched.username && formik.errors.username) || (formik.touched.password && formik.errors.password)) {
            setOpen(false);
        }
        else {
            setOpen(true);
        }        
    };
    
    const handleGoogleSignInButton = async () => {
        /*alert("Google Sign In Button clicked");*/
        setGoogleDisable(true);
        handleToggle();
        try {
            const { user} = await signInWithGooglePopup();            
            props.gmail(user, onGmailLoginSuccess);
        } catch (error) {
            console.log("Error from Firebase->", error);  
            handleClose();
            setGoogleDisable(false);
        }       
    };

    const onGmailLoginSuccess = () => {
        setGoogleDisable(false);
        handleClose();
        console.log('Gmail Login Success from onGmailLoginSuccess function.')  
    }; 

    const handleCheckbox = () => setRememberme_Checked(!rememberme_checked);

    const isMountedRef = useIsMountedRef();

    let logoutData = localStorage.getItem('logged-out');
    //console.log("logout-->",logoutData);    
    let authData = localStorage.getItem('auth');
    let backButtonData = localStorage.getItem('back');
    //console.log("authData-->",authData);
    //console.log("------Completed------");

    useEffect(() => {
        //alert("In Login Use Effect");

        //alert("In Login Use Effect when isMountedRef is true");
        
        console.log('Landed on login page');
        if (props.loginList.length > 0) {
            console.log('login with email and password' + JSON.stringify(props.loginList))
            props.loginList.map((record, index) => {
                console.log('login status-->', record.login_successful);
                if (record.login_successful && (!logoutData)) {
                    //addToast("Login successful", { appearance: 'success', autoDismiss: true });
                    history.push('/home');
                    localStorage.setItem('auth', true);
                    //alert("auth value true in login component");
                    record.login_successful = false;
                    props.loginList.length = 0;
                }
                else if (!record.login_successful) {
                    addToast(record.error, { appearance: 'error', autoDismiss: true })                                        
                    props.loginList.length = 0;
                    setOpen(false);
                    setSubmitDisable(false);
                    setGoogleDisable(false);
                }
                else if (logoutData) {
                    addToast("Logged out successfully. Goodbye and have a nice day!", { appearance: 'success', autoDismiss: true })
                    localStorage.removeItem('logged-out');
                    logoutData = false;
                    props.loginList.length = 0;
                }
                else if (!backButtonData) {
                    setOpen(false);
                    addToast("Login Failed. Please try again with valid credentials", { appearance: 'error', autoDismiss: true })
                    setSubmitDisable(false);
                    setGoogleDisable(false);
                    props.loginList.length = 0;
                }
                else if (backButtonData) {
                    localStorage.removeItem('back');
                    props.loginList.length = 0;
                }
            })
        }
        else if (props.gmailList.length > 0) {
            console.log('login with Gmail account' + JSON.stringify(props.gmailList))
            props.gmailList.map((record, index) => {
                console.log('login status-->', record.login_successful);                
                if (record.login_successful && (!logoutData)) {
                    //addToast("Login successful", { appearance: 'success', autoDismiss: true });
                    history.push('/home');
                    localStorage.setItem('auth', true);
                    //alert("auth value true in login component");
                    record.login_successful = false;
                    props.gmailList.length = 0;
                }
                else if (!record.login_successful) {
                    addToast(record.error, { appearance: 'error', autoDismiss: true })                    
                    props.gmailList.length = 0;
                    setOpen(false);
                    setSubmitDisable(false);
                    setGoogleDisable(false);
                }
                else if (logoutData) {
                    addToast("Logged out successfully. Goodbye and have a nice day!", { appearance: 'success', autoDismiss: true })
                    localStorage.removeItem('logged-out');
                    logoutData = false;
                    props.gmailList.length = 0;
                }
                else if (!backButtonData) {
                    setOpen(false);
                    addToast("Login Failed. Please try again with valid credentials", { appearance: 'error', autoDismiss: true })
                    setSubmitDisable(false);
                    setGoogleDisable(false);
                    props.gmailList.length = 0;
                }
                else if (backButtonData) {
                    localStorage.removeItem('back');
                    props.gmailList.length = 0;
                }
            })
        }
        
        if (logoutData) {
            addToast("Logged out successfully. Goodbye and have a nice day!", { appearance: 'success', autoDismiss: true })
            localStorage.removeItem('logged-out');
            props.loginList.length = 0;
            props.gmailList.length = 0;
        }

    }, [props.loginList, props.gmailList])
    

    let logoutRoutes = null;

    if ((authData == null && logoutData == null) || !authData || logoutData) {
        logoutRoutes = (
            <ThemeProvider theme={theme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: 'url(https://source.unsplash.com/random)',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <Box
                            sx={{
                                my: 8,
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="User Name"
                                    name="username"
                                    autoComplete="username"

                                    {...formik.getFieldProps("username")}
                                />
                                {formik.touched.username && formik.errors.username ?
                                    <span style={{ color: 'red' }}>{formik.errors.username}</span> : null}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    {...formik.getFieldProps("password")}
                                />
                                {formik.touched.password && formik.errors.password ?
                                    <span style={{ color: 'red' }}>{formik.errors.password}</span> : null}
                                <br />
                                <FormControlLabel
                                    control={<Checkbox name="rememberme" color="primary" onClick={handleCheckbox} checked={rememberme_checked} value={formik.values.rememberme}
                                        onChange={formik.handleChange} />}
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={submitDisable}
                                    variant="contained"
                                    style={{ textTransform: "uppercase", padding: "10px 0px" }}
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={handleToggle}
                                >
                                    Sign In
                                </Button>
                                
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 1, mb: 3 }}
                                    disabled={googleDisable}
                                    style={{ textTransform: "uppercase", padding: "2px 0px" }}
                                    onClick={handleGoogleSignInButton}
                                >
                                    <Avatar src={googleLogo} />&nbsp; &nbsp; Sign in with Google
                                </Button>

                                {(googleDisable == true) ? <Backdrop
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={open}
                                >
                                    <CircularProgress color="inherit" />
                                </Backdrop> : null}

                                {(authData == null && logoutData == null && backButtonData == null) ? <Backdrop
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={open}                                    
                                >
                                    <CircularProgress color="inherit" />
                                </Backdrop> : null}
                                <Grid container>
                                    <Grid item xs>
                                        <RRDLink to="/ForgotPasswordWithEmail">
                                            Forgot password?
                                        </RRDLink>
                                    </Grid>
                                    <Grid item>
                                        <RRDLink to="/learning">
                                            Don't have an account? Sign Up
                                        </RRDLink>
                                    </Grid>
                                </Grid>
                                <Copyright sx={{ mt: 5 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
    }
    else {
        logoutRoutes = (
            <Home />
        );
    }

    return (
        <>
            {logoutRoutes}
        </>
    );
}


const mapStateToProps = state => ({
    loginList: state.login.login,
    gmailList: state.login.gmailLogin
})

const mapActionToProps = {
    login: actions.post,
    gmail: actions.gmail
}

export default connect(mapStateToProps, mapActionToProps)(SignInSide);