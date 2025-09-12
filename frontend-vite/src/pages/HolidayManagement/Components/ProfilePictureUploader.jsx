import React, { useState } from 'react';
import adminInstance from '../../../Interceptors/adminInstance';
import { FaPenToSquare } from 'react-icons/fa6';
import { Camera } from 'lucide-react';


const ProfilePictureUploader = ({ employeeId, currentPicture, onSuccess }) => {

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [showEditOptions, setShowEditOptions] = useState(false);
  
  // Cloudinary configuration from environment variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dvep621or';
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '685963599446253';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Check file type
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setShowEditOptions(true); // Show edit options when a new image is selected
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an image to upload');
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert file to base64 for direct upload
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64data = reader.result;
          
          // Send the base64 data directly to the backend
          const response = await adminInstance.post(
            `/profile-picture/${employeeId}`,
            { 
              profilePictureUrl: base64data
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.data.status === 'Success') {
            alert('Profile picture updated successfully');
            // Call the onSuccess callback with the new profile picture URL
            if (onSuccess) {
              onSuccess(response.data.data.profile_picture);
            }
            // Reset the file input
            setFile(null);
            // Clear preview
            setPreviewUrl(null);
            // Hide edit options
            setShowEditOptions(false);
          } else {
            alert('Failed to update profile picture in the system');
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          alert(error.message || 'Failed to upload profile picture');
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error processing image file');
        setLoading(false);
      };
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert(error.message || 'Failed to upload profile picture');
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setPreviewUrl(null);
    setFile(null);
    setShowEditOptions(false);
  };

  return (
    <div className="profile-picture-uploader">
      <div className="avatar-container" style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
        {/* Profile Picture */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '50%', width: '100%', height: '100%' }}>
         
          
          {/* Overlay on hover - using inline styles for hover effect since className hover doesn't work */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              cursor: 'pointer',
              color: 'white',
              borderRadius: '50%',
            }}
            className="hover:opacity-100"
            onClick={() => document.getElementById('profile-picture-input').click()}
            onMouseEnter={() => {
              // Use DOM manipulation for hover effect since CSS hover doesn't work reliably
              document.querySelector('.avatar-overlay').style.opacity = '1';
            }}
            onMouseLeave={() => {
              document.querySelector('.avatar-overlay').style.opacity = '0';
            }}
          >
            <Camera size={24} />
            <span style={{ fontSize: '12px', marginTop: '4px', fontWeight: '500' }}>Edit Photo</span>
          </div>
        </div>
        
        {/* Edit button - more prominent than just the camera icon */}
        <button
          onClick={() => document.getElementById('profile-picture-input').click()}
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            backgroundColor: '#3B82F6',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
            zIndex: 10
          }}
          className="hover:bg-blue-700 transform hover:scale-105"
          type="button"
        >
          <Camera size={16} />
        </button>
        
        <input 
          id="profile-picture-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      
      {/* Edit options - shown when a new image is selected */}
      {showEditOptions && (
        <div className="mt-4 text-center flex justify-center space-x-3">
          <button 
            style={{
              background: 'linear-gradient(90deg, #47BCCB 0%, #4A90E2 100%)',
              color: 'white',
              borderRadius: '30px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 10px rgba(74, 144, 226, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="hover:shadow-lg hover:translate-y-[-2px]"
            onClick={handleUpload}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(74, 144, 226, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(74, 144, 226, 0.3)';
            }}
          >
            {loading ? (
              <>
                <Camera className="animate-spin" style={{ filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.5))' }} /> 
                <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Uploading...</span>
              </>
            ) : (
              <>
                <Camera style={{ filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.5))' }} /> 
                <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Save Photo</span>
              </>
            )}
          </button>
          <button 
            style={{
              background: 'transparent',
              color: '#4B5563',
              borderRadius: '30px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              border: '1px solid #D1D5DB',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
            className="hover:bg-gray-50 hover:border-gray-400"
            onClick={cancelEdit}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}
          >
            <FaPenToSquare /> Cancel
          </button>
        </div>
      )}
      
      {/* Add a clear edit button when no image is being previewed */}
      {!showEditOptions && (
        <div className="mt-4 text-center">
          <button
            onClick={() => document.getElementById('profile-picture-input').click()}
            style={{
              background: 'linear-gradient(90deg, #47BCCB 0%, #4A90E2 100%)',
              color: 'white',
              borderRadius: '30px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              margin: '0 auto',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(74, 144, 226, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="hover:shadow-lg hover:translate-y-[-2px]"
            type="button"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(74, 144, 226, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(74, 144, 226, 0.3)';
            }}
          >
            <Camera size={16} style={{ filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.5))' }} /> 
            <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Edit Profile Picture</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
