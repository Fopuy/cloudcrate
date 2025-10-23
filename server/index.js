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

app.use(express.urlencoded({ extended: true }));
//app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(
    session({
        cookie: {
        maxAge: 60 * 60 * 1000 // ms
        },
        secret: 'your_secret_key',
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

app.listen( process.env.PORT || 3000, () => {
    console.log('Server is running @ http://localhost:' + (process.env.PORT || 3000));
})