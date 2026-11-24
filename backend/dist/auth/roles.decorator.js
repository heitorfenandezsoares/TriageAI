import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...perfis) => SetMetadata(ROLES_KEY, perfis);
export const PROFISSIONAIS = ['recepcionista', 'enfermeiro', 'gestor'];
//# sourceMappingURL=roles.decorator.js.map