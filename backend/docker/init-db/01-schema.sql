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
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ocupado',
    cliente_nome VARCHAR(100),
    cliente_contato VARCHAR(100),
    cliente_email VARCHAR(100),
    valor_total DECIMAL(10,2) NOT NULL,
    data_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_datas CHECK (data_fim >= data_inicio)
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
CREATE INDEX IF NOT EXISTS idx_disponibilidade_datas ON disponibilidade(data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_outdoor ON disponibilidade(outdoor_id);
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