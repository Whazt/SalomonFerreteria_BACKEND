const { exec } = require('child_process');

function generarInformeVentas() {
  return new Promise((resolve, reject) => {
    exec('python3 ventas_predict.py', (error, stdout, stderr) => {
      if (error) {
        reject(`Error al ejecutar el script: ${error.message}`);
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
    });
  });
}

module.exports = { generarInformeVentas };
