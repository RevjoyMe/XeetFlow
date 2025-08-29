# XeetFlow - Crypto Twitter Analytics Platform

A modern web application for analyzing crypto influencers from Xeet.ai leaderboards with real-time data parsing, filtering, and automatic global synchronization powered by Firebase.

## 🚀 Features

- **🏆 Dual Tournament Support**: Both "Leagues" and "Signals" tournaments
- **⚡ Real-time Data Parsing**: Direct API integration with Xeet.ai
- **🔍 Advanced Filtering**: Search by username, filter by score and noise points
- **📊 Interactive Sorting**: Sort by score, followers, signal score, or noise points
- **🎨 Modern Design**: Dark theme with Tailwind CSS
- **📄 Smart Pagination**: Handle large datasets efficiently
- **🔥 Real-time Global Sync**: Firebase Realtime Database for instant data sharing
- **🔄 Automatic Updates**: Data updates automatically for all users worldwide
- **📱 Responsive**: Works perfectly on all devices

## 🎯 How It Works

1. **User A** clicks "Update Data" and parses fresh statistics from Xeet.ai
2. **Data is automatically saved** to Firebase Realtime Database
3. **All other users worldwide** instantly receive the updated data
4. **Notifications appear** showing "Data updated from another user!"
5. **No manual refresh needed** - everything updates automatically

## 🚀 Quick Start

### Option 1: Use the Live Demo
Simply visit the deployed application - no setup required!

### Option 2: Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RevjoyMe/XeetFlow.git
   cd XeetFlow
   ```

2. **Set up Firebase** (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))

3. **Open `index.html`** in your browser

4. **Select a tournament** (Leagues or Signals)

5. **Click "Update Data"** to load fresh statistics

## 🔥 Real-time Global Synchronization

This application uses **Firebase Realtime Database** for automatic data synchronization:

- ✅ **No user setup required** - works out of the box
- ✅ **Real-time updates** - data syncs instantly across all users
- ✅ **Automatic notifications** - users know when data is updated
- ✅ **Free tier** - up to 1GB data and 10GB traffic per month
- ✅ **Secure** - built-in authentication and security rules

### Setup Instructions

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed Firebase setup instructions.

## 📊 API Configuration

### Leagues Tournament
- **URL**: `https://www.xeet.ai/api/tournaments/xeet-tournament-1/leaderboard`
- **Pages**: 1797 (~35,940 records)
- **Description**: Main tournament with comprehensive statistics

### Signals Tournament
- **URL**: `https://www.xeet.ai/api/tournaments/5ea420b7-17c1-4a9d-9501-0fcaa60387f9/leaderboard`
- **Pages**: 431 (~8,620 records)
- **Description**: Signals-focused tournament

## 📈 Extracted Data

For each crypto influencer, the following data is collected:

- `rank` - ranking position
- `username` - username
- `followerCount` - number of followers
- `score` - overall score (rounded to 2 decimal places)
- `signalScore` - signal score (rounded to 2 decimal places)
- `noisePoints` - noise points (rounded to 2 decimal places)
- `totalEngagement` - total engagement
- `engagementRate` - engagement rate
- `averageEngagementPerPost` - average engagement per post
- `avatar` - profile picture URL
- `name` - display name

## 🛠️ Technologies Used

- **HTML5** - Structure
- **Tailwind CSS** - Modern styling
- **Vanilla JavaScript** - Functionality
- **Firebase Realtime Database** - Global data synchronization
- **Firebase SDK** - Real-time data management
- **PapaParse** - CSV parsing (legacy support)

## 📁 Project Structure

```
├── index.html                 # 🚀 MAIN web application
├── firebase-config.js         # Firebase configuration
├── firebase-api.js           # Firebase API wrapper
├── FIREBASE_SETUP.md         # Firebase setup instructions
├── GITHUB_SETUP.md           # Legacy GitHub Gist setup (deprecated)
├── xeet_leaderboard_parser.py # Python parser (standalone)
├── README.md                 # This documentation
└── legacy/                   # Legacy files (if any)
```

## 🔧 Development

### Local Development
1. Set up Firebase project
2. Update `firebase-config.js` with your Firebase credentials
3. Open `index.html` in browser
4. Start developing!

### Deployment
The application can be deployed to any static hosting service:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**

## 📊 Performance

- **Parsing Speed**: ~15 minutes (Leagues), ~4 minutes (Signals)
- **Real-time Sync**: Instant updates across all users
- **Data Size**: ~35,940 records (Leagues), ~8,620 records (Signals)
- **Request Delay**: 0.5 seconds between API calls

## 🛡️ Security

- **Firebase Security Rules** - configurable access control
- **Test Mode** - simple setup for development
- **Production Ready** - can be secured for production use

## 🚨 Error Handling

The application includes comprehensive error handling:
- Network error recovery
- JSON parsing error handling
- Request timeouts (30 seconds)
- Graceful fallbacks to localStorage
- User-friendly error messages

## 📈 Analytics & Monitoring

Firebase provides built-in analytics:
- **Usage Statistics** - data transfer and storage
- **User Activity** - real-time user count
- **Performance Monitoring** - response times and errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use and modify as needed.

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Questions**: Open a discussion on GitHub

---

**🔥 XeetFlow - Where Crypto Analytics Meets Real-time Collaboration! 🌍**
