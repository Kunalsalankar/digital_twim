# 🚀 Solar Panel Digital Twin - Deployment Guide

## 📋 **Hosting Options Overview**

### **Option 1: Free Hosting (Recommended)**
- **Frontend**: Netlify or Vercel
- **Backend**: Railway, Render, or Heroku
- **Cost**: Free tier available
- **Best for**: Demo, portfolio, small projects

### **Option 2: Cloud Hosting**
- **Platform**: AWS, Google Cloud, Azure
- **Cost**: Pay-as-you-go
- **Best for**: Production, scalable applications

### **Option 3: VPS Hosting**
- **Platform**: DigitalOcean, Linode, Vultr
- **Cost**: $5-20/month
- **Best for**: Full control, custom configurations

---

## 🎯 **Quick Deploy (Recommended)**

### **Step 1: Deploy Backend to Railway**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your `digital_twim` repository**
5. **Railway will auto-detect Node.js and deploy**

**Environment Variables to set:**
```
NODE_ENV=production
PORT=3001
```

### **Step 2: Deploy Frontend to Netlify**

1. **Go to [Netlify.com](https://netlify.com)**
2. **Sign in with GitHub**
3. **Click "New site from Git"**
4. **Select your `digital_twim` repository**
5. **Configure build settings:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

6. **Update API URL in frontend:**

```javascript
// In frontend/src/App.js, replace localhost with your Railway URL
const API_URL = 'https://your-railway-app.railway.app';
```

---

## 🔧 **Detailed Deployment Steps**

### **A. Railway Deployment (Backend)**

1. **Create Railway Account**
   ```bash
   # Install Railway CLI (optional)
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy via GitHub**
   - Connect your GitHub repository
   - Railway auto-detects `package.json`
   - Deploys backend automatically

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   ```

4. **Your backend will be available at:**
   ```
   https://your-app-name.railway.app
   ```

### **B. Netlify Deployment (Frontend)**

1. **Build Settings**
   ```toml
   # netlify.toml (already created)
   [build]
     base = "frontend"
     publish = "frontend/build"
     command = "npm run build"
   ```

2. **Update API URLs**
   ```javascript
   // Replace in frontend/src/App.js
   const eventSource = new EventSource('https://your-railway-app.railway.app/api/solar/stream');
   
   // Replace all fetch calls
   fetch('https://your-railway-app.railway.app/api/solar/start', ...)
   ```

### **C. Vercel Deployment (Full Stack)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configuration** (vercel.json already created)

---

## 🐳 **Docker Deployment**

### **Build and Run Locally**
```bash
# Build Docker image
docker build -t solar-panel-twin .

# Run container
docker run -p 3001:3001 solar-panel-twin
```

### **Deploy to Cloud**

#### **Google Cloud Run**
```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT-ID/solar-panel-twin

# Deploy
gcloud run deploy --image gcr.io/PROJECT-ID/solar-panel-twin --platform managed
```

#### **AWS ECS/Fargate**
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

docker build -t solar-panel-twin .
docker tag solar-panel-twin:latest ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/solar-panel-twin:latest
docker push ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/solar-panel-twin:latest
```

---

## 🌐 **Custom Domain Setup**

### **Netlify Custom Domain**
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

### **Railway Custom Domain**
1. Go to your project settings
2. Add custom domain
3. Update DNS CNAME record

---

## ⚙️ **Environment Configuration**

### **Production Environment Variables**
```bash
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
```

### **Frontend Environment Variables**
```bash
# Create .env.production in frontend/
REACT_APP_API_URL=https://your-backend-domain.com
```

---

## 🔍 **Monitoring & Maintenance**

### **Health Checks**
- Backend health: `https://your-backend.com/api/health`
- Monitor uptime with UptimeRobot or Pingdom

### **Logs**
- Railway: Built-in logging dashboard
- Netlify: Function logs and deploy logs
- Vercel: Real-time logs in dashboard

### **Performance**
- Use Lighthouse for frontend performance
- Monitor API response times
- Set up error tracking (Sentry)

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**
   ```javascript
   // Update server.js CORS configuration
   app.use(cors({
     origin: ['https://your-frontend-domain.com', 'http://localhost:3000'],
     credentials: true
   }));
   ```

2. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm run build --reset-cache
   ```

3. **API Connection Issues**
   - Check environment variables
   - Verify API URLs in frontend
   - Test endpoints manually

### **Debug Commands**
```bash
# Check build logs
netlify logs

# Test API endpoints
curl https://your-backend.com/api/health

# Check environment variables
railway variables
```

---

## 📊 **Cost Estimates**

### **Free Tier Limits**
- **Netlify**: 100GB bandwidth, 300 build minutes
- **Railway**: $5 credit monthly, then $0.000463/GB-hour
- **Vercel**: 100GB bandwidth, 6000 build minutes

### **Paid Plans**
- **Railway Pro**: $20/month
- **Netlify Pro**: $19/month
- **Vercel Pro**: $20/month

---

## 🎉 **Quick Start Commands**

```bash
# 1. Build frontend
cd frontend && npm run build

# 2. Deploy to Railway (via GitHub)
# - Connect repository at railway.app

# 3. Deploy to Netlify (via GitHub)
# - Connect repository at netlify.com

# 4. Update API URLs in frontend
# - Replace localhost with production URLs

# 5. Test deployment
curl https://your-backend.com/api/health
```

---

## 📞 **Support**

If you encounter issues:
1. Check the logs in your hosting dashboard
2. Verify environment variables
3. Test API endpoints manually
4. Check CORS configuration

Your Solar Panel Digital Twin is now ready for production! 🌞⚡
