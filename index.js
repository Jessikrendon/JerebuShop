const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static('public'));

app.set('view engine', 'handlebars');
app.engine('handlebars', hbs({
    defaultLayout: 'main',
    partialsDir: [
        path.join(__dirname, 'views/partials'),
    ]
}));

MongoClient.connect('mongodb+srv://jerebu-qxyha.mongodb.net/products', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auth: {
            user: 'JerebuAdmin',
            password: 'JerebuAdmin123'
        }
    },
    (err, client) => {
        if (err) throw err;
        db = client.db('products');
        app.listen(process.env.PORT || 1234);
    },
);

const url = 'mongodb://localhost:27017';
const dbName = 'linkinpark';
const client = new MongoClient(url);
let db = null;

app.get('/', (req, res) => {
    //res.render('home');
    res.redirect('shop')
});

app.get('/shop', (req, res) => {
    const collection = db.collection('All').find({});
    collection.toArray((err, docs) => {
        let product_items = {
            filter: "ALL",
            item: docs,
        }
        res.render('shop', product_items);
    });
});

app.post('/shop/addToCart', (req, res) => {
    let itemName = req.body.name;
    const collection = db.collection('All');
    collection.find({}).toArray((err, docs) => {
        let item = docs.find((obj) => {
            return obj.name == itemName;
        });
        db.collection('Cart').insertOne(item);
    });
    console.log('Added');
});

app.post('/shop/removeFromCart', (req, res) => {
    let itemName = req.body.name;
    const collection = db.collection('All');
    collection.find({}).toArray((err, docs) => {
        let item = docs.find((obj) => {
            return obj.name == itemName;
        });
        db.collection('Cart').deleteOne(item);
    });
    console.log('Removed');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/cart/getdiscscart', (req, res) => {
    const collection = db.collection('cartdiscs');
    collection.find({}).toArray((err, docs) => {
        res.json(docs);
    });
});

app.post('/cart/removecart', (req, res) => {
    let discname = req.body.disc;
    const collection = db.collection('discs');
    collection.find({}).toArray((err, docs) => {
        let disc = docs.find((obj) => {
            return obj.name == discname;
        });
        db.collection('cartdiscs').deleteOne(disc);
    });
    res.send('REMOVED');
});

app.get('/shop/updateItems', (req, res) => {
    console.log(req.query.year);
    let type = req.query.type;
    let year = parseInt(req.query.year);
    let price = parseFloat(req.query.price);
    const collection = db.collection('All');
    collection.find({}).toArray((err, docs) => {
        let filteredItems = docs;
        if (req.query.type != undefined) {
            console.log('entra a type ****')
            let filter = filteredItems.filter(item => item.type == type);
            filteredItems = filter;
        }
        if (req.query.year != undefined) {
            console.log('entra a year ****')
            let filter = filteredItems.filter(item => item.year == year);
            filteredItems = filter;
        }
        if (req.query.price != undefined) {
            console.log('entra a price ****')
            let filter = filteredItems.filter(item => item.price >= price);
            filteredItems = filter;
        }
        res.json(filteredItems);
    });
});

app.get('/checkout', (req, res) => {
    const collection = db.collection('cartdiscs');
    collection.find({}).toArray((err, docs) => {
        let price = 0;
        docs.forEach(element => {
            price += element.price;
        });
        let discs_items = {
            totalprice: price,
            discs: docs,
        }
        res.render('checkout', discs_items);
    });
});

app.listen(3000);