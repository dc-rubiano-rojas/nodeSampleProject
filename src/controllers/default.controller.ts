import { Request, Response } from 'express';
// Me permite agregar decoradores a mis clases
// Tenemos que habilitar en el tsconfig.json
// "experimentalDecorators": true,        
// "emitDecoratorMetadata": true,  
import { route, GET } from 'awilix-express';
import { TestService } from '../services/test.service';

@route('/')
export class DefautController {

    constructor(private readonly testService: TestService) {}
 
    @GET()
    public index(req: Request, res: Response): void {
        res.send({
            NODE_ENV: process.env.NODE_ENV,
            APP_ENV: process.env.APP_ENV,
        });
    }

}

