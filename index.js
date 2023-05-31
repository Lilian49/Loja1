const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

// criar a rota para o POST middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

//IMPORTAR MODEL USUARIOS
const Usuario = require('./models/Usuario');
//IMPORTAR MODEL PRODUTOS
const Produto = require('./models/Produto');

// Configuracao do HandleBars
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Importar os arquivos de rota
const usuarioRoutes = require('./routes/usuario');
const produtoRoutes = require('./routes/produto');

// Definir o prefixo para as rotas de usuário
app.use('/usuario', usuarioRoutes);

// Definir o prefixo para as rotas de produto
app.use('/produto', produtoRoutes);


// rota inicial 
// renderiza o home.hbs para abrir dentro da tag {{{body}}} no layout
app.get('/', async (req, res) => {
  try {
    const produtos = await Produto.findAll(); // Busca todos os produtos do banco de dados

    if (produtos.length > 0) {
      const produtosComImagemBase64 = produtos.map(produto => ({
        ...produto.toJSON(),
        imagem: produto.imagem.toString('base64') // Supondo que a imagem seja um Buffer ou um tipo de dado que possa ser convertido para base64
      }));

      return res.render('home', { produtos: produtosComImagemBase64 });
    } else {
      return res.render('home', { produtos: [] }); // Se não houver produtos, passe um array vazio
    }
  } catch (err) {
    console.log(`Houve um problema: ${err}`);
    return res.render('home', { produtos: [] }); // Em caso de erro, passe um array vazio
  }
});





// rota renderizada para exibir produtos
// rota renderizada 
app.get('/exibir_painel', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll(); // Busca todos os usuários do banco de dados
    const produtos = await Produto.findAll(); // Busca todos os produtos do banco de dados

    if (usuarios.length > 0 || produtos.length > 0) {
      const usuariosJSON = usuarios.map(usuario => usuario.toJSON());
      const produtosComImagemBase64 = produtos.map(produto => ({
        ...produto.toJSON(),
        imagem: produto.imagem.toString('base64') // Supondo que a imagem seja um Buffer ou um tipo de dado que possa ser convertido para base64
      }));

      return res.render('exibir_painel', { NavActiveUsers: true, table: true, usuarios: usuariosJSON, produtos: produtosComImagemBase64 });
    } else {
      return res.render('exibir_painel', { NavActiveUsers: true, table: false });
    }
  } catch (err) {
    console.log(`Houve um problema: ${err}`);
    return res.render('exibir_painel', { NavActiveUsers: true, table: false });
  }
});



// Rota para contato
app.get('/contato', (req, res) => {
  res.render('contato');
});



// Rota para o formulário de login
app.get('/login', (req, res) => {
  res.render('login');
});

// Rota para processar o login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verificar se o usuário está cadastrado
  Usuario.findOne({ where: { email, senha } })
    .then((usuario) => {
      if (usuario) {
        // Usuário encontrado, redirecionar para a página inicial
        return res.redirect('/');
      } else {
        // Usuário não encontrado, exibir mensagem de não cadastrado e redirecionar para cadastro
        return res.render('nao_cadastrado');
      }
    })
    .catch((err) => {
      console.log(`Houve um problema: ${err}`);
      // Exibir uma página de erro ou redirecionar para alguma rota de tratamento de erros
      // return res.render('error');
    });
});




// app.get('/produto/:id', async (req, res) => {
//   try {
//     const produto = await Produto.findByPk(req.params.id); // Busca um produto pelo ID

//     if (produto) {
//       const produtoComImagemBase64 = {
//         ...produto.toJSON(),
//         imagem: produto.imagem.toString('base64') // Supondo que a imagem seja um Buffer ou um tipo de dado que possa ser convertido para base64
//       };

//       return res.render('produto', { produto: produtoComImagemBase64 });
//     } else {
//       // Produto não encontrado
//       return res.status(404).send('Produto não encontrado');
//     }
//   } catch (err) {
//     console.log(`Houve um problema: ${err}`);
//     return res.status(500).send('Ocorreu um erro no servidor');
//   }
// });










//ativar o sistema
app.listen(PORT, () => {
  console.log('Servidor rodando em http://localhost:' + PORT);
});
