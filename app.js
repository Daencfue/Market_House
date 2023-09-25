
//1 Invocamos a express 
const express = require('express');
const app = express();

//2 set urlencoded para captura de datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3 Invocamos a dotenv

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//4 set directorio publico 
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));


//5 set motor de plantilla
app.set('view engine', 'ejs');

//6 bycreps js

const bcryptjs = require('bcryptjs');


//7var. session

const session = require('express-session');
const connection = require('./database/db');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

//8 modulo de conexion
require('./database/db');

//9 estableciendo rutas

app.get('/login', (req, res)=>{
    res.render('login');
})

app.get('/register', (req, res)=>{
    res.render('register');
})

//10 registro

app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
  
    // Seleccionar la base de datos adecuada
    connection.query('USE login_node', (error) => {
      if (error) {
        console.error('Error al seleccionar la base de datos:', error);
        res.status(500).send('Error interno del servidor');
      } else {
        // Generar el hash de la contraseña y realizar la inserción
        bcryptjs.hash(pass, 8, async (error, passwordHash) => {
          if (error) {
            console.error('Error al generar el hash de la contraseña:', error);
            res.status(500).send('Error interno del servidor');
          } else {
            // Realizar la inserción en la base de datos
            const sql = 'INSERT INTO users SET ?';
            const userData = {
              user: user,
              name: name,
              pass: passwordHash
            };
  
            connection.query(sql, userData, (error, results) => {
              if (error) {
                console.error('Error al insertar en la base de datos:', error);
                res.status(500).send('Error interno del servidor');
              } else {
                res.render('register',{
                    alert: true,
                    alertTitle: "Registration",
                    alertMessage: "registro exitoso",
                    alertIcon: 'success',
                    showConfirmButton:false,
                    timer:1500,
                    ruta:''

                })
              }
            });
          }
        });
      }
    });
  });
  

// Autenticación

connection.query('USE login_node', (error) => {
    if (error) {
        console.error('Error al seleccionar la base de datos:', error);

    } else {

        connection.query('SELECT * FROM users WHERE user = ?', ['ADMIN'], (error, results) => {
            if (error) {
                console.error('Error en la consulta SQL:', error);

            } else {

                console.log('Resultados:', results);
            }
        });
    }
});

app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if (user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error interno del servidor');
            } else {
                if (results && results.length > 0 && (await bcryptjs.compare(pass, results[0].pass))) {
                    req.session.loggedin = true;
                    req.session.name = results[0].name;
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "Login correcto",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: false,
                        ruta: ''
                    });
                } else {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectos",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 1500,
                        ruta: 'login'
                    });
                }
            } 
        });
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Por favor ingrese un usuario y/o contraseña",
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: 1500,
            ruta: 'login'
        });
    }
});


//12 auth pages 
app.get('/', (req, res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login:true,
            name: req.session.name
        });
    }else{
        res.render('index', {
            login:false,
            name:'Debe iniciar sesión'
        })
    }    
})


// Logout
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})



app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})
