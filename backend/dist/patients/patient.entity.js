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
let Patient = class Patient {
    id;
    ini;
    idade;
    q;
    nivel;
    espera;
    risco;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Patient.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Patient.prototype, "ini", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Patient.prototype, "idade", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Patient.prototype, "q", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Patient.prototype, "nivel", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Patient.prototype, "espera", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Patient.prototype, "risco", void 0);
Patient = __decorate([
    Entity('patients')
], Patient);
export { Patient };
//# sourceMappingURL=patient.entity.js.map