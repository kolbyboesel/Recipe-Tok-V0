import React, { useContext, useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import { UserSettingsContext } from './UserSettings';
import classNames from 'classnames';

const RecipeTokNavbar = () => {
    const { userSettings, updateUserSettings } = useContext(UserSettingsContext);
    const [settings, setSettings] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        isLoggedIn: false,
    });

    const [expanded, setExpanded] = useState(false);
    const navRef = useRef();

    useEffect(() => {
        if (userSettings) {
            setSettings(userSettings);
        }
    }, [userSettings]);

    const defaultSettings = {
        loginID: 'defaultUser@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        isLoggedIn: false
    };

    const handleSignOut = () => {
        updateUserSettings(defaultSettings);
        localStorage.removeItem('userSettings');
        window.location.href = '/';
    };

    // Close navbar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close navbar on link click
    const handleNavClick = () => setExpanded(false);

    return (
        <Navbar expand="lg" className="custom-navbar" expanded={expanded} ref={navRef}>
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="custom-brand d-flex align-items-center" onClick={handleNavClick}>
                    <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="RecipeTok Logo" className="navbar-logo me-2" />
                    RecipeTok
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto custom-nav-links">
                        <Nav.Link as={NavLink} to="/" className={({ isActive }) => classNames("custom-link", { active: isActive })} onClick={handleNavClick}>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/Cookbook" className={({ isActive }) => classNames("custom-link", { active: isActive })} onClick={handleNavClick}>Cookbook</Nav.Link>

                        {settings.isLoggedIn ? (
                            <>
                                <Nav.Link as="button" onClick={() => { handleSignOut(); handleNavClick(); }} className="custom-link nav-link">Signout</Nav.Link>
                                <Nav.Link as={NavLink} to="/Account" className={({ isActive }) => classNames("custom-link", { active: isActive })} onClick={handleNavClick}>Account</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/Signup" className={({ isActive }) => classNames("custom-link", { active: isActive })} onClick={handleNavClick}>Sign Up</Nav.Link>
                                <Nav.Link as={NavLink} to="/Login" className={({ isActive }) => classNames("custom-link", { active: isActive })} onClick={handleNavClick}>Log In</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default RecipeTokNavbar;