// Evon AI - Professional Trading Platform
const API_BASE = window.location.origin;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Evon AI Initializing...');
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    checkHealth();
    loadConfigStatus();
    setupEventListeners();
    loadMarketOverview();
}

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => handleNavigation(item));
    });
}

function handleNavigation(navItem) {
    const section = navItem.dataset.section;
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    navItem.classList.add('active');
    
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${section}-section`)?.classList.add('active');
    
    // Load section-specific data
    if (section === 'market') loadMarketOverview();
    if (section === 'options') loadOptionsFlow();
    if (section === 'news') loadNews();
    if (section === 'reddit') loadRedditSentiment();
    if (section === 'earnings') loadEarnings();
    if (section === 'watchlist') loadWatchlist();
}

function setupEventListeners() {
    // Chat
    document.getElementById('chat-form')?.addEventListener('submit', handleChatSubmit);
    
    // Voice
    document.getElementById('speak-btn')?.addEventListener('click', handleVoiceSpeak);
    document.getElementById('voice-speed')?.addEventListener('input', (e) => {
        document.getElementById('voice-speed-value').textContent = e.target.value + 'x';
    });
    
    // Market
    document.getElementById('quote-form')?.addEventListener('submit', handleQuoteSubmit);
    
    // Options
    document.getElementById('refresh-options')?.addEventListener('click', loadOptionsFlow);
    
    // News
    document.getElementById('refresh-news')?.addEventListener('click', loadNews);
    
    // Reddit
    document.getElementById('refresh-reddit')?.addEventListener('click', loadRedditSentiment);
    
    // Earnings
    document.getElementById('refresh-earnings')?.addEventListener('click', loadEarnings);
    
    // Watchlist
    document.getElementById('watchlist-form')?.addEventListener('submit', handleWatchlistAdd);
    
    // Settings
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => handleThemeChange(btn));
    });
    document.getElementById('api-form')?.addEventListener('submit', handleAPIKeySubmit);
}

async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (data.status === 'healthy') {
            statusDot.classList.add('ready');
            statusText.textContent = 'Evon Online';
        }
    } catch (error) {
        console.error('Health check failed:', error);
    }
}

async function loadConfigStatus() {
    try {
        const response = await fetch(`${API_BASE}/api/config/status`);
        const data = await response.json();
        
        const statusDiv = document.getElementById('config-status');
        if (!statusDiv) return;
        
        statusDiv.innerHTML = '';
        
        const items = [
            ['OpenAI (Evon Brain)', data.configuration.ai.openai],
            ['ElevenLabs Voice', data.configuration.voice.elevenLabs],
            ['Voice ID', data.configuration.voice.voiceId],
            ['MongoDB Database', data.configuration.database.mongodb],
            ['Polygon Market Data', data.configuration.market.polygon],
            ['News API', data.configuration.services.news]
        ];
        
        items.forEach(([name, configured]) => {
            statusDiv.innerHTML += createConfigItem(name, configured);
        });
    } catch (error) {
        console.error('Config load failed:', error);
    }
}

function createConfigItem(name, configured) {
    const status = configured ? 'Configured' : 'Not Configured';
    const className = configured ? 'configured' : 'not-configured';
    return `
        <div class="config-item">
            <span>${name}</span>
            <span class="config-badge ${className}">${status}</span>
        </div>
    `;
}

// Chat Functions
async function handleChatSubmit(e) {
    e.preventDefault();
    
    const input = document.getElementById('chat-input');
    const userMessage = input.value.trim();
    
    if (!userMessage) return;
    
    addChatMessage(userMessage, true);
    input.value = '';
    
    const typingId = addTypingIndicator();
    
    try {
        const response = await fetch(`${API_BASE}/api/evon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userMessage })
        });
        
        const data = await response.json();
        
        removeTypingIndicator(typingId);
        
        if (!response.ok) throw new Error(data.message || 'Evon encountered an error');
        
        const evonReply = data.evonResponse?.voiceMessage || 
                         data.evonResponse?.nextAction || 
                         'I\'ve analyzed your request.';
        addChatMessage(evonReply, false);
        
    } catch (error) {
        removeTypingIndicator(typingId);
        addChatMessage(`Sorry, I encountered an error: ${error.message}`, false);
    }
}

function addChatMessage(text, isUser) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'evon-message'}`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${isUser ? 'U' : 'E'}</div>
        <div class="message-content">
            <div class="message-author">${isUser ? 'You' : 'Evon AI'}</div>
            <div class="message-text">${text}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    const id = 'typing-' + Date.now();
    typingDiv.id = id;
    typingDiv.className = 'message evon-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">E</div>
        <div class="message-content">
            <div class="message-author">Evon AI</div>
            <div class="message-text">Thinking...</div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    document.getElementById(id)?.remove();
}

// Voice Functions
async function handleVoiceSpeak() {
    const text = document.getElementById('voice-text').value;
    const speed = document.getElementById('voice-speed').value;
    const resultDiv = document.getElementById('voice-result');
    const btn = document.getElementById('speak-btn');
    
    if (!text) {
        alert('Please enter text for Evon to speak');
        return;
    }
    
    btn.disabled = true;
    btn.textContent = '🔊 Evon is speaking...';
    
    try {
        const response = await fetch(`${API_BASE}/api/voice/speak`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, speed })
        });
        
        const data = await response.json();
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>Evon Voice Response</h3>
            <p><strong>Text:</strong> ${data.text}</p>
            <p><strong>Speed:</strong> ${data.speed}x</p>
            <p><strong>Voice:</strong> ${data.voiceId}</p>
            <p class="help-text">${data.note}</p>
        `;
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<p style="color: var(--rh-red);">Error: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.textContent = '🔊 Speak with Evon Voice';
    }
}

// Market Functions
async function loadMarketOverview() {
    const symbols = ['TSLA', 'NVDA', 'SPY', 'QQQ'];
    
    for (const symbol of symbols) {
        try {
            const response = await fetch(`${API_BASE}/api/market/quote/${symbol}`);
            const data = await response.json();
            
            const card = document.querySelector(`.quote-card[data-symbol="${symbol}"] .quote-data`);
            if (card) {
                const changeClass = data.change >= 0 ? 'positive' : 'negative';
                const changeSign = data.change >= 0 ? '+' : '';
                card.innerHTML = `
                    <div class="price">$${data.price.toFixed(2)}</div>
                    <div class="change ${changeClass}">
                        ${changeSign}${data.change.toFixed(2)} (${changeSign}${data.changePercent.toFixed(2)}%)
                    </div>
                `;
            }
        } catch (error) {
            console.error(`Error loading ${symbol}:`, error);
        }
    }
}

async function handleQuoteSubmit(e) {
    e.preventDefault();
    
    const symbol = document.getElementById('quote-symbol').value.toUpperCase();
    const resultDiv = document.getElementById('custom-quote-result');
    
    try {
        const response = await fetch(`${API_BASE}/api/market/quote/${symbol}`);
        const data = await response.json();
        
        const changeClass = data.change >= 0 ? 'positive' : 'negative';
        const changeSign = data.change >= 0 ? '+' : '';
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="card">
                <h3>${data.symbol}</h3>
                <div class="quote-data">
                    <div class="price">$${data.price.toFixed(2)}</div>
                    <div class="change ${changeClass}">
                        ${changeSign}${data.change.toFixed(2)} (${changeSign}${data.changePercent.toFixed(2)}%)
                    </div>
                    <p>Volume: ${data.volume.toLocaleString()}</p>
                </div>
            </div>
        `;
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<p style="color: var(--rh-red);">Error: ${error.message}</p>`;
    }
}

// Options Flow Functions
async function loadOptionsFlow() {
    const hotCalls = document.getElementById('hot-calls');
    const hotPuts = document.getElementById('hot-puts');
    const evonPicks = document.getElementById('evon-picks');
    
    // Mock data - in production, this would call a real options flow API
    const mockCalls = [
        { symbol: 'TSLA', strike: 250, expiry: '12/15', volume: 15234, oi: 42891 },
        { symbol: 'NVDA', strike: 500, expiry: '12/15', volume: 12543, oi: 38291 }
    ];
    
    const mockPuts = [
        { symbol: 'SPY', strike: 450, expiry: '12/15', volume: 9876, oi: 28432 },
        { symbol: 'QQQ', strike: 380, expiry: '12/15', volume: 8765, oi: 24123 }
    ];
    
    hotCalls.innerHTML = mockCalls.map(opt => `
        <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem;">
            <strong>${opt.symbol}</strong> $${opt.strike} ${opt.expiry}<br>
            <span style="color: var(--rh-green);">Vol: ${opt.volume.toLocaleString()} | OI: ${opt.oi.toLocaleString()}</span>
        </div>
    `).join('');
    
    hotPuts.innerHTML = mockPuts.map(opt => `
        <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem;">
            <strong>${opt.symbol}</strong> $${opt.strike} ${opt.expiry}<br>
            <span style="color: var(--rh-red);">Vol: ${opt.volume.toLocaleString()} | OI: ${opt.oi.toLocaleString()}</span>
        </div>
    `).join('');
    
    evonPicks.innerHTML = `
        <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem;">
            <strong style="color: var(--rh-green);">CALL: AAPL $180</strong> 12/22<br>
            <span style="color: var(--rh-gray);">Evon confidence: High</span>
        </div>
        <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem;">
            <strong style="color: var(--rh-red);">PUT: TSLA $240</strong> 12/22<br>
            <span style="color: var(--rh-gray);">Evon confidence: Medium</span>
        </div>
    `;
}

// News Functions
async function loadNews() {
    const newsFeed = document.getElementById('news-feed');
    
    try {
        const response = await fetch(`${API_BASE}/api/news/latest`);
        const data = await response.json();
        
        newsFeed.innerHTML = data.news.map(article => `
            <div class="news-item">
                <h4>${article.title}</h4>
                <div class="meta">${article.source} - ${new Date(article.publishedAt).toLocaleString()}</div>
                <span class="sentiment ${article.sentiment}">${article.sentiment.toUpperCase()}</span>
                <p style="margin-top: 0.75rem; color: var(--rh-gray);">
                    Evon AI: ${article.sentiment === 'bullish' ? 'Positive market impact expected' : article.sentiment === 'bearish' ? 'Caution advised' : 'Neutral impact'}
                </p>
            </div>
        `).join('');
    } catch (error) {
        newsFeed.innerHTML = `<p style="color: var(--rh-red);">Error loading news: ${error.message}</p>`;
    }
}

// Reddit Sentiment Functions
async function loadRedditSentiment() {
    const subreddit = document.getElementById('subreddit-select').value;
    const trendingDiv = document.getElementById('trending-tickers');
    const hypeDiv = document.getElementById('hype-levels');
    
    try {
        const response = await fetch(`${API_BASE}/api/reddit/sentiment/${subreddit}`);
        const data = await response.json();
        
        trendingDiv.innerHTML = data.topMentions.map(mention => `
            <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem;">
                <strong>${mention.symbol}</strong><br>
                <span style="color: var(--rh-yellow);">${mention.mentions} mentions</span>
            </div>
        `).join('');
        
        hypeDiv.innerHTML = `
            <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem;">
                <strong>Overall Sentiment:</strong> <span style="color: var(--rh-green);">${data.sentiment.overall.toUpperCase()}</span><br>
                <span style="color: var(--rh-gray);">Evon Hype Score: ${(data.sentiment.score * 100).toFixed(0)}%</span>
            </div>
        `;
    } catch (error) {
        trendingDiv.innerHTML = `<p style="color: var(--rh-red);">Error: ${error.message}</p>`;
    }
}

// Earnings Functions
async function loadEarnings() {
    const earningsList = document.getElementById('earnings-list');
    
    // Mock data - in production, would call earnings calendar API
    const mockEarnings = [
        { symbol: 'AAPL', date: '2024-01-25', estimate: '$2.10 EPS', evonNote: 'Strong quarter expected, monitor iPhone sales' },
        { symbol: 'MSFT', date: '2024-01-30', estimate: '$2.75 EPS', evonNote: 'Cloud growth key metric to watch' },
        { symbol: 'GOOGL', date: '2024-02-01', estimate: '$1.50 EPS', evonNote: 'Ad revenue may surprise to upside' }
    ];
    
    earningsList.innerHTML = mockEarnings.map(earnings => `
        <div class="earnings-item">
            <h4>${earnings.symbol}</h4>
            <p class="date">${earnings.date}</p>
            <p>Estimate: ${earnings.estimate}</p>
            <p style="color: var(--rh-gray); margin-top: 0.5rem;">
                <strong>Evon AI:</strong> ${earnings.evonNote}
            </p>
        </div>
    `).join('');
}

// Watchlist Functions
async function loadWatchlist() {
    const watchlistDiv = document.getElementById('watchlist-items');
    
    try {
        const response = await fetch(`${API_BASE}/api/db/read?key=watchlist`);
        const data = await response.json();
        
        const watchlist = data.value || [];
        
        if (watchlist.length === 0) {
            watchlistDiv.innerHTML = '<p style="color: var(--rh-gray);">No symbols in watchlist. Add some above!</p>';
            return;
        }
        
        watchlistDiv.innerHTML = watchlist.map(symbol => `
            <div class="card">
                <h4>${symbol}</h4>
                <p style="color: var(--rh-gray);">Monitored by Evon</p>
            </div>
        `).join('');
    } catch (error) {
        watchlistDiv.innerHTML = `<p style="color: var(--rh-red);">Error: ${error.message}</p>`;
    }
}

async function handleWatchlistAdd(e) {
    e.preventDefault();
    
    const symbol = document.getElementById('watchlist-symbol').value.toUpperCase();
    
    try {
        // Get current watchlist
        const readResponse = await fetch(`${API_BASE}/api/db/read?key=watchlist`);
        const readData = await readResponse.json();
        const watchlist = readData.value || [];
        
        if (watchlist.includes(symbol)) {
            alert(`${symbol} is already in your watchlist!`);
            return;
        }
        
        watchlist.push(symbol);
        
        // Save updated watchlist
        await fetch(`${API_BASE}/api/db/write`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'watchlist', value: watchlist })
        });
        
        document.getElementById('watchlist-symbol').value = '';
        loadWatchlist();
    } catch (error) {
        alert(`Error adding to watchlist: ${error.message}`);
    }
}

// Settings Functions
function handleThemeChange(btn) {
    const theme = btn.dataset.theme;
    
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.body.className = `theme-${theme}`;
    
    // In production, save theme preference to database
    console.log('Theme changed to:', theme);
}

async function handleAPIKeySubmit(e) {
    e.preventDefault();
    
    const apiName = document.getElementById('api-name').value;
    const apiValue = document.getElementById('api-value').value;
    
    if (!apiValue) {
        alert('Please enter an API key');
        return;
    }
    
    // In production, this would securely save to server-side .env
    alert(`API key for ${apiName} would be saved securely on the server.\n\nNote: Restart the server after adding keys to .env file.`);
    
    document.getElementById('api-value').value = '';
}

console.log('✅ Evon AI Loaded - Ready for Trading!');
