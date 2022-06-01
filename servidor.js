const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: IoServer} = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IoServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.set('views', './views');
app.set('view engine', 'pug');

// metodos

let usuarios = [];
let mensajes = [];
let productos = [];

app.get('/', (req, res) => {
    res.render('layouts/main');
});

app.post('/', (req, res) => {
    const usuario = req.body.email;
    return res.redirect(`/?usuario=${usuario}`)
});

// socket

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('ingreso', ({usuario}) => {
        usuarios.push({
            id: socket.id,
            usuario,
        });

        socket.emit('notificacion', `¡Hola ${usuario}, ya puedes participar`);
        socket.broadcast.emit('notificacionGeneral', `- ${usuario} se ha unido al chat`);
    });

    socket.on('inputMensaje', data => {
        const fecha = new Date();
        const usuario = usuarios.find(usuario => usuario.id === socket.id);
        const email = usuario.usuario;
        const mensaje = {
            usuario: email,
            fecha: `${fecha.getDay()-2}/${fecha.getMonth()+1}/${fecha.getFullYear()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getMilliseconds()}`,
            texto: data
        };
        mensajes.push(mensaje);

        socket.emit('mensaje', mensaje);
        socket.broadcast.emit('mensajes', mensaje);
    });

    socket.on('inputProducto', data => {
        const producto = {
            titulo: data.titulo,
            precio: data.precio,
            imagen: data.imagen,
            id: socket.id.substring(0,5)
        };
        productos.push(producto);

        socket.emit('producto', producto);
        socket.broadcast.emit('productos', producto);
    });
});

// server

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

server.on('error', error => console.log(`Error en servidor: ${error}`));