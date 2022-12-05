import { Dropzone } from "dropzone"

Dropzone.options.imagen ={

    dictDefaultMessage:'Sube tus imagenes aqui',
    acceptedFiles:'.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'BORRAR ARCHIVO',
    dictMaxFilesExceeded:'Solo puedes subir maximo 1 archivo',
    paramName: 'imagen',
    init: function () {
        const dropzone = this
        const btnPublicar =document.querySelector('#publicar')
        
        btnPublicar.addEventListener('click', function() {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function() {
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades'
            }
        })

    }
}