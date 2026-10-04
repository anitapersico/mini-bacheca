// Carico le variabili segrete dal file .env (deve essere la prima riga)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

// Importo i due "menù" di indirizzi
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = 3003;

// Permette al server di leggere i dati JSON che arrivano nelle richieste
app.use(express.json());

// Collego i menù: tutti gli indirizzi di authRoutes iniziano con /api/auth,
// quelli di noteRoutes con /api/notes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Mi collego al database e, solo se la connessione riesce, accendo il server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connesso a MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('Errore di connessione:', err.message));