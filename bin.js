const inquirer = require('inquirer');
const index = require('./index');

const menu = () => inquirer.prompt([{
    type: 'list',
    name: 'option',
    message: 'Elija una opcion',
    choices: ['Agregar leyenda/estrella', 'Ordenar lista', 'Eliminar leyenda', 'Previsualizar', 'Salir y guardar', 'Salir']
}]).then(answer => {
    switch (answer.option) {
        case 'Agregar leyenda/estrella': addLeyenda(); break;
        case 'Ordenar lista': {
            ordenarLista();
            break;
        }
        case 'Eliminar leyenda': {
            eliminarLeyenda();
            break;
        }
        case 'Previsualizar': {
            console.clear();
            index.chunkLeyendas(15).forEach((e, i) => console.log(`\nLeyendas ${++i}: ${e}\n`));
            menu();
            break;
        }
        case 'Salir y guardar': {
            index.writeTxt(15);
            index.saveJson();
            console.log('Guardados JSON y TXT');
        }
        default: {
            console.log('Ta luego! Okayge\n');
            pressAnyKeyToContinue();
        }
    }
})

const addLeyenda = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'user',
            message: 'Escriba el nombre del usuario: '
        }
    ]).then(answers => {
        console.log(index.processUser(answers.user));
        inquirer.prompt([{
            type: 'confirm',
            name: 'addAgain',
            message: '¿Quiere agregar otra leyenda o sumar una estrella a una existente?',
        }]).then(a => {
            if(a.addAgain) {
                addLeyenda();
            } else {
                console.clear();
                menu();
            }
        })
    })
}

const ordenarLista = () => {
    console.clear();
    const listaOrdenada = index.sortByEstrellas();
    index.chunkAndMap(listaOrdenada, 15).forEach((e, i) => console.log(`\nLeyendas ${++i}: ${e}\n`));
    inquirer.prompt([{
        type: 'confirm',
        name: 'save',
        message: '¿Desea confirmar los cambios?'
    }]).then(answer => {
        if(answer.save) {
            index.actualizarLeyendas(listaOrdenada);
            console.log('Lista actualizada. Okayge\n');
        }
        menu();
    })
}

const eliminarLeyenda = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'delete',
        message: 'Elija al usuario que quiera eliminar',
        choices: index.getLeyendas().map(l => l.user)
    }]).then(a => {
        console.log(index.eliminarLeyenda(a.delete));
        inquirer.prompt([{
            type: 'confirm',
            name: 'addAgain',
            message: '¿Quiere eliminar otra leyenda?',
        }]).then(a => {
            if(a.addAgain) {
                eliminarLeyenda();
            } else {
                console.clear();
                menu();
            }
        })
    })
}

const pressAnyKeyToContinue = () => {
    console.log('Presione cualquier tecla para continuar...');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
} 

menu();