import { ConfigService } from '@nestjs/config';
export declare const CloudinaryProvider: {
    provide: string;
    useFactory: (configService: ConfigService) => import("cloudinary").ConfigOptions;
    inject: (typeof ConfigService)[];
};
export declare const CloudinaryService: {
    provide: string;
    useFactory: () => {
        uploadImage: (base64Image: string) => Promise<string>;
    };
};
