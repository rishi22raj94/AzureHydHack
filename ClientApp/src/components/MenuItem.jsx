//import React from 'react';
//import { withRouter } from 'react-router-dom';
//import '../styles/menu-item.styles.scss';

//const MenuItem = ({ title, imageUrl, size, history, linkUrl, match }) => (
//    <div
//        className={`${size} menu-item`}
//        onClick={() => history.push(`${match.url}${linkUrl}`)}
//    >

//        <div className='background-image' style={{ backgroundImage: `url(${imageUrl})` }}></div>
//        <div className='content'>
//            <h1 className='title'>{title.toUpperCase()}</h1>
//            {/*<span className='subtitle'>S NOW</span>*/}
//        </div>
//    </div>
//);

//export default withRouter(MenuItem);

import React from 'react';
import { withRouter } from 'react-router-dom';

import {
    MenuItemContainer,
    BackgroundImageContainer,
    ContentContainer,
    ContentTitle,
    ContentSubtitle
} from '../styles/menu-item.styles';

const MenuItem = ({ title, imageUrl, size, history, linkUrl, match }) => (
    <MenuItemContainer
        size={size}
        onClick={() => history.push(`${linkUrl}`)}
    >
        <BackgroundImageContainer
            className='background-image'
            imageUrl={imageUrl}
        />
        <ContentContainer className='content'>
            <ContentTitle>{title.toUpperCase()}</ContentTitle>
            <ContentSubtitle>INVEST NOW</ContentSubtitle>
        </ContentContainer>
    </MenuItemContainer>
);

export default withRouter(MenuItem);