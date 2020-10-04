var XLSX = require("xlsx");

function ExcelAJSON(archivo) {
  const excel = XLSX.readFile(archivo
    // "C:\\CursoBackEnd\\Segunda_Aplicacion\\administradores.xlsx"
  );
  var nombreHoja = excel.SheetNames; // regresa un array
  let datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);
     
  datos.map(i=>{
    //console.log(i)
    Object.getOwnPropertyNames(i).map(val=>{
      //console.log(val)
     if (val.includes('fecha')){
      //  console.log(`${val} ==> ${i[val]}`)
       i[val] = new Date ((i[val] - (25567 + 2)) * 86400 * 1000).toISOString().slice(0,10)
      //  console.log(`${val} ==> ${i[val]}`)
      }
     })

  })
    return datos
};

module.exports = {ExcelAJSON}
