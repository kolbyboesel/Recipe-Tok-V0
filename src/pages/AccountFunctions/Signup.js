import React, { useState, useContext } from 'react';
import { UserSettingsContext } from '../../components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
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
        const userSettings = response.data;
        updateUserSettings(userSettings);
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
    <div className="scroll-view">
      <form className="modal-content animate mobileScreen" onSubmit={handleSignupSubmit}>
        <div className="modal-content-container container pt-5 h-auto">
          <label className="left-align" htmlFor="Email">
            <b>Email</b>
          </label>
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

          <label className="left-align" htmlFor="RepeatEmail">
            <b>Repeat Email</b>
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Repeat Email"
            id="RepeatEmail"
            name="RepeatEmail"
            value={signupData.RepeatEmail}
            onChange={handleChange}
            required
          />

          <label className="left-align" htmlFor="FirstName">
            <b>First Name</b>
          </label>
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

          <label className="left-align" htmlFor="LastName">
            <b>Last Name</b>
          </label>
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

          <label className="left-align" htmlFor="Password">
            <b>Password</b>
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            id="Password"
            name="Password"
            value={signupData.Password}
            onChange={handleChange}
            required
          />

          <label className="left-align" htmlFor="RepeatPassword">
            <b>Repeat Password</b>
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Repeat Password"
            id="RepeatPassword"
            name="RepeatPassword"
            value={signupData.RepeatPassword}
            onChange={handleChange}
            required
          />

          <button className="confirm-btn" type="submit" style={{ borderRadius: '5px' }} disabled={signupPressed}>
            {signupPressed ? 'Signing up...' : 'Signup'}
          </button>

          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>

        <div className="container pb-5 pt-3 login-cancel">
          <a href="/" className="cancelbtn" style={{ borderRadius: '5px' }}>
            Cancel
          </a>
          <span className="psw right-align">
            Already have an account? <a href="/Login">Login</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
