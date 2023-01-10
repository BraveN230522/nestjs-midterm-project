import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import multer from 'multer';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const upload = multer();
  // for parsing application/json
  app.use(express.json());

  // for parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // for parsing multipart/form-data
  app.use(express.static('public'));
  app.use(upload.single('undefined'));

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(1999);
}
bootstrap();
