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
    const hoje = new Date();
    const reservas = [
      {
        outdoor_id: 1,
        data_inicio: new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Daqui 7 dias
        data_fim: new Date(hoje.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Por 14 dias
        cliente_nome: 'Empresa ABC',
        cliente_contato: '(11) 98765-4321',
        cliente_email: 'contato@empresaabc.com',
        dias: 14,
        preco_mensal: 5000
      },
      {
        outdoor_id: 2,
        data_inicio: new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Daqui 30 dias
        data_fim: new Date(hoje.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Por 30 dias
        cliente_nome: 'Loja XYZ',
        cliente_contato: '(11) 91234-5678',
        cliente_email: 'marketing@lojaxyz.com',
        dias: 30,
        preco_mensal: 8000
      },
      {
        outdoor_id: 3,
        data_inicio: hoje.toISOString().split('T')[0], // Hoje
        data_fim: new Date(hoje.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Por 10 dias
        cliente_nome: 'Supermercado Local',
        cliente_contato: '(11) 95555-1234',
        cliente_email: 'marketing@supermercado.com',
        dias: 10,
        preco_mensal: 3500
      }
    ];

    for (const reserva of reservas) {
      const valorDiario = reserva.preco_mensal / 30;
      const valorTotal = valorDiario * reserva.dias;
      
      await pool.query(
        `INSERT INTO disponibilidade (outdoor_id, data_inicio, data_fim, status, cliente_nome, cliente_contato, cliente_email, valor_total)
         VALUES ($1, $2, $3, 'ocupado', $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [reserva.outdoor_id, reserva.data_inicio, reserva.data_fim, reserva.cliente_nome, reserva.cliente_contato, reserva.cliente_email, valorTotal]
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
