export interface AdminCreateDto {
    id?: number,
    nombre?: string;
    apellido?: string;
    telefono?: number;
    cedula?: number;
    rol?: string;
    email: string;
    password: string;
}