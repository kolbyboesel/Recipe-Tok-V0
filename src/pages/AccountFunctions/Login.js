import React, { useState, useContext } from 'react';
import { UserSettingsContext } from '../../components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import "../../styles/Modals.css";

const Login = () => {
  const { updateUserSettings } = useContext(UserSettingsContext);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [loginPressed, setLoginPressed] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginPressed(true);
    setError('');

    try {
      const response = await axios.post(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/RecipeTokUserSettings/confirmLogin`, loginData);

      if (response.status === 200) {
        const userSettings = {
          ...response.data,
          isLoggedIn: true // Explicitly set this flag
        };
        updateUserSettings(userSettings);
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
        navigate('/Account');
      } else {
        setError(response.data.message || 'Login failed: Invalid credentials');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred while logging in. Please try again later.');
      } else {
        setError('An error occurred while logging in. Please try again later.');
      }
    } finally {
      setLoginPressed(false);
    }
  };

  return (
    <div className="container page">
      <form className="modal-content animate mobileScreen" onSubmit={handleLoginSubmit}>
        <div className="modal-content-container container pt-5 h-auto">
          <h2 className="text-center">Login to Your Account</h2>

          {error && <div className="alert-error">{error}</div>}

          <div className="form-group">
            <label className="left-align" htmlFor="email">
              <b>Email</b>
            </label>
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="password-label-wrapper">
              <label className="left-align" htmlFor="password">
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
                placeholder="Enter your password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="confirm-btn" type="submit" disabled={loginPressed}>
            <FaSignInAlt /> {loginPressed ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="container pb-5 pt-3 login-cancel">
          <button type="button" onClick={handleCancel} className="cancelbtn">
            Cancel
          </button>
          <span>
            Don't have an account? <a href="/Signup">Sign up</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;