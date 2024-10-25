const { exec } = require('child_process');
const axios = require('axios'); // Usaremos axios para obtener los datos de ventas

function ejecutarPython() {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtener los datos de ventas desde la API de Node.js
      const { data: ventas } = await axios.get('http://localhost:3000/api/ventas');

      // Ejecutar el script de Python pasando los datos como argumento
      exec(
        `python3 ventas_predict.py '${JSON.stringify(ventas)}'`,
        (error, stdout, stderr) => {
          if (error) {
            reject(`Error al ejecutar Python: ${error.message}`);
          } else if (stderr) {
            reject(`Error en el script: ${stderr}`);
          } else {
            try {
              const informe = JSON.parse(stdout);
              resolve(informe);
            } catch (err) {
              reject(`Error al parsear la salida: ${err.message}`);
            }
          }
        }
      );
    } catch (error) {
      reject(`Error al obtener datos de ventas: ${error.message}`);
    }
  });
}

module.exports = { ejecutarPython };
