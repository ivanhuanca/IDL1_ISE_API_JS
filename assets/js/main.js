let base_api = 'https://fipo.equisd.com/api/'
let users_api = base_api + 'users.json'
let make_users_api = base_api + 'users/new.json'
let api_response_json = './api.response.json'
let avatar_base = 'https://ui-avatars.com/api/?name='

//iniciar pagina
init()
function init() {
    //consumir users_api
    getData(users_api, function (response) {
        // console.log(JSON.stringify(response))
        makeTable(response)
    })
}

//interactuar con el modal
const myModal = document.getElementById('myModal')
var bootstrapModal = new bootstrap.Modal(myModal);

myModal.addEventListener('show.bs.modal', (e) => {
    // console.log('modal', e.target)
    let modal_title = myModal.querySelector('.modal-title')
    modal_title.innerText = 'Create new User'
    let modal_body = myModal.querySelector('.modal-body')
    modal_body.innerHTML = ''

    let form = document.createElement('div')
    form.classList = 'formulario'

    let input_group = document.createElement('div')
    input_group.classList = 'input-group mb-3'
    let span = document.createElement('span')
    span.classList = 'input-group-text'
    span.innerText = 'First Name'
    let input = document.createElement('input')
    input.required = true
    input.classList = 'form-control first-name'
    input.placeholder = 'Ex. Michael'
    // input.value = 'Ivan Diego'
    input_group.appendChild(span)
    input_group.appendChild(input)
    input_keyup(input)
    form.appendChild(input_group)

    input_group = document.createElement('div')
    input_group.classList = 'input-group mb-3'
    span = document.createElement('span')
    span.classList = 'input-group-text'
    span.innerText = 'Last Name'
    input = document.createElement('input')
    input.required = true
    input.classList = 'form-control last-name'
    input.placeholder = 'Ex. Jackson'
    // input.value = 'Huanca Pajuelo'
    input_group.appendChild(span)
    input_group.appendChild(input)
    input_keyup(input)
    form.appendChild(input_group)

    let avatar_container = document.createElement('div')
    let avatar = document.createElement('img')
    avatar.classList = 'img-fluid rounded-circle modal-avatar'
    avatar.src = avatar_base + 'Ivan Diego Huanca Pajuelo'
    avatar_container.appendChild(avatar)

    form.appendChild(avatar_container)

    modal_body.appendChild(form)
    //creamos los inputs
})

//crear nuevo usuario
//detectar submit
const form = document.querySelector('form')
const send_button = document.querySelector('.send-button')
const toastLiveExample = document.getElementById('liveToast')
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.checkValidity()) {
        //cerrar modal
        bootstrapModal.hide()
        //enviar datos al servidor
        send_new_user()
        toastBootstrap.show()
    }
    console.log('send')
})

//enviar nuevo usuario
function send_new_user() {
    //obtener los datos del form
    let avatar = form.querySelector('.modal-avatar')
    let first_name = form.querySelector('.modal-avatar')
    let last_name = form.querySelector('.modal-avatar')

    let data = {
        'first_name': first_name.value,
        'last_name': last_name.value,
        'avatar': avatar.src
    }
    postData(make_users_api, data, function (data) {
        console.log(data)
        init()
    })
}

//añadir evento keyup a los input
function input_keyup(input) {
    input.addEventListener('keyup', (e) => {
        let avatar = form.querySelector('.modal-avatar')
        let first_name = form.querySelector('.first-name')
        let last_name = form.querySelector('.last-name')
        avatar.src = avatar_base + first_name.value + ' ' + last_name.value
    })
}

//crear tabla con las cabeceras
function makeTable(data) {
    let content = document.querySelector('.content')
    let table = document.createElement('table')
    table.classList = 'table table-dark table-hover'
    let thead = document.createElement('thead')
    let tr = document.createElement('tr')
    let th = document.createElement('th')
    th.textContent = 'ID'
    tr.appendChild(th)

    th = document.createElement('th')
    th.textContent = 'Avatar'
    tr.appendChild(th)

    th = document.createElement('th')
    th.textContent = 'First Name'
    tr.appendChild(th)

    th = document.createElement('th')
    th.textContent = 'Last Name'
    tr.appendChild(th)

    thead.appendChild(tr)
    table.appendChild(thead)
    content.appendChild(table)

    //llenar la tabla con los datos recuperados
    fillTable(table, data)
}

//llenar la tabla con los datos recuperados
function fillTable(table, data) {
    let objects = data.objects;

    let tbody = document.createElement('tbody')

    objects.forEach(element => {
        // console.log(element)
        let tr = document.createElement('tr')
        let td = document.createElement('td')
        td.textContent = element.id
        tr.appendChild(td)
        tbody.appendChild(tr)

        td = document.createElement('td')
        let img = document.createElement('img')
        img.classList = 'img-fluid thumbnail'
        img.src = element.avatar
        td.appendChild(img)
        tr.appendChild(td)
        tbody.appendChild(tr)

        td = document.createElement('td')
        td.textContent = element.first_name
        tr.appendChild(td)
        tbody.appendChild(tr)

        td = document.createElement('td')
        td.textContent = element.last_name
        tr.appendChild(td)
        tbody.appendChild(tr)

    });
    table.appendChild(tbody)
}

//funcion consumir la api (fetch)
function getData(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Procesar los datos recibidos
            callback(data);
            console.log(data);
        })
        .catch(error => {
            // Manejar los errores
            console.error(error);
        });
}

//enviar datos al servidor (fetch, post)
function postData(url, datos, callback) {
    // Configuración de la solicitud
    var opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos),
        // mode: 'no-cors'
    }
    // Realizar la solicitud fetch
    fetch(url, opciones)
        .then(response => response.json())
        .then(data => {
            // Manejar los datos de la respuesta
            callback(data);
            console.log('Respuesta:', data);
        })
        .catch(error => {
            // Manejar errores
            console.error('Error:', error);
        });
}
