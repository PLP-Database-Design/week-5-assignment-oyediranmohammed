const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if db connects successfully
db.connect((err) => {
    if (err) return console.log('Error connecting to the database');
    console.log("Database connected successfully as", db.threadId);

    // Start the server once the database is connected
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
        app.get('/', (req, res) => {
            res.send('Server started successfully!');
        });
    });
});

// GET endpoint to display patients and providers
app.get('/data', (req, res) => {
    // Query for fetching all patients (Question 1)
    let patientsQuery = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";

    // Query for fetching all providers (Question 2)
    let providersQuery = "SELECT first_name, last_name, provider_specialty FROM providers";

    // Query for fetching patients ordered by their first name (Question 3)
    let patientsFirstnameQuery = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients ORDER BY first_name";

    // Query for fetching all providers by specialty (Question 4)
    let specialtyQuery = "SELECT first_name, last_name, provider_specialty FROM providers ORDER BY provider_specialty";

    // Execute the patients query (Question 1)
    db.query(patientsQuery, (err, patientsResult) => {
        if (err) throw err;

        // Execute the providers query (Question 2)
        db.query(providersQuery, (err, providersResult) => {
            if (err) throw err;

            // Execute the query for patients ordered by first name (Question 3)
            db.query(patientsFirstnameQuery, (err, patientsFirstnameResult) => {
                if (err) throw err;

                 // Execute the providers specialty query (Question 4)
                     db.query(specialtyQuery, (err, specialtyResult) => {
                         if (err) throw err;

                        // Render the EJS template with the query results
                        res.render('data', {
                            patients: patientsResult,
                            providers: providersResult,
                            PatientsFirstname: patientsFirstnameResult,
                            Specialty: specialtyResult
                     });
                });
            });
        });
    });
});
