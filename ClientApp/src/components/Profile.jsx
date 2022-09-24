import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@mui/material/colors';
import { onSignOut } from './HomePage';
import { withRouter, useHistory, Link as RRDLink } from 'react-router-dom';
import { useToasts } from "react-toast-notifications";
import Logout from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import ContactMailSharpIcon from '@mui/icons-material/ContactMailSharp';
import InsertEmoticonSharpIcon from '@mui/icons-material/InsertEmoticonSharp';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import ListItemIcon from '@mui/material/ListItemIcon';
import About from "./About";
import { useChangeTheme } from "../context/ColorModeContext";
import useTheme from '@material-ui/core/styles/useTheme';
/*import IconButton from '@material-ui/core/IconButton';*/
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { UserContext } from '../App.js';
import { useEffect, useState, createContext, useContext } from 'react';
import logouserprofile from '../assets/Default-UserProfile.png';
import { GlobalStyle } from '../global.styles';

const settings = ['Profile', 'Sign out'];

export default function ImageAvatars({ ...props }) {

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    let history = useHistory();
    const theme = useTheme();
    const changeTheme = useChangeTheme();
    //toast msg.
    const { addToast } = useToasts();

    props.renderToChild("Hi calling from profile page");

    var user = useContext(UserContext);
    if (user.id == null || user.userDetails == null || user.imgSrc == null) {
        user.id = localStorage.getItem('LoggedInUserId');
        user.userDetails = localStorage.getItem('LoggedInUserDetails');
        user.imgSrc = localStorage.getItem('LoggedInUserImageSrc');
    }

    var userDetailsData = JSON.parse(user.userDetails);
    var userName = userDetailsData.name;
    var city = userDetailsData.city;
    var email = userDetailsData.email;
    var imageSrc = user.imgSrc;

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    //const settingFunc = (value) => {
    //    console.log(value);
    //    if (value == "Profile") {

    //    }
    //    else {
    //        onSignOut();
    //        history.push('/login');
    //        let logoutData = localStorage.getItem('logged-out');
    //        if (logoutData) {
    //        addToast("Logged out successfully. Goodbye and have a nice day!", { appearance: 'success', autoDismiss: true })
    //        localStorage.removeItem('logged-out');
    //        }
    //    }
    //}

    const profile = () => {
       /* alert('Hi Profile');*/
    }   

    const home = () => {
       /* alert('Hi home');*/
    }

    const contact = () => {
       /* alert('Hi contact');*/
    }


    return (
        <>
        <GlobalStyle />
        <Stack direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2} style={{ paddingRight: '0vh'}}>   
            <Tooltip title="Toggle light/dark mode">
                <IconButton
                    onClick={() => changeTheme()}
                >
                    {theme.palette.type === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
            </Tooltip>
            <Box sx={{ flexGrow: 0 }}>               
                <Tooltip title="Settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>                        
                        <Avatar
                            alt={userName.substring(0, 1).toUpperCase()}
                            src={
                                imageSrc == "" ? userName.substring(0, 1).toUpperCase() : imageSrc                            
                                } 
                            sx={{ width: 60, height: 60, bgcolor: grey[700] }}
                        />
                    </IconButton>
                </Tooltip>                
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}    
                    PaperProps={{
                        sx: {
                            background: theme.palette.type === 'light' ? 'white' : 'blueviolet'
                        }
                    }}
                >
                    <MenuItem style={{ padding: '10px 25px' }}>
                        <ListItemIcon>
                            <HomeIcon fontSize="small" />
                        </ListItemIcon>
                        <RRDLink style={{ color: 'black', textDecoration: 'none' }} to='/home' onClick={() => home()} >
                            Home  
                        </RRDLink>
                    </MenuItem>
                    <MenuItem style={{ padding: '10px 25px' }}>
                        <ListItemIcon>
                            <ContactMailSharpIcon fontSize="small" />
                        </ListItemIcon>
                        <RRDLink style={{ color: 'black', textDecoration: 'none' }} to='/about' onClick={() => contact()} >
                            Contact  
                        </RRDLink>
                    </MenuItem>
                    <MenuItem style={{ padding: '10px 25px' }}>
                        <ListItemIcon>
                            <AccountCircleSharpIcon fontSize="small" />
                        </ListItemIcon>                        
                        <RRDLink style={{ color: 'black', textDecoration: 'none' }} to='/ProfilePage' onClick={() => profile()} >
                            Profile  
                        </RRDLink>
                    </MenuItem>                   
                    <MenuItem style={{ padding: '10px 25px' }}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        <RRDLink style={{ color:'black', textDecoration:'none'}} to='/login' onClick={() => onSignOut(false)} >                            
                            Sign Out
                        </RRDLink>
                    </MenuItem>
                    {/*<MenuItem style={{ padding: '1px 55px'}}>*/}
                    {/*    <ListItemIcon>*/}
                    {/*        <IconButton*/}
                    {/*            title="Toggle light/dark mode"*/}
                    {/*            onClick={() => changeTheme()}                                */}
                    {/*        >*/}
                    {/*            {theme.palette.type === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}*/}
                    {/*        </IconButton>                            */}
                    {/*    </ListItemIcon>*/}
                    {/*    <RRDLink style={{ color: 'black', textDecoration: 'none' }} to='/home'>*/}
                    {/*    </RRDLink>*/}
                    {/*</MenuItem>*/}
                </Menu>
            </Box>
        </Stack>
        </>
    );
}
