// Dashboard alkalmazás a Romani Szó A Nap projekthez
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const wordsList = document.getElementById('wordsList');
    const modal = document.getElementById('wordModal');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('prevWord');
    const nextBtn = document.getElementById('nextWord');
    
    let currentWordIndex = 0;
    let filteredWords = [];
    
    // Szavak betöltése és megjelenítése
    loadWords();
    
    // URL paraméter kezelése - ha day paraméter van, nyissuk meg azt a modal-t
    handleURLParameters();
    
    // Event listener-ek
    searchInput.addEventListener('input', filterWords);
    categoryFilter.addEventListener('change', filterWords);
    document.getElementById('todayButton').addEventListener('click', scrollToToday);
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPreviousWord);
    nextBtn.addEventListener('click', showNextWord);
    
    // Feliratkozási modal
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', openSubscribeModal);
    }
    
    const subscribeClose = document.getElementById('subscribeClose');
    if (subscribeClose) {
        subscribeClose.addEventListener('click', closeSubscribeModal);
    }
    
    const subscribeForm = document.getElementById('subscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', handleSubscribe);
    }
    
    // Billentyűzet navigáció
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Modal bezárás kattintásra
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
        // Feliratkozási modal bezárás
        const subscribeModal = document.getElementById('subscribeModal');
        if (event.target === subscribeModal) {
            closeSubscribeModal();
        }
    });

    function handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const dayParam = urlParams.get('day');
        
        if (dayParam) {
            const targetDate = new Date(dayParam);
            if (!isNaN(targetDate)) {
                // Keressük meg a megfelelő szót a dátum alapján
                const startDate = new Date('2025-01-01');
                const daysDiff = Math.floor((targetDate - startDate) / (1000 * 60 * 60 * 24));
                
                if (daysDiff >= 0 && daysDiff < 365) {
                    // Találjuk meg a szót a filteredWords-ben
                    const wordIndex = filteredWords.findIndex(word => word.dayIndex === daysDiff);
                    if (wordIndex !== -1) {
                        setTimeout(() => openModal(wordIndex), 500); // Kis késleltetés hogy betöltődjön minden
                    }
                }
            }
        }
    }

    function loadWords() {
        filteredWords = [];
        const startDate = new Date('2025-01-01');
        const today = new Date();
        
        // 365 szó generálása 2025-re
        for (let i = 0; i < 365; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const word = getWordForDay(i);
            const isToday = currentDate.toDateString() === today.toDateString();
            
            filteredWords.push({
                ...word,
                dayIndex: i,
                date: currentDate,
                isToday: isToday
            });
        }
        
        displayWords();
    }
    
    function displayWords() {
        wordsList.innerHTML = '';
        
        filteredWords.forEach((word, index) => {
            const wordCard = createWordCard(word, index);
            wordsList.appendChild(wordCard);
        });
    }
    
    function createWordCard(word, index) {
        const card = document.createElement('div');
        card.className = `word-card ${word.isToday ? 'today' : ''}`;
        card.onclick = () => openModal(index);
        
        const dateStr = word.date.toLocaleDateString('hu-HU', {
            month: 'long',
            day: 'numeric'
        });
        
        card.innerHTML = `
            <div class="word-illustration">${word.illustration}</div>
            <h3 class="word-romani">${word.romani}</h3>
            <div class="word-pronunciation">[${word.pronunciation}]</div>
            <div class="word-hungarian">${word.hungarian}</div>
            <div class="word-definition">${word.definition}</div>
            <div class="word-date">${dateStr}</div>
        `;
        
        return card;
    }
    
    function filterWords() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        
        const allWords = [];
        const startDate = new Date('2025-01-01');
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const word = getWordForDay(i);
            const isToday = currentDate.toDateString() === today.toDateString();
            
            allWords.push({
                ...word,
                dayIndex: i,
                date: currentDate,
                isToday: isToday
            });
        }
        
        filteredWords = allWords.filter(word => {
            const matchesSearch = !searchTerm || 
                word.romani.toLowerCase().includes(searchTerm) ||
                word.hungarian.toLowerCase().includes(searchTerm) ||
                word.definition.toLowerCase().includes(searchTerm);
            
            const matchesCategory = category === 'all' || 
                (word.category && word.category === category);
            
            return matchesSearch && matchesCategory;
        });
        
        displayWords();
    }
    
    function openModal(index) {
        currentWordIndex = index;
        const word = filteredWords[index];
        
        document.getElementById('modalIllustration').textContent = word.illustration;
        document.getElementById('modalRomani').textContent = word.romani;
        document.getElementById('modalPronunciation').textContent = `[${word.pronunciation}]`;
        document.getElementById('modalHungarian').textContent = word.hungarian;
        document.getElementById('modalDefinition').textContent = word.definition;
        document.getElementById('modalExampleRomani').textContent = word.exampleRomani;
        document.getElementById('modalExampleHungarian').textContent = word.exampleHungarian;
        
        const dateStr = word.date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('modalDate').textContent = dateStr;
        
        // Megosztás gombok beállítása
        setupShareButtons(word);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function showPreviousWord() {
        if (currentWordIndex > 0) {
            openModal(currentWordIndex - 1);
        }
    }
    
    function showNextWord() {
        if (currentWordIndex < filteredWords.length - 1) {
            openModal(currentWordIndex + 1);
        }
    }
    
    function handleKeyboardNavigation(event) {
        if (modal.style.display === 'block') {
            switch(event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    showPreviousWord();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    showNextWord();
                    break;
                case 'Escape':
                    event.preventDefault();
                    closeModal();
                    break;
            }
        }
    }
    
    function setupShareButtons(word) {
        const shareMessenger = document.getElementById('shareMessenger');
        const shareLink = document.getElementById('shareLink');
        
        // A megosztott link a főoldalra mutat a megfelelő nappal
        const url = `${window.location.origin}/?day=${word.date.toISOString().split('T')[0]}`;
        const text = `🎯 ${word.date.toLocaleDateString('hu-HU')} | Romani Szó A Nap\n\n` +
                    `${word.illustration} ${word.romani} [${word.pronunciation}]\n` +
                    `🇭🇺 ${word.hungarian}\n\n` +
                    `💡 ${word.definition}\n\n` +
                    `📝 Példa: ${word.exampleRomani}\n` +
                    `   → ${word.exampleHungarian}\n\n` +
                    `🔗 ${url}`;
        
        shareMessenger.onclick = () => shareToMessenger(text, url);
        shareLink.onclick = () => copyToClipboard(url);
    }
    
    function shareToMessenger(text, url) {
        // Első próbálkozás: Natív Messenger alkalmazás
        const messengerAppUrl = `fb-messenger://share/?link=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        
        // Ellenőrzés, hogy mobile eszközön vagyunk-e
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Mobile eszközön próbáljuk a natív alkalmazást
            window.location.href = messengerAppUrl;
            
            // Fallback: Ha nem sikerül 2 másodperc alatt, nyissuk meg a webes verziót
            setTimeout(() => {
                const webMessengerUrl = `https://m.me/?text=${encodeURIComponent(text + '\n' + url)}`;
                window.open(webMessengerUrl, '_blank');
            }, 2000);
        } else {
            // Desktop: Webes Messenger megnyitása új ablakban
            const webMessengerUrl = `https://www.messenger.com/new?text=${encodeURIComponent(text + '\n' + url)}`;
            window.open(webMessengerUrl, '_blank');
        }
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const button = document.getElementById('shareLink');
            const originalText = button.textContent;
            button.textContent = '✓ Másolva!';
            button.style.background = '#000';
            button.style.color = 'white';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'white';
                button.style.color = '#000';
            }, 2000);
        }).catch(() => {
            alert('Nem sikerült a vágólapra másolni');
        });
    }
    
    function scrollToToday() {
        // Keressük meg a mai szót
        const today = new Date();
        const todayWord = filteredWords.find(word => word.isToday);
        
        if (todayWord) {
            // Keressük meg a megfelelő DOM elemet
            const wordCards = document.querySelectorAll('.word-card');
            const todayCardIndex = filteredWords.indexOf(todayWord);
            
            if (wordCards[todayCardIndex]) {
                // Görgessünk a kártyához és emeljük ki
                wordCards[todayCardIndex].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Kis villogó effekt a mai naphoz
                const todayCard = wordCards[todayCardIndex];
                todayCard.style.transform = 'scale(1.05)';
                
                setTimeout(() => {
                    todayCard.style.transform = '';
                }, 500);
            }
        } else {
            // Ha nincs mai szó (pl. szűrve van), akkor alaphelyzetbe állítjuk a szűrőket
            document.getElementById('searchInput').value = '';
            document.getElementById('categoryFilter').value = 'all';
            filterWords();
            
            // Kis késleltetés után újra próbáljuk
            setTimeout(() => {
                scrollToToday();
            }, 200);
        }
    }
    
    // Feliratkozási modal függvények
    function openSubscribeModal() {
        const subscribeModal = document.getElementById('subscribeModal');
        subscribeModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeSubscribeModal() {
        const subscribeModal = document.getElementById('subscribeModal');
        subscribeModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Form reset
        document.getElementById('subscribeForm').reset();
    }
    
    function handleSubscribe(event) {
        event.preventDefault();
        
        const emailInput = document.getElementById('emailInput');
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Kérlek add meg az email címedet!');
            return;
        }
        
        // Email validáció
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Kérlek adj meg egy érvényes email címet!');
            return;
        }
        
        // EmailJS küldés (ide jön majd a tényleges implementáció)
        saveSubscription(email);
    }
    
    function saveSubscription(email) {
        // Egyelőre csak mentjük el localStorage-ba és visszajelzést adunk
        // Később ezt kiegészítjük EmailJS-szel
        
        let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
        
        // Ellenőrzés, hogy már feliratkozottq-e
        if (subscribers.includes(email)) {
            alert('Ez az email cím már fel van iratkozva! ✅');
            closeSubscribeModal();
            return;
        }
        
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
        
        alert(`Sikeres feliratkozás! 🎉\n\nA ${email} címre minden nap küldünk egy új romani szót!\n\n✨ Köszönjük a feliratkozást!`);
        closeSubscribeModal();
        
        console.log('Új feliratkozó:', email);
        console.log('Összes feliratkozó:', subscribers.length);
    }
} 