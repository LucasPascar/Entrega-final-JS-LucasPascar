class Producto {
    constructor(id, nombre, precio, img, descripcion) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.cantidad = 1
        this.img = img
        this.descripcion = descripcion

    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos")
    }

    levantarProductos() {
        this.listaProductos = [
            new Producto(1, "Firebird", 120000, "./assets/bicicletas/firebird.png", "Una Bicicleta liviana para la ciudad"),
            new Producto(2, "Futura", 130000, "./assets/bicicletas/futura.png", "Una Bicicleta liviana para la ciudad"),
            new Producto(3, "Gherpard", 140000, "./assets/bicicletas/ghepard.png", "Una Bicicleta liviana para la ciudad"),
            new Producto(4, "Nordic", 150000, "./assets/bicicletas/nordic.png", "Una Bicicleta liviana para la ciudad"),
            new Producto(5, "Raleigh", 160000, "./assets/bicicletas/raleigh.png", "Una Bicicleta liviana para la ciudad"),
            new Producto(6, "Ush U", 170000, "./assets/bicicletas/ushu.png", "Una Bicicleta liviana para la ciudad"),

        ]
    }

    mostrarEnDOM() {
        //Mostramos los productos en DOM de manera dinamica
        this.listaProductos.forEach(producto => {
            this.contenedor_productos.innerHTML +=
                `<div class="card">
                <img src="${producto.img}" >
            <div class="card-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p>$${producto.precio}</p>
                <div id="productoAgregado">
                <a href="#" id="Bicicleta-${producto.id}" class="btn btn-primary botonespecial" >Añadir al carrito</a>
                </div>
            </div>
            </div>`
        })
    }

    darEventoClickAProductos(controladorCarrito) {
        this.listaProductos.forEach(producto => {

            const btnAP = document.getElementById(`Bicicleta-${producto.id}`)
            btnAP.addEventListener("click", () => {
                Toastify({
                    text: `${producto.nombre} Agregado`,
                    duration: 3000,
                    position: "right",
                    gravity: "bottom",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                }).showToast();



                controladorCarrito.agregar(producto)
                controladorCarrito.guardarEnStorage()
                //TODO: que solo añada 1 producto al DOM. Que no recorra toda la lista.
                controladorCarrito.mostrarEnDOM()
            })
        })
    }


}


class CarritoController {
    constructor() {
        this.listaCarrito = []
        this.contenedor_carrito = document.getElementById("contenedor_carrito")
        this.verificarExistenciaEnStorage()
    }

    agregar(producto) {
        const index = this.listaCarrito.findIndex(p => p.id === producto.id);
        if (index !== -1) {
            this.listaCarrito[index].cantidad++;
        } else {
            this.listaCarrito.push(producto);
        }
    }

    limpiarCarritoEnStorage() {

        localStorage.removeItem("listaCarrito")
    }
    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }

    verificarExistenciaEnStorage() {
        this.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || []
        if (this.listaCarrito.length > 0) {
            this.mostrarEnDOM()
            this.darEventoClickACancelarCompra()
        }
    }

    limpiarContenedor_Carrito() {
        //limpio el contenedor para recorrer todo el arreglo y no se repita sin querer los productos.
        this.contenedor_carrito.innerHTML = ""
    }
    mostrarEnDOM() {
        this.limpiarContenedor_Carrito();
        let subtotal = 0;
        if (this.listaCarrito.length === 0) {
            this.contenedor_carrito.innerHTML = "<p>El carrito está vacío</p>";
        } else {
            this.listaCarrito.forEach(producto => {
                contenedor_carrito.innerHTML +=
                    `<div class="card d-flex flex-column ">
                        <img src="${producto.img}">
                        <div class="card-info">
                            <h3>${producto.nombre}</h3>
                            <p>Cantidad: ${producto.cantidad}</p>
                            <p>Precio: $${producto.precio}</p>
                        </div>
                    </div>`;
                subtotal += producto.precio * producto.cantidad;
            });
            const iva = subtotal * 0.21;
            const total = subtotal + iva;
            this.contenedor_carrito.innerHTML += `
            <div class="d-flex flex-column">
                <p>Subtotal: $${subtotal.toFixed(2)}</p>
                <p>IVA (21%): $${iva.toFixed(2)}</p>
                <p>Total: $${total.toFixed(2)}</p>
            </div> `
        }
    }
    //Borrar carrito al cancelar la compra
    limpiarCarrito() {
        this.listaCarrito = [];
        localStorage.removeItem("listaCarrito");
        this.mostrarEnDOM();
    }

    darEventoClickACancelarCompra() {
        const btnCancelarCompra = document.getElementById("btnCancelarCompra");
        btnCancelarCompra.addEventListener("click", () => {
            this.limpiarCarrito();
        });
    }

}



//sweetALERT! producto agregado al carrito
const finalizarCompra = document.getElementById("finalizarCompra")
finalizarCompra.addEventListener("click", () => {

    if (controladorCarrito.listaCarrito.length === 0) {
        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'El carrito está vacío',
            showConfirmButton: false,
            timer: 1400
        })
        return
    }

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Su compra fue realizada con éxito',
        showConfirmButton: false,
        timer: 1500
    })

    controladorCarrito.limpiarContenedor_Carrito()
    controladorCarrito.limpiarCarritoEnStorage()
    controladorCarrito.listaCarrito = []
})

//
const controladorProductos = new ProductoController()
controladorProductos.levantarProductos()

const controladorCarrito = new CarritoController()


//Verifica en STORAGE y muestra en DOM si hay algo.
controladorCarrito.verificarExistenciaEnStorage()

//DOM
controladorProductos.mostrarEnDOM()

//EVENTOSf
controladorProductos.darEventoClickAProductos(controladorCarrito)




