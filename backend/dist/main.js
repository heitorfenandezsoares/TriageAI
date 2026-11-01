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
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap().catch((err) => {
    console.error('Falha ao iniciar a aplicação:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map