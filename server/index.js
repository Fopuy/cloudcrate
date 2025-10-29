require('dotenv').config();
const express = require('express');
const app = express();
const path=require('node:path');
const passport = require('passport');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('./generated/prisma')
const cors = require('cors');

const loginRouter = require('./routers/loginRouter')
const registerRouter = require('./routers/registerRouter')
const folderRouter = require('./routers/folderRouter')

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(
    session({
        cookie: {
        maxAge: 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        },
        secret: process.env.SESSION_SECRET || 'defaultkey',
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
}));

app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/login', loginRouter)
app.use('/api/register', registerRouter);
app.use('/api/index', folderRouter);
app.post("/api/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
});

//Server start
const PORT = process.env.PORT;
app.listen( PORT || 3000, () => {
    console.log('Server is running @ http://localhost:' + (PORT || 3000));
})