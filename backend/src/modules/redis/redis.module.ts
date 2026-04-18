import { Module, Global, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const logger = new Logger('Redis');
        const host = process.env.REDIS_HOST || 'localhost';
        const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
        
        const redis = new Redis({
          host,
          port,
          lazyConnect: true,
          maxRetriesPerRequest: 0, // Desativa retentativas infinitas de request
          retryStrategy: (times) => {
            if (times > 2) {
              logger.warn('Conexão Redis indisponível. Continuando sem cache distribuído.');
              return null; // Encerra tentativas de reconexão
            }
            return 1000;
          }
        });

        // Captura o erro para evitar que suba como Unhandled Exception
        redis.on('error', (err: any) => {
          if (err.code === 'ECONNREFUSED') {
            // Silencioso, tratado pela estratégia de retry
          } else {
            logger.error('Erro inesperado no Redis:', err.message);
          }
        });

        return redis;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
