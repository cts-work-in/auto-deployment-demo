const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");
const puppeteer = require('puppeteer');
const path = require('path');

// Uncomment if using MongoDB
// const mongooseConnection = require("./src/Helpers/mongoose-connection.jsx");

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Import Routes
const authRouter = require('./src/Routes/authRoutes.jsx');
const userRouter = require('./src/Routes/userRoutes.jsx');

// Use Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);

// PDF Conversion Endpoint
app.post('/convert', async (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).send('Data is required');
    }

    let browser;
    try {
        // Render the EJS template to HTML
        const htmlContent = await new Promise((resolve, reject) => {
            app.render('template', data, (err, html) => {
                if (err) reject(err);
                else resolve(html);
            });
        });

        // Launch the browser
        browser = await puppeteer.launch({
            headless: true, // Set to true for production
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4' });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('An error occurred while generating the PDF');
    } finally {
        // Ensure the browser is closed properly
        if (browser) {
            await browser.close();
        }
    }
});

// Uncomment if using MongoDB
// mongooseConnection();

// Export the app for testing
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(8000, () => {
        console.log("Server is listening on port 8000");
    });
}
