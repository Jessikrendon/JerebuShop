let filterType;
let filter;

let itemName;

[...document.querySelectorAll('#filters .type li')].forEach((e, i) => {
    e.addEventListener('click', () => {
        filterType = "type";
        filter = e.innerHTML.toUpperCase();
        updateItems();
    });
});

[...document.querySelectorAll('#filters .year li')].forEach((e, i) => {
    e.addEventListener('click', () => {
        filterType = "year";
        filter = e.innerHTML.toUpperCase();
        updateItems();
    });
});

[...document.querySelectorAll('#filters .price li')].forEach((e, i) => {
    e.addEventListener('click', () => {
        filterType = "price";
        filter = e.innerHTML.split('-')[1].split('$')[1].toUpperCase();
        updateItems();
    });
});

function updateItems() {
    let url = '/shop/updateItems?';
    url = url + "&" + filterType + '=' + filter;

    console.log(filterType, filter, url);

    fetch(url, {
            method: 'GET', // or 'PUT'
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(newdiscs => {
            document.getElementById('items').innerHTML = "";
            console.log(newdiscs);
            if (newdiscs.length != 0) {
                newdiscs.forEach(disc => {
                    createItem(disc);
                });
            } else {
                var div = document.createElement('div');
                div.setAttribute('class', 'warning');

                var p = document.createElement('p');
                p.setAttribute('class', 'warning__text');
                p.innerHTML = '<strong>UPS!</strong> apparently there is no items with the specifications you are looking for.<br>Try searching again with different filters.'

                div.appendChild(p);
                document.querySelector('#items').appendChild(div);
            }
        });
}

function createItem(item) {
    let li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('dataname', item.name);


    let img = document.createElement('img');
    img.setAttribute('src', '../' + item.imagePath);
    img.setAttribute('alt', item.name + ' image');

    let div = document.createElement('div');
    div.setAttribute('class', 'info');

    let h2 = document.createElement('h2');
    h2.innerHTML = item.name;

    let p = document.createElement('p');
    p.setAttribute('class', 'description');
    p.innerHTML = item.description;

    let h3 = document.createElement('h3');
    h3.setAttribute('class', 'price');
    h3.innerHTML = '$' + item.price;

    let i = document.createElement('i');
    i.setAttribute('class', 'fas fa-shopping-cart');

    div.appendChild(h2);
    div.appendChild(p);
    div.appendChild(h3);

    li.appendChild(img);
    li.appendChild(div);
    li.appendChild(i);

    let url = '';
    lastItemSelected = '';

    li.addEventListener('click', () => {
        console.log("holaaaa")
        if (li.className === 'item') {
            url = '/addToCart?';
            li.className = 'item added';
        } else {
            url = '/removeFromCart?';
            li.className = 'item';
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'name='+item.name,
          })
          .then(res => res.text())
          .catch(error => console.error('Error:', error))
    });

    document.querySelector('#items').appendChild(li);
}

[...document.querySelectorAll('#items .item')].forEach((e, i) => {
    let url = '';
    lastItemSelected = '';

    e.addEventListener('click', () => {
        itemName = e.children[1].children[0].innerHTML;
        if (e.className === 'item') {
            url = '/addToCart?';
            e.className = 'item added';
        } else {
            url = '/removeFromCart?';
            e.className = 'item';
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'name='+itemName,
          })
          .then(res => res.text())
          .catch(error => console.error('Error:', error))
    });
});