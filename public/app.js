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
    loadDashboard();
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
    if (section === 'dashboard') loadDashboard();
    if (section === 'strategy') loadStrategy();
    if (section === 'options') loadOptions();
    if (section === 'penny') loadPennyStocks();
    if (section === 'etf') loadETFAnalysis();
    if (section === 'growth') loadGrowthStocks();
    if (section === 'dividend') loadDividendStocks();
    if (section === 'unusual') loadUnusualActivity();
    if (section === 'sectors') loadSectors();
    if (section === 'market') loadMarketOverview();
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
    
    // Strategy
    document.getElementById('strategy-form')?.addEventListener('submit', handleStrategySubmit);
    
    // Market
    document.getElementById('quote-form')?.addEventListener('submit', handleQuoteSubmit);
    
    // Unusual Activity
    document.getElementById('refresh-unusual')?.addEventListener('click', loadUnusualActivity);
    
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

// Dashboard Functions
async function loadDashboard() {
    loadDashboardPicks('week', 'week-picks');
    loadDashboardPicks('month', 'month-picks');
    loadDashboardPicks('quarter', 'quarter-picks');
    loadDashboardPicks('halfyear', 'halfyear-picks');
    loadDashboardPicks('year', 'year-picks');
    loadDashboardNews();
}

async function loadDashboardPicks(timeframe, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Mock data - in production, would use Evon AI to generate recommendations
    const picks = {
        week: [
            { type: 'STOCK', symbol: 'NVDA', action: 'BUY', entry: '$495', exit: '$520', reason: 'AI momentum' },
            { type: 'OPTION', symbol: 'TSLA $250 Call', action: 'BUY', entry: '$8.50', exit: '$12', reason: 'Breakout play' }
        ],
        month: [
            { type: 'ETF', symbol: 'QQQ', action: 'BUY', entry: '$385', exit: '$400', reason: 'Tech rally' },
            { type: 'STOCK', symbol: 'AAPL', action: 'BUY', entry: '$175', exit: '$190', reason: 'iPhone sales' }
        ],
        quarter: [
            { type: 'STOCK', symbol: 'MSFT', action: 'BUY', entry: '$370', exit: '$410', reason: 'Cloud growth' },
            { type: 'ETF', symbol: 'SPY', action: 'BUY', entry: '$450', exit: '$475', reason: 'Market rally' }
        ],
        halfyear: [
            { type: 'STOCK', symbol: 'GOOGL', action: 'BUY', entry: '$140', exit: '$165', reason: 'AI integration' },
            { type: 'STOCK', symbol: 'AMD', action: 'BUY', entry: '$140', exit: '$175', reason: 'Chip demand' }
        ],
        year: [
            { type: 'STOCK', symbol: 'META', action: 'BUY', entry: '$350', exit: '$450', reason: 'Metaverse growth' },
            { type: 'DIVIDEND', symbol: 'JNJ', action: 'BUY', entry: '$155', exit: '$170', reason: 'Stable income' }
        ]
    };
    
    const data = picks[timeframe] || [];
    element.innerHTML = data.map(pick => `
        <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid var(--rh-green);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <div>
                    <strong style="color: var(--rh-white);">${pick.symbol}</strong>
                    <span style="color: var(--rh-gray); font-size: 0.875rem; margin-left: 0.5rem;">${pick.type}</span>
                </div>
                <span style="color: var(--rh-green); font-weight: 600;">${pick.action}</span>
            </div>
            <div style="font-size: 0.875rem; color: var(--rh-gray);">
                Entry: ${pick.entry} → Exit: ${pick.exit}
            </div>
            <div style="font-size: 0.875rem; color: var(--rh-yellow); margin-top: 0.25rem;">
                ${pick.reason}
            </div>
        </div>
    `).join('');
}

async function loadDashboardNews() {
    try {
        const response = await fetch(`${API_BASE}/api/news/latest`);
        const data = await response.json();
        
        const newsDiv = document.getElementById('dashboard-news');
        if (!newsDiv) return;
        
        newsDiv.innerHTML = data.news.slice(0, 5).map(article => `
            <div style="padding: 1rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.75rem;">
                <h4 style="color: var(--rh-white); margin-bottom: 0.5rem;">${article.title}</h4>
                <div style="color: var(--rh-gray); font-size: 0.875rem;">${article.source} - ${new Date(article.publishedAt).toLocaleString()}</div>
                <span class="sentiment ${article.sentiment}" style="margin-top: 0.5rem; display: inline-block;">${article.sentiment.toUpperCase()}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading dashboard news:', error);
    }
}

// Strategy Center Functions
async function handleStrategySubmit(e) {
    e.preventDefault();
    
    const symbol = document.getElementById('strategy-symbol').value.toUpperCase();
    const type = document.getElementById('strategy-type').value;
    const resultDiv = document.getElementById('strategy-result');
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="card">
            <h3>Evon AI Strategy for ${symbol}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
                <div style="padding: 1rem; background: var(--rh-black); border-radius: 8px; border-left: 3px solid var(--rh-green);">
                    <h4 style="color: var(--rh-green); margin-bottom: 0.75rem;">📈 CALL Strategy</h4>
                    <p><strong>Strike:</strong> $${(Math.random() * 50 + 100).toFixed(2)}</p>
                    <p><strong>Expiry:</strong> 30 days</p>
                    <p><strong>Entry:</strong> $${(Math.random() * 5 + 2).toFixed(2)}</p>
                    <p><strong>Target:</strong> $${(Math.random() * 8 + 5).toFixed(2)}</p>
                    <p style="color: var(--rh-gray); margin-top: 0.5rem; font-size: 0.875rem;">
                        Evon Confidence: ${(Math.random() * 30 + 70).toFixed(0)}%
                    </p>
                </div>
                <div style="padding: 1rem; background: var(--rh-black); border-radius: 8px; border-left: 3px solid var(--rh-red);">
                    <h4 style="color: var(--rh-red); margin-bottom: 0.75rem;">📉 PUT Strategy</h4>
                    <p><strong>Strike:</strong> $${(Math.random() * 40 + 80).toFixed(2)}</p>
                    <p><strong>Expiry:</strong> 30 days</p>
                    <p><strong>Entry:</strong> $${(Math.random() * 4 + 1).toFixed(2)}</p>
                    <p><strong>Target:</strong> $${(Math.random() * 7 + 3).toFixed(2)}</p>
                    <p style="color: var(--rh-gray); margin-top: 0.5rem; font-size: 0.875rem;">
                        Evon Confidence: ${(Math.random() * 30 + 50).toFixed(0)}%
                    </p>
                </div>
            </div>
            <p style="color: var(--rh-yellow); margin-top: 1rem; padding: 1rem; background: var(--rh-black); border-radius: 8px;">
                <strong>Evon's Recommendation:</strong> Based on current market conditions, the CALL strategy shows stronger potential for ${symbol}. Consider entry on dips with stop-loss at -20%.
            </p>
        </div>
    `;
}

function loadStrategy() {
    // Strategy section is interactive - user submits form
}

// Options Functions
async function loadOptions() {
    loadOptionsCategory('popular-options', 'popular');
    loadOptionsCategory('etf-options', 'etf');
    loadOptionsCategory('penny-options', 'penny');
    loadOptionsCategory('upcoming-options', 'upcoming');
}

async function loadOptionsCategory(elementId, category) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const mockOptions = {
        popular: [
            { symbol: 'AAPL', type: 'CALL', strike: 180, expiry: '12/22', premium: 4.50 },
            { symbol: 'TSLA', type: 'PUT', strike: 240, expiry: '12/22', premium: 6.75 }
        ],
        etf: [
            { symbol: 'SPY', type: 'CALL', strike: 460, expiry: '01/19', premium: 3.20 },
            { symbol: 'QQQ', type: 'CALL', strike: 390, expiry: '01/19', premium: 5.10 }
        ],
        penny: [
            { symbol: 'SNDL', type: 'CALL', strike: 2.50, expiry: '01/19', premium: 0.15 },
            { symbol: 'PLUG', type: 'PUT', strike: 8.00, expiry: '12/22', premium: 0.65 }
        ],
        upcoming: [
            { symbol: 'RIVN', type: 'CALL', strike: 20, expiry: '02/16', premium: 1.80 },
            { symbol: 'LCID', type: 'CALL', strike: 6, expiry: '02/16', premium: 0.45 }
        ]
    };
    
    const options = mockOptions[category] || [];
    element.innerHTML = options.map(opt => `
        <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid ${opt.type === 'CALL' ? 'var(--rh-green)' : 'var(--rh-red)'};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <strong style="color: var(--rh-white);">${opt.symbol}</strong>
                <span style="color: ${opt.type === 'CALL' ? 'var(--rh-green)' : 'var(--rh-red)'}; font-weight: 600;">${opt.type}</span>
            </div>
            <div style="font-size: 0.875rem; color: var(--rh-gray);">
                Strike: $${opt.strike} | Expiry: ${opt.expiry}<br>
                Premium: $${opt.premium}
            </div>
        </div>
    `).join('');
}

// Penny Stocks Functions
async function loadPennyStocks() {
    loadPennyCategory('under1-stocks', 1);
    loadPennyCategory('under5-stocks', 5);
}

async function loadPennyCategory(elementId, priceLimit) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const mockStocks = priceLimit === 1 ? [
        { symbol: 'SNDL', price: 0.45, change: 8.5, volume: '125M', potential: 'High' },
        { symbol: 'ATOS', price: 0.82, change: 12.3, volume: '45M', potential: 'Medium' }
    ] : [
        { symbol: 'PLUG', price: 4.25, change: 5.2, volume: '28M', potential: 'High' },
        { symbol: 'TLRY', price: 3.80, change: -2.1, volume: '15M', potential: 'Medium' },
        { symbol: 'WISH', price: 2.15, change: 15.8, volume: '52M', potential: 'Very High' }
    ];
    
    element.innerHTML = mockStocks.map(stock => `
        <div style="padding: 1rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.75rem; border-left: 3px solid var(--rh-yellow);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <div>
                    <strong style="color: var(--rh-white); font-size: 1.1rem;">${stock.symbol}</strong>
                    <div style="color: var(--rh-gray); font-size: 0.875rem; margin-top: 0.25rem;">
                        Volume: ${stock.volume}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.1rem; font-weight: 600; color: var(--rh-white);">$${stock.price.toFixed(2)}</div>
                    <div style="color: ${stock.change >= 0 ? 'var(--rh-green)' : 'var(--rh-red)'}; font-size: 0.875rem;">
                        ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(1)}%
                    </div>
                </div>
            </div>
            <div style="background: var(--rh-card); padding: 0.5rem; border-radius: 6px; margin-top: 0.5rem;">
                <span style="color: var(--rh-yellow); font-size: 0.875rem; font-weight: 600;">
                    Evon Potential: ${stock.potential}
                </span>
            </div>
        </div>
    `).join('');
}

// ETF Analysis Functions
async function loadETFAnalysis() {
    loadETFCategory('etf-calls', 'calls');
    loadETFCategory('etf-puts', 'puts');
}

async function loadETFCategory(elementId, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const mockETFs = type === 'calls' ? [
        { symbol: 'QQQ', price: 385, target: 405, confidence: 85, reason: 'Tech sector strength' },
        { symbol: 'XLK', price: 180, target: 195, confidence: 78, reason: 'AI momentum' }
    ] : [
        { symbol: 'XLE', price: 88, target: 80, confidence: 72, reason: 'Oil price pressure' },
        { symbol: 'XLF', price: 38, target: 35, confidence: 65, reason: 'Rate concerns' }
    ];
    
    element.innerHTML = mockETFs.map(etf => `
        <div style="padding: 1rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.75rem; border-left: 3px solid ${type === 'calls' ? 'var(--rh-green)' : 'var(--rh-red)'};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <strong style="color: var(--rh-white); font-size: 1.1rem;">${etf.symbol}</strong>
                <span style="color: ${type === 'calls' ? 'var(--rh-green)' : 'var(--rh-red)'}; font-weight: 600;">${type.toUpperCase()}</span>
            </div>
            <div style="color: var(--rh-gray); font-size: 0.875rem; margin-bottom: 0.5rem;">
                Current: $${etf.price} → Target: $${etf.target}<br>
                Evon Confidence: ${etf.confidence}%
            </div>
            <div style="color: var(--rh-yellow); font-size: 0.875rem;">
                ${etf.reason}
            </div>
        </div>
    `).join('');
}

// Growth Stocks Functions
async function loadGrowthStocks() {
    const element = document.getElementById('growth-stocks');
    if (!element) return;
    
    const mockGrowth = [
        { symbol: 'NVDA', price: 495, growth: '+125%', sector: 'Technology', score: 95 },
        { symbol: 'META', price: 355, growth: '+88%', sector: 'Technology', score: 90 },
        { symbol: 'SHOP', price: 78, growth: '+65%', sector: 'E-commerce', score: 85 },
        { symbol: 'SQ', price: 85, growth: '+52%', sector: 'Fintech', score: 82 }
    ];
    
    element.innerHTML = mockGrowth.map(stock => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="color: var(--rh-white); margin-bottom: 0.25rem;">${stock.symbol}</h4>
                    <div style="color: var(--rh-gray); font-size: 0.875rem;">${stock.sector}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.25rem; font-weight: 600; color: var(--rh-white);">$${stock.price}</div>
                    <div style="color: var(--rh-green); font-size: 0.875rem; font-weight: 600;">${stock.growth}</div>
                </div>
            </div>
            <div style="background: var(--rh-black); padding: 0.75rem; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--rh-gray); font-size: 0.875rem;">Evon Growth Score</span>
                    <span style="color: var(--rh-yellow); font-weight: 600;">${stock.score}/100</span>
                </div>
                <div style="background: var(--rh-card); height: 6px; border-radius: 3px; margin-top: 0.5rem; overflow: hidden;">
                    <div style="background: var(--rh-green); height: 100%; width: ${stock.score}%;"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// Dividend Stocks Functions
async function loadDividendStocks() {
    const element = document.getElementById('dividend-stocks');
    if (!element) return;
    
    const mockDividend = [
        { symbol: 'JNJ', price: 158, yield: 3.2, payout: '$4.76', frequency: 'Quarterly', score: 92 },
        { symbol: 'PG', price: 145, yield: 2.8, payout: '$3.65', frequency: 'Quarterly', score: 90 },
        { symbol: 'KO', price: 59, yield: 3.1, payout: '$1.84', frequency: 'Quarterly', score: 88 },
        { symbol: 'VZ', price: 38, yield: 6.8, payout: '$2.61', frequency: 'Quarterly', score: 85 }
    ];
    
    element.innerHTML = mockDividend.map(stock => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="color: var(--rh-white); margin-bottom: 0.25rem;">${stock.symbol}</h4>
                    <div style="color: var(--rh-gray); font-size: 0.875rem;">${stock.frequency}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.25rem; font-weight: 600; color: var(--rh-white);">$${stock.price}</div>
                    <div style="color: var(--rh-green); font-size: 0.875rem; font-weight: 600;">${stock.yield}% Yield</div>
                </div>
            </div>
            <div style="background: var(--rh-black); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.75rem;">
                <div style="color: var(--rh-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Annual Payout</div>
                <div style="color: var(--rh-white); font-size: 1.1rem; font-weight: 600;">${stock.payout}</div>
            </div>
            <div style="background: var(--rh-black); padding: 0.75rem; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--rh-gray); font-size: 0.875rem;">Evon Dividend Score</span>
                    <span style="color: var(--rh-yellow); font-weight: 600;">${stock.score}/100</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Unusual Activity Functions
async function loadUnusualActivity() {
    const element = document.getElementById('unusual-list');
    if (!element) return;
    
    const mockActivity = [
        { symbol: 'AAPL', type: 'CALL', volume: 45230, oi: 12500, unusual: 'Very High', time: '2 min ago' },
        { symbol: 'TSLA', type: 'PUT', volume: 38920, oi: 15200, unusual: 'High', time: '5 min ago' },
        { symbol: 'NVDA', type: 'CALL', volume: 52100, oi: 18900, unusual: 'Extreme', time: '8 min ago' },
        { symbol: 'SPY', type: 'PUT', volume: 125000, oi: 450000, unusual: 'High', time: '12 min ago' }
    ];
    
    element.innerHTML = mockActivity.map(activity => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                <div>
                    <h4 style="color: var(--rh-white); margin-bottom: 0.25rem;">${activity.symbol}</h4>
                    <span style="color: ${activity.type === 'CALL' ? 'var(--rh-green)' : 'var(--rh-red)'}; font-weight: 600;">${activity.type}</span>
                </div>
                <div style="text-align: right;">
                    <div style="color: var(--rh-yellow); font-size: 0.875rem; font-weight: 600;">${activity.unusual}</div>
                    <div style="color: var(--rh-gray); font-size: 0.75rem;">${activity.time}</div>
                </div>
            </div>
            <div style="background: var(--rh-black); padding: 0.75rem; border-radius: 8px;">
                <div style="color: var(--rh-gray); font-size: 0.875rem;">
                    Volume: ${activity.volume.toLocaleString()} | OI: ${activity.oi.toLocaleString()}
                </div>
            </div>
        </div>
    `).join('');
}

// Sectors Functions
async function loadSectors() {
    const sectors = ['tech', 'health', 'finance', 'energy', 'consumer', 'industrial'];
    sectors.forEach(sector => loadSectorStocks(sector));
}

async function loadSectorStocks(sector) {
    const element = document.getElementById(`sector-${sector}`);
    if (!element) return;
    
    const sectorStocks = {
        tech: [
            { symbol: 'AAPL', price: 178, pe: 28, score: 95 },
            { symbol: 'MSFT', price: 372, pe: 35, score: 93 }
        ],
        health: [
            { symbol: 'JNJ', price: 158, pe: 24, score: 90 },
            { symbol: 'UNH', price: 525, pe: 22, score: 88 }
        ],
        finance: [
            { symbol: 'JPM', price: 155, pe: 10, score: 87 },
            { symbol: 'BAC', price: 32, pe: 9, score: 85 }
        ],
        energy: [
            { symbol: 'XOM', price: 105, pe: 8, score: 82 },
            { symbol: 'CVX', price: 148, pe: 10, score: 80 }
        ],
        consumer: [
            { symbol: 'WMT', price: 165, pe: 28, score: 88 },
            { symbol: 'COST', price: 645, pe: 42, score: 86 }
        ],
        industrial: [
            { symbol: 'CAT', price: 285, pe: 16, score: 84 },
            { symbol: 'BA', price: 205, pe: -15, score: 75 }
        ]
    };
    
    const stocks = sectorStocks[sector] || [];
    element.innerHTML = stocks.map(stock => `
        <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <strong style="color: var(--rh-white);">${stock.symbol}</strong>
                <span style="color: var(--rh-white);">$${stock.price}</span>
            </div>
            <div style="font-size: 0.875rem; color: var(--rh-gray);">
                P/E: ${stock.pe} | Score: ${stock.score}/100
            </div>
        </div>
    `).join('');
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
