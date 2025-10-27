const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();
const bcrypt = require('bcrypt')

const register = async (req, res) => {
    try{
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Username and password are required.' });
    }
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
    })
    return res.json({success:true, message:'User registered successfully'})
    } catch (err) {
        console.error('Error registering user:', err);
        return res
        .status(500)
        .json({ success: false, message: 'Server error during registration.' });
    }
}

module.exports = { register }