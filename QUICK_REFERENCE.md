# 🎯 Evon AI - Quick Reference Card

## 🚀 Quick Start (3 Steps)

```bash
# 1. Install
npm install

# 2. Configure (copy and edit .env)
cp .env.example .env
# Add your OPENAI_KEY

# 3. Launch
npm start
# Visit http://localhost:3000
```

## 📡 Key Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/api/health` | Server health check | Status, uptime, memory |
| `/api/readiness` | Production readiness | Full system validation |
| `/api/config/status` | API key status | What's configured |
| `/api/evon` | AI chat | Trading analysis |

## 🔑 Environment Variables

### Required
- `OPENAI_KEY` - AI brain (required)

### Optional but Recommended
- `APP_PASSWORD` - Secure your app
- `SESSION_SECRET` - Session security
- `JWT_SECRET` - Token security

### Optional Features
- `ELEVEN_KEY` + `ELEVEN_VOICE_ID` - Voice
- `MONGODB_URI` - Database
- `POLYGON_KEY` - Market data
- `NEWS_API_KEY` - News feeds

## 🌐 Deploy Commands

```bash
# Vercel
vercel

# Netlify
netlify deploy --prod

# Docker
docker-compose up -d

# Heroku
git push heroku main
```

## ✅ Verify Deployment

```bash
# Automated
./verify-deployment.sh https://your-app.com

# Manual
curl https://your-app.com/api/health
curl https://your-app.com/api/readiness
```

## 🛡️ Security Checklist

- ✅ OPENAI_KEY in .env
- ✅ APP_PASSWORD set
- ✅ .env in .gitignore
- ✅ HTTPS in production
- ✅ Secrets not in code

## 📊 Production Status

**Healthy App:**
- `/api/health` → 200 "healthy"
- `/api/readiness` → "ready"
- Frontend loads
- No console errors

**Needs Config:**
- `/api/readiness` → "not_ready"
- Shows recommendations
- Works with demo data

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't start | Check Node.js 18+, run `npm install` |
| "Not configured" | Add API keys to .env |
| Port in use | Change PORT in .env |
| Features not working | Check `/api/readiness` |

## 📚 Documentation

- `README.md` - Full documentation
- `QUICKSTART.md` - Setup guide
- `DEPLOYMENT.md` - Platform guides
- `PRODUCTION_LAUNCH_CHECKLIST.md` - Complete checklist
- `LAUNCH_SUMMARY.md` - Launch overview
- `SECURITY.md` - Security guide

## 🎯 Common Tasks

```bash
# Start development
npm run dev

# Verify everything works
npm start
./verify-deployment.sh http://localhost:3000

# Check for vulnerabilities
npm audit

# Production build
NODE_ENV=production npm start
```

## 💡 Pro Tips

1. **Start minimal**: Just OPENAI_KEY to test
2. **Check readiness**: Use `/api/readiness` endpoint
3. **Secure production**: Always set APP_PASSWORD
4. **Monitor health**: Use `/api/health` for uptime checks
5. **Test before launch**: Run verification script

## 🆘 Quick Support

- Check `/api/readiness` for recommendations
- Review PRODUCTION_LAUNCH_CHECKLIST.md
- Open GitHub issue for bugs
- Security: See SECURITY.md

---

**🚀 You're ready to launch!**

*Educational purposes only. Not financial advice.*
