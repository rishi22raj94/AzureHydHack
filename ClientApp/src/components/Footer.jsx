////import * as React from 'react';
////import CssBaseline from '@mui/material/CssBaseline';
////import { createTheme, ThemeProvider } from '@mui/material/styles';
////import Box from '@mui/material/Box';
////import Typography from '@mui/material/Typography';
////import Link from '@mui/material/Link';

////function Copyright() {
////    return (
////        <Typography variant="body2" color="text.secondary" align="center">
////            {'Copyright © '}
////            <Link color="inherit" href="https://www.linkedin.com/in/busanellirishi/">
////                Rishi
////            </Link>{' '}
////            {new Date().getFullYear()}
////            {'.'}
////        </Typography>
////    );
////}

////const theme = createTheme();

////export default function StickyFooter() {
////    return (
////        <ThemeProvider theme={theme}>
////        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
////            <Typography variant="h6" align="center" gutterBottom>
////               Rishi
////            </Typography>
////            <Typography
////                variant="subtitle1"
////                align="center"
////                color="text.secondary"
////                component="p"
////            >
////                    To contact me mail at{' '}
////                    <Link color="inherit" href="https://mail.google.com/mail/u/0/#inbox?compose=new">
////                        rishi@gmail.com
////                    </Link>
////            </Typography>
////            <Copyright />
////        </Box>  
////    </ThemeProvider >
////    );
////}


import React from "react";
import {
	Box,
	Container,
	Row,
	Column,
	FooterLink,
	Heading,
} from "../styles/Footer-Styles";

const Footer = () => {
	return (
		<Box>
			<h1 style={{
				color: "green",
				textAlign: "center",
				marginTop: "-50px"
			}}>
				GeeksforGeeks: A Computer Science Portal for Geeks
			</h1>
			<Container>
				<Row>
					<Column>
						<Heading>About Us</Heading>
						<FooterLink href="#">Aim</FooterLink>
						<FooterLink href="#">Vision</FooterLink>
						<FooterLink href="#">Testimonials</FooterLink>
					</Column>
					<Column>
						<Heading>Services</Heading>
						<FooterLink href="#">Writing</FooterLink>
						<FooterLink href="#">Internships</FooterLink>
						<FooterLink href="#">Coding</FooterLink>
						<FooterLink href="#">Teaching</FooterLink>
					</Column>
					<Column>
						<Heading>Contact Us</Heading>
						<FooterLink href="#">Uttar Pradesh</FooterLink>
						<FooterLink href="#">Ahemdabad</FooterLink>
						<FooterLink href="#">Indore</FooterLink>
						<FooterLink href="#">Mumbai</FooterLink>
					</Column>
					<Column>
						<Heading>Social Media</Heading>
						<FooterLink href="#">
							<i className="fab fa-facebook-f">
								<span style={{ marginLeft: "10px" }}>
									Facebook
								</span>
							</i>
						</FooterLink>
						<FooterLink href="#">
							<i className="fab fa-instagram">
								<span style={{ marginLeft: "10px" }}>
									Instagram
								</span>
							</i>
						</FooterLink>
						<FooterLink href="#">
							<i className="fab fa-twitter">
								<span style={{ marginLeft: "10px" }}>
									Twitter
								</span>
							</i>
						</FooterLink>
						<FooterLink href="#">
							<i className="fab fa-youtube">
								<span style={{ marginLeft: "10px" }}>
									Youtube
								</span>
							</i>
						</FooterLink>
					</Column>
				</Row>
			</Container>
		</Box>
	);
};
export default Footer;
