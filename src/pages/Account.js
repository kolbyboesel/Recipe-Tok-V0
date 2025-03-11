import React, { useContext, useEffect, useState } from 'react';
import { UserSettingsContext } from '../../src/components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/LoadingSpinner'; // Assuming you have a Spinner component

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
          alert('Your account has been successfully deleted.');
          updateUserSettings({
            loginID: 'defaultUser',
            firstName: 'John',
            lastName: 'Doe',
            isLoggedIn: false
          });
          localStorage.removeItem('userSettings');
          navigate('/');
          window.location.reload();
        } else {
          alert('Error deleting account: ' + response.data);
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChangePassword = () => {
    navigate('/ChangePassword');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setEditingImage(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return alert('Please select an image first.');

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
        alert('Profile picture updated successfully!');
        const updatedSettings = {
          ...settings,
          profilePic: base64Image
        };
        setSettings(updatedSettings);
        updateUserSettings(updatedSettings);
        localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
        setEditingImage(false);
      } else {
        alert('Failed to upload image.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('An error occurred while uploading the profile picture.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🌀 Loading Spinner While Operation is Running
  if (isLoading) return <Spinner />;

  return (
    <div className="container page" style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <div className="page-content-container" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 className="text-center mb-4">Welcome, {settings.firstName || 'N/A'}!</h2>

        {/* Profile Picture Section */}
        <div className="profile-picture-section" style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
          <div
            style={{
              width: '160px',
              height: '160px',
              margin: '0 auto',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 0 8px rgba(0,0,0,0.2)'
            }}
          >
            {base64Image ? (
              <img
                src={base64Image}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#ddd',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold'
                }}
              >
                No Image
              </div>
            )}
            <label
              htmlFor="uploadImageInput"
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                textAlign: 'center',
                padding: '0.4rem',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Edit Picture
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
            <div style={{ marginTop: '1rem' }}>
              <button className="m-2" onClick={handleUploadImage}>Save New Picture</button>
              <button className="m-2 bg-gray" onClick={() => { setBase64Image(settings.profilePictureBase64); setEditingImage(false); }}>Cancel</button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="info-section" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p><strong>Email:</strong> {settings.loginID}</p>
          <p><strong>First Name:</strong> {settings.firstName}</p>
          <p><strong>Last Name:</strong> {settings.lastName}</p>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <button className="m-2" onClick={handleChangePassword}>Change Password</button>
          <button className="m-2 bg-red" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Account;