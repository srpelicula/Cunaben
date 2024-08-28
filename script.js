let totalCuadrados = 0;

// Cargar el estado guardado al cargar la página
window.onload = function() {
    cargarEstado();
};

// Función para crear cuadrados
function crearCuadrados(num, imgSrc = '', url = '', imgName = '') {
    const container = document.getElementById('cuadradosContainer');
    for (let i = 0; i < num; i++) {
        const cuadrado = document.createElement('div');
        cuadrado.className = 'cuadrado';

        if (imgSrc) {
            cuadrado.innerHTML = `<img src="${imgSrc}" alt="${imgName}" data-name="${imgName}">`;
            cuadrado.setAttribute('data-url', url);
        }

        cuadrado.addEventListener('click', function() {
            const url = cuadrado.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });

        cuadrado.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            if (confirm("¿Deseas eliminar este cuadrado?")) {
                container.removeChild(cuadrado);
                guardarEstado(); 
            }
        });

        container.appendChild(cuadrado);
        totalCuadrados++;
    }
}

// Añadir un cuadrado con la tecla 7
document.addEventListener('keydown', function(event) {
    if (event.key === '7') {
        crearCuadrados(1);
        guardarEstado(); 
    }
});

// Añadir imagen con la tecla 'F'
document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 'f') {
        const cuadradoSeleccionado = document.querySelector('.cuadrado:hover');
        if (cuadradoSeleccionado) {
            const fileInput = document.getElementById('fileInput');
            fileInput.click();
            fileInput.onchange = function() {
                const file = fileInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imageUrl = e.target.result;
                        const videoUrl = prompt('Introduce la URL del video:');
                        const imageName = file.name; 

                        if (videoUrl) {
                            cuadradoSeleccionado.innerHTML = `<img src="${imageUrl}" alt="${imageName}" data-name="${imageName}">`;
                            cuadradoSeleccionado.setAttribute('data-url', videoUrl);
                            guardarEstado(); 
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
        }
    }
});

// Guardar el estado en el almacenamiento local
function guardarEstado() {
    const cuadrados = document.querySelectorAll('.cuadrado');
    const estado = [];

    cuadrados.forEach(cuadro => {
        const img = cuadro.querySelector('img');
        const url = cuadro.getAttribute('data-url') || '';
        const name = img ? img.getAttribute('data-name') : '';
        if (img) {
            estado.push({ imgSrc: img.src, url: url, name: name });
        } else {
            estado.push({ imgSrc: '', url: '', name: '' });
        }
    });

    localStorage.setItem('estadoCuadrados', JSON.stringify(estado));
}

// Cargar el estado desde el almacenamiento local
function cargarEstado() {
    const estado = JSON.parse(localStorage.getItem('estadoCuadrados')) || [];
    totalCuadrados = estado.length;

    estado.forEach(cuadro => {
        crearCuadrados(1, cuadro.imgSrc, cuadro.url, cuadro.name);
    });
}

// Función de búsqueda
document.getElementById('buscar').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const cuadrados = document.querySelectorAll('.cuadrado');
    cuadrados.forEach(cuadro => {
        const img = cuadro.querySelector('img');
        const name = img ? img.getAttribute('data-name').toLowerCase() : '';
        if (name.includes(searchTerm)) {
            cuadro.style.display = 'flex';
        } else {
            cuadro.style.display = 'none';
        }
    });
});
