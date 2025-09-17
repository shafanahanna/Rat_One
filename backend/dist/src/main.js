"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    if (dataSource.isInitialized) {
        console.log('✅ Database connection established successfully');
    }
    else {
        console.error('❌ Failed to establish database connection');
    }
    app.enableCors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'admintoken', 'Admintoken', 'admin-token', 'Admin-Token'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    await app.listen(4000);
    console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map