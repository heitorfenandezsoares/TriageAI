-- ==============================================================================
-- TriageAI - Script Completo de Criação e Configuração do Banco de Dados
-- Compatível com Hostinger (MySQL 8.x / MariaDB 10.x / phpMyAdmin)
-- ==============================================================================

-- 1. TABELA DE USUÁRIOS GERAIS (PACIENTES)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `senhaHash` VARCHAR(255) NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `perfil` VARCHAR(50) NOT NULL DEFAULT 'paciente',
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABELA DE PROFISSIONAIS DE SAÚDE E EQUIPE HOSPITALAR
CREATE TABLE IF NOT EXISTS `users_professionals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `senhaHash` VARCHAR(255) NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `perfil` VARCHAR(50) NOT NULL, -- enfermeiro, gestor, recepcionista
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABELA DE ARMAZENAMENTO DAS PRÉ-TRIAGENS (CHATBOT / APP DO PACIENTE)
CREATE TABLE IF NOT EXISTS `pre_triagens` (
  `id` VARCHAR(64) PRIMARY KEY,
  `pacienteId` VARCHAR(255) NULL,
  `pacienteNome` VARCHAR(255) NULL,
  `idade` VARCHAR(50) NULL,
  `peso` VARCHAR(50) NULL,
  `queixa` TEXT NULL,
  `alerta` TINYINT(1) NOT NULL DEFAULT 0,
  `urgencia` VARCHAR(50) NULL, -- 'Baixo', 'Médio', 'Alto'
  `redFlags` TEXT NULL,
  `tabelaMarkdown` TEXT NULL,
  `respostas` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pendente', -- 'pendente', 'em_fila', 'atendido'
  `criadoEm` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABELA DA FILA DE ATENDIMENTO HOSPITALAR (PROTOCOLO DE MANCHESTER)
CREATE TABLE IF NOT EXISTS `patients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ini` VARCHAR(20) NOT NULL,      -- Iniciais do paciente (ex: M.S.)
  `idade` INT NOT NULL,            -- Idade em anos
  `q` INT NOT NULL DEFAULT 0,      -- Índice da queixa principal (0 a 14)
  `nivel` VARCHAR(30) NOT NULL,    -- Manchester: 'vermelho', 'laranja', 'amarelo', 'verde', 'azul'
  `espera` INT NOT NULL DEFAULT 0, -- Tempo de espera em minutos
  `risco` FLOAT NOT NULL DEFAULT 0.1 -- Score de risco clínico (0.0 a 1.0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABELA DO MAPA DE LEITOS HOSPITALARES
CREATE TABLE IF NOT EXISTS `beds` (
  `id` VARCHAR(20) PRIMARY KEY,    -- Código do leito (ex: E1, U1, O1)
  `setor` VARCHAR(50) NOT NULL,    -- 'enfermaria', 'uti', 'observacao'
  `status` VARCHAR(50) NOT NULL    -- 'disponivel', 'ocupado', 'limpeza', 'reservado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- CARGA INICIAL DE DADOS (SEEDS)
-- ==============================================================================

-- Profissionais pré-configurados (Hash Bcrypt de: Enfermeiro@123, Gestor@123, Recepcao@123)
-- Código de autenticação de 2 fatores (MFA): 123456
INSERT INTO `users_professionals` (`email`, `senhaHash`, `nome`, `perfil`) VALUES
('enfermeiro@triageai.com', '$2b$10$ZQSsOqCs0TiDKf574SbwYu7Ncs.D9F6ZnFfkt2E.JHpmaQZDHHo2.', 'Enf. Juliana Ramos', 'enfermeiro'),
('gestor@triageai.com', '$2b$10$LBb9UAZ3hgOVwyfEogACpeTwMIF3pfZmESdy0DFz1ecyB6cS4F2sy', 'Dr. Roberto Mendes', 'gestor'),
('recepcao@triageai.com', '$2b$10$VQ5QABLgQJp7hl6go07kzO3/6LS3G.XSmJxTKAM3CQth9MDqYM3Ji', 'Carlos Atendente', 'recepcionista')
ON DUPLICATE KEY UPDATE `senhaHash` = VALUES(`senhaHash`), `nome` = VALUES(`nome`), `perfil` = VALUES(`perfil`);

-- Inserção correspondente na tabela users para compatibilidade completa
INSERT INTO `users` (`email`, `senhaHash`, `nome`, `perfil`) VALUES
('enfermeiro@triageai.com', '$2b$10$ZQSsOqCs0TiDKf574SbwYu7Ncs.D9F6ZnFfkt2E.JHpmaQZDHHo2.', 'Enf. Juliana Ramos', 'enfermeiro'),
('gestor@triageai.com', '$2b$10$LBb9UAZ3hgOVwyfEogACpeTwMIF3pfZmESdy0DFz1ecyB6cS4F2sy', 'Dr. Roberto Mendes', 'gestor'),
('recepcao@triageai.com', '$2b$10$VQ5QABLgQJp7hl6go07kzO3/6LS3G.XSmJxTKAM3CQth9MDqYM3Ji', 'Carlos Atendente', 'recepcionista')
ON DUPLICATE KEY UPDATE `senhaHash` = VALUES(`senhaHash`), `nome` = VALUES(`nome`), `perfil` = VALUES(`perfil`);

-- Pacientes na fila inicial de triagem Manchester
INSERT INTO `patients` (`id`, `ini`, `idade`, `q`, `nivel`, `espera`, `risco`) VALUES
(1, 'M.S.', 34, 0, 'azul', 95, 0.05),
(2, 'L.F.', 27, 1, 'verde', 48, 0.12),
(3, 'C.R.', 45, 2, 'amarelo', 35, 0.45),
(4, 'J.P.', 61, 3, 'laranja', 6, 0.78),
(5, 'A.T.', 19, 4, 'verde', 22, 0.08),
(6, 'B.N.', 72, 6, 'amarelo', 70, 0.72)
ON DUPLICATE KEY UPDATE `ini` = VALUES(`ini`);

-- Mapa de Leitos Inicial (Enfermaria: E1 a E12, UTI: U1 a U6, Observação: O1 a O8)
INSERT INTO `beds` (`id`, `setor`, `status`) VALUES
('E1', 'enfermaria', 'ocupado'),
('E2', 'enfermaria', 'ocupado'),
('E3', 'enfermaria', 'disponivel'),
('E4', 'enfermaria', 'ocupado'),
('E5', 'enfermaria', 'limpeza'),
('E6', 'enfermaria', 'ocupado'),
('E7', 'enfermaria', 'reservado'),
('E8', 'enfermaria', 'ocupado'),
('E9', 'enfermaria', 'ocupado'),
('E10', 'enfermaria', 'disponivel'),
('E11', 'enfermaria', 'ocupado'),
('E12', 'enfermaria', 'disponivel'),
('U1', 'uti', 'disponivel'),
('U2', 'uti', 'ocupado'),
('U3', 'uti', 'ocupado'),
('U4', 'uti', 'reservado'),
('U5', 'uti', 'ocupado'),
('U6', 'uti', 'limpeza'),
('O1', 'observacao', 'limpeza'),
('O2', 'observacao', 'ocupado'),
('O3', 'observacao', 'reservado'),
('O4', 'observacao', 'ocupado'),
('O5', 'observacao', 'ocupado'),
('O6', 'observacao', 'disponivel'),
('O7', 'observacao', 'ocupado'),
('O8', 'observacao', 'disponivel')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);
