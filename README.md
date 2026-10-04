# 📌 Mini Bacheca — Progetto di pratica: Autenticazione e dati protetti

Terzo progetto di pratica backend: una bacheca di appunti dove ogni utente si registra, fa login e vede **solo i propri appunti**. Introduce password sicure, token JWT, middleware di protezione e dati collegati all'utente che li ha creati.

## 🛠️ Cosa ho fatto, passo per passo

### 1. Creazione del progetto
- `npm init -y` → creato `package.json`
- `npm install express mongoose dotenv bcryptjs jsonwebtoken` → le librerie per il server, il database, i dati segreti, le password sicure e i token di login

### 2. File `.env` e `.gitignore`
- `.env` contiene due dati segreti: `MONGO_URI` (indirizzo del database, un nuovo database `bacheca` nello stesso cluster degli altri progetti) e `JWT_SECRET` (la frase segreta con cui il server firma i token)
- `.gitignore` contiene `node_modules` e `.env`, così né le librerie né i segreti finiscono su GitHub

### 3. I Model (`models/`)
- `User.js` → un utente ha `email` (unica, non possono esistere due utenti con la stessa) e `password`
- `Note.js` → un appunto ha `testo` e `autore`. L'autore non è un nome scritto a mano ma **l'id dell'utente** che lo ha creato (`ObjectId` con `ref: 'User'`): è il filo che collega ogni appunto alla persona giusta

### 4. Il controller di autenticazione (`controllers/authController.js`)
- **register**: controlla che l'email non esista già, trasforma la password con `bcrypt.hash()` e salva l'utente. La password vera non viene mai salvata
- **login**: cerca l'utente per email, confronta la password con `bcrypt.compare()` (non si "decifra" mai l'hash, si ricalcola e si confronta) e, se è giusta, crea un token con `jwt.sign()` che contiene l'id dell'utente e scade dopo 7 giorni

### 5. Il middleware (`middleware/authMiddleware.js`)
Il "buttafuori": legge il token dall'header `Authorization: Bearer ...`, lo controlla con `jwt.verify()` e, se è valido, salva l'id dell'utente in `req.userId` e chiama `next()`. Se il token manca o non è valido, risponde `401` e la richiesta si ferma lì

### 6. Il controller degli appunti (`controllers/noteController.js`)
Ogni operazione usa `req.userId` (messo dal middleware) invece di fidarsi di dati inviati dal client:
- `getNotes` → `Note.find({ autore: req.userId })`: solo i miei appunti
- `createNote` → l'autore viene preso dal token, mai dal Body, perché il Body si può falsificare
- `updateNote` / `deleteNote` → cercano per `_id` **e** `autore`: anche conoscendo l'id di un appunto altrui, non si può modificare né cancellare

### 7. Routes e server
- `authRoutes.js` → `POST /api/auth/register` e `POST /api/auth/login`
- `noteRoutes.js` → quattro rotte su `/api/notes`, tutte con `protect` davanti al controller
- `server.js` → collega tutto, si connette a MongoDB e solo dopo accende il server sulla porta 3003

### 8. Test con Postman
Ho verificato l'intero percorso: registrazione, login, richiesta senza token (`401`), richiesta con token (`201`), lettura dei propri appunti, e con un secondo utente ho controllato che non veda né possa modificare gli appunti del primo (`404`).

## 🧠 Concetti chiave imparati

- Perché le password non si salvano mai in chiaro, e come funziona `bcrypt` (hash e confronto)
- Cos'è un token JWT e come si crea e si verifica
- Cos'è un middleware e perché `next()` è fondamentale
- Come collegare un documento a un altro con `ObjectId` e `ref`
- Perché l'identità dell'utente va presa dal token verificato e mai dai dati inviati dal client
- Come un doppio filtro (`_id` + `autore`) protegge i dati degli altri utenti

## 🔌 API

| Metodo | Endpoint | Descrizione | Token |
|--------|----------|-------------|-------|
| POST | `/api/auth/register` | Registra un utente | No |
| POST | `/api/auth/login` | Login, restituisce il token | No |
| GET | `/api/notes` | I miei appunti | Sì |
| POST | `/api/notes` | Crea un appunto | Sì |
| PUT | `/api/notes/:id` | Modifica un mio appunto | Sì |
| DELETE | `/api/notes/:id` | Elimina un mio appunto | Sì |

## 🚀 Come avviarlo

Crea un file `.env` con:
\`\`\`
MONGO_URI=la_tua_stringa_di_connessione
JWT_SECRET=una_frase_segreta_lunga
\`\`\`
Poi:
\`\`\`bash
npm install
node server.js
\`\`\`
Il server parte su `http://localhost:3003`

