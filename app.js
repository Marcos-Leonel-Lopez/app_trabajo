let personas = [];
let n_id;
let n_ficha;
let registrar = document.getElementById("registro");
let eliminar = document.getElementById("eliminar");
let eliminarTodo = document.getElementById("clearAll")
let imputNombre = document.getElementById("nombre");
let listaDeTrabjadores = document.getElementById("lista");
let errorParrafo = document.getElementById("error");
let i = 0;
const guardaLocal = (clave, valor) => { localStorage.setItem(clave, valor) };
const eliminaLocal = (clave) => { localStorage.removeItem(clave) };

class Personal {
    constructor(id, Ficha, Nombre, Puesto, porHora) {
        this.id = id,
            this.Ficha = Ficha,
            this.Nombre = Nombre,
            this.Puesto = Puesto,
            this.porHora = porHora
    }
}

function posicion(ident) {
    personas = JSON.parse(localStorage.getItem("trabajadoresLS"));
    for (let j = 0; j < personas.length; j++) {
        if (personas[j].Ficha == ident) {
            k = j;
        }
    };
    console.log(k);
    return k
}

function maximo(array) {
    return Math.max(...array.map(cUno => cUno.Ficha))
}

function identificarId(array, idDeseado) {
    return array.filter(obj => idDeseado == obj.Ficha);
}

function muestra() {
    personas = JSON.parse(localStorage.getItem("trabajadoresLS"));
    personas.forEach(trabajador => {
        listaDeTrabjadores.innerHTML += `<tr>
                                        <td>${trabajador.Ficha}</td>
                                        <td>${trabajador.Nombre}</td>
                                        <td>${trabajador.Puesto}</td>
                                        <td>${trabajador.porHora}</td>
                                    </tr>`;
    });
}

const cargarBD = async () => {
    const resp = await fetch('http://localhost:3000/trabajadores')
    const data = await resp.json()
    guardaLocal("trabajadoresLS", JSON.stringify(data));
    guardaLocal("idLS", data.length + 1);
    guardaLocal("fichaLS", maximo(data) + 1);
};

const postBD = async (nuevo) => {
    const resp = await fetch('http://localhost:3000/trabajadores', {
        method: 'POST',
        body: JSON.stringify(nuevo),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    const data = await resp.json()
};

const eliminaBD = async (id) => {
    await fetch(`http://localhost:3000/trabajadores/${id}`, {
        method: 'DELETE',
    });
}

if (JSON.parse(localStorage.getItem("trabajadoresLS"))) {
    console.log(`LS cargado`);
    muestra();
}
else {
    cargarBD();
    location.reload();
}
personas = JSON.parse(localStorage.getItem("trabajadoresLS"));
n_ficha = parseInt(localStorage.getItem("fichaLS"));
n_id = parseInt(localStorage.getItem("idLS"));
if (personas.length < 1) {
    eliminarTodo.disabled = true;
}

registrar.addEventListener("submit", async (e) => {
    e.preventDefault();
    let registrar = e.target;
    let nomb = registrar.nombre.value.toUpperCase();
    let puesto = registrar.puesto.value.toUpperCase();
    let salario_hora = parseFloat(registrar.pesos.value);
    if (nomb !== '' && puesto !== '' && salario_hora !== '') {
        Toastify({
            text: `${nomb} AGREGADO`,
            duration: 2000,
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
        let i = parseFloat(salario_hora)
        listaDeTrabjadores.innerHTML += `<tr">
        <td>${n_ficha}</td>
        <td>${nomb}</td>
        <td>${puesto}</td>
        <td>${i}</td>
        `;
        let newObj = new Personal(n_id, n_ficha, nomb, puesto, salario_hora)
        personas.push(newObj);
        postBD(newObj);
        n_id++;
        n_ficha++;
        eliminarTodo.disabled = false;
        guardaLocal("trabajadoresLS", JSON.stringify(personas));
        guardaLocal("idLS", n_id);
        guardaLocal("fichaLS", n_ficha);
        
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'FALTAN DATOS'
        })
    }
});

eliminar.addEventListener("submit", async (e) => {
    e.preventDefault();
    let eliminar = e.target;
    let ident = parseInt(eliminar.identidad.value) || '';
    personas = JSON.parse(localStorage.getItem("trabajadoresLS"));
    if (ident !== '') {
        let i = identificarId(personas, ident)[0]?.id || "desconocido"; // identifica id dentro del db.json
        if (i != "desconocido") {   
            let x = posicion(ident);
            eliminaBD(i);
            personas.splice(x, 1);
            listaDeTrabjadores.remove();
            guardaLocal("trabajadoresLS", JSON.stringify(personas));
            guardaLocal("idLS", n_id);
            muestra();
        }
        else {
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'ID DESCONOCIDO'
            })
        }
    }
    else {
        e.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'FALTAN DATOS'
        })
    }
});

eliminarTodo.addEventListener('click', async (e) => {
    e.preventDefault();
    eliminarTodo.disabled = true;
    Swal.fire({
        title: 'Esta seguro de eliminar todo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, seguro',
        cancelButtonText: 'No, no quiero'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Borrados!',
                icon: 'success',
                text: 'El listado se limpio'
            })
            listaDeTrabjadores.innerHTML = '';
            personas.forEach((e) => {
                eliminaBD(e.id);
            });
            eliminaLocal("trabajadoresLS");
            eliminaLocal("idLS");
            eliminaLocal("fichaLS")
            n_id = 1;
            personas = [];
            n_ficha = 101;
            guardaLocal("trabajadoresLS", JSON.stringify(personas));
            guardaLocal("idLS", n_id);
            guardaLocal("fichaLS", n_ficha);
        }
        else {
            eliminarTodo.disabled = false;
        }
    })
});