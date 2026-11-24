import { JwtService } from '@nestjs/jwt';
export function normalizarChavePrivada(raw) {
    return raw.replace(/\\n/g, '\n').trim();
}
const assinador = new JwtService();
export async function assinarTokenJaas(cfg, entrada) {
    const { sala, usuario, moderador } = entrada;
    return assinador.signAsync({
        room: sala,
        context: {
            user: {
                id: String(usuario.sub),
                name: usuario.nome,
                email: usuario.email,
                moderator: moderador ? 'true' : 'false',
            },
            features: { livestreaming: false, recording: false, transcription: false, 'outbound-call': false },
        },
    }, {
        algorithm: 'RS256',
        privateKey: normalizarChavePrivada(cfg.privateKey),
        keyid: cfg.kid,
        expiresIn: '2h',
        audience: 'jitsi',
        issuer: 'chat',
        subject: cfg.appId,
    });
}
//# sourceMappingURL=jaas-token.js.map