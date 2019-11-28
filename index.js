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

MongoClient.connect('mongodb+srv://jerebushop-cdzyw.mongodb.net/products', {
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


app.listen(3000);