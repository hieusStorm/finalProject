const url = window.location.href;
let cardSearch;

if (url.includes('?')) {
    cardSearch = new URLSearchParams(window.location.search);
    loadApis(cardSearch.get("cardSearch"));
    document.getElementById("save").addEventListener("click", savePrice);

} else if(url.includes('savedPrices')) {
    loadPrices();
}

async function loadApis(searchParams) {
    console.log(searchParams);
    // collect api data
    const magicTheGathering = await magicTheGatheringAPI(searchParams);
    const scryFall = await scryFallAPI(searchParams);

    // fill in html based on the api results
    const cardName = document.getElementById("cardName");
    const cardPrice = document.getElementById("price");
    const cardImage = document.querySelector("img");

    cardName.innerHTML = decodeURIComponent(searchParams);
    cardPrice.innerHTML = `$${scryFall}`;
    cardImage.alt = `Image of ${decodeURIComponent(searchParams)}`;
    cardImage.src = magicTheGathering;
}

// load in the saved prices
async function loadPrices() {
    // collect the place to put the list for cards and clear it out
    const savedList = document.getElementById('savedList');
    savedList.innerHTML = '';

    const cards = JSON.parse(localStorage.getItem('cards'));

    cards.forEach(async (card, cardIndex)=> {
        let listItem = document.createElement('li');
        let removeItem = document.createElement('button');

        // create list content
        let cardPrice = await scryFallAPI(card);
        listItem.textContent = `${card}:  $${cardPrice}`;

        removeItem.textContent = "X";
        listItem.appendChild(removeItem);
        
        // add button functions
        removeItem.addEventListener('click', ()=> {
            newCards = JSON.parse(localStorage.getItem('cards'));
            newCards.splice(cardIndex, 1);
            localStorage.setItem('cards', JSON.stringify(newCards));
            loadPrices();
        });

        // add the list item to the screen
        savedList.appendChild(listItem);
    });
}

// Save the price
function savePrice() {
    const cardName = document.getElementById('cardName').innerHTML;
    // if there is already a saved card price add to the list
    cards = (localStorage.getItem('cards')) ? JSON.parse(localStorage.getItem('cards').split(',')): [];
    if (!cards.includes(cardName)) {
        cards.push(cardName);   
    }
    localStorage.setItem('cards', JSON.stringify(cards))
}

// Get the image of the card and return the image url
async function magicTheGatheringAPI(query) {
    try {
        let urlSafeQuery = encodeURIComponent(query);
        const response = await fetch(`https://corsproxy.io/?https://api.magicthegathering.io/v1/cards?name=${urlSafeQuery}`);
        const data = await response.json();
        const card = (data.cards[0]) ? data.cards[0] : {"imageUrl" : "can not find card"};
        const imageURL = card.imageUrl;
        return imageURL;
        
    } catch (error) {
        console.error(error);
        return error;
    }
}

// get the card price and return it
async function scryFallAPI(query) {
    try {
        let urlSafeQuery = encodeURIComponent(query);
        const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${urlSafeQuery}`);
        const data = await response.json();
        const price = data.prices.usd || "N/A";

        return price;
    } catch (error) {
        console.error(error);

        return "There was an error getting the card";
    }
}