import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use((req, res, next) => {
        if (req.url) {
            req.url = req.url.replace(/\/{2,}/g, '/');
        }
        next();
    });
    const origens = (process.env.CORS_ORIGINS ||
        'https://app.triageia.com,https://triageia.com,https://www.triageia.com,http://localhost:5173,http://127.0.0.1:5173')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    app.enableCors({
        origin: origens,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: false,
    });
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap().catch((err) => {
    console.error('Falha ao iniciar a aplicação:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map