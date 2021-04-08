import { Request, Response } from 'express';
// Me permite agregar decoradores a mis clases
// Tenemos que habilitar en el tsconfig.json
// "experimentalDecorators": true,        
// "emitDecoratorMetadata": true,  
import { route, POST, PUT, GET } from 'awilix-express';
import { IdentifyService } from '../services/indetify.service';
// import { FuncionarioCreateDto } from '../dtos/funcionario.dto';
import { BaseController } from '../common/controllers/base.controller';
import { AdminCreateDto } from '../dtos/admin.dto';

@route('/admin-auth')
export class DefautController extends BaseController {

    constructor(private readonly identifyService: IdentifyService) {
        super();
    }

    @GET()
    public index(req: Request, res: Response): void {
        res.send("HOLA MUNDO");
    }



    @route('/login')
    @POST()
    public async login(req: Request, res: Response): Promise<void> {

        const { email, password } = req.body;

        if (!email || !password ) { 
            res.status(404).json({
                ok: false,
                msg: 'El email y el password son requeridos'
            });
        } else {
            try {
                
                const result = await this.identifyService.login(email, password);

                res.status(200).json({
                    ok: true,
                    msg: 'Login Exitoso!',
                    id: result.id,
                    rol: result.rol,
                    token: result.token
                });
    
    
            } catch(error) {
                this.handleException(error, res);
            }
        }
    }


    // Usuuario solicita cambio de contraseña funcionarios/forgot-password
    @route('/forgot-password')
    @POST()
    public async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        if(!email ) {
            res.status(404).json({
                ok: false,
                msg: "El email del funcionario es requerido"
            });
        } else {
            
            try {
                await this.identifyService.forgotPassword(email);

                res.status(200).json({
                    ok: true,
                    msg: "Verifique su correo electrónico"
                });

            } catch(error){
                this.handleException(error, res);     
            }

        }
    }




    @route('/new-password')
    @PUT()
    public async newPassword(req: Request, res: Response): Promise<void> {
        const { newPassword } = req.body;

        const resetToken = req.headers.reset as string;
        // console.log(resetToken);

        if(!(resetToken || newPassword)) {
            res.status(400).json({
                ok: false,
                msg: 'Todos los campos son requeridos'
            });
        }

        try {
            await this.identifyService.createNewPassword(resetToken, newPassword);

            res.status(200).json({
                ok: true,
                msg: 'Password actualizado correctamente'
            });

        } catch(error) {
            this.handleException(error, res);     
        }

    }
    



   



}

