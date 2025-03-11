import React, { useContext, useState, useEffect, useRef } from 'react';
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import { UserSettingsContext } from './UserSettings';

const RecipeTokNavbar = () => {
    const { userSettings, updateUserSettings } = useContext(UserSettingsContext);
    const [settings, setSettings] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        isLoggedIn: false,
    });

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const isSmallScreen = windowWidth < 992; // Bootstrap 'lg' breakpoint

    const profilePictureBase64 = userSettings?.profilePic || '';
    const [expanded, setExpanded] = useState(false);
    const navRef = useRef();

    useEffect(() => {
        if (userSettings) setSettings(userSettings);
    }, [userSettings]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSignOut = () => {
        updateUserSettings({
            loginID: 'defaultUser@gmail.com',
            firstName: 'John',
            lastName: 'Doe',
            isLoggedIn: false
        });
        localStorage.removeItem('userSettings');
        window.location.href = '/';
    };

    const handleNavClick = () => setExpanded(false);

    const AvatarComponent = () => (
        <div className="nav-avatar-wrapper">
            {profilePictureBase64 ? (
                <img src={profilePictureBase64} alt="Profile" className="nav-avatar-img" />
            ) : (
                <div className="nav-avatar-placeholder">
                    {userSettings?.firstName?.charAt(0).toUpperCase() || 'A'}
                </div>
            )}
        </div>
    );

    return (
        <Navbar expand="lg" className="custom-navbar" expanded={expanded} ref={navRef}>
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="custom-brand d-flex align-items-center" onClick={handleNavClick}>
                    <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="RecipeTok Logo" className="navbar-logo me-2" />
                    RecipeTok
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    onClick={() => setExpanded(!expanded)}
                    className={isSmallScreen && settings.isLoggedIn ? 'avatar-toggle borderless-toggle' : ''}
                >
                    {isSmallScreen && settings.isLoggedIn ? <AvatarComponent /> : null}
                </Navbar.Toggle>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto custom-nav-links">
                        {isSmallScreen ? (
                            settings.isLoggedIn ? (
                                // Small screen & logged in — show all menu items in dropdown panel
                                <>
                                    <Nav.Link as={NavLink} to="/" className="custom-link" onClick={handleNavClick}>Home</Nav.Link>
                                    <Nav.Link as={NavLink} to="/Cookbook" className="custom-link" onClick={handleNavClick}>My Cookbook</Nav.Link>
                                    <Nav.Link as={NavLink} to="/Account" className="custom-link" onClick={handleNavClick}>Manage Account</Nav.Link>
                                    <Nav.Link as="button" className="custom-link" onClick={() => { handleSignOut(); handleNavClick(); }}>Logout</Nav.Link>
                                </>
                            ) : (
                                // Small screen & not logged in
                                <>
                                    <Nav.Link as={NavLink} to="/" className="custom-link" onClick={handleNavClick}>Home</Nav.Link>
                                    <Nav.Link as={NavLink} to="/Signup" className="custom-link" onClick={handleNavClick}>Sign Up</Nav.Link>
                                    <Nav.Link as={NavLink} to="/Login" className="custom-link" onClick={handleNavClick}>Log In</Nav.Link>
                                </>
                            )
                        ) : (
                            settings.isLoggedIn ? (
                                // Large screen & logged in
                                <>
                                    <Nav.Link as={NavLink} to="/" className="custom-link" onClick={handleNavClick}>Home</Nav.Link>
                                    <Nav.Link as={NavLink} to="/Cookbook" className="custom-link" onClick={handleNavClick}>My Cookbook</Nav.Link>
                                    <NavDropdown
                                        title={<AvatarComponent />}
                                        id="account-dropdown"
                                        className="custom-dropdown"
                                    >
                                        <NavDropdown.Item as={NavLink} to="/Account" onClick={handleNavClick}>Manage Account</NavDropdown.Item>
                                        <NavDropdown.Item as="button" onClick={() => { handleSignOut(); handleNavClick(); }}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                // Large screen & not logged in
                                <>
                                    <Nav.Link as={NavLink} to="/" className="custom-link" onClick={handleNavClick}>Home</Nav.Link>
                                    <Nav.Link as={NavLink} to="/Signup" className="custom-link" onClick={handleNavClick}>Sign Up</Nav.Link>
                                    <Nav.Link as={NavLink} to="/Login" className="custom-link" onClick={handleNavClick}>Log In</Nav.Link>
                                </>
                            )
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default RecipeTokNavbar;