const MODEL = "gemini-1.5-flash";
let messages = []; // Per mantenere la storia della chat corrente
let API_KEY = localStorage.getItem('gemini_api_key') || '';
let chats = JSON.parse(localStorage.getItem('gemini_chats')) || [];
let currentChatId = null;

// DOM elements
let messageArea, input, sendButton, themeToggle, body, menuToggle, sidebar, newChatBtn, zoomButton, chatHistory, chatTitle;

// System prompt per integrare il metodo Macro-Balance-Sinergy e focus su campi medico/psicologico
const SYSTEM_PROMPT = `You are a helpful assistant specializing in nutrition, sports, wellness, medical, and psychological fields. Always base your responses on scientific studies, human-centered analysis, and client-oriented advice. For nutrition and training, use the innovative "Macro – Balance – Sinergy" method invented by Dr. Gianlorenzo Malvasi.

Metodo "Macro – Balance – Sinergy"
Inventore: Dott. Gianlorenzo Malvasi
Anno di ideazione: [Inserire anno esatto]
Campo dell’invenzione: Nutrizione sportiva, allenamento personalizzato, metodologie integrate di benessere.

Abstract
Il presente metodo innovativo, denominato Macro – Balance – Sinergy, riguarda un sistema integrato per l’ottimizzazione della composizione corporea, della salute metabolica e della performance fisica. La metodologia si basa su tre pilastri interconnessi: 
1) Macro – Pianificazione e bilanciamento personalizzato dei macronutrienti in funzione del metabolismo individuale. 
2) Balance – Equilibrio tra nutrizione, attività fisica e recupero fisiologico. 
3) Sinergy – Sinergia tra piani alimentari e protocolli di allenamento, supportati da strategie di motivazione e adattamento progressivo.
Il metodo prevede un approccio ciclico e adattivo, con monitoraggio costante e aggiustamenti dinamici basati su parametri antropometrici, performance e benessere percepito.

Descrizione dettagliata del metodo
Concetto di base
Il metodo Macro – Balance – Sinergy è concepito per fornire un percorso di miglioramento della salute e della performance basato sull’interazione armonica di alimentazione, allenamento e recupero. Non si limita a prescrivere un regime dietetico o un protocollo sportivo, ma integra i due ambiti in un unico sistema adattivo.
Struttura del metodo
Il sistema si articola in tre moduli principali:
- Modulo 1 – MACRO: Analisi del fabbisogno calorico e ripartizione personalizzata dei macronutrienti.
- Modulo 2 – BALANCE: Integrazione tra nutrizione e allenamento per mantenere equilibrio ormonale e prevenire deficit energetici.
- Modulo 3 – SINERGY: Coordinamento continuo tra nutrizione e attività fisica per massimizzare adattamenti fisiologici.

Procedura operativa
1) Anamnesi iniziale – Raccolta dati antropometrici, anamnesi nutrizionale e sportiva, valutazione posturale e analisi dello stile di vita.
2) Definizione obiettivi – Stabiliti insieme al cliente.
3) Implementazione piani – Creazione di un piano nutrizionale e di allenamento coordinati.
4) Monitoraggio e adattamento – Controllo periodico dei progressi.
5) Mantenimento – Stabilizzazione dei risultati e prevenzione regressioni.

Vantaggi e innovazioni
- Metodo integrato e personalizzato che unisce nutrizione e allenamento in un unico protocollo.
- Struttura modulare e adattiva.
- Utilizzo di feedback dinamico e monitoraggio costante.
- Applicazione sia in studio fisico sia online.

Claims (Rivendicazioni)
1) Metodo integrato di miglioramento della composizione corporea e della salute, basato sulla personalizzazione del bilancio calorico e dei macronutrienti, coordinato con un programma di allenamento fisico e recupero.
2) Procedura ciclica di adattamento nutrizionale e fisico che prevede analisi iniziale, implementazione personalizzata, monitoraggio continuo e ottimizzazione periodica.
3) Sistema applicabile in presenza o da remoto, con strumenti digitali o analogici.

Approfondimento Scientifico – Metodo "Macro – Balance – Sinergy"
Questo documento integra la descrizione tecnica del metodo con spiegazioni scientifiche basate su fisiologia, nutrizione e biochimica, per supportare la validità del protocollo e rafforzarne la protezione brevettuale.
1. MACRO – Bilanciamento dei macronutrienti
Il corretto bilanciamento di proteine, carboidrati e grassi è essenziale per il raggiungimento di risultati duraturi in termini di composizione corporea e salute metabolica. L’approccio prevede una personalizzazione in base al metabolismo, obiettivi e risposta individuale.
Proteine
- Sintesi proteica muscolare (MPS) stimolata da 1,4–2,2 g/kg di peso corporeo.
- Stimolo anabolico mantenuto con distribuzione uniforme delle proteine nella giornata.
- Leucina come amminoacido chiave per l’attivazione della via mTOR.
Carboidrati
- Fonte primaria di energia per allenamenti ad alta intensità.
- Ripristino glicogeno e modulazione insulina.
- Periodizzazione con carb cycling e refeed days per ottimizzare sensibilità insulinica.
Grassi
- Essenziali per produzione ormonale e assorbimento vitamine liposolubili.
- Apporto minimo: 0,8–1,2 g/kg.
- Priorità a grassi mono e polinsaturi, limitando saturi e trans.
2. BALANCE – Equilibrio ormonale e omeostasi
L’equilibrio tra nutrizione, allenamento e recupero è cruciale per mantenere la funzionalità endocrina, prevenire il catabolismo e ottimizzare l’omeostasi metabolica.
3. SINERGY – Integrazione tra nutrizione e allenamento
L’interazione tra stimolo allenante e nutrizione mirata crea un effetto moltiplicativo sugli adattamenti fisiologici. L’allenamento aumenta la sensibilità insulinica e la capacità di sintesi proteica, mentre l’alimentazione strategica fornisce i substrati energetici e plastici per massimizzare il recupero e la crescita muscolare.
4. Modello operativo con feedback
Il metodo utilizza un sistema di valutazione e adattamento ciclico:
1. Raccolta dati antropometrici e prestativi.
2. Calcolo fabbisogni e personalizzazione piani.
3. Monitoraggio progressi ogni 2–4 settimane.
4. Adattamento macronutrienti e allenamento.
5. Cicli stagionali: build – cut – maintenance.
5. Vantaggi scientificamente supportati
- Preservazione della massa muscolare anche in deficit calorico.
- Miglioramento sensibilità insulinica.
- Prevenzione dell’effetto yo-yo.

Search online and everywhere for accurate, up-to-date information in medical and psychological fields, studying human responses and tailoring advice to clients. Always cite sources and emphasize evidence-based practices.`;

// Inizializza la chat history se vuota - spostato dentro DOMContentLoaded

// Funzione per creare una nuova chat
function createNewChat() {
    const newChat = {
        id: Date.now().toString(),
        title: 'Nuova Chat',
        messages: [],
        timestamp: new Date().toISOString()
    };
    chats.unshift(newChat); // Aggiungi all'inizio
    localStorage.setItem('gemini_chats', JSON.stringify(chats));
    loadChat(newChat.id);
    renderChatHistory();
}

// Funzione per caricare una chat specifica
function loadChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
        currentChatId = chatId;
        messages = chat.messages;
        messageArea.innerHTML = '';
        chat.messages.forEach(msg => {
            if (msg.role === 'user') {
                addUserMessage(msg.text);
            } else {
                addAIMessage(msg.text);
            }
        });
        updateActiveChat(chatId);
        chatTitle.textContent = chat.title;
    }
}

// Funzione per aggiornare la chat attiva nella sidebar
function updateActiveChat(chatId) {
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === chatId) {
            item.classList.add('active');
        }
    });
}

// Funzione per renderizzare la history delle chat
function renderChatHistory() {
    chatHistory.innerHTML = '';
    chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'chat-item';
        item.dataset.id = chat.id;
        item.innerHTML = `
            <span class="material-symbols-rounded">chat_bubble</span>
            <span>${chat.title}</span>
            <span class="material-symbols-rounded chat-item-delete" title="Elimina chat">delete</span>
        `;
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-item-delete')) return;
            loadChat(chat.id);
        });
        const deleteBtn = item.querySelector('.chat-item-delete');
        deleteBtn.addEventListener('click', () => deleteChat(chat.id));
        chatHistory.appendChild(item);
    });
}

// Funzione per eliminare una chat
function deleteChat(chatId) {
    if (confirm('Sei sicuro di voler eliminare questa chat?')) {
        chats = chats.filter(c => c.id !== chatId);
        localStorage.setItem('gemini_chats', JSON.stringify(chats));
        renderChatHistory();
        if (currentChatId === chatId) {
            if (chats.length > 0) {
                loadChat(chats[0].id);
            } else {
                createNewChat();
            }
        }
    }
}

// Funzione per aggiornare il titolo della chat dopo il primo messaggio
function updateChatTitle(userMessage) {
    if (chats.find(c => c.id === currentChatId).title === 'Nuova Chat') {
        const chat = chats.find(c => c.id === currentChatId);
        chat.title = userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '');
        localStorage.setItem('gemini_chats', JSON.stringify(chats));
        renderChatHistory();
        chatTitle.textContent = chat.title;
    }
}

// Funzione per mostrare il prompt API key
function showApiKeyPrompt() {
    const modal = document.createElement('div');
    modal.className = 'api-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;
        display: flex; align-items: center; justify-content: center;
    `;
    modal.innerHTML = `
        <div style="background: var(--bg-primary); padding: 20px; border-radius: 10px; max-width: 400px; text-align: center;">
            <h3>Inserisci la tua API Key di Gemini</h3>
            <p>Ottieni la tua chiave gratuita da <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></p>
            <input id="api-key-input" type="password" placeholder="Inserisci API Key" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid var(--border-color); border-radius: 5px;">
            <button onclick="saveApiKey()" style="background: var(--color-accent); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Salva</button>
            <button onclick="this.parentElement.parentElement.remove(); API_KEY = '';" style="background: transparent; color: var(--text-secondary); padding: 10px 20px; border: 1px solid var(--border-color); border-radius: 5px; margin-left: 10px; cursor: pointer;">Annulla</button>
        </div>
    `;
    document.body.appendChild(modal);

    const keyInput = document.getElementById('api-key-input');
    keyInput.focus();
}

// Funzione per salvare API key
window.saveApiKey = function() {
    const key = document.getElementById('api-key-input').value.trim();
    if (key) {
        API_KEY = key;
        localStorage.setItem('gemini_api_key', key);
        document.querySelector('.api-modal').remove();
        addAIMessage('API Key salvata! Ora puoi chattare con Gemini.');
    } else {
        alert('Inserisci una API Key valida.');
    }
};

// Funzioni per aggiungere messaggi
function addUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'message-row user-message';
    row.innerHTML = `<div class="bubble">${text}</div>`;
    messageArea.appendChild(row);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function addAIMessage(text) {
    const row = document.createElement('div');
    row.className = 'message-row ai-message';
    row.innerHTML = `
        <div class="ai-content">
            <div class="bubble">${text.replace(/\n/g, '<br>')}</div>
            <div class="ai-actions">
                <span class="material-symbols-rounded">thumb_up</span>
                <span class="material-symbols-rounded">thumb_down</span>
                <span class="material-symbols-rounded">replay</span>
                <span class="material-symbols-rounded">content_copy</span>
            </div>
        </div>
    `;
    messageArea.appendChild(row);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Funzione per chiamare l'API Gemini
async function callGemini(text) {
    if (!API_KEY) {
        throw new Error('API Key non configurata. Configura la tua API Key.');
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const fullPrompt = SYSTEM_PROMPT + '\n\nUser: ' + text;

    const requestBody = {
        contents: [{
            parts: [{
                text: fullPrompt
            }]
        }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}

// Funzione di invio messaggio
async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    messages.push({ role: 'user', parts: [{ text: text }] });
    updateChatTitle(text); // Aggiorna titolo se prima messaggio
    input.value = '';
    input.style.height = 'auto';
    sendButton.classList.add('disabled');

    // Salva messaggi nella chat corrente
    const currentChat = chats.find(c => c.id === currentChatId);
    if (currentChat) {
        currentChat.messages = messages;
        localStorage.setItem('gemini_chats', JSON.stringify(chats));
    }

    try {
        const aiText = await callGemini(text);
        addAIMessage(aiText);
        messages.push({ role: 'model', parts: [{ text: aiText }] });

        // Salva risposta
        if (currentChat) {
            currentChat.messages = messages;
            localStorage.setItem('gemini_chats', JSON.stringify(chats));
        }
    } catch (error) {
        console.error('Error:', error);
        addAIMessage('Errore nella generazione della risposta: ' + error.message + '. Assicurati di aver configurato la tua API Key.');
        if (error.message.includes('API Key non configurata')) {
            showApiKeyPrompt();
        }
    }
}

// Inizializza
document.addEventListener('DOMContentLoaded', () => {
    // Assegna gli elementi DOM
    messageArea = document.querySelector('.message-area');
    input = document.getElementById('chat-input');
    sendButton = document.getElementById('send-button');
    themeToggle = document.getElementById('theme-toggle');
    body = document.body;
    menuToggle = document.getElementById('menu-toggle');
    sidebar = document.getElementById('sidebar');
    newChatBtn = document.querySelector('.new-chat-btn');
    zoomButton = document.getElementById('zoom-button');
    chatHistory = document.querySelector('.chat-history');
    chatTitle = document.querySelector('.chat-title span:last-child');

    // --- Logica Light/Dark Mode ---
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Aggiorna l'icona
        if (body.classList.contains('dark-mode')) {
            themeToggle.textContent = 'dark_mode';
        } else {
            themeToggle.textContent = 'light_mode';
        }
    });

    // --- Logica Toggle Menu (Mobile) ---
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        // Chiudi la sidebar se si clicca all'esterno (UX base)
        document.addEventListener('click', (event) => {
            if (!sidebar.contains(event.target) && !menuToggle.contains(event.target) && sidebar.classList.contains('open')) {
                 // Solo su schermi stretti
                if (window.innerWidth <= 768) {
                   sidebar.classList.remove('open');
                }
            }
        });
    }

    // --- Logica Nuova Chat ---
    newChatBtn.addEventListener('click', createNewChat);

    // --- Logica Pulsante Zoom ---
    if (zoomButton) {
        zoomButton.addEventListener('click', () => {
            alert('Funzionalità Zoom - Apri riunione Zoom (da implementare)');
            // Qui puoi integrare l'SDK Zoom o un link
        });
    }

    // --- Logica Barra di Input e Bottone di Invio ---
    input.addEventListener('input', () => {
        // Aggiorna l'altezza della textarea in base al contenuto (effetto auto-espandibile)
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';

        // Abilita/Disabilita il bottone di invio
        if (input.value.trim().length > 0) {
            sendButton.classList.remove('disabled');
        } else {
            sendButton.classList.add('disabled');
        }
    });

    // Invia premendo Invio (e SHIFT+INVIO per una nuova riga)
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Impedisce la nuova riga
            sendMessage();
        }
    });

    // Click sul bottone di invio
    sendButton.addEventListener('click', sendMessage);

    // Inizializza la chat history se vuota
    if (chats.length === 0) {
        createNewChat();
    }

    // Inizializzazione
    input.style.height = 'auto';
    renderChatHistory();
    if (chats.length > 0) {
        loadChat(chats[0].id); // Carica la prima chat
    }
    if (!API_KEY) {
        showApiKeyPrompt();
    }
});
