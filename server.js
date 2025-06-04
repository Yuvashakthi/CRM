const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const billingRoutes = require('./routes/billingRoutes');
const { renderInvoiceView } = require('./controllers/invoiceController');

const indexRoutes = require('./routes/index');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // to serve uploaded files
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

//routes//
app.use('/', clientRoutes);
app.use('/', indexRoutes);
app.use('/', billingRoutes);
app.use('/', require('./routes/clientRoutes'));
app.use("/api/projects", projectRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/', projectRoutes);
app.use(projectRoutes);


app.get('/invoiceView', renderInvoiceView);


// Redirect to dashboard if root is accessed
app.get('/', (req, res) => {
  res.redirect('/dashboard');
})


app.get('/invoice', (req, res) => {
  res.render('invoice'); // No leading slash, no .ejs
});

app.get('/billing', (req, res) => {
  res.render('billing'); // No leading slash, no .ejs
});
//  Start Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

