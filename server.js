const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

let proximoUsuarioId = 6; 
let proximoItemId = 6;

let usuarios = [
    { id: 1, nome: "Pessoa 1", email: "pessoa1@gmail.com" },
    { id: 2, nome: "Pessoa 2", email: "pessoa2@gmail.com" },
    { id: 3, nome: "Pessoa 3", email: "pessoa3@gmail.com" },
    { id: 4, nome: "Pessoa 4", email: "pessoa4@gmail.com" },
    { id: 5, nome: "Pessoa 5", email: "pessoa5@gmail.com" },
];

let itens = [
    { id: 1, nome: "Sofá usado", categoria: "Móveis", tipo: "Doação", descricao: "Sofá em bom estado", usuarioId: 1 },
    { id: 2, nome: "Biblioteca da meia-noite", categoria: "Livros", tipo: "Troca", descricao: "Em ótimo estado", usuarioId: 2 },
    { id: 3, nome: "Pc DO Alanzoka", categoria: "Eletronicos", tipo: "Troca", descricao: "Em ótimo estado", usuarioId: 3 },
    { id: 4, nome: "bola de Futebol", categoria: "Brinquedo", tipo: "Troca", descricao: "Em péssimo estado", usuarioId: 4 },
    { id: 5, nome: " Garrafa Térmica", categoria: "recipiente isotérmico", tipo: "Troca", descricao: "Em ótimo estado", usuarioId: 5 },
];

let mensagens = [
    { id: 1, remetenteId: 1, destinatarioId: 2, texto: "Oi! Tenho interesse no seu livro!" },
    { id: 2, remetenteId: 2, destinatarioId: 3, texto: "olá, vc ainda tem o Pc disponivel para troca? " },
    { id: 3, remetenteId: 3, destinatarioId: 4, texto: "oi,essa bola de futebol ainda pode ser tilizada?" },
    { id: 4, remetenteId: 4, destinatarioId: 5, texto: "olá, vc ainda tem a garrafa Térmica?" },
    { id: 5, remetenteId: 5, destinatarioId: 1, texto: "oi gostaria de trocar algo pelo sofá?" }
];

app.get('/', (req, res) => res.render('home'));


app.get('/usuarios', (req, res) => {
    res.render('listarUsuarios', { usuarios: usuarios });
});

app.get('/usuarios/novo', (req, res) => res.render('cadastrarUsuario'));

app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;
    const novoUsuario = { id: proximoUsuarioId++, nome, email }; 
    usuarios.push(novoUsuario);
    res.redirect('/usuarios'); 
});

app.get('/usuarios/ver/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return res.status(404).send('Usuário não encontrado');

    const itensDoUsuario = itens.filter(i => i.usuarioId === id);

    res.render('detalharUsuario', {
        usuario,
        itensDoUsuario,
        title: `Detalhes de ${usuario.nome}` 
    }); 
});


app.post('/usuarios/excluir/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).send('Usuário não encontrado');
    usuarios.splice(index, 1);
    res.redirect('/usuarios');
});


app.get('/itens', (req, res) => {
    const itensComDono = itens.map(item => {
        const dono = usuarios.find(u => u.id === item.usuarioId);
        return {
            ...item,
            nomeDono: dono ? dono.nome : "Desconhecido"
        };
    });
   
    res.render('listarItens', { itens: itensComDono });
});

app.get('/itens/novo', (req, res) => {
    res.render('cadastrarItem', { usuarios: usuarios });
});

app.post('/itens', (req, res) => {
    const { nome, categoria, tipo, descricao, usuarioId } = req.body;
    
    const novoItem = {
        id: proximoItemId++,
        nome,
        categoria,
        tipo,
        descricao,
        usuarioId: parseInt(usuarioId)
    };
    itens.push(novoItem);
    
    res.redirect('/itens');
});

app.get('/itens/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = itens.find(i => i.id === id);
    if (!item) return res.status(404).send('Item não encontrado');

    const dono = usuarios.find(u => u.id === item.usuarioId);

    res.render('detalharItens', {
        item,
        dono,
        title: `Detalhes de ${item.nome}`
    });
});


app.listen(port, () => {
    console.log(`Servidor em execução: http://localhost:${port}`);
});