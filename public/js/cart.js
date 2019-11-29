let url = '/getCartItems';

fetch(url, {
        method: 'GET', // or 'PUT'
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(items => getTotal(items));

let totalPrice = 0;
let totalItems = 0;

function getTotal(items) {
    console.log(items);
    if (items.length != 0) {
        items.forEach(item => {
            createitemCart(item);
            totalPrice += item.price;
        });
        totalItems = items.length;
    } else {
        createWarningMessage();
    }
    document.querySelector('#cart .price').innerHTML = '(' + totalItems + ' items) <span>$' + totalPrice + '</span>'
}

function createWarningMessage() {
    console.log("oh no");
}

function updateItems() {

    let url = '/cart/getCartItems';
    fetch(url, {
            method: 'GET', // or 'PUT'
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(items => getTotal(items));
}

function getNewTotal(items) {
    console.log(items);
    if (items.length != 0) {
        items.forEach(item => {
            createitemCart(item);
            totalPrice += item.price;
        });
    } else {
        createWarningMessage();
    }
    document.querySelector('#cart .price').innerHTML = '(' + items.length + ' items) <span>$' + totalPrice + '</span>'
}

function createitemCart(item) {

    let li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('dataname', item.name);

    li.addEventListener('click', () => {

        fetch('/removeFromCart?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'name=' + item.name,
            })
            .then(res => res.text())
            .catch(error => console.error('Error:', error))

        updateItems();
        totalItems --;
        totalPrice -= item.price;
        document.querySelector('#cart .price').innerHTML = '(' + totalItems + ' items) <span>$' + totalPrice.toFixed(2) + '</span>'
        li.remove();
    })

    let img = document.createElement('img');
    img.setAttribute('src', '../' + item.imagePath);
    img.setAttribute('alt', item.name + ' image');

    let div = document.createElement('div');
    div.setAttribute('class', 'info');

    let h2 = document.createElement('h2');
    h2.innerHTML = item.name;

    let h3 = document.createElement('h3');
    h3.setAttribute('class', 'price');
    h3.innerHTML = '$' + item.price;

    let i = document.createElement('i');
    i.setAttribute('class', 'fas fa-times');

    div.appendChild(h2);
    div.appendChild(h3);

    li.appendChild(img);
    li.appendChild(div);
    li.appendChild(i);

    document.querySelector('#items').appendChild(li);
}