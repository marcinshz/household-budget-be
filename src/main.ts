import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setVersion('1.0')
    .addTag('Household Budget')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();


/* 
User:
-Username
-password
-wallets
-cele oszczędnościowe 

wallet:
-name
-wydatki
-wplywy

Wydatek:
- wartosc
- kategoria
- note
- data

Wplyw:
- wartosc
-kategoria
-note
-data

Cel:
-typ
-wartosc
-deadline
-start





*/