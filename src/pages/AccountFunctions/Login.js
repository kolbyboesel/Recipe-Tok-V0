import React, { useState, useContext } from 'react';
import { UserSettingsContext } from '../../components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginPressed(true);
    setError('');

    try {
      const response = await axios.post(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/RecipeTokUserSettings/confirmLogin`, loginData);

      if (response.status === 200) {
        const userSettings = response.data;
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
          <label className="left-align" htmlFor="uname">
            <b>Email</b>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Username"
            id="uname"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <label className="left-align" htmlFor="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            id="psw"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <button className="confirm-btn" type="submit" style={{ borderRadius: '5px' }} disabled={loginPressed}>
            {loginPressed ? 'Logging in...' : 'Login'}
          </button>

          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>

        <div className="container pb-5 pt-3 login-cancel">
          <a href="/" className="cancelbtn" style={{ borderRadius: '5px' }}>
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;