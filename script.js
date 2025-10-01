function analisarBoletim() {
    const boletimInput = document.getElementById('boletim-input').value.split('\n');
    const quantidadeMaterias = boletimInput.length / 5;

    const areas = {};

    const resultado = [];
    let maiorNome = 0;
    
    for (let i = 0; i < boletimInput.length; i+=5) {
        const materia = boletimInput[i];
        let notas = boletimInput[i+4].split("\t");

        const codigoArea = materia.split("\t")[1][0];
        const nomeArea = materia.substring(materia.indexOf("-") + 1, materia.lastIndexOf(".") - 3).trim();
        
        const nomeMateria = materia.substring(materia.lastIndexOf("-") + 2, materia.lastIndexOf(",") - 3).trim();

        let notasTratado = [];
        let notasTratadoString = [];
        let somaNotas = 0;

        for (let j = 0; j < 7; j += 2) {
            let notaMateria = notas[j].replaceAll(",",".").replaceAll("-","0");
            notasTratadoString.push(notaMateria)

            let notaMateriaTratado = parseFloat(notaMateria);
            notasTratado.push(notaMateriaTratado);
            somaNotas += notaMateriaTratado;
        }

        if (!areas[codigoArea]) {
            areas[codigoArea] = [0, 0, "", 0];
        }        
    
        areas[codigoArea][0] += 1
        areas[codigoArea][1] += somaNotas/4
        areas[codigoArea][2] = nomeArea
        areas[codigoArea][3] += somaNotas

        const infoMateria = [
            nomeMateria,
            notasTratadoString.join(" -- "),
            24 - somaNotas,
            somaNotas,
            `${codigoArea} - ${nomeArea}`,
            codigoArea
        ];

        maiorNome = Math.max(maiorNome, nomeMateria.length);

        resultado.push(infoMateria)
    }

    resultado.sort((a, b) => b[2] - a[2]);

    materiasConcluida = [];
    materiasFalta = [];

    for (let i = 0; i < resultado.length; i++) {
        if (resultado[i][2] <= 0) {
            materiasConcluida.push(resultado[i]);
        } else {
            materiasFalta.push(resultado[i]);
        }
    }

    const placeholder1 = document.getElementById('placeholder1');
    const placeholder2 = document.getElementById('placeholder2');
    const placeholder3 = document.getElementById('placeholder3');

    placeholder1.innerHTML = `${quantidadeMaterias} MATÉRIAS DETECTADAS<br><br>`;
    placeholder2.innerHTML = "";
    placeholder3.innerHTML = "";

    for (let i = 0; i < resultado.length; i++) {
        let materia = resultado[i];

        placeholder1.innerHTML += `>> ${materia[0]} (${materia[4]})<br>`
        placeholder1.innerHTML += `>> ${materia[1]}<br>`
        placeholder1.innerHTML += materia[2] <= 0 ? ">> CONCLUÍDA" : `>> NOTA RESTANTE: ${materia[2].toFixed(1)} (${materia[3].toFixed(1)} / 24)`
        
        if (i != resultado.length - 1) {
            placeholder1.innerHTML += "<br><br>";
        }
    }

    placeholder2.innerHTML += `MATÉRIAS CONCLUIDAS: (${materiasConcluida.length})<br>`;

    for (let i = 0; i < materiasConcluida.length; i++) {
        let materia = materiasConcluida[i];
        placeholder2.innerHTML += `(${materia[5]}) ${materia[0]}<br>`
    }

    placeholder2.innerHTML += `<br>MATÉRIAS NÃO CONCLUIDAS: (${materiasFalta.length})<br>`;

    for (let i = 0; i < materiasFalta.length; i++) {
        let materia = materiasFalta[i];
        placeholder2.innerHTML += `(${materia[5]}) ${materia[0]}`
        placeholder2.innerHTML += ` (${materia[2].toFixed(1)})<br>`
    }

    let blocos = Object.entries(areas);
    blocos.sort().sort((a, b) => {
        return (a[1][1]/a[1][0]) - (b[1][1]/b[1][0]);
    })

    for (let i = 0; i < blocos.length; i++) {
        const codigoArea = blocos[i][0];
        const infoArea = blocos[i][1];
        const mediaArea = infoArea[1] / infoArea[0];
        
        placeholder3.innerHTML += `${codigoArea} - ${infoArea[2]} -> `
        placeholder3.innerHTML += mediaArea >= 6 ? "CONCLUÍDO<br>" : `${mediaArea.toFixed(2)} / 6 [${infoArea[3].toFixed(2)} / ${infoArea[0]*24}]<br>`
    }
}