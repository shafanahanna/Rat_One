# Profile Picture API Documentation

This document provides information about the profile picture upload and retrieval API endpoints implemented in the employee module.

## API Endpoints

### Upload Profile Picture

Uploads a profile picture for an employee and stores it in Cloudinary.

- **URL**: `/api/employees/profile-picture/:employeeId`
- **Method**: `POST`
- **Authentication**: Required (JWT Bearer Token)
- **URL Parameters**: 
  - `employeeId`: ID of the employee to update

- **Request Body**:
  ```json
  {
    "profilePictureUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
  }
  ```
  The `profilePictureUrl` can be either:
  - A base64-encoded image string (must start with `data:image/`)
  - A direct URL to an existing image

- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
  ```json
  {
    "status": "Success",
    "message": "Profile picture updated successfully",
    "data": {
      "profile_picture": "https://res.cloudinary.com/dvep621or/image/upload/v1629123456/hayal_profile_pictures/abcdef123456.jpg"
    }
  }
  ```

- **Error Responses**:
  - **Code**: 404 Not Found
    - **Content**: `{ "message": "Employee not found" }`
  - **Code**: 400 Bad Request
    - **Content**: `{ "message": "No profile picture provided" }`
  - **Code**: 401 Unauthorized
    - **Content**: `{ "message": "No authentication token provided" }`
  - **Code**: 500 Internal Server Error
    - **Content**: `{ "message": "Failed to upload profile picture: [error details]" }`

### Get Profile Picture

Retrieves the profile picture URL for an employee.

- **URL**: `/api/employees/profile-picture/:employeeId`
- **Method**: `GET`
- **Authentication**: Not required
- **URL Parameters**: 
  - `employeeId`: ID of the employee

- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
  ```json
  {
    "status": "Success",
    "data": {
      "profile_picture": "https://res.cloudinary.com/dvep621or/image/upload/v1629123456/hayal_profile_pictures/abcdef123456.jpg"
    }
  }
  ```

- **Error Responses**:
  - **Code**: 404 Not Found
    - **Content**: `{ "message": "Employee not found" }`
  - **Code**: 500 Internal Server Error
    - **Content**: `{ "message": "Failed to get profile picture: [error details]" }`

## Implementation Details

- Images are uploaded to Cloudinary with the following transformations:
  - Width and height limited to 500px
  - Automatic quality optimization
- Images are stored in the `hayal_profile_pictures` folder in Cloudinary
- The secure URL from Cloudinary is stored in the employee's `profilePicture` field in the database
- The frontend uses the `ProfilePictureUploader` component to handle image selection, preview, and upload
- The `adminInstance` axios instance is used for API communication with proper JWT authentication

## Environment Variables

The following environment variables are used for Cloudinary configuration:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

These can be set in the `.env` file in the backend directory.
