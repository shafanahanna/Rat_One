import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, UploadCloud, X } from 'lucide-react';
import EmployeeAvatar from './EmployeeAvatar';
import { uploadProfilePicture } from '../redux/slices/employeeSlice';

const API_URL = import.meta.env.VITE_API_URL;

const ProfilePictureUploader = ({ employeeId, currentPicture, onSuccess }) => {
  const dispatch = useDispatch();
  const { profilePictureLoading, profilePictureError } = useSelector(state => state.employees);
  
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
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
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
      return;
    }
    
    try {
      // Convert file to base64 for direct upload
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64data = reader.result;
          
          // Dispatch the Redux action to upload the profile picture
          const resultAction = await dispatch(uploadProfilePicture({
            employeeId,
            profilePictureUrl: base64data
          }));
          
          // Check if the action was fulfilled (successful)
          if (uploadProfilePicture.fulfilled.match(resultAction)) {
            // Call the onSuccess callback with the new profile picture URL if provided
            if (onSuccess) {
              onSuccess(resultAction.payload.profilePictureUrl);
            }
            
            // Reset the file input
            setFile(null);
            // Clear preview
            setPreviewUrl(null);
            // Hide edit options
            setShowEditOptions(false);
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const cancelEdit = () => {
    setPreviewUrl(null);
    setFile(null);
    setShowEditOptions(false);
  };

  return (
    <div className="profile-picture-uploader">
      <div className="avatar-container relative w-24 h-24 mx-auto">
        {/* Profile Picture */}
        <div className="relative overflow-hidden rounded-full w-full h-full">
          <EmployeeAvatar 
            employee={{ 
              profile_picture: previewUrl || currentPicture,
              name: 'Preview'
            }} 
            size="xxl" 
          />
          
          {/* Overlay on hover */}
          <div 
            className="avatar-overlay absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white rounded-full"
            onClick={() => document.getElementById('profile-picture-input').click()}
          >
            <Camera size={24} />
            <span className="text-xs mt-1 font-medium">Edit Photo</span>
          </div>
        </div>
        
        {/* Edit button */}
        <button
          onClick={() => document.getElementById('profile-picture-input').click()}
          className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-700 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-white border-2 border-white shadow-md transition-all duration-200 hover:scale-105 z-10"
          type="button"
        >
          <Camera size={16} />
        </button>
        
        <input 
          id="profile-picture-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {/* Edit options - shown when a new image is selected */}
      {showEditOptions && (
        <div className="mt-4 text-center flex justify-center space-x-3">
          <button 
            className="bg-gradient-to-r from-[#47BCCB] to-[#4A90E2] text-white rounded-full py-2 px-5 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 border-none cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleUpload}
            disabled={profilePictureLoading}
          >
            {profilePictureLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="text-shadow">Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud size={16} /> 
                <span>Save Photo</span>
              </>
            )}
          </button>
          <button 
            className="bg-transparent text-gray-600 rounded-full py-2 px-5 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 border border-gray-300 cursor-pointer shadow-sm hover:bg-gray-50 hover:border-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={cancelEdit}
            disabled={profilePictureLoading}
          >
            <X size={16} /> Cancel
          </button>
        </div>
      )}
      
      {/* Add a clear edit button when no image is being previewed */}
      {!showEditOptions && (
        <div className="mt-4 text-center">
          <button
            onClick={() => document.getElementById('profile-picture-input').click()}
            className="bg-gradient-to-r from-[#47BCCB] to-[#4A90E2] text-white rounded-full py-2 px-5 text-sm font-semibold flex items-center justify-center gap-2 mx-auto transition-all duration-300 border-none cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5"
            type="button"
          >
            <Camera size={16} /> 
            <span>Edit Profile Picture</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
