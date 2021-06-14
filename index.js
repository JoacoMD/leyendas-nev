const fs = require('fs');
const path = require('path');

// path.join(__dirname, 'leyendas.json'))
var leyendas;

if (fs.existsSync('leyendas.json')) {
    leyendas = JSON.parse(fs.readFileSync('leyendas.json'))
} else {
    leyendas = [];
}

const saveJson = () => {
    fs.writeFileSync('leyendas.json', JSON.stringify(leyendas));
};

const writeTxt = size => {
    const leyendasChunks = chunkLeyendas(size);
    var s = '';
    leyendasChunks.forEach((c, i) => {
        s = s.concat(`${c}\n\n`);
    })
    fs.writeFileSync('leyendas.txt', s);
};

const addEstrella = leyenda => {
    var newLeyendas = [...leyendas];
    var newLeyenda = { ...leyenda, estrellas: leyenda.estrellas + 1 };
    var index = leyendas.indexOf(leyenda);
    const a = leyendas.slice(0, index).reverse();
    var target = a.find(e => e.estrellas >= newLeyenda.estrellas)
    var targetIndex = target ? leyendas.findIndex(el => el.user === target.user) + 1 : 0;   
    newLeyendas = newLeyendas.filter(el => el.user !== newLeyenda.user);
    newLeyendas.splice(targetIndex, 0, newLeyenda);
    return newLeyendas;
}

const sortByEstrellas = () => [...leyendas].sort((a, b) => b.estrellas - a.estrellas);

const chunkAndMap = (array, size) => chunk(array, size).map(mapLeyendas);

const processUser = user => {
    if(user === '') {
        return 'Debe escribir un nombre. Madge';
    }
    var leyenda = leyendas.find(l => l.user === user);
    if(leyenda) {
        leyendas = addEstrella(leyenda);
        return `Se ha agregado una estrella a ${user}.`
    } else {
        leyendas.push({user, estrellas: 0});
        return `Se agregó a ${user} como una nueva leyenda.`
    }
}

const mapUser = (leyenda, index) => `/ ${index}-♛ ${leyenda.user}${'☆'.repeat(leyenda.estrellas)}`

const mapLeyendas = (leyendas, indexChunk) => {
    var s = '';   
    leyendas.forEach((l, i) => s = s.concat(mapUser(l, (++i + 15 * indexChunk))));
    return s;
}

const chunk = (array, size) => {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }
    return chunked_arr;
}

const txtName = i => `leyendas${i}.txt`

const chunkLeyendas = size => chunk(leyendas, size).map(mapLeyendas);

const actualizarLeyendas = array => leyendas = array;

module.exports = {processUser, saveJson, writeTxt, chunkLeyendas, sortByEstrellas, chunkAndMap, actualizarLeyendas}