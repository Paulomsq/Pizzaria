let modalQt = 1;
const c = (el) => document.querySelector(el);
let cart = [];
let modalKey = 0;

//O item map percorre a variável (no caso o JSON) item a item
pizzaJson.map ((item, id) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', id);
    
    pizzaItem.querySelector('.pizza-item--img img').src = item.img ;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[2].toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
   
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2){
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML =pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt; 

        c('.pizzaWindowArea').style.display = "flex";
        c('.pizzaWindowArea'). style.opacity = 0;
        setTimeout(()=> {
            c('.pizzaWindowArea'). style.opacity = 1;
        }, 200);
        
    });
    c('.pizza-area').append(pizzaItem);
});


//Eventos do Modal

let precoAtual = pizzaJson[modalKey].price;

const fechaModal = () =>{

    c('.pizzaWindowArea').style.opacity = 0;

    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
};

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach ((item) =>{
    item.addEventListener('click', fechaModal)
});

c('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt; 
     //***************tentativa de mudar o preço ao adicionar qtd********
     //consegui =)
     atualizaPreco();
    

    
});

c('.pizzaInfo--qtmenos').addEventListener('click', () =>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
        atualizaPreco();
    };
    
});

const atualizaPreco = () =>{
    
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    let precoAtual = parseFloat(pizzaJson[modalKey].price[size]);
    let novoPreco = parseFloat(precoAtual * modalQt);
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${novoPreco.toFixed(2)}`;
};

document.querySelectorAll('.pizzaInfo--size').forEach ((size, sizeIndex) =>{
    size.addEventListener('click', (e) =>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        c('.pizzaInfo--qt').innerHTML = '1';
        modalQt = 1;
    });
    size.addEventListener('click', ()=>{
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[sizeIndex].toFixed(2)}`
    });
});

c('.pizzaInfo--addButton').addEventListener('click', () =>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let ID = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item) => {return item.ID == ID}) 

    if(key > -1){
        cart[key].qt += modalQt;
    }else {

    cart.push({
        ID,
        id : pizzaJson[modalKey].id,
        size,
        qt : modalQt
    })};
    
    fechaModal();
    atualizarCart();
});

const atualizarCart = () =>{

    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');

        c('.cart').innerHTML = "";

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        let pizzaSizePrec;
        
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) =>{
                return item.id == cart[i].id;
            });

            

            let cartItem = c('.models .cart--item').cloneNode(true);
            
            

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'Pequena';
                    pizzaSizePrec = pizzaItem.price[0];
                    break;
                case 1:
                    pizzaSizeName = 'Méda';
                    pizzaSizePrec = pizzaItem.price[1];
                    break;
                case 2:
                    pizzaSizeName = 'Grande';
                    pizzaSizePrec = pizzaItem.price[2];
                    break;

            };

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if(cart[i].qt > 1){
                    cart[i].qt--;

                }else{
                    cart.splice(i, 1);
                }
                atualizarCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qt++;
                atualizarCart();
            });

            c('.cart').append(cartItem);
            subtotal += pizzaSizePrec * cart[i].qt;
        };

        desconto = subtotal * 0.1;
        
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    }else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';

    }
}

c('.menu-openner').addEventListener('click', () =>{
    if(cart.length > 0){    
        c('aside').style.left = 0;
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})