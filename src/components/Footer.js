import React from 'react';
import { FaGithub, FaEnvelope, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="social-links">
                <a
                    href="mailto:kolbyzboesel@gmail.com"
                    aria-label="Email"
                >
                    <FaEnvelope size={24} />
                </a>
                <a
                    href="https://github.com/kolbyboesel"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                >
                    <FaGithub size={24} />
                </a>
                <a
                    href="https://www.linkedin.com/in/kolby-boesel"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                >
                    <FaLinkedin size={24} />
                </a>
                <a
                    href="https://www.instagram.com/kolbyboesel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                >
                    <FaInstagram size={24} />
                </a>
                <a
                    href="https://x.com/kolbyboesel"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                >
                    <FaTwitter size={24} />
                </a>
            </div>
            <p>Site Last Updated: 3/11/2025</p>
        </footer>
    );
};

export default Footer;
