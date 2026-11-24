export type PerfilApi = 'paciente' | 'recepcionista' | 'enfermeiro' | 'gestor';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...perfis: PerfilApi[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const PROFISSIONAIS: PerfilApi[];
