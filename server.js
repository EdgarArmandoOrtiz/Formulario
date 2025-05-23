const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express(); // <-- Aquí defines app
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/sendForm', async (req, res) => {
  const formData = req.body;

  console.log("Datos recibidos del frontend:", formData);

  try {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzClaOyG2riE9A3cqNUR6U958IvgGfK1yTUZt1mIrDzKzkubk67dixNj_Ws8H9CCkk/exec';

    // Convertir el objeto a query string
    const params = new URLSearchParams(formData);

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()  // enviar como texto url encoded
    });

    const text = await response.text();

    if (response.ok) {
      res.status(200).send({ message: 'Formulario enviado con éxito', response: text });
      console.log("Enviando datos al script:", params.toString());
      console.log("Datos que se enviarán al script:", params.toString());


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
