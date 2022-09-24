import React from 'react';
import { ReactComponent as ReactLogo } from '../assets/undraw_page_not_found_re_e9o6.svg';
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    marginAutoContainer: {
        [theme.breakpoints.up('md')]: {
            backgroundColor: 'peachpuff',
        },       
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightblue',
    }
}))

const NotFound = () => {

    const classes = useStyles();

    return (        
        <React.Fragment>     
            <div className={classes.marginAutoContainer}>                
                <ReactLogo />
            </div>
    </React.Fragment>
    );
}

export default NotFound;