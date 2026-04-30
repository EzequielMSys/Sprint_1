-- Migration: Add profile fields and ensure indexes for owner/admin management
-- Execute: mysql -u [user] -p [database] < add_perfil_and_owner_fields.sql

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS apelido VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS foto_url TEXT NULL;

-- Ensure tipo column exists and optimize lookups
ALTER TABLE usuarios MODIFY COLUMN tipo ENUM('dono','admin','docente','aluno') NOT NULL DEFAULT 'aluno';

-- Indexes for admin panel performance
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);

-- Verify
DESCRIBE usuarios;
