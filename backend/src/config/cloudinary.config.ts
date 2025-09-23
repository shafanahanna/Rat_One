import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME') || 'dvep621or',
      api_key: configService.get('CLOUDINARY_API_KEY') || '685963599446253',
      api_secret: configService.get('CLOUDINARY_API_SECRET') || 'G9MQcIS2BeBFJoiTp5iXUkw7NW4'
    });
  },
  inject: [ConfigService],
};

export const CloudinaryService = {
  provide: 'CLOUDINARY_SERVICE',
  useFactory: () => {
    return {
      uploadImage: async (base64Image: string): Promise<string> => {
        try {
          // Upload base64 image to Cloudinary
          const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: 'upcline_profile_pictures',
            transformation: [
              { width: 500, height: 500, crop: 'limit' },
              { quality: 'auto' }
            ]
          });
          
          return uploadResponse.secure_url;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
        }
      }
    };
  }
};
