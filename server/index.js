const express = require('express')
const app = express();
const path = require('node:path')
const cors = require('cors')
const registerRouter = require('./routers/registerRouter')

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST'],
    credentials: true
}))

app.use('/api/register', registerRouter)

app.listen (process.env.PORT || 3000, () =>{
    console.log('Server is running @ http://localhost:' + (process.env.PORT || 3000));
})