const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/chat.html', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Novo usuário conectado');

  socket.on('entrar', (nome) => {
    console.log(`Usuário ${nome} entrou na sala`);

    // Adiciona o usuário ao canal da sala principal
    socket.join('sala_principal');

    // Emite uma mensagem de boas-vindas para a sala principal
    io.to('sala_principal').emit('mensagem', `${nome} entrou na sala`);

    // Trata as mensagens do usuário
    socket.on('mensagem', (mensagem) => {
      console.log(`Nova mensagem: ${mensagem}`);

      // Emite a mensagem para a sala principal, incluindo o nome do usuário
      io.to('sala_principal').emit('mensagem', `${nome}: ${mensagem}`);
    });

    // Trata o evento de desconexão do usuário
    socket.on('disconnect', () => {
      console.log('Usuário desconectado');

      io.to('sala_principal').emit('mensagem', `${nome} saiu da sala`);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
