
-- Migration: Add authentication fields to usuarios table
-- Execute: mysql -u [user] -p [database] < add_auth_fields.sql

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS senha_temporaria TINYINT(1) NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS ativo TINYINT(1) NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS token_recuperacao VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS token_expiracao DATETIME NULL,
ADD COLUMN IF NOT EXISTS ultimo_login DATETIME NULL,
ADD COLUMN IF NOT EXISTS atualizado_em DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Ensure email is UNIQUE
ALTER TABLE usuarios MODIFY COLUMN email VARCHAR(150) NOT NULL;
ALTER TABLE usuarios ADD UNIQUE KEY unique_email (email);

-- Update existing users (set defaults)
UPDATE usuarios SET senha_temporaria = 1, ativo = 1 WHERE senha_temporaria IS NULL OR ativo IS NULL;

-- Verify
DESCRIBE usuarios;
SELECT COUNT(*) FROM usuarios;

