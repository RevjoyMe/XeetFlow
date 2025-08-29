# XeetFlow - Crypto Twitter Analytics Platform

A comprehensive platform for parsing and analyzing crypto influencers data from Xeet.ai tournament leaderboard.

## Description

The platform automatically collects data from all tournament participants by processing multiple API pages with pagination. The platform supports two different tournaments:

- **🏆 Leagues Tournament**: 1797 pages, ~35,940 records
- **📊 Signals Tournament**: 431 pages, ~8,620 records

Each tournament has its own leaderboard with different statistics and participants. Extracted information is saved to separate CSV files for each tournament.

## Features

- ✅ Paginated API processing (431 pages)
- ✅ Extraction of all required data fields
- ✅ Error handling and retry mechanisms
- ✅ Request delays to reduce server load
- ✅ UTF-8 CSV file saving
- ✅ Detailed progress logging

## Extracted Data

For each crypto influencer, the following data is collected:

- `rank` - ranking position
- `username` - username
- `followerCount` - number of followers
- `score` - overall score
- `signalScore` - signal score
- `noisePoints` - noise points
- `totalEngagement` - total engagement
- `engagementRate` - engagement rate
- `averageEngagementPerPost` - average engagement per post

## Installation

1. Make sure you have Python 3.7+ installed
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### Data Parsing

Run the parser script for specific tournaments:

```bash
# Parse Leagues Tournament (default)
python xeet_leaderboard_parser.py leagues

# Parse Signals Tournament
python xeet_leaderboard_parser.py signals

# Or just run without arguments (defaults to leagues)
python xeet_leaderboard_parser.py
```

The script will automatically:
1. Start processing all pages for the selected tournament
2. Display progress in the console
3. Save the result to tournament-specific CSV files

### Data Analysis

After obtaining data, run the analysis script:

```bash
python analyze_data.py
```

The analysis script will create:
- Detailed statistics for all metrics
- Correlation analysis between indicators
- Data distribution visualizations
- Top performers analysis
- PNG format graphs

### Web Interface

For interactive data viewing and filtering, open the web application:

```bash
# Basic version (CSV file upload)
start index.html

# Version with avatar support (CSV file upload)
start index_with_avatars.html

# 🚀 STANDALONE version (built-in API parsing)
start index_standalone.html
```

**Web Interface Features:**
- 📊 CSV file upload through browser
- 🔍 Search by username
- 📈 Sorting by score, followers, signal, noise
- 🎯 Filtering by score and noise points ranges
- 🎨 Dark theme with modern design
- 📱 Responsive design for all devices
- 👤 Avatar display (in enhanced version)

**🚀 Standalone Application (index_standalone.html):**
- ⚡ Built-in API parsing directly in browser
- 🏆 Support for both Leagues and Signals tournaments
- 🔄 "Update Data" button for loading fresh statistics
- 📊 Progress bar and real-time loading status
- 💾 Automatic data saving in localStorage (separate for each tournament)
- 🎯 All filtering and sorting functions
- 👤 Automatic avatar display
- ⏱️ Request delays to reduce server load

## Output Files

### Leagues Tournament Files
- `xeet_leagues_stats.csv` - Main statistics data
- `xeet_leagues_avatars.csv` - Avatar data
- `xeet_leagues_metadata.json` - Parsing metadata

### Signals Tournament Files
- `xeet_signals_stats.csv` - Main statistics data
- `xeet_signals_avatars.csv` - Avatar data
- `xeet_signals_metadata.json` - Parsing metadata

### Data Structure
Main statistics CSV files contain the following headers:

```csv
rank,username,followerCount,score,signalScore,noisePoints,totalEngagement,engagementRate,averageEngagementPerPost
```

Avatar CSV files contain:

```csv
username,avatar,name
```

Where:
- `username` - username
- `avatar` - avatar link
- `name` - display name

## API Endpoints

The script uses different API endpoints for each tournament:

### Leagues Tournament
```
https://www.xeet.ai/api/tournaments/xeet-tournament-1/leaderboard
```
- `page` - page number (1-1797)
- `limit` - records per page (20)

### Signals Tournament
```
https://www.xeet.ai/api/tournaments/5ea420b7-17c1-4a9d-9501-0fcaa60387f9/leaderboard
```
- `page` - page number (1-431)
- `limit` - records per page (20)

## Error Handling

The script includes:
- Network error handling
- JSON parsing error handling
- Request timeouts (30 seconds)
- Skipping problematic pages with continued operation

## Performance

- Delay between requests: 0.5 seconds
- Expected execution time: ~15 minutes (Leagues), ~4 minutes (Signals)
- Expected number of records: ~35,940 (Leagues: 1797 pages × 20 records), ~8,620 (Signals: 431 pages × 20 records)

## Project Structure

```
├── xeet_leaderboard_parser.py  # Main parser script
├── analyze_data.py             # Data analysis script
├── requirements.txt            # Python dependencies
├── README.md                  # Documentation
├── index.html                 # Web application for data viewing
├── index_with_avatars.html    # Enhanced version with avatar support
├── index_standalone.html      # 🚀 STANDALONE application with built-in parsing
├── xeet_leagues_stats.csv     # Leagues tournament data
├── xeet_leagues_avatars.csv   # Leagues tournament avatars
├── xeet_leagues_metadata.json # Leagues tournament metadata
├── xeet_signals_stats.csv     # Signals tournament data
├── xeet_signals_avatars.csv   # Signals tournament avatars
└── xeet_signals_metadata.json # Signals tournament metadata
```

## Usage Example

```python
from xeet_leaderboard_parser import XeetLeaderboardParser

# Create parser instance for Leagues tournament
parser_leagues = XeetLeaderboardParser("leagues")
parser_leagues.run()

# Create parser instance for Signals tournament
parser_signals = XeetLeaderboardParser("signals")
parser_signals.run()
```

## Notes

- The script uses User-Agent headers to mimic browser requests
- All data is saved in UTF-8 encoding for proper character display
- If errors occur on individual pages, the script continues with the remaining pages
