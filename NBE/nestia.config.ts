import { INestiaConfig } from '@nestia/sdk';

const NESTIA_CONFIG: INestiaConfig = {
  input: ['src/**/*.controller.ts'],
  swagger: {
    output: './swagger.json',
    beautify: true,
    info: {
      title: 'Broadcast Project API',
      description: 'broadcast project API description',
      version: '0.0.1',
    },
    security: {
      bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Local Server',
      },
    ],
  },
};
export default NESTIA_CONFIG;
