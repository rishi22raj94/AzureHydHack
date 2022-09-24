/* ForgotPassword */
import * as React from 'react';
import { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { connect } from "react-redux";
import { Link as RRDLink, useHistory } from 'react-router-dom';
import * as actions from "../actions/Login";
import { useToasts } from "react-toast-notifications";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Rishi
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

const ForgotPassword = ({ ...props }) => {

    //toast msg.
    const { addToast } = useToasts();
    const [submitDisable, setSubmitDisable] = useState(false);
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = React.useState(false);

    let history = useHistory();

    const handleClose = () => {
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen(!open);
    };

    const onSuccess = () => {
        setSubmitDisable(false);
        formik.resetForm();
        if (checked)
            setChecked(!checked)
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            newpassword: '',
            confirmpassword: ''
        },
        validationSchema: yup.object({
            email: yup.string().email('Invalid email address').required('Please Enter Email Id'),
            newpassword: yup.string().required('No password provided.').min(8, 'Password is too short - should be 8 chars minimum.').matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
            confirmpassword: yup.string().oneOf([yup.ref('newpassword'), null], 'Passwords must match')
        }),
        onSubmit: values => {
            setSubmitDisable(true);
            handleToggle();
            props.login(values, onSuccess);
        },
    });

    const handleCheckbox = () => setChecked(!checked);

    useEffect(() => {
        console.log('dealing with ' + JSON.stringify(props.loginResetPassword))
        if (props.loginResetPassword.length > 0) {
            props.loginResetPassword.map((record, index) => {
                if (record.resetpassword_successful) {
                    addToast("Password Reset Successful", { appearance: 'success', autoDismiss: true })
                    history.push('/Login')
                    props.loginResetPassword.length = 0;
                } else if (!record.resetpassword_successful) {
                    addToast(record.error_data, { appearance: 'error', autoDismiss: true })
                    handleClose();
                    props.userList.length = 0;
                }
                else {
                    record.error_data.map((error_record, index) => {
                        addToast(error_record, { appearance: 'error', autoDismiss: true })
                        handleClose();
                    })
                }
            })
        }
    }, [props.loginResetPassword])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Forgot Password
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    {...formik.getFieldProps("email")}
                                />
                                {formik.touched.email && formik.errors.email ?
                                    <span style={{ color: 'red' }}>{formik.errors.email}</span> : null}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="newpassword"
                                    label="New Password"
                                    type="password"
                                    id="newpassword"
                                    autoComplete="newpassword"
                                    {...formik.getFieldProps("newpassword")}
                                />
                                {formik.touched.newpassword && formik.errors.newpassword ?
                                    <span style={{ color: 'red' }}>{formik.errors.newpassword}</span> : null}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="confirmpassword"
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmpassword"
                                    autoComplete="confirmpassword"
                                    {...formik.getFieldProps("confirmpassword")}
                                />
                                {formik.touched.confirmpassword && formik.errors.confirmpassword ?
                                    <span style={{ color: 'red' }}>{formik.errors.confirmpassword}</span> : null}
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={submitDisable}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit
                        </Button>
                        {(submitDisable == true) ? <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={open}                            
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop> : null}

                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <RRDLink to="/Login" variant="body2">
                                    Back to login page? Sign in
                                </RRDLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}

const mapStateToProps = state => ({
    loginResetPassword: state.login.resetPassword
})

const mapActionToProps = {
    login: actions.resetPassword
}

export default connect(mapStateToProps, mapActionToProps)(ForgotPassword);