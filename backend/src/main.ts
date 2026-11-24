import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Normaliza barras duplas na URL (ex: //auth/register -> /auth/register)
  app.use((req: any, res: any, next: any) => {
    if (req.url) {
      req.url = req.url.replace(/\/{2,}/g, '/');
    }
    next();
  });

  // Origens permitidas: CORS_ORIGINS (lista separada por vírgula) ou o padrão abaixo.
  const origens = (process.env.CORS_ORIGINS ??
    'https://triageia.com,https://www.triageia.com,http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origens,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // A autenticação usa o header Authorization (Bearer), não cookies.
    credentials: false,
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar a aplicação:', err);
  process.exit(1);
});
