import bcrypt from "bcryptjs";
import { QueryResult } from "pg";
import jwt from "jsonwebtoken";

// import { FuncionarioCreateDto } from "../dtos/funcionario.dto";
import { pool } from "../common/persistence/postgres.persistence";
import { ApplicationException } from "../common/exceptions/application.exception";
import { transporter } from '../common/config/mailer';
import { AdminCreateDto } from '../dtos/admin.dto';


export class IdentifyService {




  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async login(email: string, password: string): Promise<any> {
    // Validamos el correo que exista
    // try {
      const response: QueryResult = await pool.query(
        "SELECT * FROM admins WHERE email = $1",
        [email]
      );

      if (response.rows.length) {
        const admin = response.rows[0];
        // console.log(admin.rol);
        // Valido Password
        const validPassword = bcrypt.compareSync(password, admin.password);
        if (validPassword) {
          // Verfica que hay secret key
          if (process.env.jwt_secret_key) {
            const secretKey = process.env.jwt_secret_key;
            // Enviar id
            // console.log(funcionario.id);
            // Genera Token
            const token = jwt.sign(
              {
                id: admin.id,
                rol: admin.rol
              },
              secretKey,
              { expiresIn: "7h", algorithm: "HS256" }
            );

            return {
              id: admin.id,
              rol: admin.rol, 
              token
            };
          } else {
            throw new Error("El secret Key no esta definida");
          }
        } else {
          throw new ApplicationException("El password no es correcto!");
        }
      } else {
        throw new ApplicationException(
          "No existe un administradores registrado con ese correo!"
        );
      }
    // } catch(error) {
    //   throw new Error("Este es un error en la consulta a la db" + error);
    // }
   
  }

  
  // Usuario solicita cambio de contraseña
  // Se le olvido la anterior
  public async forgotPassword(email: string): Promise<void> {
    const response: QueryResult = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );
  
    if (response.rows.length) {
      const funcionario = response.rows[0];
  
        // Verfica que hay secret key
        if (process.env.jwt_secret_key_reset) {
            const secretKey = process.env.jwt_secret_key_reset;
            // Genera Token
            const token = jwt.sign({
                id: funcionario.id,
                rol: funcionario.rol
            }, secretKey, { expiresIn: "10m", algorithm: "HS256" });
            
            const verificationLink = `http://localhost:3000/funcionarios/new-password/${token}`;
            try {
                // Enviamos el correo
                this.sendEmail(email, verificationLink);
               
  
            }catch(error) {
                throw new Error("Hubo un problema al enviar el email");
            }
            
            // Guardo token en base de datos del funcionario(Verify token)
            await pool.query(
                "UPDATE admins SET token_reset = $1 WHERE id = $2",
                [token, funcionario.id]
                );
        }
    } else {
      throw new ApplicationException("No existe un administradores registrado con ese correo!");
    }
  }




  private async sendEmail(email: string, verificationLink: string): Promise<void>{  
      await transporter.sendMail({
        from: '"Olvido la contraseña" <dcrubiano01@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Restablecimiento de contraseña de la cuenta de IPES", // Subject line
        html: `
            <h1>Código para restablecer contraseña</h1>
            <br>
            <p>Si quieres recuperar tu contraseña ve al siguiente link: </p>
            <a href="${verificationLink}">${verificationLink}</a>
        `,
      });    
  }
  


  // El resetToken debe llega por los headers
  public async createNewPassword(resetToken: string, newPassword: string): Promise<void> {
    // console.log(resetToken);
    if(process.env.jwt_secret_key_reset) {

        try {
            // Aca me regresa la informacion del payload
            // id y rol
            // const jwtPayload = jwt.verify(resetToken, process.env.jwt_secret_key_reset);
            jwt.verify(resetToken, process.env.jwt_secret_key_reset);
            // console.log(valida);
            // Consultamos el usuario que tenga ese token
            // Este usuario es el que debemos actualizar su password
            const response: QueryResult = await pool.query("SELECT * FROM admins WHERE token_reset = $1",
                                [resetToken]);
            const funcionario = response.rows[0];
            
            // Encriptar newPassword
            const salt = bcrypt.genSaltSync();
            const passwordEncrypted = bcrypt.hashSync(newPassword, salt);

            // const hoy = new Date();
            const now = new Date();
            await pool.query("UPDATE admins SET password = $1, token_reset = $2, updated_at = $3 WHERE id = $4",
            [passwordEncrypted, null, now, funcionario.id]);

        } catch(error) {
            throw new ApplicationException("Hubo un error en los campos solicitados");
        }
    } else {
      throw new Error('Hubo un error');
    }
  }







 


}

