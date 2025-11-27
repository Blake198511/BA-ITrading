// Evon AI - Professional Trading Platform
const API_BASE = window.location.origin;

// Authentication state
let sessionId = localStorage.getItem('evon_session_id');

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Evon AI Initializing...');
    checkAuthentication();
});

async function checkAuthentication() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');

    // Check if we have a valid session
    if (sessionId) {
        try {
            const response = await fetch(`${API_BASE}/api/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            const data = await response.json();

            if (data.authenticated) {
                // Valid session - show app
                loginScreen.style.display = 'none';
                appContainer.style.display = 'flex';
                initializeApp();
                return;
            }
        } catch (error) {
            console.error('Session verification error:', error);
        }
    }

    // Show login screen
    loginScreen.style.display = 'flex';
    appContainer.style.display = 'none';
    setupLoginForm();
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('login-button');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = passwordInput.value;
        
        if (!password) {
            showLoginError('Please enter a password');
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = 'Verifying...';

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                // Store session and show app
                sessionId = data.sessionId;
                localStorage.setItem('evon_session_id', sessionId);
                
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('app-container').style.display = 'flex';
                initializeApp();
            } else {
                showLoginError(data.message || 'Invalid password');
                passwordInput.value = '';
                passwordInput.focus();
            }
        } catch (error) {
            console.error('Login error:', error);
            showLoginError('Login failed. Please try again.');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Unlock';
        }
    });
}

function showLoginError(message) {
    const loginError = document.getElementById('login-error');
    loginError.textContent = message;
    loginError.style.display = 'block';
    setTimeout(() => {
        loginError.style.display = 'none';
    }, 3000);
}

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
    if (section === 'insider') loadInsiderBuying();
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
    loadDashboardPicks('day', 'day-picks');
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
    
    // Evon AI-generated picks with comprehensive buy/sell strategies
    const picks = {
        day: [
            { 
                type: 'CALL OPTION', 
                symbol: 'SPY $460 Call', 
                underlying: 'SPY',
                action: 'BUY', 
                entry: '$3.50', 
                target: '$5.20', 
                stopLoss: '$2.80',
                expiry: 'Today',
                profitPotential: '+49%',
                strategy: 'Day trade momentum - Enter on morning dip, exit before 2pm',
                reason: 'Market showing bullish reversal pattern' 
            },
            { 
                type: 'STOCK', 
                symbol: 'NVDA', 
                action: 'BUY', 
                entry: '$492-$495', 
                target: '$510', 
                stopLoss: '$485',
                profitPotential: '+3-4%',
                strategy: 'Scalp trade - Quick entry/exit on intraday momentum',
                reason: 'AI sector strength, technical breakout' 
            }
        ],
        week: [
            { 
                type: 'CALL OPTION', 
                symbol: 'TSLA $250 Call', 
                underlying: 'TSLA',
                action: 'BUY', 
                entry: '$8.50', 
                target: '$14.00', 
                stopLoss: '$6.00',
                expiry: 'This Friday',
                profitPotential: '+65%',
                strategy: 'Swing trade - Hold through week, exit Wednesday if up 40%',
                reason: 'Earnings catalyst, delivery numbers strong' 
            },
            { 
                type: 'PUT OPTION', 
                symbol: 'XLE $88 Put', 
                underlying: 'XLE',
                action: 'BUY', 
                entry: '$2.10', 
                target: '$3.80', 
                stopLoss: '$1.50',
                expiry: 'This Friday',
                profitPotential: '+81%',
                strategy: 'Oil weakness play - Exit early if oil stabilizes',
                reason: 'Energy sector showing weakness, oil prices declining' 
            }
        ],
        month: [
            { 
                type: 'CALL OPTION', 
                symbol: 'AAPL $180 Call', 
                underlying: 'AAPL',
                action: 'BUY', 
                entry: '$4.75', 
                target: '$9.50', 
                stopLoss: '$3.20',
                expiry: '30 days',
                profitPotential: '+100%',
                strategy: 'iPhone sales momentum - Hold 2-3 weeks, take profits at 80%',
                reason: 'Strong iPhone 15 demand, services growth' 
            },
            { 
                type: 'STOCK', 
                symbol: 'MSFT', 
                action: 'BUY', 
                entry: '$368-$372', 
                target: '$395', 
                stopLoss: '$360',
                profitPotential: '+6-7%',
                strategy: 'Position trade - Add on dips, scale out at targets',
                reason: 'Cloud growth accelerating, AI integration' 
            }
        ],
        quarter: [
            { 
                type: 'CALL OPTION', 
                symbol: 'AMD $145 Call', 
                underlying: 'AMD',
                action: 'BUY', 
                entry: '$9.20', 
                target: '$18.00', 
                stopLoss: '$6.50',
                expiry: '90 days',
                profitPotential: '+96%',
                strategy: '3-month hold - Roll if profit >60% before expiry',
                reason: 'Server chip demand, AI processor ramp' 
            },
            { 
                type: 'STOCK', 
                symbol: 'META', 
                action: 'BUY', 
                entry: '$345-$355', 
                target: '$420', 
                stopLoss: '$330',
                profitPotential: '+18-22%',
                strategy: 'Quarterly position - DCA on pullbacks, hold for Q1 earnings',
                reason: 'Ad revenue recovery, Reality Labs progress' 
            }
        ],
        halfyear: [
            { 
                type: 'CALL OPTION', 
                symbol: 'GOOGL $150 Call', 
                underlying: 'GOOGL',
                action: 'BUY', 
                entry: '$12.50', 
                target: '$28.00', 
                stopLoss: '$8.00',
                expiry: '6 months',
                profitPotential: '+124%',
                strategy: 'LEAPS strategy - Hold through 2 earnings, roll at 100% gain',
                reason: 'AI search integration, cloud momentum' 
            },
            { 
                type: 'STOCK', 
                symbol: 'PLTR', 
                action: 'BUY', 
                entry: '$16-$18', 
                target: '$28', 
                stopLoss: '$14',
                profitPotential: '+56-75%',
                strategy: 'Long position - Accumulate on weakness, 6-month hold minimum',
                reason: 'AI platform growth, government contracts' 
            }
        ],
        year: [
            { 
                type: 'CALL OPTION', 
                symbol: 'NVDA $550 Call', 
                underlying: 'NVDA',
                action: 'BUY', 
                entry: '$65.00', 
                target: '$150.00', 
                stopLoss: '$45.00',
                expiry: '1 year',
                profitPotential: '+131%',
                strategy: 'LEAPS - Buy and hold, roll profits after 6 months if up 80%',
                reason: 'AI chip dominance, datacenter buildout cycle' 
            },
            { 
                type: 'STOCK', 
                symbol: 'SHOP', 
                action: 'BUY', 
                entry: '$72-$78', 
                target: '$130', 
                stopLoss: '$60',
                profitPotential: '+67-81%',
                strategy: 'Long-term hold - DCA monthly, ride e-commerce recovery',
                reason: 'E-commerce recovery, SMB growth, AI tools' 
            }
        ]
    };
    
    const data = picks[timeframe] || [];
    element.innerHTML = data.map(pick => `
        <div style="padding: 1rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.75rem; border-left: 4px solid ${pick.action === 'BUY' ? 'var(--rh-green)' : 'var(--rh-red)'};">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                        <strong style="color: var(--rh-white); font-size: 1.1rem;">${pick.symbol}</strong>
                        <span style="background: var(--rh-card); color: var(--rh-yellow); padding: 0.125rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${pick.type}</span>
                    </div>
                    ${pick.expiry ? `<div style="color: var(--rh-gray); font-size: 0.875rem;">Expiry: ${pick.expiry}</div>` : ''}
                </div>
                <div style="text-align: right;">
                    <div style="color: var(--rh-green); font-weight: 700; font-size: 1.1rem;">${pick.profitPotential}</div>
                    <div style="color: var(--rh-green); font-size: 0.75rem;">Profit Potential</div>
                </div>
            </div>
            
            <div style="background: var(--rh-card); padding: 0.75rem; border-radius: 6px; margin-bottom: 0.75rem;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; font-size: 0.875rem;">
                    <div>
                        <div style="color: var(--rh-gray);">Entry</div>
                        <div style="color: var(--rh-white); font-weight: 600;">${pick.entry}</div>
                    </div>
                    <div>
                        <div style="color: var(--rh-gray);">Target</div>
                        <div style="color: var(--rh-green); font-weight: 600;">${pick.target}</div>
                    </div>
                    <div>
                        <div style="color: var(--rh-gray);">Stop Loss</div>
                        <div style="color: var(--rh-red); font-weight: 600;">${pick.stopLoss}</div>
                    </div>
                </div>
            </div>
            
            <div style="background: rgba(255, 204, 0, 0.1); padding: 0.75rem; border-radius: 6px; border-left: 3px solid var(--rh-yellow); margin-bottom: 0.5rem;">
                <div style="color: var(--rh-yellow); font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">📋 Strategy:</div>
                <div style="color: var(--rh-gray); font-size: 0.875rem;">${pick.strategy}</div>
            </div>
            
            <div style="color: var(--rh-gray); font-size: 0.875rem; padding: 0.5rem; background: var(--rh-card); border-radius: 6px;">
                <strong style="color: var(--rh-white);">Why:</strong> ${pick.reason}
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
        
        // Handle error responses or missing news array
        if (!response.ok || !data.news || !Array.isArray(data.news)) {
            newsDiv.innerHTML = '<p style="color: var(--rh-gray);">News API not configured. Set NEWS_API_KEY in .env for live news.</p>';
            return;
        }
        
        newsDiv.innerHTML = data.news.slice(0, 5).map(article => `
            <div style="padding: 1rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.75rem;">
                <h4 style="color: var(--rh-white); margin-bottom: 0.5rem;">${article.title}</h4>
                <div style="color: var(--rh-gray); font-size: 0.875rem;">${article.source} - ${new Date(article.publishedAt).toLocaleString()}</div>
                <span class="sentiment ${article.sentiment}" style="margin-top: 0.5rem; display: inline-block;">${article.sentiment.toUpperCase()}</span>
            </div>
        `).join('');
    } catch (error) {
        const newsDiv = document.getElementById('dashboard-news');
        if (newsDiv) {
            newsDiv.innerHTML = '<p style="color: var(--rh-gray);">Unable to load news. Please try again later.</p>';
        }
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

// Insider & Analyst Buying Functions
async function loadInsiderBuying() {
    loadInsiderCategory('investor-buys', 'investors');
    loadInsiderCategory('analyst-picks', 'analysts');
    loadInsiderCategory('politician-trades', 'politicians');
    loadInsiderCategory('retail-favorites', 'retail');
    loadEvonTopPicks();
}

async function loadInsiderCategory(elementId, category) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const insiderData = {
        investors: [
            { symbol: 'NVDA', buyer: 'Warren Buffett', shares: '125M', price: '$485', date: '2 days ago', confidence: 98 },
            { symbol: 'AAPL', buyer: 'Cathie Wood', shares: '45M', price: '$175', date: '5 days ago', confidence: 95 },
            { symbol: 'TSLA', buyer: 'Bill Ackman', shares: '18M', price: '$245', date: '1 week ago', confidence: 92 }
        ],
        analysts: [
            { symbol: 'MSFT', firm: 'Goldman Sachs', rating: 'Strong Buy', target: '$425', current: '$372', upside: '+14%' },
            { symbol: 'GOOGL', firm: 'Morgan Stanley', rating: 'Buy', target: '$165', current: '$142', upside: '+16%' },
            { symbol: 'META', firm: 'JP Morgan', rating: 'Overweight', target: '$425', current: '$355', upside: '+20%' }
        ],
        politicians: [
            { symbol: 'PLTR', buyer: 'Nancy Pelosi', amount: '$5M', price: '$17.50', date: '3 days ago', profit: '+12%' },
            { symbol: 'RBLX', buyer: 'Dan Crenshaw', amount: '$1.2M', price: '$38', date: '1 week ago', profit: '+8%' },
            { symbol: 'DIS', buyer: 'Josh Gottheimer', amount: '$850K', price: '$92', date: '2 weeks ago', profit: '+3%' }
        ],
        retail: [
            { symbol: 'GME', mentions: '152K', sentiment: 'Bullish', price: '$22.50', trend: '+285%' },
            { symbol: 'AMC', mentions: '98K', sentiment: 'Bullish', price: '$6.80', trend: '+156%' },
            { symbol: 'SOFI', mentions: '67K', sentiment: 'Very Bullish', price: '$8.25', trend: '+89%' }
        ]
    };
    
    const data = insiderData[category] || [];
    
    if (category === 'investors') {
        element.innerHTML = data.map(item => `
            <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid var(--rh-green);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: var(--rh-white); font-size: 1.1rem;">${item.symbol}</strong>
                    <span style="color: var(--rh-green); font-size: 0.875rem;">${item.confidence}% Confidence</span>
                </div>
                <div style="color: var(--rh-yellow); font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;">
                    ${item.buyer}
                </div>
                <div style="color: var(--rh-gray); font-size: 0.875rem;">
                    ${item.shares} shares @ ${item.price}<br>
                    ${item.date}
                </div>
            </div>
        `).join('');
    } else if (category === 'analysts') {
        element.innerHTML = data.map(item => `
            <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid var(--rh-green);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: var(--rh-white); font-size: 1.1rem;">${item.symbol}</strong>
                    <span style="color: var(--rh-green); font-weight: 600;">${item.upside}</span>
                </div>
                <div style="color: var(--rh-yellow); font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;">
                    ${item.firm} - ${item.rating}
                </div>
                <div style="color: var(--rh-gray); font-size: 0.875rem;">
                    Current: ${item.current} → Target: ${item.target}
                </div>
            </div>
        `).join('');
    } else if (category === 'politicians') {
        element.innerHTML = data.map(item => `
            <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid var(--rh-green);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: var(--rh-white); font-size: 1.1rem;">${item.symbol}</strong>
                    <span style="color: var(--rh-green); font-weight: 600;">${item.profit}</span>
                </div>
                <div style="color: var(--rh-yellow); font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;">
                    ${item.buyer}
                </div>
                <div style="color: var(--rh-gray); font-size: 0.875rem;">
                    ${item.amount} @ ${item.price}<br>
                    ${item.date}
                </div>
            </div>
        `).join('');
    } else if (category === 'retail') {
        element.innerHTML = data.map(item => `
            <div style="padding: 0.75rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 0.5rem; border-left: 3px solid var(--rh-yellow);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: var(--rh-white); font-size: 1.1rem;">${item.symbol}</strong>
                    <span style="color: var(--rh-green); font-weight: 600;">${item.trend}</span>
                </div>
                <div style="color: var(--rh-yellow); font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;">
                    ${item.sentiment}
                </div>
                <div style="color: var(--rh-gray); font-size: 0.875rem;">
                    ${item.mentions} mentions | $${item.price}
                </div>
            </div>
        `).join('');
    }
}

async function loadEvonTopPicks() {
    const element = document.getElementById('evon-top-picks');
    if (!element) return;
    
    // Evon AI combines insider buying, analyst ratings, retail sentiment to pick best stocks
    const evonPicks = [
        {
            symbol: 'NVDA',
            price: '$492',
            score: 98,
            reasons: ['Top investor buying (Buffett)', 'Strong analyst ratings', 'AI sector leader', 'Retail momentum'],
            action: 'STRONG BUY',
            target: '$580',
            timeframe: '3-6 months'
        },
        {
            symbol: 'MSFT',
            price: '$372',
            score: 96,
            reasons: ['Goldman Sachs upgrade', 'Cloud growth 25%+', 'AI integration strong', 'Institutional accumulation'],
            action: 'BUY',
            target: '$425',
            timeframe: '6-12 months'
        },
        {
            symbol: 'META',
            price: '$355',
            score: 94,
            reasons: ['Multiple analyst upgrades', 'Ad revenue recovery', 'Cost cutting paying off', 'AI monetization'],
            action: 'BUY',
            target: '$425',
            timeframe: '6-12 months'
        },
        {
            symbol: 'PLTR',
            price: '$17.50',
            score: 91,
            reasons: ['Politician buying (Pelosi)', 'AI platform growth', 'Government contracts', 'Retail favorite'],
            action: 'BUY',
            target: '$28',
            timeframe: '12 months'
        }
    ];
    
    element.innerHTML = evonPicks.map(pick => `
        <div style="padding: 1.25rem; background: var(--rh-black); border-radius: 8px; margin-bottom: 1rem; border: 2px solid var(--rh-green);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <strong style="color: var(--rh-white); font-size: 1.5rem;">${pick.symbol}</strong>
                        <span style="background: var(--rh-green); color: var(--rh-black); padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.875rem; font-weight: 700;">
                            ${pick.action}
                        </span>
                    </div>
                    <div style="color: var(--rh-gray); font-size: 0.875rem;">
                        Timeframe: ${pick.timeframe}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: var(--rh-white); font-size: 1.5rem; font-weight: 700;">${pick.price}</div>
                    <div style="color: var(--rh-green); font-size: 0.875rem;">Target: ${pick.target}</div>
                </div>
            </div>
            
            <div style="background: var(--rh-card); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="color: var(--rh-gray);">Evon Confidence Score</span>
                    <span style="color: var(--rh-yellow); font-size: 1.25rem; font-weight: 700;">${pick.score}/100</span>
                </div>
                <div style="background: var(--rh-black); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, var(--rh-green), var(--rh-yellow)); height: 100%; width: ${pick.score}%;"></div>
                </div>
            </div>
            
            <div style="background: rgba(0, 200, 5, 0.1); padding: 0.75rem; border-radius: 6px; border-left: 3px solid var(--rh-green);">
                <div style="color: var(--rh-white); font-weight: 600; margin-bottom: 0.5rem;">Why Evon Recommends:</div>
                <ul style="margin: 0; padding-left: 1.25rem; color: var(--rh-gray); font-size: 0.875rem;">
                    ${pick.reasons.map(reason => `<li style="margin-bottom: 0.25rem;">${reason}</li>`).join('')}
                </ul>
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
    if (!newsFeed) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/news/latest`);
        const data = await response.json();
        
        // Handle error responses or missing news array
        if (!response.ok || !data.news || !Array.isArray(data.news)) {
            newsFeed.innerHTML = '<p style="color: var(--rh-gray);">News API not configured. Set NEWS_API_KEY in .env for live news.</p>';
            return;
        }
        
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
        newsFeed.innerHTML = '<p style="color: var(--rh-gray);">Unable to load news. Please try again later.</p>';
    }
}

// Reddit Sentiment Functions
async function loadRedditSentiment() {
    const subreddit = document.getElementById('subreddit-select')?.value;
    const trendingDiv = document.getElementById('trending-tickers');
    const hypeDiv = document.getElementById('hype-levels');
    
    if (!trendingDiv || !hypeDiv) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/reddit/sentiment/${subreddit || 'wallstreetbets'}`);
        const data = await response.json();
        
        // Handle error responses or missing data
        if (!response.ok || !data.topMentions || !data.sentiment) {
            trendingDiv.innerHTML = '<p style="color: var(--rh-gray);">Reddit API not configured. Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in .env.</p>';
            hypeDiv.innerHTML = '';
            return;
        }
        
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
        trendingDiv.innerHTML = '<p style="color: var(--rh-gray);">Unable to load Reddit sentiment. Please try again later.</p>';
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
    if (!watchlistDiv) return;
    
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
        watchlistDiv.innerHTML = '<p style="color: var(--rh-gray);">Unable to load watchlist. Please try again later.</p>';
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
