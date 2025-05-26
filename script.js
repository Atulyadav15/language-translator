const leftArea = document.getElementById('left-area');
const rightArea = document.getElementById('right-area');
const translateBtn = document.getElementById('translate-btn');
const clearBtn = document.getElementById('clear-btn');
const leftCopyBtn = document.getElementById('left-copy');
const rightCopyBtn = document.getElementById('right-copy');
const alertMsg = document.getElementById('alert');
const leftMicro = document.getElementById('left-micro');
const rightMicro = document.getElementById('right-micro');
const swapBtn = document.getElementById('swap-languages');
const historyList = document.getElementById('history-list');
const suggestionsList = document.getElementById('suggestions-list');

let speech = new SpeechSynthesisUtterance();
let history = []; 
let suggestions = []; 
let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
};

swapBtn.addEventListener('click', () => {
    const fromLang = document.getElementById('translate-from');
    const toLang = document.getElementById('translate-to');
    [fromLang.value, toLang.value] = [toLang.value, fromLang.value]; // Swap the values
});


translateBtn.addEventListener('click', () => {
    const fromLang = document.getElementById('translate-from').value;
    const toLang = document.getElementById('translate-to').value;

    if (!leftArea.value.trim()) {
        showAlert("Please enter text to translate.");
        return;
    }

    if (fromLang === toLang) {
        showAlert("You cannot translate to the same language.");
        return;
    }

    translate(leftArea.value, fromLang, toLang);
});


const translate = async (text, fromLang, toLang) => {
    try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLang}|${toLang}`);
        const data = await res.json();
        rightArea.value = data.responseData.translatedText;

        addTranslationToHistory(text, data.responseData.translatedText, fromLang, toLang);

    } catch (error) {
        showAlert("An error occurred while translating. Please try again.");
    }
};


const addTranslationToHistory = (original, translated, fromLang, toLang) => {
    const historyItem = `${original} → ${translated} [${fromLang} → ${toLang}]`;
    history.unshift(historyItem); 
    
    if (history.length > 5) history.pop(); 

    
    updateHistoryUI();

 
    addLanguageSuggestion(fromLang);
    addLanguageSuggestion(toLang);
};


const updateHistoryUI = () => {
    historyList.innerHTML = '';
    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = item;
        historyList.appendChild(listItem);
    });
};

const addLanguageSuggestion = (lang) => {
    if (!suggestions.includes(lang)) {
        suggestions.push(lang);
        const suggestionItem = document.createElement('li');
        suggestionItem.classList.add('list-group-item');
        suggestionItem.textContent = lang;
        suggestionsList.appendChild(suggestionItem);
    }
};


const showAlert = (message) => {
    alertMsg.innerHTML = message;
    alertMsg.style.display = "block";
    setTimeout(() => {
        alertMsg.style.display = "none";
    }, 2000);
};


leftCopyBtn.addEventListener('click', () => {
    if (leftArea.value.trim()) {
        navigator.clipboard.writeText(leftArea.value);
        showAlert("Text copied to clipboard.");
    } else {
        showAlert("Left text area is empty.");
    }
});


rightCopyBtn.addEventListener('click', () => {
    if (rightArea.value.trim()) {
        navigator.clipboard.writeText(rightArea.value);
        showAlert("Text copied to clipboard.");
    } else {
        showAlert("Right text area is empty.");
    }
});


clearBtn.addEventListener('click', () => {
    leftArea.value = "";
    rightArea.value = "";
    alertMsg.style.display = "none";
});


leftMicro.addEventListener('click', () => {
    if (leftArea.value.trim()) {
        speech.text = leftArea.value;
        const voice = voices.find(v => v.lang === document.getElementById('translate-from').value);
        speech.voice = voice;
        window.speechSynthesis.speak(speech);
    } else {
        showAlert("Nothing to speak.");
    }
});
rightMicro.addEventListener('click', () => {
    if (rightArea.value.trim()) {
        speech.text = rightArea.value;
        const voice = voices.find(v => v.lang === document.getElementById('translate-to').value);
        speech.voice = voice;
        window.speechSynthesis.speak(speech);
    } else {
        showAlert("Nothing to speak.");
    }
});
