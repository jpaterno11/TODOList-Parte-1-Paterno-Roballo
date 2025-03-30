let darkmode = localStorage.getItem('darkmode');
const cambioColor = document.getElementById("cambio-color");

const enableDarkmode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
};

const disableDarkmode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
};

if (darkmode === "active") enableDarkmode();

cambioColor.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});

const addTaskBoton = document.getElementById("addTaskBoton");
addTaskBoton.addEventListener("click", () => {
    const tarea = document.getElementById("tarea").value.trim();
    if (!tarea) return;

    let todasLasTareas = [
        ...JSON.parse(localStorage.getItem('tareasNoComenzadas')) || [],
        ...JSON.parse(localStorage.getItem('tareasIncompletas')) || [],
        ...JSON.parse(localStorage.getItem('tareasTerminadas')) || []
    ];

    if (todasLasTareas.some(t => t.texto === tarea)) {
        alert("Esta tarea ya ha sido ingresada en alguna lista.");
        return;
    }

    let tareasNoComenzadas = JSON.parse(localStorage.getItem('tareasNoComenzadas')) || [];
    const nuevaTarea = {
        texto: tarea,
        creada: new Date(),
        completada: null
    };
    tareasNoComenzadas.push(nuevaTarea);
    localStorage.setItem('tareasNoComenzadas', JSON.stringify(tareasNoComenzadas));
    mostrarTareas();
});

const eliminartarea = (index, tipo) => {
    let listaTareas = JSON.parse(localStorage.getItem(tipo)) || [];
    let tareaEliminada = listaTareas.splice(index, 1)[0];
    if (tipo === 'tareasTerminadas' && tareaEliminada.completada === tiempoDeFinalizacion) {
        tiempoDeFinalizacion = null; 
    }

    localStorage.setItem(tipo, JSON.stringify(listaTareas));
    mostrarTareas();
    mostrarTareasIncompletas();
    mostrarTareasTerminadas();
    actualizarTareaMasRapida();
};

const eliminartareascompletadas = () => {
    let tareasTerminadas = JSON.parse(localStorage.getItem('tareasTerminadas')) || [];
    tareasTerminadas = [];
    localStorage.setItem('tareasTerminadas', JSON.stringify(tareasTerminadas));
    tiempoDeFinalizacion = null;
    mostrarTareasTerminadas();
    actualizarTareaMasRapida();
};

const moverTarea = (index, origen, destino) => {
    let tareasOrigen = JSON.parse(localStorage.getItem(origen)) || [];
    let tareasDestino = JSON.parse(localStorage.getItem(destino)) || [];
    let tarea = tareasOrigen.splice(index, 1)[0];
    if (destino === 'tareasTerminadas') {
        tarea.completada = new Date().toISOString(); 
    } else if (origen === 'tareasTerminadas' && destino !== 'tareasTerminadas') {
        if (tarea.completada === tiempoDeFinalizacion) {
            tiempoDeFinalizacion = null;
        }
    }
    tareasDestino.push(tarea);
    localStorage.setItem(origen, JSON.stringify(tareasOrigen));
    localStorage.setItem(destino, JSON.stringify(tareasDestino));
    mostrarTareas();
    mostrarTareasIncompletas();
    mostrarTareasTerminadas();
    actualizarTareaMasRapida();
};

const empezartarea = (index) => {
    moverTarea(index, 'tareasNoComenzadas', 'tareasIncompletas');
};

const terminartarea = (index) => {
    moverTarea(index, 'tareasIncompletas', 'tareasTerminadas');
};

const revertirATareaIncompleta = (index) => {
    moverTarea(index, 'tareasTerminadas', 'tareasIncompletas');
    actualizarTareaMasRapida();
};

const revertirANoComenzada = (index) => {
    moverTarea(index, 'tareasIncompletas', 'tareasNoComenzadas');
    actualizarTareaMasRapida();
};

const mostrarTareas = () => {
    const tareasDisplay = document.getElementById('tareasDisplay');
    let tareasNoComenzadas = JSON.parse(localStorage.getItem('tareasNoComenzadas')) || [];
    tareasDisplay.innerHTML = '';

    if (tareasNoComenzadas.length === 0) {
        tareasDisplay.innerHTML = '<p>No hay tareas no comenzadas.</p>';
    } else {
        tareasNoComenzadas.forEach((tarea, index) => {
            const { texto, creada } = tarea;
            const horaCreacion = new Date(creada).toLocaleString();

            const mostrarTarea = document.createElement('li');
            mostrarTarea.innerHTML = `
                ${texto} 
                <div>Creada a: ${horaCreacion}</div>
                <button onclick="moverTarea(${index}, 'tareasNoComenzadas', 'tareasIncompletas')">Empezar</button>
                <button onclick="eliminartarea(${index}, 'tareasNoComenzadas')">Eliminar</button>
            `;
            tareasDisplay.appendChild(mostrarTarea);
        });
    }
};

const mostrarTareasIncompletas = () => {
    const tareasDisplay = document.getElementById('mostrarIncompletas').querySelector('ul');
    let tareasIncompletas = JSON.parse(localStorage.getItem('tareasIncompletas')) || [];
    tareasDisplay.innerHTML = '';

    if (tareasIncompletas.length === 0) {
        tareasDisplay.innerHTML = '<p>No hay tareas incompletas.</p>';
    } else {
        tareasIncompletas.forEach((tarea, index) => {
            const { texto, creada } = tarea;
            const horaCreacion = new Date(creada).toLocaleString();

            const mostrarTarea = document.createElement('li');
            mostrarTarea.innerHTML = `
                ${texto} 
                <div>Creada a: ${horaCreacion}</div>
                <button class="eliminar-btn" onclick="eliminartarea(${index}, 'tareasIncompletas')">Eliminar</button>
                <button class="eliminar-btn" onclick="moverTarea(${index}, 'tareasIncompletas', 'tareasTerminadas')">Finalizar</button>
                <button class="eliminar-btn" onclick="moverTarea(${index}, 'tareasIncompletas', 'tareasNoComenzadas')">Volver a No Comenzada</button>
            `;
            tareasDisplay.appendChild(mostrarTarea);
        });
    }
};

const mostrarTareasTerminadas = () => {
    const tareasDisplay = document.getElementById('mostrarTerminadas').querySelector('ul');
    let tareasTerminadas = JSON.parse(localStorage.getItem('tareasTerminadas')) || [];
    tareasDisplay.innerHTML = '';

    if (tareasTerminadas.length === 0) {
        tareasDisplay.innerHTML = '<p>No hay tareas terminadas.</p>';
    } else {
        tareasTerminadas.forEach((tarea, index) => {
            const { texto, creada, completada } = tarea;
            const horaCreacion = new Date(creada).toLocaleString();
            const horaCompletado = new Date(completada).toLocaleString();

            const mostrarTarea = document.createElement('li');
            mostrarTarea.innerHTML = `
                ${texto} 
                <div>Creada a: ${horaCreacion}</div>
                <div>Completada a: ${horaCompletado}</div>
                <button class="eliminar-btn" onclick="eliminartarea(${index}, 'tareasTerminadas')">Eliminar</button>
                <button class="eliminar-btn" onclick="moverTarea(${index}, 'tareasTerminadas', 'tareasIncompletas')">Volver a Incompleta</button>
            `;
            tareasDisplay.appendChild(mostrarTarea);
        });
    }
};

let tiempoDeFinalizacion = null;

const actualizarTareaMasRapida = () => {
    let tareasTerminadas = JSON.parse(localStorage.getItem('tareasTerminadas')) || [];
    
    if (tareasTerminadas.length === 0) {
        tiempoDeFinalizacion = null;
        mostrarTareaMasRapida(null);
        return;
    }

    let tareaMasRapida = tareasTerminadas.reduce((tarea1, tarea2) => {
        return new Date(tarea1.completada) < new Date(tarea2.completada) ? tarea1 : tarea2;
    });

    tiempoDeFinalizacion = tareaMasRapida.completada;
    mostrarTareaMasRapida(tareaMasRapida);
};

const mostrarTareaMasRapida = (tarea) => {
    const divRapida = document.getElementById('tareaMasRapida');
    
    if (tarea) {
        divRapida.innerHTML = `La tarea más rápida fue: ${tarea.texto} completada el ${new Date(tarea.completada).toLocaleString()}`;
    } else {
        divRapida.innerHTML = 'Aún no hay tarea completada más rápida.';
    }
};

mostrarTareas();
mostrarTareasIncompletas();
mostrarTareasTerminadas();
actualizarTareaMasRapida();
