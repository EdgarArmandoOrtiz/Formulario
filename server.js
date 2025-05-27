const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configura CORS para tu dominio y métodos permitidos
const corsOptions = {
  origin: 'https://edgararmandoortiz.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

// Usa CORS en todas las rutas
app.use(cors(corsOptions));

// Responde explícitamente a preflight OPTIONS para todas las rutas
app.options('*', cors(corsOptions), (req, res) => {
  res.sendStatus(204);
});

// Ruta para procesar formulario
app.post('/sendForm', async (req, res) => {
  const formData = req.body;
  console.log("📥 Datos recibidos:", formData);

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
      console.log("✅ Datos enviados al script correctamente.");
      res.status(200).send({ message: 'Formulario enviado con éxito', response: text });
    } else {
      console.error("❌ Error al enviar al script:", text);
      res.status(response.status).send({ error: 'Error al enviar al script', details: text });
    }

  } catch (error) {
    console.error("🔥 Error interno:", error);
    res.status(500).send({ error: 'Error del servidor', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
