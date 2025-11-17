// Evon AI Frontend Application
const API_BASE = window.location.origin;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Evon AI Initializing...');
    checkHealth();
    loadConfigStatus();
    setupEventListeners();
});

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => handleNavigation(item));
    });

    // Chat
    document.getElementById('chat-form')?.addEventListener('submit', handleChatSubmit);

    // Voice
    document.getElementById('speak-btn')?.addEventListener('click', handleVoiceSpeak);
    document.getElementById('voice-speed')?.addEventListener('input', (e) => {
        document.getElementById('voice-speed-value').textContent = e.target.value + 'x';
    });

    // Scanner
    document.getElementById('scanner-form')?.addEventListener('submit', handleScannerSubmit);

    // Options
    document.getElementById('refresh-options')?.addEventListener('click', handleOptionsRefresh);

    // Reddit
    document.getElementById('reddit-form')?.addEventListener('submit', handleRedditSubmit);

    // News
    document.getElementById('news-form')?.addEventListener('submit', handleNewsSubmit);
}

function handleNavigation(navItem) {
    const section = navItem.dataset.section;
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    navItem.classList.add('active');
    
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${section}-section`)?.classList.add('active');
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
        
        // AI Configuration
        statusDiv.innerHTML += createConfigItem('OpenAI (Evon Brain)', data.configuration.ai.openai);
        
        // Voice Configuration
        statusDiv.innerHTML += createConfigItem('ElevenLabs Voice Key', data.configuration.voice.elevenLabs);
        statusDiv.innerHTML += createConfigItem('ElevenLabs Voice ID', data.configuration.voice.voiceId);
        
        // Database Configuration
        statusDiv.innerHTML += createConfigItem('MongoDB Database', data.configuration.database.mongodb);
        
        // Market Data Configuration
        statusDiv.innerHTML += createConfigItem('Polygon Market Data', data.configuration.market.polygon);
        
        // Services Configuration
        statusDiv.innerHTML += createConfigItem('News API', data.configuration.services.news);
        
        const ready = data.ready ? 'Evon Ready' : 'Configuration Needed';
        const className = data.ready ? 'configured' : 'not-configured';
        statusDiv.innerHTML += `
            <div class="config-item" style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--border-color);">
                <span style="font-weight: 700;">Overall Status</span>
                <span class="config-badge ${className}">${ready}</span>
            </div>
        `;
        
        const evonStatus = document.getElementById('evon-status');
        if (evonStatus) {
            evonStatus.textContent = data.ready ? 'Active & Ready' : 'Needs Configuration';
            evonStatus.style.color = data.ready ? 'var(--evon-success)' : 'var(--evon-warning)';
        }
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
            <p class="text-muted">${data.note}</p>
        `;
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<p style="color: var(--evon-danger);">Error: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.textContent = '🔊 Speak with Evon Voice';
    }
}

async function handleScannerSubmit(e) {
    e.preventDefault();
    
    const symbol = document.getElementById('scanner-symbol').value.toUpperCase();
    const timeframe = document.getElementById('scanner-timeframe').value;
    const resultDiv = document.getElementById('scanner-result');
    const btn = e.target.querySelector('button');
    
    btn.disabled = true;
    btn.textContent = 'Evon is scanning...';
    
    try {
        const response = await fetch(`${API_BASE}/api/market/quote/${symbol}`);
        const data = await response.json();
        
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-box success';
        resultDiv.innerHTML = `
            <h3>Evon Market Scanner - ${data.symbol}</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0;">
                <div>
                    <p><strong>Price:</strong> $${data.price.toFixed(2)}</p>
                    <p><strong>Change:</strong> ${data.change.toFixed(2)} (${data.changePercent.toFixed(2)}%)</p>
                </div>
                <div>
                    <p><strong>Volume:</strong> ${data.volume.toLocaleString()}</p>
                    <p><strong>Timeframe:</strong> ${timeframe}</p>
                </div>
            </div>
            <p class="text-muted">${data.note || 'Analyzed by Evon AI'}</p>
        `;
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-box error';
        resultDiv.innerHTML = `<h3>Scan Failed</h3><p>${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Scan Market';
    }
}

async function handleOptionsRefresh() {
    const resultDiv = document.getElementById('options-result');
    const btn = document.getElementById('refresh-options');
    
    btn.disabled = true;
    btn.textContent = '🔄 Loading...';
    
    try {
        resultDiv.innerHTML = `
            <h3>Unusual Options Activity (Evon Analysis)</h3>
            <div style="margin-top: 1rem;">
                <div class="card" style="background: var(--bg-dark); margin-bottom: 1rem;">
                    <p><strong>AAPL</strong> - Calls @ $180 Strike</p>
                    <p>Volume: 15,234 | Open Interest: 42,891</p>
                    <p style="color: var(--evon-success);">Bullish Signal</p>
                </div>
                <div class="card" style="background: var(--bg-dark); margin-bottom: 1rem;">
                    <p><strong>TSLA</strong> - Puts @ $240 Strike</p>
                    <p>Volume: 9,876 | Open Interest: 28,432</p>
                    <p style="color: var(--evon-danger);">Bearish Signal</p>
                </div>
                <p class="text-muted">Configure options data API for real-time flow analysis</p>
            </div>
        `;
    } finally {
        btn.disabled = false;
        btn.textContent = '🔄 Refresh Options Flow';
    }
}

async function handleRedditSubmit(e) {
    e.preventDefault();
    
    const subreddit = document.getElementById('reddit-subreddit').value;
    const resultDiv = document.getElementById('reddit-result');
    const btn = e.target.querySelector('button');
    
    btn.disabled = true;
    btn.textContent = 'Evon is analyzing...';
    
    try {
        const response = await fetch(`${API_BASE}/api/reddit/sentiment/${subreddit}`);
        const data = await response.json();
        
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-box success';
        resultDiv.innerHTML = `
            <h3>Evon Reddit Sentiment - r/${data.subreddit}</h3>
            <div style="margin: 1rem 0;">
                <p><strong>Overall:</strong> <span style="color: var(--evon-success);">${data.sentiment.overall.toUpperCase()}</span></p>
                <p><strong>Score:</strong> ${(data.sentiment.score * 100).toFixed(0)}%</p>
            </div>
            <h4>Top Mentions:</h4>
            ${data.topMentions.map(mention => `
                <div class="card" style="background: var(--bg-dark); margin-top: 0.5rem;">
                    <p><strong>${mention.symbol}</strong> - ${mention.mentions} mentions</p>
                </div>
            `).join('')}
            <p class="text-muted" style="margin-top: 1rem;">${data.note || 'Analyzed by Evon AI'}</p>
        `;
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-box error';
        resultDiv.innerHTML = `<h3>Analysis Failed</h3><p>${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Analyze Sentiment';
    }
}

async function handleNewsSubmit(e) {
    e.preventDefault();
    
    const symbol = document.getElementById('news-symbol').value;
    const resultDiv = document.getElementById('news-result');
    const btn = e.target.querySelector('button');
    
    btn.disabled = true;
    btn.textContent = 'Evon is loading news...';
    
    try {
        const response = await fetch(`${API_BASE}/api/news/latest?symbol=${symbol}`);
        const data = await response.json();
        
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-box success';
        resultDiv.innerHTML = `
            <h3>Evon News Radar ${symbol ? `- ${symbol}` : ''}</h3>
            ${data.news.map(article => `
                <div class="card" style="background: var(--bg-dark); margin-top: 1rem;">
                    <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">${article.title}</h4>
                    <p class="text-muted">${article.source} - ${new Date(article.publishedAt).toLocaleString()}</p>
                </div>
            `).join('')}
            <p class="text-muted" style="margin-top: 1rem;">${data.note || 'Curated by Evon AI'}</p>
        `;
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.className = 'result-box error';
        resultDiv.innerHTML = `<h3>News Load Failed</h3><p>${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Load News';
    }
}

console.log('✅ Evon AI Loaded');
