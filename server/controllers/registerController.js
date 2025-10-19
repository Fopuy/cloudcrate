const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();
const bcrypt = require('bcrypt')

const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
    })
    res.json({success:true, message:'User registered successfully'})
}

module.exports = { register }