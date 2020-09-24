var XLSX = require("xlsx");

function ExcelAJSON(archivo) {
  const excel = XLSX.readFile(archivo
    // "C:\\CursoBackEnd\\Segunda_Aplicacion\\administradores.xlsx"
  );
  var nombreHoja = excel.SheetNames; // regresa un array
  let datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);
  //console.log(datos)
  // const jDatos = [];
  // for (let i = 0; i < datos.length; i++) {
  //   const dato = datos[i];
  //   jDatos.push({
  //     usuario: dato.usuario,
  //     password: dato.password
  //   //   Fecha: new Date((dato.Fecha - (25567 + 2)) * 86400 * 1000)
  //   });
  // }
  //console.log(jDatos);
  return datos
};

module.exports = {ExcelAJSON}
//ExcelAJSON();