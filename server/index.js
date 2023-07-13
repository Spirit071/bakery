import express from "express";
import * as dotenv from 'dotenv'
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import sendMail from "./email.js";
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({ origin : '*',
            optionsSuccessStatus: 200
 }))

dotenv.config()


const Order = mongoose.model('Order', new mongoose.Schema({
    name:{
        type: String,
        required: true
    }, 
    order: {
        type: String,
        required: true
    }
}));

app.post('/api/v1/order', async (req, res) => {
    try {
        const { name, order } = req.body;
        const newOrder = await Order.create({
            name, order
        })
        res.status(200).json({ success: true, data: newOrder });
        sendMail('Order', `<h1> ${newOrder.name} </h1> <br/> ordered <h3> ${newOrder.order} </h3>`)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error placing an order' });
        console.error(error.message)
    }
})

app.get('/', async (req, res) => {
    try {
        res.status(200).json({ success: true, data: await Order.find({}) });
      } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching resiurces' });
      }
}) 

mongoose.set('strictQuery', !true)
mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

const db = mongoose.connection

db.on('error', function(err){console.error(err)})
db.once('open', async () =>{
    console.clear()
    const port = 8000
    app.listen(port, () =>{
         console.log(`Connected to mongoose\nhttp://localhost:${port}`)
    })
    await Order.deleteMany({}).then(()=> console.log('Clean'))
})
