import * as React from 'react';
import { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik} from 'formik';
import * as yup from 'yup';
import { connect } from "react-redux";
import { Link as RRDLink, useHistory } from 'react-router-dom';
import * as actions from "../actions/userDetails";
import Header from "./Header";
import Grid from '@material-ui/core/Grid'
import AddIcon from "@material-ui/icons/Add";
import SendIcon from "@material-ui/icons/Send";
import { Fab } from "@material-ui/core";
import AssignmentIcon from '@material-ui/icons/Assignment';
import { makeStyles } from '@material-ui/core'
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { IconButton } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { onSignOut } from './HomePage';


const useStyles = makeStyles({
    btn: {
        backgroundColor: 'black'
    }
})

const ProfilePageForm = ({ userId, ...props }) => {

    const theme = createTheme();

    const classes = useStyles();

    let history = useHistory();

    const notify = () => toast('Welcome To User Profile Page', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const [file, setFile] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [openDeleteButton, setOpenDeleteButton] = React.useState(false);
    const [submitDisable, setSubmitDisable] = useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [openDeleteSnackbar, setOpenDeleteSnackbar] = React.useState(false);
    const [deleteDisable, setDeleteDisable] = useState(false);
    const mediaTheme = useTheme();
    const fullScreen = useMediaQuery(mediaTheme.breakpoints.down('md'));

    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };    

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const handleClickSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleCloseDeleteSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenDeleteSnackbar(false);
    };

    const handleClickDeleteSnackbar = () => {
        setOpenDeleteSnackbar(true);
    };

    const handleUserAccountDelete = () => {             
        handleDeleteClose();
        setDeleteDisable(true);
        handleToggle();
        props.deleteUser(userId, onDeleteSuccess);        
    }

    const handleClickOpen = () => {
        setOpenDeleteButton(true);
    };

    const handleDeleteClose = () => {
        setOpenDeleteButton(false);
    };

    const handleFileInput = event => {
        if (event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            let reader = new FileReader();

            console.log(file);
            reader.onload = function (e) {
                if (file != null) {
                    setFile(file.name);
                    formik.setFieldValue("file", file);
                }                
            };
            reader.readAsDataURL(event.target.files[0]);

            const fileExtension = file.name.split(".").at(-1);
            const allowedFileTypes = ["jpg", "png", "JPG", "PNG"];

            if (!allowedFileTypes.includes(fileExtension)) {
                file = null;
                window.alert(`File does not support. Files type must be ${allowedFileTypes.join(", ")}`);
                return false;
            }

            if (file.size > 10e6) {
                file = null;
                window.alert("Please upload a file smaller than 10 MB");
                return false;
            }

            if (file.name.length >= 50) {
                file = null;
                window.alert("Please upload a file with File Name not above 50 characters long.");
                return false;
            }
        }
        else {           
            setFile(null);
            formik.setFieldValue("file", null);            
        }

    };

    const handleImageDelete = () => {
        setFile(null);
        formik.setFieldValue("file", null);
        console.log("clicked iconbutton")   
    };

    const onSuccess = () => {
        setSubmitDisable(false);        
        handleClose();
        formik.resetForm();        
        setFile(null);
    };    

    const onDeleteSuccess = () => {  
        setSubmitDisable(true);
        onSignOut(true);
        /*history.push('/login');*/        
    };    

    const formik = useFormik({
        initialValues: {
            name: '',           
            email: '',
            city: '',
            auth: localStorage.getItem('auth'),
            id: userId,
            file: file
        },
        validationSchema: yup.object({
            name: yup.string().max(20, 'Name should not exceed 20 characters'),            
            email: yup.string().email('Invalid email address'),
            city: yup.string().max(30, 'Name should not exceed 30 characters')
        }),
        onSubmit: values => {
            if (values.name == "" && values.email == "" && values.city == "" && values.file == null) {
                window.alert("Invalid User Details");
                handleClose();
            } else {
                setSubmitDisable(true);
                handleToggle();
                const formData = new FormData();
                formData.append('name', values.name)
                formData.append('email', values.email)
                formData.append('city', values.city)
                formData.append('auth', values.auth)
                formData.append('id', values.id)
                formData.append('file', values.file)
                props.updateUser(formData, onSuccess);
            }            
        },        
    });   

    useEffect(() => {
        notify();
        handleCloseSnackbar();
        handleCloseDeleteSnackbar();
    }, []);

    useEffect(() => {        
        console.log('User Details from Profile Page Form' + JSON.stringify(props.userDetailsList))
        props.userDetailsList.map((record, index) => {
                        
            if (record.userDetails_successful) {                  
                props.userDetailsData(record.userDetails_successful, record.userDetails, record.imageSrc);
                handleClickSnackbar();
                console.log('User Details status from child-->', record.userDetails_successful);                
            }            
        })       
        
    }, [props.userDetailsList])  


    useEffect(() => {        
        props.userDeletedDetails.map((record, index) => {
            if (record.userDeleted_successful) {
                console.log('User Deleted Details from Profile Page Form' + JSON.stringify(props.userDeletedDetails))
                handleClose();
                onDeleteSuccess();
            } else {
                handleClose();
                setDeleteDisable(false);
                handleClickDeleteSnackbar();
            }
        })              
    }, [props.userDeletedDetails]) 
    

    return (
        <React.Fragment>                                                         
                        <Container component="main" maxWidth="xs">                            
                            <Box
                                sx={{
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >                               
                                <Avatar sx={{ m: 1, bgcolor: 'black' }}>
                                    <AssignmentIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Update Details
                                </Typography>
                                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                autoComplete="name"
                                                name="name"                                                 
                                                fullWidth
                                                id="name"
                                                label="Name"                                                

                                                {...formik.getFieldProps("name")}
                                            />
                                            {formik.errors.name ?
                                                <span style={{ color: 'red' }}>{formik.errors.name}</span> : null
                                            }                                
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                autoComplete="city"
                                                name="city"
                                                
                                                fullWidth
                                                id="city"
                                                label="City"

                                                {...formik.getFieldProps("city")}
                                            />
                                            {formik.errors.city ?
                                    <span style={{ color: 'red' }}>{formik.errors.city}</span> : null}
                                
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                
                                                fullWidth
                                                id="email"
                                                label="Email Address"
                                                name="email"
                                                autoComplete="email"
                                                {...formik.getFieldProps("email")}
                                            />
                                            {formik.errors.email ?
                                    <span style={{ color: 'red' }}>{formik.errors.email}</span> : null}   
                                
                                        </Grid>                                    
                                        <label htmlFor="upload-photo">
                                            <br />
                                            <input
                                                style={{ display: "none" }}
                                                id="upload-photo"
                                                name="upload-photo"
                                                type="file"                                    
                                                accept="image/*" 
                                                onChange={handleFileInput}                                    
                                            />
                                            <Fab
                                                className={classes.btn}
                                                color="secondary"
                                                size="small"
                                                component="span"
                                                aria-label="add"
                                                variant="extended"
                                            >
                                                <AddIcon /> Upload photo
                                </Fab>
                            </label>
                            <label id="filename" style={{ padding: '18px' }}>{
                                    file !== null ?
                                        <>
                                            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            <span style={{ color: 'purple', fontFamily: 'Roboto', fontSize: 'large', justifyContent: "space-between" }}>{file}</span>
                                            <IconButton style={{ color: 'red' }} onClick={() => handleImageDelete() }> {/*handleImageDelete(file)*/}
                                                <DeleteForeverTwoToneIcon style={{ cursor: 'pointer' }} />
                                            </IconButton>                                            
                                        </>: null
                                }</label>                                                                                                                    
                        </Grid>                        
                                <Button
                                    type="submit"
                                    color="secondary"
                                    variant="outlined"
                                    disabled={submitDisable}
                                    endIcon={<SendIcon />}
                                    sx={{ mt: 3, mb: 2 }}                                    
                                >
                                    Submit
                        </Button>   
                        <br/>
                        <Button                            
                            color="error"
                            variant="outlined"
                            disabled={deleteDisable}
                            startIcon={<DeleteIcon />}
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleClickOpen}
                        >
                            Delete Account
                        </Button>    
                        <Dialog
                            fullScreen={fullScreen}
                            open={openDeleteButton}
                            onClose={handleDeleteClose}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                {"Do you want to delete your account?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Your account will be permanently closed and cannot be retrieved. 
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={handleDeleteClose}>
                                    Disagree
                                </Button>
                                <Button onClick={handleUserAccountDelete} autoFocus>
                                    Agree
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {(submitDisable == true) ? <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={open}                            
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop> : null}

                        {(deleteDisable == true) ? <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={open}                               
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop> : null}

                       
                            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                                    User details got successfully updated.
                                </Alert>
                        </Snackbar>  

                        <Snackbar open={openDeleteSnackbar} autoHideDuration={6000} onClose={handleCloseDeleteSnackbar}>
                            <Alert onClose={handleCloseDeleteSnackbar} severity="error" sx={{ width: '100%' }}>
                                Facing issues while deleting this user. Please try again after sometime.
                            </Alert>
                        </Snackbar>  
                        
                    </Box >
                            </Box>                           
                        </Container>                                                    
        </React.Fragment>
    );
}

const mapStateToProps = state => ({
    userDetailsList: state.userDetails.list,
    userDeletedDetails: state.userDetails.deletedUser
})

const mapActionToProps = {    
    updateUser: actions.update,
    deleteUser: actions.deleteUser
}

export default connect(mapStateToProps, mapActionToProps)(ProfilePageForm);
