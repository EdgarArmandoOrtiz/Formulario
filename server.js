const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sirve archivos estáticos si tienes frontend en la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal (si usas HTML en el servidor)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para recibir el formulario
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

// Escucha el puerto asignado por Render
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
