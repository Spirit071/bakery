import express from "express";
import * as dotenv from 'dotenv'
import mongoose from "mongoose";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

dotenv.config()

const orderHandler = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    order: {
        type: String,
        required: true
    } 
})

const OrderSchema = mongoose.model('OrderSchema', orderHandler);

app.post('/api/v1/order', async (req, res) => {
    console.log('fired')
    try {
        const { name, order } = req.body;
        console.log('The error is the creation uwu')
        const newOrder = new OrderSchema({
            name: name,
            order: order
          })          
        await newOrder.save()
        res.status(200).json({ success: true, data: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error placing an order' });
        console.error(error.message)
    }
})

app.get('/api/v1/order', async (req, res) => {
    try {
        const orders = await OrderSchema.find({});
        res.status(200).json({ success: true, data: orders });
      } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching resiurces' });
      }
})

app.get('/', (req, res) => {
    res.send('Alive')
})

mongoose.set('strictQuery', !true)
mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

const db = mongoose.connection

db.on('error', function(err){console.error(err)})
db.once('open', () =>{
    console.clear()
    const port = 80
    app.listen(port, () =>{
         console.log(`Connected to mongoose\nhttp://localhost:${port}`)
    })
})
