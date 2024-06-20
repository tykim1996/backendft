const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const passport = require('./config/passport');
require('dotenv').config();
const routes = require('./routes');
const app = express();
const db = require('./database/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(session({
  saveUninitialized: false,
  resave: true,
  store: mongoStore.create({ client: db.getMongoClient() }),
  secret: 'wiserobot-pliable.io',
  cookie: { httpOnly: true, secure: false, maxAge: (5 * 60 * 60 * 1000 ) }
})); // session secret
const cors = require('cors');
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true
}));
//app.use(cors());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

const port = process.env.PORT;
app.get('/', (req, res) => {
  res.send('Hello from the basic Node.js project!');
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`The application is running at http://localhost:${port}`);
});
