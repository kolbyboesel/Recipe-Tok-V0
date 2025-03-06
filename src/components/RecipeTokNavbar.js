import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Import custom styles

const RecipeTokNavbar = () => {
    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="custom-brand d-flex align-items-center">
                    <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="RecipeTok Logo" className="navbar-logo me-2" />
                    RecipesTok
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto custom-nav-links">
                        <Nav.Link as={Link} to="/" className="custom-link">Home</Nav.Link>
                        <Nav.Link as={Link} to="/Cookbook" className="custom-link">Cookbook</Nav.Link>
                        <NavDropdown title="Profile" id="recipe-dropdown" className="custom-dropdown">
                            <NavDropdown.Item as={Link} to="/LogIn">Log In</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/SignUp">Sign Up</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default RecipeTokNavbar;