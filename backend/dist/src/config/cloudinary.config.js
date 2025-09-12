"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = exports.CloudinaryProvider = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
exports.CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: (configService) => {
        return cloudinary_1.v2.config({
            cloud_name: configService.get('CLOUDINARY_CLOUD_NAME') || 'dvep621or',
            api_key: configService.get('CLOUDINARY_API_KEY') || '685963599446253',
            api_secret: configService.get('CLOUDINARY_API_SECRET') || 'G9MQcIS2BeBFJoiTp5iXUkw7NW4'
        });
    },
    inject: [config_1.ConfigService],
};
exports.CloudinaryService = {
    provide: 'CLOUDINARY_SERVICE',
    useFactory: () => {
        return {
            uploadImage: async (base64Image) => {
                try {
                    const uploadResponse = await cloudinary_1.v2.uploader.upload(base64Image, {
                        folder: 'hayal_profile_pictures',
                        transformation: [
                            { width: 500, height: 500, crop: 'limit' },
                            { quality: 'auto' }
                        ]
                    });
                    return uploadResponse.secure_url;
                }
                catch (error) {
                    console.error('Cloudinary upload error:', error);
                    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
                }
            }
        };
    }
};
//# sourceMappingURL=cloudinary.config.js.map