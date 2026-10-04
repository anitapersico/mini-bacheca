// jwt serve per controllare che il token (il "biglietto") sia autentico
const jwt = require('jsonwebtoken');

// Questa funzione è il "buttafuori": controlla il token prima di far passare la richiesta
// next è la funzione che dice "ok, puoi passare al prossimo passo"
const protect = (req, res, next) => {
  // Il token arriva nell'header "Authorization", scritto così: "Bearer eyJhbGc..."
  const authHeader = req.headers.authorization;

  // Se l'header non c'è, oppure non inizia con "Bearer ", il biglietto manca: fermo tutto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ messaggio: "Accesso negato: token mancante" });
  }

  // Divido il testo in due pezzi usando lo spazio, e prendo il secondo (il token vero)
  const token = authHeader.split(' ')[1];

  try {
    // Controllo che il token sia stato firmato con la nostra chiave segreta e non sia scaduto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dentro il token avevamo messo l'id dell'utente: lo salvo nella richiesta
    // Così i prossimi pezzi di codice sapranno CHI sta facendo la richiesta
    req.userId = decoded.userId;

    // Tutto ok: lascio passare la richiesta verso il prossimo passo
    next();
  } catch (err) {
    // Se il token è falso, manomesso o scaduto, fermo tutto
    res.status(401).json({ messaggio: "Token non valido o scaduto" });
  }
};

// Rendo disponibile la funzione agli altri file
module.exports = protect;