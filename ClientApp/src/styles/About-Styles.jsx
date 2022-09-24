import styled from 'styled-components';
import { Link as RRDLink } from 'react-router-dom'
import Link from '@mui/material/Link';

export const Body = styled.body`
    display: flex;
justify-content: center;
align-items: center;
flex-wrap: wrap;
//background: white;
min-height: 100vh;

@media screen and (max-width: 800px) {
    min-height: 75vh;
  }
`;

export const UserDetailsBody = styled.body`
    display: flex;
justify-content: center;
align-items: center;
flex-wrap: wrap;
//background: white;
//min-height: 100vh;
`;

export const Section = styled.section`    
   &:before {
    content: '';
position: absolute;
top: 0;
left: 0;
width: 102%;
height: 125%;
background: linear-gradient(#f00,#f0f);
clip-path: circle(30% at right 90%);
  }
`;

export const Container = styled.div`// this link is a custom component thats why we did like styled(Link)
     position: relative;
z-index: 1;
display: flex;
justify-content: center;
align-items: center;
flex-wrap: wrap;
margin: 40px 0;
`;

export const Card = styled.div`      
      position: relative;
width: 300px;
height: 400px;
background: rgba(255, 255, 255, 0.05);
margin: 20px;
box-shadow: 0 15px 35px rgba(0,0,0,0.2);
border-radius: 15px;
display: flex;
justify-content: center;
align-items: center;
backdrop-filter: blur(10px);
`;

export const Content = styled.div`
      position: relative;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
opacity: 0.5;
transition: 0.5s;
${Card}:hover & {
    opacity: 1;
transform: translateY(-20px);
  }
`;

export const ImgBx = styled.div`
   position: relative;
width: 150px;
height: 150px;
border-radius: 50%;
overflow: hidden;
border: 10px solid rgba(0,0,0,0.25);
`;

export const Image = styled.img`
   position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
object-fit: cover;
`;

export const Head3 = styled.h3`
  color: black;
text-transform: uppercase;
letter-spacing: 2px;
font-weight: 500;
font-size: 18px;
text-align: center;
margin: 20px 0 10px;
line-height: 1.1em;
`;

export const Span1 = styled.span`
  font-weight: 300;
font-size: 12px;
text-transform: initial;
`;

export const UnorderList = styled.ul`
 position: absolute;
bottom: 50px;
right: 90px;
display: flex;
`;

export const OrderList = styled.li`
 list-style: none;
margin: 0 10px;
transform: translateY(40px);
transition: 0.5s;
opacity: 0;
transition-delay: calc(0.1s * var(--i));
${Card}:hover & {
    transform: translateY(0px);
    opacity: 1;
  }
`;

export const IconLink = styled(Link)`
      color: #fff;
font-size:24px;
`;

