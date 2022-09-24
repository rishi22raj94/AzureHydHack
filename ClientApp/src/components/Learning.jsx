/* Sign Up */
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
import * as actions from "../actions/Learning";
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

const SignUp = ({ ...props }) => {    

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
        if(checked)
            setChecked(!checked)
    };    

    const formik = useFormik({
        initialValues: {
            name:'',
            password:'',
            email: '',
            city: '',
            promotions:false
        },
        validationSchema: yup.object({            
            name: yup.string().max(20, 'Name should not exceed 20 characters').required('Please Enter UserName'),
            password: yup.string().required('No password provided.').min(8, 'Password is too short - should be 8 chars minimum.').matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
            email: yup.string().email('Invalid email address').required('Please Enter Email Id'),
            city: yup.string().max(30, 'Name should not exceed 30 characters').required('Please Enter City Name')
        }),        
        onSubmit: values => {
            setSubmitDisable(true);
            handleToggle();
            props.createUser(values, onSuccess);            
        },        
    });   

    const handleCheckbox = () => setChecked(!checked);

    useEffect(() => {
        console.log('dealing with ' + JSON.stringify(props.userList))    
        if (props.userList.length > 0) {
            props.userList.map((record, index) => {
                if (record.registration_successful) {
                    addToast("Registration successful. Please activate your account by clicking on the link sent to your registered email address.", { appearance: 'success', autoDismiss: true })
                    history.push('/Login')                    
                    props.userList.length = 0;
                }
                else if (!record.registration_successful) {
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
    }, [props.userList])

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
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="User Name"
                                    
                                    {...formik.getFieldProps("name")}
                                />
                                {formik.touched.name && formik.errors.name ?
                                    <span style={{ color: 'red' }}>{formik.errors.name}</span> : null}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="city"
                                    name="city"
                                    required
                                    fullWidth
                                    id="city"
                                    label="City"
                                    
                                    {...formik.getFieldProps("city")}
                                />
                                {formik.touched.city && formik.errors.city ?
                                    <span style={{ color: 'red' }}>{formik.errors.city}</span> : null}
                            </Grid>
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
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    {...formik.getFieldProps("password")}
                                />
                                {formik.touched.password && formik.errors.password ?
                                    <span style={{ color: 'red' }}>{formik.errors.password}</span> : null}
                            </Grid>                           
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox name="promotions" color="primary" onClick={handleCheckbox} checked={checked} value={formik.values.promotions}
                                        onChange={formik.handleChange} />}
                                    label="I want to receive promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={submitDisable}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
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
                                    Already have an account? Sign in
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
    userList: state.learning.list
})

const mapActionToProps = {
    createUser: actions.create,
    updateUser: actions.update
}

export default connect(mapStateToProps, mapActionToProps)(SignUp);