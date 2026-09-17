const express = require("express"); //Importar express
const app = express();
const port = 3000; //Puerto donde va a correr el servidor 

app.use(express.json()); //Todos los datos que el usuario mande se van a convertir en JSON

//Datos de prueba
let videojuegos = [
    {id: 1, titulo: "red dead redemption 2", precio : 1000},
    {id: 2, titulo: "GTA VI", precio: 2000},
    {id : 3, titulo : "Aristoputas 2", precio: 5000},
    {id : 4, titulo : "EA SPORTS FC 27", precio : 3000}
]

app.get("/", (req, res) => {
    return res.json(videojuegos);
});

app.get("/videojuegos", (req, res) => {
    return res.json([
        videojuegos[0],
        videojuegos[1]
    ]);
});

app.post("/guardar-juego", (req, res) => {
    let nuevoJuego = {
        id : videojuegos.length + 1, //aumento de id, obtenemos el id y agregamos 1
        titulo : req.body.titulo, //tomamos el titulo del body 
        precio : req.body.precio //tomamos el precio del body
    };
    videojuegos.push(nuevoJuego); //agregamos el juego al array

    return res.status(200).json(nuevoJuego); //mandamos codigo 200
});



app.listen(port, () => {
    console.log("Servidor node escuchando en http://localhost:" + port);
});
