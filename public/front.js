const socket = io();

const notificacionHTML = document.getElementById('notificacion');
const notificacionGeneralHTML = document.getElementById('notificacionGeneral');
const inputMensajeHTML = document.getElementById('inputMensaje');
const enviarMensajeHTML = document.getElementById('enviarMensaje');
const contenedorMensajesHTML = document.getElementById('contenedorMensajes');
const enviarProductoHTML = document.getElementById('enviarProducto');
const inputTituloHTML = document.getElementById('inputTitulo');
const inputPrecioHTML = document.getElementById('inputPrecio');
const inputImagenHTML = document.getElementById('inputImagen');
const contenedorProductosHTML = document.getElementById('contenedorProductos');

const {usuario} = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true
});

socket.emit('ingreso', {usuario});

if(usuario){

    socket.on('notificacion', data => {
        notificacionHTML.innerHTML = data;
    });
    
    socket.on('notificacionGeneral', data => {
        notificacionGeneralHTML.innerHTML += `${data}<br>`;
        setTimeout(() => {
            notificacionGeneralHTML.innerHTML = "";
        }, 3000);
    });
    
    enviarMensajeHTML.addEventListener('click', () => {
        socket.emit('inputMensaje', inputMensajeHTML.value);
    });

    socket.on('mensaje', data => {
        const mensaje = `
            <li>
                <div>
                    <p><span>${data.usuario}</span> [<span>${data.fecha}</span>]: <span>${data.texto}</span><p/>
                </div>        
            </li>
        `;

        contenedorMensajesHTML.innerHTML += mensaje;
    });

    socket.on('mensajes', data => {
        const mensaje = `
            <li>
                <div>
                    <p><span>${data.usuario}</span> [<span>${data.fecha}</span>]: <span>${data.texto}</span><p/>
                </div>        
            </li>
        `;

        contenedorMensajesHTML.innerHTML += mensaje;
    });
};

enviarProductoHTML.addEventListener('click', () => {
    const data = {
        titulo: inputTituloHTML.value,
        precio: inputPrecioHTML.value,
        imagen: inputImagenHTML.value
    };
    socket.emit('inputProducto', data);
});

socket.on('producto', data => {
    const producto = `
        <tr>
            <th scope="row">${data.id}</th>
            <td>${data.titulo}</td>
            <td>${data.precio}</td>
            <td><img src=${data.imagen} style="width: 5%;"/></td>
        </tr>
    `;

    contenedorProductosHTML.innerHTML += producto;
});

socket.on('productos', data => {
    const producto = `
        <tr>
            <th scope="row">${data.id}</th>
            <td>${data.titulo}</td>
            <td>${data.precio}</td>
            <td><img src=${data.imagen} style="width: 5%;"/></td>
        </tr>
    `;

    contenedorProductosHTML.innerHTML += producto;
});