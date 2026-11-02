var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
let UserProfessional = class UserProfessional {
    id;
    email;
    senhaHash;
    nome;
    perfil;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserProfessional.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], UserProfessional.prototype, "email", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], UserProfessional.prototype, "senhaHash", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], UserProfessional.prototype, "nome", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], UserProfessional.prototype, "perfil", void 0);
UserProfessional = __decorate([
    Entity('users_professionals')
], UserProfessional);
export { UserProfessional };
//# sourceMappingURL=user-professional.entity.js.map