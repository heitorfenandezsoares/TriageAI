import { SetMetadata } from '@nestjs/common';

export type PerfilApi = 'paciente' | 'recepcionista' | 'enfermeiro' | 'gestor';

export const ROLES_KEY = 'roles';
/** Restringe a rota aos perfis informados. Sem @Roles, qualquer usuário autenticado acessa. */
export const Roles = (...perfis: PerfilApi[]) => SetMetadata(ROLES_KEY, perfis);

export const PROFISSIONAIS: PerfilApi[] = ['recepcionista', 'enfermeiro', 'gestor'];
