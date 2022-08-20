import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_NAME } from "./config/config";
import { auth } from "./firebase/config";
import { Modal,Button } from 'react-bootstrap';
import {
Box,
Container,
Row,
Column,
FooterLink,
Heading,
} from "./FooterStyles";

const Footer = () => {
	const [aim, setAim] = useState('');
	const [vision, setVision] = useState('');
	const [contactUsText, setContactUsText] = useState('');
	const [contactUsLink, setContactUsLink] = useState('');
	const [twitterLink, setTwitterLink] = useState('');
	const [linkedinLink, setLinkedinLink] = useState('');
	const [facebookLink, setFacebookLink] = useState('');
	const [showAimModal, setShowAimModal] = useState(false);
	const [showVisionModal, setShowVisionModal] = useState(false);

	const handleAimModalClose = () => setShowAimModal(false);
    const handleAimModalShow = () => setShowAimModal(true);
	const handleVisionModalClose = () => setShowVisionModal(false);
    const handleVisionModalShow = () => setShowVisionModal(true);

	useEffect(() => {
        auth.currentUser.getIdToken()
        .then((currentToken)=>{
            const data ={
                headers:{
                    authorization:currentToken
                }
            }
            axios.get(SERVER_NAME+'/footer/links')
            .then((res)=>{
				setAim(res.data[0].aim);
				setVision(res.data[0].vision);
				setContactUsText(res.data[0].contactText);
				setContactUsLink(res.data[0].contactLink);
				setTwitterLink(res.data[0].twitter);
				setLinkedinLink(res.data[0].linkedin);
				setFacebookLink(res.data[0].facebook);
			}).catch((err)=>console.log(err));
        }).catch((err)=>console.log(err));
    }, []);

return (
	<>
		<Box>
		<Container>
			<Row>
			<Column>
				<Heading>About Us</Heading>
				<FooterLink onClick={handleAimModalShow}>Aim</FooterLink>
				<FooterLink onClick={handleVisionModalShow}>Vision</FooterLink>
			</Column>
			<Column>
				<Heading>Contact Us</Heading>
				<a href={contactUsLink} target='_blank'><FooterLink>{contactUsText}</FooterLink></a>
			</Column>
			<Column>
				<Heading>Social Media</Heading>
				<a href={twitterLink} target='_blank'><FooterLink>
				<i className="fab fa-twitter">
					<span style={{ marginLeft: "10px" }}>
					Twitter
					</span>
				</i>
				</FooterLink></a>
				<a href={linkedinLink} target='_blank'><FooterLink>
				<i className="fab fa-linkedin">
					<span style={{ marginLeft: "10px" }}>
					Linkedin
					</span>
				</i>
				</FooterLink></a>
				<a href={facebookLink} target='_blank'><FooterLink>
				<i className="fab fa-facebook">
					<span style={{ marginLeft: "10px" }}>
					Facebook
					</span>
				</i></FooterLink></a>
			</Column>
			</Row>
		</Container>
		</Box>
		{/* Modal Aim */}
		<Modal show={showAimModal} onHide={handleAimModalClose}>
			<Modal.Header closeButton>
			<Modal.Title>Aim</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{aim}
			</Modal.Body>
			<Modal.Footer>
			<Button variant="secondary" onClick={handleAimModalClose}>
				Close
			</Button>
			</Modal.Footer>
		</Modal>
		{/* Modal Vision */}
		<Modal show={showVisionModal} onHide={handleVisionModalClose}>
			<Modal.Header closeButton>
			<Modal.Title>Vision</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{vision}
			</Modal.Body>
			<Modal.Footer>
			<Button variant="secondary" onClick={handleVisionModalClose}>
				Close
			</Button>
			</Modal.Footer>
		</Modal>
	</>
);
};
export default Footer;
