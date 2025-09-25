export type Usuario = {
    id?: number,
    username: string,
    password: string,
    confirmPassword?: string,
    email?: string,
    nombres?: string,
    apellidos?: string,
    fechaNacimiento?: string,
    telefono?: string,
    estado?: string,
    idEmpresa?: number
}