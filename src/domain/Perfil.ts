// Representa información de perfil extendida para el usuario.
import { Usuario } from "./Usuario";

export class Perfil {
    public usuario?: Usuario; 
    public fotoPerfil?: string; 
    public biografia?: string; 
    public nombre?: string;
    public telefono?: string; 

    // constructor(usuario: Usuario) {
    //     this.usuario = usuario;
    // }
}
