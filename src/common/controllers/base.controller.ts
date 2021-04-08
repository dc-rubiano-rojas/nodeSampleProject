import { Response } from 'express';
import { ApplicationException } from '../exceptions/application.exception';


export abstract class BaseController {

    handleException(err: any, res: Response): void {
        if (err instanceof ApplicationException) {
            res.status(400).json({
                ok: false,
                error: err.message
            });
        } else {
            throw new Error(err);
        }
    }
}