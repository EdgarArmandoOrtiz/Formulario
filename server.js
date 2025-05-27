const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

const allowedOrigins = [
  'https://edgararmandoortiz.github.io',
  'http://127.0.0.1:5500'
];

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.post('/sendForm', async (req, res) => {
  const formData = req.body;
  console.log("Datos recibidos del frontend:", formData);

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
      console.log("Datos enviados al script correctamente.");
      res.status(200).send({ message: 'Formulario enviado con éxito', response: text });
    } else {
      console.error("Error en respuesta del script:", text);
      res.status(response.status).send({ error: 'Error al enviar al script', details: text });
    }

  } catch (error) {
    console.error("Error al enviar al script:", error);
    res.status(500).send({ error: 'Error del servidor', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
