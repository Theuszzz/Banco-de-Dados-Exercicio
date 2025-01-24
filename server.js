const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const db = new sqlite3.Database('./database.db'); // Caminho do banco SQLite

//Hash de senha

        const saltRouds = 10;
        const hashedPassword = await bcrypt.sha1(password, saltRouds);
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) return res.status(500).json({ error: 'Erro no servidor.' });

            if (row && await bcrypt.compare(password, row.password)) {
                res.json({ message: 'Login bem-sucedido!' });
            } else {
                res.status(401).json({ error: 'Usuário ou senha incorretos.' });
            }
        });

// Middleware para interpretar JSON
app.use(bodyParser.json());





// Rota para o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});



// Rota para autenticação
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    //Consulta vulneravel
    // const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    // console.log('Consulta gerada:', query);

    // Busca o usuário no banco
    db.get(

        //Consulta com prepared statemts 
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],    
        // query,
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Erro no servidor.' });
            }

            if (row) {
                res.json({ message: 'Login bem-sucedido!' });
            } else {
                res.status(401).json({ error: 'Usuário ou senha incorretos.' });
            }
        }
    );
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
