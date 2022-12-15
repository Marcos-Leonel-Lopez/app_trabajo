let personas = [];
 let n_id;
let n_ficha;
const guardaLocal = (clave, valor) => { localStorage.setItem(clave, valor) };
const eliminaLocal = (clave) => { localStorage.removeItem(clave) };

class Personal {
    constructor( id, Ficha, Nombre, Puesto, porHora) {
        this.id = id,
        this.Ficha = Ficha,
        this.Nombre = Nombre,
        this.Puesto = Puesto,
        this.porHora = porHora
    }
}

function posicion(ident){
    personas = JSON.parse(localStorage.getItem("trabajadoresLS"));
    for( let j = 0; j < personas.length ; j++){

        console.log(personas[j].Ficha);

        if(personas[j].Ficha == ident){
                k = j;
             }
        };
        console.log(k);
        return k
}

function maximo(array) {
    return Math.max(...array.map(cUno => cUno.Ficha))
}
function identificarId(array,idDeseado) {
    return array.filter( obj => idDeseado == obj.Ficha);
}

function muestra() {
    personas = JSON.parse(localStorage.getItem("trabajadoresLS"));
    console.log(personas);
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
    console.log(data);
    guardaLocal("trabajadoresLS", JSON.stringify(data));
    guardaLocal("idLS", data.length+1);
    guardaLocal("fichaLS", maximo(data)+1);
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
    console.log(data);
};

const eliminaBD = async (id) => {
    await fetch(`http://localhost:3000/trabajadores/${id}`, {
        method: 'DELETE',
    });
}



let registrar = document.getElementById("registro");
let eliminar = document.getElementById("eliminar");
let eliminarTodo = document.getElementById("clearAll")
let imputNombre = document.getElementById("nombre");
let listaDeTrabjadores = document.getElementById("lista");
let errorParrafo = document.getElementById("error");
let i = 0;




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
// console.log(identificarId(personas,108));
// console.log(personas.length);

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
        let i = parseFloat(salario_hora)
        listaDeTrabjadores.innerHTML += `<tr">
        <td>${n_ficha}</td>
        <td>${nomb}</td>
        <td>${puesto}</td>
        <td>${i}</td>
        `;
        let newObj = new Personal(n_id, n_ficha, nomb, puesto, salario_hora)
        personas.push(newObj);
        console.log(Personal);
        console.log(newObj);
        postBD(newObj);
        n_id++;
        n_ficha++;
        eliminarTodo.disabled = false;
        guardaLocal("trabajadoresLS", JSON.stringify(personas));
        guardaLocal("idLS", n_id);
        guardaLocal("fichaLS", n_ficha);
        Toastify({
            text: `${nomb} AGREGADO`,
            duration: 2000,
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
        // location.reload();
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

    console.log(ident);

    

    if (ident !== '') {

        let i = identificarId(personas,ident)[0]?.id || "desconocido"; // identifica id dentro del db.json
console.log(i);
        console.log(`antes detosty`);
        console.log(personas.length);
        if (i != "desconocido") {
            console.log(i);
            let x =posicion(ident);
            console.log(x);
            console.log(i);
            eliminaBD(i);
            personas.splice(x, 1);
            listaDeTrabjadores.remove();
            guardaLocal("trabajadoresLS", JSON.stringify(personas));
            guardaLocal("idLS", n_id);
            muestra();
            console.log(personas);
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
            personas.forEach( (e) => {
                eliminaBD(e.id);
            });
            eliminaLocal("trabajadoresLS");
            eliminaLocal("idLS");
            eliminaLocal("fichaLS")
            n_id = 1;
            personas = [];
            n_ficha = 101;
            console.log(`reset de peersonas e id`);
            guardaLocal("trabajadoresLS", JSON.stringify(personas));
            guardaLocal("idLS", n_id);
            guardaLocal("fichaLS",n_ficha);
            
        }
        else {
            eliminarTodo.disabled = false;
        }
    })
});











// // function porCadaUno(arr, fn) {
// //     for (const el of arr) {
// //         fn(el)
// //     }
// // }

//--------------------------------------------------------------------
// let config = " ";
// let i = 0;
// let trabajadores = [];
// let parcial = [];
// let n_id = 1;
// let dia = 1;
// const guardaLocal = (clave, valor) => { localStorage.setItem(clave, valor) };


// class Personal {
//     constructor(Id, Nombre, Horas, Salario, Puesto, entrada, fecha_entrada, salida, fecha_salida, dia_s, dia_h, porHora) {
//         this.Id = Id,
//             this.Nombre = Nombre,
//             this.Horas = Horas,
//             this.Salario = Salario,
//             this.Puesto = Puesto,
//             this.entrada = entrada,
//             this.fecha_entrada = fecha_entrada,
//             this.salida = salida,
//             this.fecha_salida = fecha_salida,
//             this.dia_s = dia_s,
//             this.dia_h = dia_h,
//             this.porHora = porHora
//     }
// }








// //--------------------------------------------------------------------



// function resta(a, b) {
//     return b - a;
// }

// function diario(jornal,hora) {
//     let total;
//     let jornada = 8;
//     let over = hora * 1.5;

//     if (jornal > 8) {
//         let extra = jornal - 8;
//         total = extra * over + jornada * hora;
//     }
//     else if (jornal <= 8) {
//         total = jornal * hora;
//     }
//     alert(`total de plata en el dia = ${total}`);
//     return total;
// }




// function check()
//  {
//     while (dia <= 2) {   //--el programa simula 2 dias laborales, para considerar mas se debe cambiar el '2' para realizar la comparacion

//      console.log('Dia:' + dia);
//      for (let i = 0; i < trabajadores.length; i++) {
//          console.log(`${trabajadores[i].Id}) ${trabajadores[i].Nombre}`);
//      }

//      let n = 0;
//      while (n == 0) {
//          k = prompt('1)Entrada\n\n2)Salida\n\nx)Pasar el dia');
//          if (k == '1') {
//              let x = parseInt(prompt('Identifiquese'));
//              let i = x - 1;
//              let a = parseFloat(prompt('Hora de entrada:'));  //Date.now();   --tomara la hora exacta--
//              let ent = 'dia_entrada';                         //new Date().toDateString();    --registrara el dia--
//              registroAux[i].fecha_entrada.push(ent);
//              registroAux[i].entrada.push(a);
//          }
//          else if (k == '2') {
//              let x = parseInt(prompt('Identifiquese'));
//              let i = x - 1;
//              let b = parseFloat(prompt('Hora de salida:'));   //Date.now();   --tomara la hora exacta--
//              let sal = 'dia_salida';                          //new Date().toDateString();    --registrara el dia--
//              registroAux[i].fecha_salida.push(sal);
//              registroAux[i].salida.push(b);
//              let jornada = resta(registroAux[i].entrada[(registroAux[i].entrada.length) - 1], registroAux[i].salida[(registroAux[i].salida.length) - 1]);   //resta(registroAux[i].entrada[(registroAux[i].entrada.length)-1],registroAux[i].salida[(registroAux[i].salida.length)-1]) / 86400000;  --Del calculo se obtiene las hrs exactas trabajadas--
//              let jornal = diario(jornada);
//              console.log(jornada + ' hrs trabajadas por $' + jornal);
//              registroAux[i].dia_s.push(jornal);
//              trabajadores[i].Salario = registroAux[i].dia_s.reduce((acumulador, elemento) => acumulador + elemento, 0);


//              registroAux[i].dia_h.push(jornada);
//              trabajadores[i].Horas = registroAux[i].dia_h.reduce((acumulador, elemento) => acumulador + elemento, 0);

//              console.log(registroAux)
//              console.log(trabajadores[i].Horas + '   ' + trabajadores[i].Salario);

//          }
//          else if (k == 'x') {
//              dia++;
//              n++;
//          }
//      }

//      for (let i = 0; i < trabajadores.length; i++) {
//          console.log(trabajadores[i].Id + ') ' + trabajadores[i].Nombre + " - " + trabajadores[i].Horas + 'hrs trabajadas y $' + trabajadores[i].Salario);
//      }

//  }

//  alert('trabajadores mostrados, adios');
//  console.log(trabajadores);}

//-----



