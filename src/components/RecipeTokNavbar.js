import React, { useContext, useState, useEffect, useRef } from 'react';
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import { UserSettingsContext } from './UserSettings';
import { FaCog, FaSignOutAlt, FaBook } from 'react-icons/fa';

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
                                    <Nav.Link as={NavLink} to="/Account" className="custom-link" onClick={handleNavClick}>Account Settings</Nav.Link>
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
                                    <NavDropdown
                                        title={
                                            <div className="account-dropdown-toggle">
                                                <AvatarComponent />
                                                <span className="user-name-display">
                                                    {userSettings?.firstName || 'Account'}
                                                </span>
                                            </div>
                                        }
                                        id="account-dropdown"
                                        className="custom-dropdown"
                                    >
                                        <div className="dropdown-header">
                                            <div className="dropdown-user-info">
                                                <div className="dropdown-avatar">
                                                    {profilePictureBase64 ? (
                                                        <img src={profilePictureBase64} alt="Profile" />
                                                    ) : (
                                                        <div className="dropdown-avatar-placeholder">
                                                            {userSettings?.firstName?.charAt(0).toUpperCase() || 'A'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="dropdown-user-details">
                                                    <div className="dropdown-user-name">
                                                        {userSettings?.firstName} {userSettings?.lastName}
                                                    </div>
                                                    <div className="dropdown-user-email">
                                                        {userSettings?.loginID}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <NavDropdown.Item as={NavLink} to="/Cookbook" onClick={handleNavClick} className="dropdown-menu-item">
                                            <FaBook className="dropdown-icon" /> My Cookbook
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/Account" onClick={handleNavClick} className="dropdown-menu-item">
                                            <FaCog className="dropdown-icon" /> Account Settings
                                        </NavDropdown.Item>
                                        <div className="dropdown-divider"></div>
                                        <NavDropdown.Item as="button" onClick={() => { handleSignOut(); handleNavClick(); }} className="dropdown-menu-item logout-item">
                                            <FaSignOutAlt className="dropdown-icon" /> Logout
                                        </NavDropdown.Item>
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