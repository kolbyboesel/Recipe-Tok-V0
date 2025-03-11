import React, { useState, useContext } from 'react';
import { UserSettingsContext } from '../../components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {

  const { userSettings } = useContext(UserSettingsContext);
  const navigate = useNavigate();
  const [changeData, setChangeData] = useState({
    Email: userSettings.loginID,
    OldPassword: '',
    NewPassword: '',
    NewPasswordRepeat: '',
  });

  const [confirmPressed, setConfirmPressed] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangeData({
      ...changeData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    navigate('/Account');
  };
  const handleChangeSubmit = async (e) => {
    e.preventDefault();
    setConfirmPressed(true);
    setError('');

    try {
      if (changeData.NewPassword !== changeData.NewPasswordRepeat) {
        setError('Passwords do not match');
        setConfirmPressed(false);
        return;
      }

      const response = await axios.post(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/userSettings/update-password`, changeData);

      if (response.status === 200) {
        const successMessage = window.confirm('Your password has been successfully updated. Would you like to return to your account?');
        if (successMessage) {
          navigate('/Account');
        }
      } else {
        setError(response || 'An error occurred while updating your password. Please try again later.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred while updating your password. Please try again later.');
      } else {
        setError('An error occurred while updating your password. Please try again later.');
      }
    } finally {
      setConfirmPressed(false);
    }
  };

  return (
    <div className="container page">
      <form className="modal-content animate mobileScreen" onSubmit={handleChangeSubmit}>
        <div className="modal-content-container container pt-5 h-auto">
          <label className="left-align" htmlFor="oldpsw">
            <b>Current Password</b>
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="Old Password"
            id="oldpsw"
            name="OldPassword"
            value={changeData.OldPassword}
            onChange={handleChange}
            required
          />

          <label className="left-align" htmlFor="newpsw">
            <b>New Password</b>
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            id="newpsw"
            name="NewPassword"
            value={changeData.NewPassword}
            onChange={handleChange}
            required
          />

          <label className="left-align" htmlFor="newpswrepeat">
            <b>New Password Repeat</b>
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="New Password Repeat"
            id="newpswrepeat"
            name="NewPasswordRepeat"
            value={changeData.NewPasswordRepeat}
            onChange={handleChange}
            required
          />

          <button className="confirm-btn" type="submit" style={{ borderRadius: '5px' }} disabled={confirmPressed}>
            {confirmPressed ? 'Updating...' : 'Confirm'}
          </button>

          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>

        <div className="container pb-5 pt-3 login-cancel">
          <button onClick={handleCancel} className="bg-red" style={{ borderRadius: '5px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;