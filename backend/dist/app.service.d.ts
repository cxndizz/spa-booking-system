export declare class AppService {
    getHello(): string;
    getHealthCheck(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
        environment: string;
    };
}
