import * as React from 'react';
import Header from "./Header";
import ProfilePageForm from "./ProfilePageForm";
import UserDetails from "./UserDetails";
/*import Grid from '@material-ui/core/Grid'*/
import { UserContext } from '../App.js';
import { useEffect, useState, createContext, useContext } from 'react';
import { isMobile } from 'react-device-detect';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';



const ProfilePage = () => {

    var user = useContext(UserContext);
    const [, setCanRender] = useState(0);
    var userName = null;
    var city = null;
    var email = null;
    var userId = null;
    var imgSrc = null;
    var dpStateChange = '';

    user.id = localStorage.getItem('LoggedInUserId');
    user.userDetails = localStorage.getItem('LoggedInUserDetails');
    user.imgSrc = localStorage.getItem('LoggedInUserImageSrc');

    function pull_state(data) {
        useEffect(() => {
            dpStateChange = data;            
        }, [])
    }

    const userDetails_Data = (userDetails_successful, userDetails, imgSrc) => {

        user.id = localStorage.getItem('LoggedInUserId');
        if (userDetails_successful) {
            localStorage.setItem('LoggedInUserDetails', JSON.stringify(userDetails));
            localStorage.setItem('LoggedInUserImageSrc', imgSrc);
            setCanRender(c => c + 1);
            dpStateChange = "State got changed";
        } else {
            console.log('User Updated Data status--> False');
        }
    }  

    var userDetailsData = JSON.parse(user.userDetails);
    var userName = userDetailsData.name;
    var city = userDetailsData.city;
    var email = userDetailsData.email;

    userId = user.id;
    imgSrc = user.imgSrc;   

    let deviceRender = null;

    if (isMobile) {
        deviceRender = (
            <Box sx={{ flexGrow: 1, overflow: 'hidden', pt: 3, px: 2 }}>
                <Grid sx={{ display: 'grid' }} container wrap="nowrap" spacing={2}>

                    <Grid style={{ textAlign: 'center', paddingTop: '-5vh' }}>
                        <UserDetails userName={userName} city={city} email={email} imgSrc={imgSrc} />
                    </Grid>
                </Grid>

                <Grid sx={{ display: 'grid' }} container wrap="nowrap" spacing={2}>
                    <Grid style={{ textAlign: 'center' }}>
                        <ProfilePageForm userId={userId} userDetailsData={userDetails_Data} />
                    </Grid>
                </Grid>
            </Box>
        );
    }
    else {
        deviceRender = (
            <Grid container>
                <Grid item xs={6} style={{ textAlign: 'center' }}>
                    <ProfilePageForm userId={userId} userDetailsData={userDetails_Data} />
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'center', paddingTop: '-5vh' }}>
                    <UserDetails userName={userName} city={city} email={email} imgSrc={imgSrc} />
                </Grid>
            </Grid>
        );
    }
          
    return (
        <React.Fragment>
            <Header render={pull_state} />
            {deviceRender}            
        </React.Fragment>
    );
}

export default ProfilePage;