const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient({
  adapter: {
    url: process.env.DATABASE_URL,
  },
});

//Passport Local Strategy
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { username: username }
            });
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user);
        } catch (err){
            console.error('Error in LocalStrategy:', err);
            return done(err);
        }
    })
);

//Session handling
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if(!user) return done(null,false);
        done(null, user);
    } catch (err) { 
        done(err);
    }
});

//Login route
router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err){
        console.error('Authentication error:', err);
        return next(err);
    }
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: info?.message || "Login failed" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        success: true,
        message: "Login successful",
        user: { id: user.id, username: user.username },
      });
    });
  })(req, res, next);
});

module.exports = router;