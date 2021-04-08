import express = require('express');
import { createContainer, asClass } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import { TestService } from './services/test.service';
import { IdentifyService } from './services/indetify.service';

export default (app: express.Application): void => {

    const container = createContainer({
        injectionMode: 'CLASSIC'
    });
    
    container.register({
        testService: asClass(TestService).scoped(),
        identifyService: asClass(IdentifyService).scoped()
    });

    app.use(scopePerRequest(container));

};