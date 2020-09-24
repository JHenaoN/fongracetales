const express = require('express')
const rutas = express.Router()
const mysql = require('mysql')
const { ValidationError } = require('yup')
const convertir = require('./convertirajson')
const fetch = require('node-fetch')
const { response } = require('express')
const fileUpload = require('express-fileupload')

rutas.use(fileUpload())

var pool = mysql.createPool({
    connectionLimit :20,
    host :          'localhost',
    user :          'root',
    password :      '12345',
    database :      'fongracetales'
})

rutas.get('/',(pet,res)=>{
    res.render('index',{mensaje : "Bienvenidos"})
})

rutas.get('/iniciosesion',(pet,res)=>{
    res.render('inicio-asociados',{mensaje:pet.flash('mensaje')})
})

rutas.get('/cierresesion',function(pet,res){
    pet.session.destroy();
    res.redirect('/')
})

rutas.get('/inicio-admon',(pet,res)=>{
    res.render('inicio-admon',{mensaje:pet.flash('mensaje')})
})

rutas.get('/registro',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const consulta = `SELECT * FROM asociados`
        conexion.query(consulta,(error,filas,campos)=>{
          res.render('registro',{asociados: filas,mensaje: pet.flash('mensaje')}) 
        }) 
        conexion.release()
    })
    
})

rutas.get('/registro-admon',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const consulta = `SELECT * FROM administradores`
        conexion.query(consulta,(error,filas,campos)=>{
          res.render('registro-admon',{usuario: pet.session.usuario, administradores: filas,mensaje: pet.flash('mensaje')}) 
        }) 
        conexion.release()
    })
})

rutas.get('/acciones-admon',(pet,res)=>{
    res.render('acciones-admon',{usuario: pet.session.usuario,mensaje: pet.flash('mensaje')}) 
    
})

rutas.get('/acciones-asociados',(pet,res)=>{
    res.render('acciones-asociados',{usuario: pet.session.usuario,mensaje: pet.flash('mensaje')}) 
    
})

//Valida que el usuario sea un administrador
rutas.post('/procesar-inicio-admon',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const consulta = `SELECT * FROM administradores
                          WHERE usuario = ${conexion.escape(pet.body.usuario)}
                          AND
                          password = ${conexion.escape(pet.body.password)}`
        conexion.query(consulta,(error,filas,campos)=>{
            if (filas.length > 0){
                pet.session.usuario = filas[0]
                res.redirect('/acciones-admon')
            }else{
                pet.flash('mensaje','El usuario registrado no es Administrador')
                res.redirect('/inicio-admon')
            }
        })
    })
})

rutas.post('/procesar-inicio-asociados',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const consulta = `SELECT * FROM asociados
                          WHERE cedula = ${conexion.escape(pet.body.cedula)}
                          AND
                          password = ${conexion.escape(pet.body.password)}`
        conexion.query(consulta,(error,filas,campos)=>{
            if (filas.length > 0){
                pet.session.usuario = filas[0]
                res.redirect('/acciones-asociados')
            }else{
                pet.flash('mensaje','Usted no es asociado')
                res.redirect('/iniciosesion')
            }
        })
    })
})

rutas.post('/procesar-registro-admon',(pet,res)=>{
  pool.getConnection((err,conexion)=>{
      const consulta = `SELECT * FROM administradores WHERE usuario = ${conexion.escape(pet.body.usuario)}`
      conexion.query(consulta,(error,filas,campos)=>{
        if (filas.length > 0){
            pet.flash('mensaje','Ya existe un administrador con ese usuario')
            res.redirect('/registro-admon')
        }else{
            const consulta = `INSERT INTO administradores 
                               (usuario, password )
                               VALUES
                               (
                                ${conexion.escape(pet.body.usuario)},
                                ${conexion.escape(pet.body.password)}) `
            conexion.query(consulta,(error,filas,campos)=>{
                if (error){
                    res.json(error)
                }
                res.redirect('/registro-admon')
            })           
        }
        
      })
      conexion.release()
  })
})

rutas.post('/procesar-registro-asociados',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const consulta = `SELECT * FROM asociados WHERE cedula = ${conexion.escape(pet.body.cedula)}`
        conexion.query(consulta,(error,filas,campos)=>{
          if (filas.length > 0){
              pet.flash('mensaje',`Ya existe un asociado con la cedula ${pet.body.cedula}`)
              res.redirect('/registro')
          }else{
              const consulta = `INSERT INTO asociados 
                                 (cedula, password, nombres, apellidos, email, estado )
                                 VALUES
                                 (
                                  ${conexion.escape(pet.body.cedula)},
                                  ${conexion.escape(pet.body.password)},
                                  ${conexion.escape(pet.body.nombres)},
                                  ${conexion.escape(pet.body.apellidos)},
                                  ${conexion.escape(pet.body.email)},
                                  ${conexion.escape(pet.body.estado)}) `
                 console.log(consulta)                 
                conexion.query(consulta,(error,filas,campos)=>{
                  if (error){
                      res.json(error)
                  }
                  res.redirect('/registro')
                })           
            }
          
        })
        conexion.release()
    })
  })

// A P I S

//Insercion multiple de registros en una tabla 

rutas.post('/api/asociados/',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const datos = pet.body
        const consulta = 'INSERT INTO asociados (cedula,password,nombres,apellidos,email,estado) values ?'
        //console.log(datos)
        conexion.query(consulta,[datos.map(x => [x.cedula,x.password,x.nombres,x.apellidos,x.email,x.estado])],(error,filas,campos)=>{
            if (!error){
                    res.status(201)
                    res.json({data:filas})
            }
            else{
                res.send(error)
            }

        })
        conexion.release()
    })
})

rutas.post('/api/descuentosaplicados/',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const datos = pet.body
        const consulta = 'INSERT INTO descuentos_aplicados (id,cedula,concepto,numero,valor_capital,valor_interes,valor_seguro,valor_total) values ?'
        // console.log(datos)
        conexion.query(consulta,[datos.map(x => [x.id, x.cedula, x.concepto,x.numero,x.valor_capital,x.valor_interes,x.valor_seguro,x.valor_total])],(error,filas,campos)=>{
            if (!error){
                    res.status(201)
                    res.json({data:filas})
            }
            else{
                res.json(error)
            }

        })
        conexion.release()
    })
})


rutas.post('/api/descuentosenviados/',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const datos = pet.body
        const consulta = 'INSERT INTO descuentos_enviados (id,cedula,concepto,numero,valor_capital,valor_interes,valor_seguro,valor_total) values ?'
        // console.log(datos)
        conexion.query(consulta,[datos.map(x => [x.id, x.cedula, x.concepto,x.numero,x.valor_capital,x.valor_interes,x.valor_seguro,x.valor_total])],(error,filas,campos)=>{
            if (!error){
                    res.status(201)
                    res.json({data:filas})
            }
            else{
                res.json(error)
            }

        })
        conexion.release()
    })
})

rutas.post('/api/saldosahorros/',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const datos = pet.body
        const consulta = 'INSERT INTO saldos_ahorros (cedula,fecha_corte,concepto,numero,valor_cuota,saldo) values ?'
        // console.log(datos)
        conexion.query(consulta,[datos.map(x => [x.cedula, x.fecha_corte,x.concepto,x.numero,x.valor_cuota,x.saldo])],(error,filas,campos)=>{
            if (!error){
                    res.status(201)
                    res.json({data:filas})
            }
            else{
                res.json(error)
            }

        })
        conexion.release()
    })
})

rutas.post('/api/saldosprestamos/',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const datos = pet.body
        const consulta = 'INSERT INTO saldo_prestamos (cedula,fecha_corte,concepto,numero,valor_cuota,valor_inicial,saldo_capital,saldo_interes,numero_cuotas) values ?'
        // console.log(datos)
        conexion.query(consulta,[datos.map(x => [x.cedula,x.fecha_corte,x.concepto,x.numero,x.valor_cuota,x.valor_inicial,x.saldo_capital,x.saldo_interes,x.numero_cuotas])],(error,filas,campos)=>{
            if (!error){
                    res.status(201)
                    res.json({data:filas})
            }
            else{
                res.json(error)
            }

        })
        conexion.release()
    })
})

rutas.post('/api/administradores/',(pet,res)=>{
    pool.getConnection((err,conexion)=>{
        const datos = pet.body
        const consulta = 'INSERT INTO administradores (usuario,password) values ?'
        console.log(datos)
        conexion.query(consulta,[datos.map(x => [x.usuario,x.password])],(error,filas,campos)=>{
            if (!error){
                    res.status(201)
                    res.json({data:filas})
            }
            else{
                res.json(error)
            }
        })
        conexion.release()
    })
})

rutas.post('/seleccionaarchivo/:id',(pet,resp)=>{
        
    const identi = pet.params.id
    var url = ""
    switch (identi){
        case '1':  //Subir achivo administradores
          url = 'http://localhost:8080/api/administradores'
        break
        case '2':
           url = 'http://localhost:8080/api/asociados'
        break
        case '3':
           url = 'http://localhost:8080/api/saldosahorros'
        break
        case '4':
           url = 'http://localhost:8080/api/saldosprestamos'
        break
    }
        const archivo = pet.body.file
        const archivoconvertido = convertir.ExcelAJSON(archivo)
        //console.log(JSON.stringify(archivoconvertido))
        fetch(url, {
        method: 'POST', 
        body: JSON.stringify(archivoconvertido), // data can be `string` or {object}!
        headers:{'Content-Type': 'application/json'}
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(res => {
            pet.flash('mensaje','Registros Grabados Exitosamente')
            resp.redirect('/acciones-admon')
        })
        // EDFile.mv(`./files/${EDFile.name}`,err => {
        //     if(err) return res.status(500).send({ message : err })
        //     return res.status(200).send({ message : 'File upload' })
        // })
    
})

rutas.get('/subiradministradores',(pet,resp)=>{
    const archivo = convertir.ExcelAJSON()
    var url = 'http://localhost:8080/api/administradores'
    
    fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(archivo), // data can be `string` or {object}!
    headers:{'Content-Type': 'application/json'}
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(res => {
        pet.flash('mensaje','Registros Grabados Exitosamente')
        resp.redirect('/acciones-admon')
    })
})

module.exports = rutas