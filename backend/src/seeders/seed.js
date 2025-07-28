require('dotenv').config();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar usuário admin padrão
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO usuarios (email, senha, nome) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO NOTHING`,
      ['admin@outdoors.com', hashedPassword, 'Administrador']
    );
    console.log('✅ Usuário admin criado');

    // Criar outdoors de exemplo
    const outdoors = [
      {
        nome: 'Outdoor Avenida Principal',
        localizacao: 'Av. Principal, 1000 - Centro',
        dimensoes: '9x3 metros',
        preco_mensal: 5000.00,
        foto_url: 'https://example.com/outdoor1.jpg',
        descricao: 'Localização privilegiada com alto fluxo de veículos'
      },
      {
        nome: 'Outdoor Rodovia BR-101',
        localizacao: 'BR-101, KM 45',
        dimensoes: '12x4 metros',
        preco_mensal: 8000.00,
        foto_url: 'https://example.com/outdoor2.jpg',
        descricao: 'Visibilidade excepcional na principal rodovia da região'
      },
      {
        nome: 'Outdoor Shopping Center',
        localizacao: 'Shopping Center Sul - Estacionamento',
        dimensoes: '6x3 metros',
        preco_mensal: 3500.00,
        foto_url: 'https://example.com/outdoor3.jpg',
        descricao: 'Público qualificado e alto poder aquisitivo'
      },
      {
        nome: 'Outdoor Praça Central',
        localizacao: 'Praça da República - Centro',
        dimensoes: '8x3 metros',
        preco_mensal: 4500.00,
        foto_url: 'https://example.com/outdoor4.jpg',
        descricao: 'Ponto de encontro tradicional da cidade'
      },
      {
        nome: 'Outdoor Aeroporto',
        localizacao: 'Acesso ao Aeroporto Internacional',
        dimensoes: '10x4 metros',
        preco_mensal: 7000.00,
        foto_url: 'https://example.com/outdoor5.jpg',
        descricao: 'Público executivo e turistas'
      }
    ];

    for (const outdoor of outdoors) {
      await pool.query(
        `INSERT INTO outdoors (nome, localizacao, dimensoes, preco_mensal, foto_url, descricao)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [outdoor.nome, outdoor.localizacao, outdoor.dimensoes, outdoor.preco_mensal, outdoor.foto_url, outdoor.descricao]
      );
    }
    console.log('✅ Outdoors de exemplo criados');

    // Criar algumas reservas de exemplo
    const reservas = [
      {
        outdoor_id: 1,
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear(),
        cliente_nome: 'Empresa ABC',
        cliente_contato: '(11) 98765-4321',
        cliente_email: 'contato@empresaabc.com'
      },
      {
        outdoor_id: 2,
        mes: new Date().getMonth() + 2,
        ano: new Date().getFullYear(),
        cliente_nome: 'Loja XYZ',
        cliente_contato: '(11) 91234-5678',
        cliente_email: 'marketing@lojaxyz.com'
      }
    ];

    for (const reserva of reservas) {
      await pool.query(
        `INSERT INTO disponibilidade (outdoor_id, mes, ano, status, cliente_nome, cliente_contato, cliente_email, data_reserva)
         VALUES ($1, $2, $3, 'ocupado', $4, $5, $6, CURRENT_TIMESTAMP)
         ON CONFLICT (outdoor_id, mes, ano) DO NOTHING`,
        [reserva.outdoor_id, reserva.mes, reserva.ano, reserva.cliente_nome, reserva.cliente_contato, reserva.cliente_email]
      );
    }
    console.log('✅ Reservas de exemplo criadas');

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📧 Credenciais de acesso:');
    console.log('Email: admin@outdoors.com');
    console.log('Senha: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

seed();