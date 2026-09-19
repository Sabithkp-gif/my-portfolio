import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const dataDir = path.join(publicDir, 'data');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(publicDir));

// Helper to read JSON data safely
const readJsonFile = (fileName) => {
  const filePath = path.join(dataDir, fileName);
  try {
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
  }
  return null;
};

// API: Get all projects
app.get('/api/projects', (req, res) => {
  const projects = readJsonFile('projects.json');
  if (!projects) {
    return res.status(500).json({ error: 'Failed to load projects data' });
  }
  res.json(projects);
});

// API: Get single project by ID
app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const projects = readJsonFile('projects.json');
  if (!projects) {
    return res.status(500).json({ error: 'Failed to load projects data' });
  }
  const project = projects.find((p) => p.id.toLowerCase() === id.toLowerCase());
  if (!project) {
    return res.status(404).json({ error: `Project '${id}' not found` });
  }
  res.json(project);
});

// API: Get skills
app.get('/api/skills', (req, res) => {
  const skills = readJsonFile('skills.json');
  if (!skills) {
    return res.status(500).json({ error: 'Failed to load skills data' });
  }
  res.json(skills);
});

// API: Get journey
app.get('/api/journey', (req, res) => {
  const journey = readJsonFile('journey.json');
  if (!journey) {
    return res.status(500).json({ error: 'Failed to load journey data' });
  }
  res.json(journey);
});

// API: Contact form submission with validation
app.post('/api/contact', (req, res) => {
  const { name, email, message, subject } = req.body;

  // Validation
  const errors = {};
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Please provide a valid name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'Please provide a detailed message (at least 10 characters).';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  const sanitizedData = {
    name: name.trim(),
    email: email.trim(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress
  };

  console.log('📬 [Contact Submission Received]:', sanitizedData);

  // Return success
  return res.status(200).json({
    success: true,
    message: 'Thank you, Sabith has received your message. Expect a response shortly.',
    data: {
      name: sanitizedData.name,
      timestamp: sanitizedData.timestamp
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Fallback for HTML pages
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sabith Portfolio Server running at http://localhost:${PORT}`);
});
