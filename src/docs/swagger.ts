
// src/swagger.ts

import swaggerJsDoc from 'swagger-jsdoc';
import { PORT } from '../settings';
import { CourtArea, Equipment, ExerciseCategory, Position, ResponseStatus, SkillLevel } from '../enums/common';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Athletex API',
      version: '1.0.0',
      description: 'A simple API for basketball workouts and exercises.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/route/*.ts','./src/docs/*.yaml'],
};

const specs = swaggerJsDoc(options);

export default specs;