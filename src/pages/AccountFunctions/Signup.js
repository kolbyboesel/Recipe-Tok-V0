import React, { useState, useContext } from 'react';
import { UserSettingsContext } from '../../components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaUser, FaLock, FaUserPlus } from 'react-icons/fa';
import "../../styles/Modals.css";

const Signup = () => {
  const { updateUserSettings } = useContext(UserSettingsContext);
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    Email: '',
    RepeatEmail: '',
    FirstName: '',
    LastName: '',
    Password: '',
    RepeatPassword: '',
  });

  const [signupPressed, setSignupPressed] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupPressed(true);
    setError('');

    if (signupData.Email !== signupData.RepeatEmail) {
      setError('Emails do not match');
      setSignupPressed(false);
      return;
    }

    if (signupData.Password !== signupData.RepeatPassword) {
      setError('Passwords do not match');
      setSignupPressed(false);
      return;
    }

    try {
      const response = await axios.post(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/RecipeTokUserSettings/register`, signupData);

      if (response.status === 200) {
        const userSettings = {
          ...response.data,
          isLoggedIn: true // Explicitly set this flag
        };
        updateUserSettings(userSettings);
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
        navigate('/Account');
      } else {
        setError('Signup failed: Invalid information');
      }
    } catch (error) {
      setError('An error occurred while signing up. Please try again later.');
    } finally {
      setSignupPressed(false);
    }
  };

  return (
    <div className="container page">
      <form className="modal-content animate mobileScreen" onSubmit={handleSignupSubmit}>
        <div className="modal-content-container container pt-5 h-auto">
          <h2 className="text-center">Create New Account</h2>

          {error && <div className="alert-error">{error}</div>}

          <div className="form-group">
            <label className="left-align" htmlFor="Email">
              <b>Email</b>
            </label>
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                id="Email"
                name="Email"
                value={signupData.Email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="left-align" htmlFor="RepeatEmail">
              <b>Confirm Email</b>
            </label>
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className="form-control"
                placeholder="Confirm Email"
                id="RepeatEmail"
                name="RepeatEmail"
                value={signupData.RepeatEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="left-align" htmlFor="FirstName">
              <b>First Name</b>
            </label>
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Enter First Name"
                id="FirstName"
                name="FirstName"
                value={signupData.FirstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="left-align" htmlFor="LastName">
              <b>Last Name</b>
            </label>
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Enter Last Name"
                id="LastName"
                name="LastName"
                value={signupData.LastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="password-label-wrapper">
              <label className="left-align" htmlFor="Password">
                <b>Password</b>
              </label>
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Create Password"
                id="Password"
                name="Password"
                value={signupData.Password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="left-align" htmlFor="RepeatPassword">
              <b>Confirm Password</b>
            </label>
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm Password"
                id="RepeatPassword"
                name="RepeatPassword"
                value={signupData.RepeatPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="confirm-btn" type="submit" disabled={signupPressed}>
            <FaUserPlus /> {signupPressed ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>

        <div className="container pb-5 pt-3 login-cancel">
          <button type="button" onClick={handleCancel} className="cancelbtn">
            Cancel
          </button>
          <span>
            Already have an account? <a href="/Login">Login</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;