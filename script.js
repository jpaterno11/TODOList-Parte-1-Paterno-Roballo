let darkmode = localStorage.getItem('darkmode');
const cambioColor = document.getElementById("cambio-color")

const enableDarkmode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
}
const disableDarkmode = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)
}
if(darkmode === "active") enableDarkmode();

cambioColor.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})

const addTaskBoton = document.getElementById("addTaskBoton")
const agregarTarea = addTaskBoton.addEventListener("click", () => {
    const tarea = document.getElementById("tarea").value
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.push(tarea);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareas();
   
})
const eliminartarea = (index) => {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.splice(index, 1);
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareas();
};
const mostrarTareas = () => {
    const tareasDisplay = document.getElementById('tareasDisplay');
    tareasDisplay.innerHTML = '';
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.forEach((tarea, index) => {
        const mostrarTarea = document.createElement('li');
        mostrarTarea.innerHTML = `
            ${tarea} 
            <button class="eliminar-btn" onclick="eliminartarea(${index})">Eliminar</button>
        `;
        tareasDisplay.appendChild(mostrarTarea);
    });
};