// Name  // 
const recipientNameInput = document.getElementById('recipient-name')
const recipientNamePreview = document.querySelector('.giftcard-recipient')

// price  // 
const recipientAmountInput = document.getElementById('amount')
const recipientPricePreview = document.querySelector('.giftcard-price')

//color font//
const colorRadios= document.querySelectorAll('input[name="color"]')
//font size //
const fontRadios= document.querySelectorAll('input[name="fontsize"]')

//background color//
const recipientBackgroundPreview = document.querySelector('.giftcard-preview');
const backgroundRadios= document.querySelectorAll('input[name="background"]')

// location //
const locationRadios = document.querySelectorAll('input[name="location"]')

// Name  // 
recipientNameInput.addEventListener('input', ()=> {
    const name = recipientNameInput.value
    if (name==='') {
        recipientNamePreview.textContent = `Destinatario`
    } else {
        recipientNamePreview.textContent = name
    }
    
})
// price  // 

recipientAmountInput.addEventListener('input', () =>{
    const amount = recipientAmountInput.value;
    if (amount === '') {
        recipientPricePreview.textContent = '$0000.-'
    } else{
        recipientPricePreview.textContent = `$${amount}.-`
    }
    
})

//color font//
function updateColor(colorSelection) {
    recipientNamePreview.style.color = colorSelection;on;
}
colorRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        const radioId = radio.id;

        const label = document.querySelector(`label[for="${radioId}"]`);

        const colorDiv = label.querySelector('.color-option');

        const colorValue = window.getComputedStyle(colorDiv).backgroundColor;
        updateColor(colorValue);
    })
});

//background color//

function updateBackgroundColor(colorSelection) {
    recipientBackgroundPreview.style.backgroundColor = colorSelection
}
backgroundRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        const radioId = radio.id;

        const label = document.querySelector(`label[for="${radioId}"]`);

        const colorDiv = label.querySelector('.background-option');

        const colorValue = window.getComputedStyle(colorDiv).backgroundColor;
        updateBackgroundColor(colorValue);
    })
});

//font size//
function updateFontSize(fontSelection) {
    recipientNamePreview.style.fontSize = fontSelection
}
fontRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        const radioId = radio.id;

        const label = document.querySelector(`label[for="${radioId}"]`);

        const fontSpan = label.querySelector('.font-size-option');

        const fontValue = fontSpan.textContent;
        updateFontSize(fontValue);
    })
});

//location//

locationRadios.forEach((radio) => {
    radio.addEventListener('change', ()=> {
    const radioId = radio.id;

    switch (radioId) {
        case 'location-topleft': 
        recipientBackgroundPreview.style.justifyContent = 'flex-start'
        recipientBackgroundPreview.style.alignItems = 'flex-start'
        recipientBackgroundPreview.style.textAlign = 'left'

        recipientPricePreview.style.right = '0.9375em'
        recipientPricePreview.style.left = 'auto'
            break;
        case 'location-topright': 
        recipientBackgroundPreview.style.justifyContent = 'flex-start'
        recipientBackgroundPreview.style.alignItems = 'flex-end'
        recipientBackgroundPreview.style.textAlign = 'right'

        recipientPricePreview.style.left = '0.9375em';
        recipientPricePreview.style.right = 'auto';
            break;
            case 'location-center': 
        recipientBackgroundPreview.style.justifyContent = 'center'
        recipientBackgroundPreview.style.alignItems = 'center'
        recipientBackgroundPreview.style.textAlign = 'center'

        recipientPricePreview.style.left = 'auto'
        recipientPricePreview.style.right = 'auto'
            break;
    }  
    })
    
});