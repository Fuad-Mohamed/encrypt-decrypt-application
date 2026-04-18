const express = require('express');
const path    = require('path');

const indexRouter = require('./routes/index');

const app  = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use((req, res) => {
  res.status(404).render('error', { title: '404', message: 'Page not found.' });
});

app.use((err, req, res, next) => {
  res.status(500).render('error', { title: 'Error', message: err.message });
});

app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
