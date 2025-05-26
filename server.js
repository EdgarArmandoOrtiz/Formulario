const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 10000;

// Orígenes permitidos
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'https://edgararmandoortiz.github.io'
];

// Configuración CORS
const corsOptions = {
  origin: function(origin, callback) {
    // Permitir solicitudes sin origin (ej. Postman) o que estén en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

// Aplica CORS a todas las rutas
app.use(cors(corsOptions));

// Asegura que responde a preflight
app.options('*', cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

app.post('/sendForm', async (req, res) => {
  const formData = req.body;

  try {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbx6Fv3aMrO4Zzsj4MRgvohE5UKc_aw8flqaL3pYz5XDXqaTlLMoUTeNjhC_QqgXr4jO/exec';
    const params = new URLSearchParams(formData);

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const text = await response.text();

    if (response.ok) {
      res.status(200).json({ message: 'Formulario enviado con éxito', response: text });
    } else {
      res.status(response.status).json({ error: 'Error al enviar al script', details: text });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
