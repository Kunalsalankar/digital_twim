# 🚀 Vercel Deployment Guide - Solar Panel Digital Twin

## 📋 **Quick Deploy Steps**

### **Method 1: Deploy via Vercel CLI (Recommended)**

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy from your project directory**
   ```bash
   vercel --prod
   ```

3. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N**
   - What's your project's name? **solar-panel-twin**
   - In which directory is your code located? **./**

### **Method 2: Deploy via GitHub (Auto-Deploy)**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import your `digital_twim` repository**
5. **Configure project:**
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `frontend/build`

## ⚙️ **Environment Variables**

Set these in Vercel Dashboard (Project Settings → Environment Variables):

```bash
NODE_ENV=production
REACT_APP_API_URL=https://your-vercel-app.vercel.app
```

## 🔧 **Project Structure for Vercel**

```
digital_twim/
├── server.js              # Backend API (Vercel Functions)
├── package.json           # Root dependencies + build scripts
├── vercel.json           # Vercel configuration
├── final.csv             # Your data file
├── frontend/
│   ├── package.json      # Frontend dependencies
│   ├── src/
│   └── build/            # Built React app (auto-generated)
└── api/                  # Vercel will create this for serverless functions
```

## 🌐 **How It Works**

1. **Frontend**: React app served as static files
2. **Backend**: Node.js server runs as Vercel serverless functions
3. **API Routes**: All `/api/*` routes go to your server.js
4. **Static Routes**: All other routes serve your React app

## 📊 **Live URLs After Deployment**

- **Main App**: `https://your-app-name.vercel.app`
- **API Health**: `https://your-app-name.vercel.app/api/health`
- **Panel Data**: `https://your-app-name.vercel.app/api/solar/live-panels`
- **SSE Stream**: `https://your-app-name.vercel.app/api/solar/stream`

## 🚨 **Troubleshooting**

### **Build Errors**
```bash
# If build fails, try locally first
npm run build
cd frontend && npm run build
```

### **API Not Working**
- Check Vercel function logs in dashboard
- Verify `vercel.json` routing configuration
- Test API endpoints manually

### **CORS Issues**
```javascript
// Update server.js if needed
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### **Environment Variables**
- Set in Vercel Dashboard → Project Settings → Environment Variables
- Redeploy after adding new variables

## 🔄 **Auto-Deploy Setup**

1. **Connect GitHub**: Link your repository in Vercel dashboard
2. **Auto-deploy**: Every push to `main` branch auto-deploys
3. **Preview**: Pull requests get preview deployments

## 📈 **Vercel Limits (Free Plan)**

- **Bandwidth**: 100GB/month
- **Function Execution**: 100GB-hours/month
- **Function Duration**: 10 seconds max
- **Deployments**: Unlimited

## 🎯 **Deployment Commands**

```bash
# Deploy to production
vercel --prod

# Deploy preview (staging)
vercel

# Check deployment status
vercel ls

# View logs
vercel logs your-app-name

# Remove deployment
vercel rm your-app-name
```

## 🔧 **Local Development**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Run locally with Vercel environment
vercel dev

# This will:
# - Start your React app on port 3000
# - Start your API functions
# - Simulate Vercel's routing
```

## 🌟 **Pro Tips**

1. **Custom Domain**: Add in Vercel dashboard → Domains
2. **Analytics**: Enable in Project Settings → Analytics
3. **Performance**: Use Vercel's built-in optimization
4. **Monitoring**: Set up alerts for function errors

## 📞 **Support**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

Your Solar Panel Digital Twin will be live at `https://your-app-name.vercel.app` 🌞⚡
