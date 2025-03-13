import React, { useContext, useEffect, useState } from 'react';
import { UserSettingsContext } from '../../src/components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/LoadingSpinner';
import { FaUser, FaEnvelope, FaEdit, FaKey, FaTrash, FaSave, FaTimes, FaCamera } from 'react-icons/fa';

const Account = () => {
  const { updateUserSettings, userSettings } = useContext(UserSettingsContext);
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    loginID: '',
    firstName: '',
    lastName: '',
    isLoggedIn: false,
    profilePictureUrl: '',
    profilePictureBase64: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [editingImage, setEditingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    if (userSettings) {
      setSettings(userSettings);
      setBase64Image(userSettings.profilePic || '');
    }
  }, [userSettings]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      try {
        setIsLoading(true);
        const response = await axios.delete(
          `https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/RecipeTokUserSettings/delete/${settings.loginID}`
        );
        if (response.status === 200) {
          setStatusMessage({ type: 'success', message: 'Your account has been successfully deleted.' });

          setTimeout(() => {
            updateUserSettings({
              loginID: 'defaultUser',
              firstName: 'John',
              lastName: 'Doe',
              isLoggedIn: false
            });
            localStorage.removeItem('userSettings');
            navigate('/');
            window.location.reload();
          }, 2000);
        } else {
          setStatusMessage({ type: 'error', message: 'Error deleting account: ' + response.data });
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        setStatusMessage({ type: 'error', message: 'An error occurred. Please try again later.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChangePassword = () => {
    navigate('/ChangePassword');
  };

  const handleNavigateToCookbook = () => {
    navigate('/Cookbook');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setStatusMessage({ type: 'error', message: 'Image size exceeds 5MB limit. Please choose a smaller image.' });
        return;
      }

      setSelectedImage(file);
      setEditingImage(true);
      setStatusMessage({ type: '', message: '' });

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      setStatusMessage({ type: 'error', message: 'Please select an image first.' });
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedImage);
    formData.append('loginID', settings.loginID);
    formData.append('profilePictureBase64', base64Image);

    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/RecipeTokUserSettings/upload-profile-picture',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.status === 200) {
        setStatusMessage({ type: 'success', message: 'Profile picture updated successfully!' });
        const updatedSettings = {
          ...settings,
          profilePic: base64Image
        };
        setSettings(updatedSettings);
        updateUserSettings(updatedSettings);
        localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
        setEditingImage(false);
      } else {
        setStatusMessage({ type: 'error', message: 'Failed to upload image.' });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setStatusMessage({ type: 'error', message: 'An error occurred while uploading the profile picture.' });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelImageEdit = () => {
    setBase64Image(settings.profilePic || '');
    setEditingImage(false);
    setSelectedImage(null);
    setStatusMessage({ type: '', message: '' });
  };

  // Get first letter of first name and last name for avatar placeholder
  const getInitials = () => {
    const firstInitial = settings.firstName ? settings.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = settings.lastName ? settings.lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="container page">
      <div className="page-content-container">
        {statusMessage.message && (
          <div className={`status-message ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'} fade-in`}>
            {statusMessage.message}
          </div>
        )}

        <div className="profile-card">
          <h2 className="text-center">Your Profile</h2>

          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="profile-picture-container">
              {base64Image ? (
                <img
                  src={base64Image}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-initials">
                  {getInitials()}
                </div>
              )}
              <label
                htmlFor="uploadImageInput"
                className="profile-edit-label"
              >
                <FaCamera /> Edit
                <input
                  id="uploadImageInput"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {editingImage && (
              <div className="edit-image-buttons">
                <button onClick={handleUploadImage}>
                  <FaSave /> Save
                </button>
                <button onClick={cancelImageEdit} className="bg-secondary">
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* User Information */}
          <div className="user-info">
            <h3 className="section-heading">Account Information</h3>

            <div className="info-item">
              <FaUser className="info-icon" />
              <div>
                <div className="info-label">Name</div>
                <div className="info-value">
                  {settings.firstName || 'N/A'} {settings.lastName || ''}
                </div>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <div className="info-label">Email</div>
                <div className="info-value">
                  {settings.loginID || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={handleNavigateToCookbook}
              className="action-button accent-button"
            >
              <FaEdit /> My Cookbook
            </button>

            <button
              onClick={handleChangePassword}
              className="action-button"
            >
              <FaKey /> Change Password
            </button>

            <button
              onClick={handleDeleteAccount}
              className="action-button full-width-button cancelbtn"
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;