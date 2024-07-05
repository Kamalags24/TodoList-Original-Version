const express = require('express');
const path = require('path');
const cors = require('cors'); // Importation du module cors
const app = express();

app.use(cors()); // Utilisation du middleware cors
app.use(express.json());
app.use('/api/todos', require('./routes/todoRoutes'));

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Serveur en cours d'execution sur http://localhost:${PORT}`));
