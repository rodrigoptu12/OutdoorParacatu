const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      if (!usuario.ativo) {
        return res.status(401).json({ error: "Usuário inativo" });
      }

      const senhaValida = await Usuario.verifyPassword(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao fazer login" });
    }
  }

  async register(req, res) {
    try {
      const { email, senha, nome } = req.body;

      const usuarioExistente = await Usuario.findByEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }

      const novoUsuario = await Usuario.create({ email, senha, nome });

      res.status(201).json({
        message: "Usuário criado com sucesso",
        usuario: novoUsuario,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }

  async me(req, res) {
    try {
      const usuario = await Usuario.findById(req.userId);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar dados do usuário" });
    }
  }
}

module.exports = new AuthController();
