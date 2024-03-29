﻿import styled from 'styled-components';
import { Link as RRDLink } from 'react-router-dom'

export const HeaderContainer = styled.div`
    height: 70px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;

@media screen and (max-width: 800px) {
    height: 60px;
    padding: 10px;
    margin-bottom: 20px;
  }
`;

export const FooterContainer = styled.div`    
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 50px;
    padding:10px;    
    display: block;   
    text-align:center;
    float:left;
    margin-top:50px;
`;

export const LogoContainer = styled(RRDLink)`// this link is a custom component thats why we did like styled(Link)
     height: 100%;
      width: 70px;
      padding: 25px;      
`;

export const OptionsContainer = styled.div`      
      height: 100%;
      width: 70px;
      padding: 15px;
`;

export const OptionLink = styled(RRDLink)`
      padding: 10px 10px;
      cursor: pointer;
      color: black;
      text-decoration: none;
`;

