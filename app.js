let personas = [];
let n_id = 1;
const guardaLocal = (clave, valor) => { localStorage.setItem(clave, valor) };
const eliminaLocal = (clave) => { localStorage.removeItem(clave) }

class Personal {
    constructor(Id, Nombre, Horas, Salario, Puesto, entrada, fecha_entrada, salida, fecha_salida, dia_s, dia_h, porHora) {
        this.Id = Id,
            this.Nombre = Nombre,
            this.Horas = Horas,
            this.Salario = Salario,
            this.Puesto = Puesto,
            this.entrada = entrada,
            this.fecha_entrada = fecha_entrada,
            this.salida = salida,
            this.fecha_salida = fecha_salida,
            this.dia_s = dia_s,
            this.dia_h = dia_h,
            this.porHora = porHora
    }
}

function muestra() {
    personas = JSON.parse(localStorage.getItem("trabajadoresLS"));
    n_id = parseInt(localStorage.getItem("trabajador_listaLS"));
    console.log(n_id);
    console.log(personas);
    personas.forEach(trabajador => {
        listaDeTrabjadores.innerHTML += `<tr id="lista_${trabajador.Id}">
        <td>${trabajador.Id}</td>
        <td>${trabajador.Nombre}</td>
        <td>${trabajador.Puesto}</td>
        <td>${trabajador.porHora}</td>
      </tr>`;
    });
}

let registrar = document.getElementById("registro");
let eliminar = document.getElementById("eliminar")
let imputNombre = document.getElementById("nombre");
let listaDeTrabjadores = document.getElementById("lista");
let errorParrafo = document.getElementById("error");
let i = 0;



if (parseInt(localStorage.getItem("trabajador_listaLS")) && JSON.parse(localStorage.getItem("trabajadoresLS"))) {
    console.log(`LS cargado`);
    muestra();
}
else {
    eliminaLocal("trabajadoresLS");
    eliminaLocal("trabajador_listaLS");
    console.log(`no hay nada en LS`);
}

registrar.addEventListener("submit", (e) => {
    e.preventDefault();
    let nomb = document.querySelector("#nombre").value.toUpperCase();
    let puesto = document.querySelector("#puesto").value.toUpperCase();
    let salario_hora = document.querySelector("#pesos").value;
    console.log(nomb);
    console.log(puesto);
    console.log(salario_hora);
    let registrar = e.target;
    if (nomb !== '' && puesto !== '' && salario_hora !== '') {
        let i = parseFloat(salario_hora);
        errorParrafo.innerText = null;
        console.log(registrar);
        listaDeTrabjadores.innerHTML += `<tr id="lista_${n_id}">
        <td>${n_id}</td>
        <td>${nomb}</td>
        <td>${puesto}</td>
        <td>${i}</td>
        `;
        personas.push(new Personal(n_id, nomb, 0, 0, puesto, [], [], [], [], [], [], salario_hora));
        n_id++;
        console.log(personas);
        guardaLocal("trabajadoresLS", JSON.stringify(personas));
        guardaLocal("trabajador_listaLS", n_id);

    }
    else {
        errorParrafo.innerText = "FALTAN DATOS!!!";
    }
});


eliminar.addEventListener("submit", (e) => {

    let identidad = document.querySelector("#identidad").value;
    console.log(identidad);
    personas = JSON.parse(localStorage.getItem("trabajadoresLS"));
    n_id = parseInt(localStorage.getItem("trabajador_listaLS"));
    let i = parseFloat(identidad);
    let x = i - 1;
    let eliminar = e.target;
    if (identidad !== '') {
        if (x < personas.length && x >= 0) {
            errorParrafo.innerText = null;
            personas.splice(x, 1);
            console.log('lo elimino');
            for (let j = x; j < personas.length; j++) {
                personas[j].Id -= 1;
            }
            n_id -= 1;
            listaDeTrabjadores.remove();
            guardaLocal("trabajadoresLS", JSON.stringify(personas));
            guardaLocal("trabajador_listaLS", n_id);
            muestra();
        }
        else {
            e.preventDefault();
            errorParrafo.innerText = "ID DESCONOCIDO!!!";
        }
    }
    else {
        e.preventDefault();
        errorParrafo.innerText = "FALTAN DATOS!!!";
    }
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

// function listado(j) {
//     for (let i = 0; i < j; i++) {
//         console.log(`${trabajadores[i].Id}) ${trabajadores[i].Nombre} - ${trabajadores[i].Puesto}`);
//     }
// }

// function eliminar() {
//     console.log('Que nombre desea eliminar del sistema?');
//     listado(trabajadores.length);
//     let i = parseInt(prompt('Que nombre desea eliminar del sistema?'));
//     let x = i - 1;
//     let k = prompt(`Desea eliminar a ${trabajadores[x].Nombre} ? S/N`);
//     if (k == 's') {
//         trabajadores.splice(x, 1);
//         alert('lo elimino');
//         for (let j = x; j < trabajadores.length; j++) {
//             trabajadores[j].Id -= 1;
//         }
//         n_id -= 1;
//         alert('lista actualizada');
//         listado(trabajadores.length);
//     }
//     else {
//         alert('no lo elimono');
//     }
//     alert('termino');
//     guardaLocal("trabajadoresLS",JSON.stringify(trabajadores));
//     guardaLocal("trabajador_listaLS",n_id);
//     console.log(trabajadores);
//     console.log(n_id);
// }

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


// function crearLista() {
//     let cantidad = parseInt(prompt("Cuantos trabajadores registrara?"));
//     do {
//         let nomb = prompt("Nombre:").toUpperCase();
//         let puesto = prompt("Puesto").toUpperCase();
//         let porHora =parseFloat(prompt(`Cuanto cobrara por hora?`))
//         trabajadores.push(new Personal(n_id, nomb, 0, 0, puesto,[], [], [], [], [], [], porHora));
//         n_id++;
//         cantidad--;
//     } while (cantidad > 0)
//     guardaLocal("trabajadoresLS", JSON.stringify(trabajadores));
//     guardaLocal("trabajador_listaLS", n_id);
// }

// function admin() {

//     let k = prompt(`1)Registrar\n2)Eliminar\n3)Planta actual`);
//     switch (k) {
//         case '1':
//             crearLista();
//             alert('lista creada');
//             break;
//         case '2':
//             console.log(trabajadores);
//              localStorage.removeItem("trabajadoresLS");

//             eliminar();
//             alert('elimino un nombre de la lista');
//             break;
//         case '3':
//             let j = trabajadores.length;
//             console.log(`Hay ${j} trabajadrores:`);
//             listado(j);
//             console.log(trabajadores);
//             break;
//         default:
//             break;
//     }
// }




// if (parseInt(localStorage.getItem("trabajador_listaLS"))) {
//     console.log(`LS cargado`);

//      trabajadores = JSON.parse(localStorage.getItem("trabajadoresLS"));
//      n_id = parseInt(localStorage.getItem("trabajador_listaLS"));
//      console.log(n_id);
//      console.log(trabajadores);
//      alert(`ok?`);
    
// }
// else {
//     console.log(`no hay nada en LS`);
// }

// do {
//     if (i == 0) {
//         config = prompt(`Accerder como: 1)Administrar planta\n2)Checkin/Check out\n3)Cerrar`);
//     }
//     else {
//         config = "3";
//     }
//     switch (config) {
//         case "1":
//             admin();
//             break;
//         case "2":
//             listado(trabajadores.length);
//             check();
//             break;
//         case "3":
//             let k = prompt("Seguro que desea salir? 1)SI\n2)NO");
//             if (k == "1") {
//                 alert("ADIOS!!!");
//                 i++;
//                 config = "ESC";
//             }
//             else if (k == "2") {
//                 console.log("no salió del programa");
//                 i = 0;
//             }
//             else if (k != 1 && k != 2) {
//                 console.log("Opcion invalida");
//                 i++;
//             }
//             break;
//         case "ESC":
//             config = "ESC";
//             break;
//         default:
//             console.log("Opcion invalida");
//             i = 0;
//             break;
//     }
// } while (config != "ESC")

// //--------------------------------------------------------------------



// function resta(a, b) {
//     return b - a;
// }

// function diario(jornal) {
//     let total;
//     let jornada = 8;
//     let hora = 12.5;
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





// // -- Arrays para evitar la carga de los datos de cada uno de los trabajadores a fines de simplificar la simulacion
// // -- Dicho proceso se realiza en lineas de codigo arriba

// trabajadores.push(new Personal(1, 'MARCOS', 0, 0));
// registroAux.push(new Registro(1, [], [], [], [], [], []));

// trabajadores.push(new Personal(2, 'LUCIANA', 0, 0));
// registroAux.push(new Registro(2, [], [], [], [], [], []));

// trabajadores.push(new Personal(3, 'PAULA', 0, 0));
// registroAux.push(new Registro(3, [], [], [], [], [], []));

// trabajadores.push(new Personal(4, 'MAXI', 0, 0));
// registroAux.push(new Registro(4, [], [], [], [], [], []));

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

// let miFormulario = document.getElementById("formulario");
// miFormulario.addEventListener("submit", (e) => {
//     e.preventDefault();
//     console.log("Formulario enviado");
//     let formulario= e.target
//     console.log(formulario.children[0].value);
//     console.log(formulario.children[1].value);
// });


