const url = window.location.href;
let cardSearch;

if (url.includes('?')) {
    cardSearch = url.split('?')[1];
    loadApis(cardSearch);
} else if(url.includes('savedPrices')) {
    loadPrices();
}

async function loadApis(searchParams) {
    // collect api data
    const tcgPlayerPrice = await tcgPlayerAPI(searchParams);
    const cardMarketPrice = await cardMarketAPI(searchParams);
    const scryFall = await scryFallAPI(searchParams);

    // fill in html based on the api results
}

// load in the saved prices
async function loadPrices() {
    // collect the place to put the list for cards and clear it out
    const savedList = document.getElementById('savedList');
    savedList.innerHTML = '';

    const cards = localStorage.getItem('cards').split(',');

    cards.forEach(async (card, cardIndex)=> {
        let listItem = document.createElement('li');
        let removeItem = document.createElement('button');

        // create list content
        let TCGPrice = await tcgPlayerAPI(card);
        let cardMarketPrice = await cardMarketAPI(card);
        listItem.textContent = `${card}: TCG Player: $${TCGPrice} : CardMarket $${cardMarketPrice}`;

        listItem.appendChild(removeItem);
        
        // add button functions
        removeItem.addEventListener('click', ()=> {
            newCards = localStorage.getItem('cards').split(',');
            newCards.splice(cardIndex, 1);
            localStorage.setItem('cards', JSON.stringify(newCards));
            loadPrices();
        });

        // add the list item to the screen
        savedList.appendChild(listItem);
    });
}

// Save the price
async function savePrice() {
    const TCGPrice = document.getElementById('TCGPrice').split('$')[1];
    const CardmarketPrice = document.getElementById('CardmarketPrice').split('$')[1];
    const cardName = document.getElementById('cardName').innerHTML;
    // if there is already a saved card price add to the list
    cards = (localStorage.getItem('cards')) ? localStorage.getItem('cards').split(',').push(cardName) : [cardName];

    localStorage.setItem('cards', JSON.stringify(cards))
}

async function tcgPlayerAPI(query) {
    let price;
    return price;
    
}

async function cardMarketAPI(query) {
    let price;
    return price;
    
}

async function scryFallAPI(query) {
    let image;
    return image;
}