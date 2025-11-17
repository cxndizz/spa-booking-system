"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    const frontendUrls = configService.get('FRONTEND_URL', 'http://localhost:3001').split(',');
    app.enableCors({
        origin: frontendUrls,
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`🚀 Spa Booking API is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map