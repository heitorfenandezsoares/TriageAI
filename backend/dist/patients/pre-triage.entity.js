var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
let PreTriage = class PreTriage {
    id;
    pacienteId;
    pacienteNome;
    idade;
    peso;
    queixa;
    alerta;
    urgencia;
    redFlags;
    tabelaMarkdown;
    respostas;
    status;
    criadoEm;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PreTriage.prototype, "id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], PreTriage.prototype, "pacienteId", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], PreTriage.prototype, "pacienteNome", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], PreTriage.prototype, "idade", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], PreTriage.prototype, "peso", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PreTriage.prototype, "queixa", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], PreTriage.prototype, "alerta", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], PreTriage.prototype, "urgencia", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PreTriage.prototype, "redFlags", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PreTriage.prototype, "tabelaMarkdown", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PreTriage.prototype, "respostas", void 0);
__decorate([
    Column({ default: 'pendente' }),
    __metadata("design:type", String)
], PreTriage.prototype, "status", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], PreTriage.prototype, "criadoEm", void 0);
PreTriage = __decorate([
    Entity('pre_triagens')
], PreTriage);
export { PreTriage };
//# sourceMappingURL=pre-triage.entity.js.map