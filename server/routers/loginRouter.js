const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

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
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });
        done(null, user);
    } catch (err) { 
        done(err);
    }
});

router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
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