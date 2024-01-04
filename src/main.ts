import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:4173'],
        methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
        credentials: true,
    })

    app.use(express.json({limit: '50mb'}));

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
-name
-docelowa kwota
-wallet (indywidualny ktory bedzie sie tworzyl specjalnie dla tego celu i bedzie mozna na niego przelac lub z niego zabrac)
-deadline
-start
-note

Limit:
-kategoria wydatku
-wartość
-deadline
-start



*/