const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Origen permitido (solo tu GitHub Pages)
const allowedOrigins = [
  'https://edgararmandoortiz.github.io'
];

// Configuración CORS personalizada
const corsOptions = {
  origin: function(origin, callback) {
    // Permite solicitudes sin origin (como Postman) o si el origen está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

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
      res.status(200).send({ message: 'Formulario enviado con éxito', response: text });
      console.log("Enviando datos al script:", params.toString());
    } else {
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
