const express = require('express');
const app = express();
const cors=require('cors')
const port = 3001;

app.use(express.json());
app.use(cors())

const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'test',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});

function convertToCSV(data) {
  if (!data || data.length === 0) {
    return '';
  }

  const header = Object.keys(data[0]).join(',') + '\n';
  const body = data.map((row) => Object.values(row).join(',')).join('\n');
  return header + body;
}

app.post('/api/employees', (req, res) => {
    const { name, email, department } = req.body;
    console.log('Received data:', name, email, department); 
    const query = 'INSERT INTO employees (name, email, department) VALUES (?, ?, ?)';
    
    db.query(query, [name, email, department], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      } else {
        console.log('Employee added successfully');
        res.status(201).json({ message: 'Employee added successfully' });
      }
    });
  });

app.get('/api/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } else {
      const csvData = convertToCSV(results);
      res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
      res.setHeader('Content-Type', 'text/csv');
      res.status(200).send(csvData);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});