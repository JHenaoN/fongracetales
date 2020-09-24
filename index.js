const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('express-flash')
const rutas = require('./routes/principales')
const app = express()

//Se define el puerto donde escucha
const port = process.env.PORT || 8080


app.set('view engine','ejs') // se Indica a Node que se usara ejs
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));  //Esto es para inciar el servicio de archivos estaticos
app.use(session({secret: "token-muy-secreto", resave: true, saveUninitialized: true}))
app.use(flash()) // se Indica a Node que se usara flash


app.use(rutas)

app.listen(port,function(pet,res){
    console.log(`Servidor Iniciado en el puerto ${port}`)
})