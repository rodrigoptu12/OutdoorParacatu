-- Criação das tabelas
-- Este arquivo será executado automaticamente pelo PostgreSQL

-- Tabela de Outdoors
CREATE TABLE IF NOT EXISTS outdoors (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(200) NOT NULL,
    dimensoes VARCHAR(50) NOT NULL,
    preco_mensal DECIMAL(10,2) NOT NULL,
    foto_url VARCHAR(500),
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Disponibilidade
CREATE TABLE IF NOT EXISTS disponibilidade (
    id SERIAL PRIMARY KEY,
    outdoor_id INTEGER REFERENCES outdoors(id) ON DELETE CASCADE,
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    ano INTEGER NOT NULL CHECK (ano >= 2024),
    status VARCHAR(20) NOT NULL DEFAULT 'disponivel',
    cliente_nome VARCHAR(100),
    cliente_contato VARCHAR(100),
    cliente_email VARCHAR(100),
    data_reserva TIMESTAMP,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(outdoor_id, mes, ano)
);

-- Tabela de Usuários Admin
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_disponibilidade_mes_ano ON disponibilidade(mes, ano);
CREATE INDEX IF NOT EXISTS idx_outdoors_ativo ON outdoors(ativo);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_outdoors_updated_at BEFORE UPDATE ON outdoors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disponibilidade_updated_at BEFORE UPDATE ON disponibilidade
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();