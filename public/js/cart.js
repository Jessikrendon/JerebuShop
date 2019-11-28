var url = '/cart/getCartItems';
    fetch(url, {
            method: 'GET', // or 'PUT'
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(discitems => evaluateDiscItems(discitems));

    var totalprice = 0;

    function evaluateDiscItems(discitems) {
        console.log(discitems);
        if (discitems.length != 0) {
            discitems.forEach(disc => {
                createDiscCart(disc);
                totalprice += disc.price;
            });
        } else {
            createWarningMessage();
        }
        document.querySelector('.value__desc__itemsvalue').innerHTML = '(' + discitems.length + ' items) <span>$' + totalprice + '</span>'
    }

    function createWarningMessage() {
        var div = document.createElement('div');
        div.setAttribute('class', 'warning');

        var p = document.createElement('p');
        p.setAttribute('class', 'warning__text');
        p.innerHTML = '<strong>UPS!</strong> you have not added any disc to your shopping cart.<br>Go to the Discography section and select the discs you want to buy.'

        div.appendChild(p);
        document.querySelector('.cartitems').appendChild(div);
    }