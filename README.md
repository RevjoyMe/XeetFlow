# XeetFlow - Crypto Twitter Analytics Platform

A comprehensive platform for parsing and analyzing crypto influencers data from Xeet.ai tournament leaderboard.

## Description

The platform automatically collects data from all tournament participants by processing 431 API pages with pagination. Extracted information is saved to CSV files for further analysis.

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

Run the parser script:

```bash
python xeet_leaderboard_parser.py
```

The script will automatically:
1. Start processing all 431 pages
2. Display progress in the console
3. Save the result to `xeet_crypto_creators_stats.csv` file

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
- 🔄 "Update Data" button for loading fresh statistics
- 📊 Progress bar and real-time loading status
- 💾 Automatic data saving in localStorage
- 🎯 All filtering and sorting functions
- 👤 Automatic avatar display
- ⏱️ Request delays to reduce server load

## Output Files

### Main Data
The result is saved to `xeet_crypto_creators_stats.csv` file in UTF-8 encoding with the following headers:

```csv
rank,username,followerCount,score,signalScore,noisePoints,totalEngagement,engagementRate,averageEngagementPerPost
```

### Avatar Data
Additionally, `xeet_avatars.csv` file is created with avatar data:

```csv
username,avatar,name
```

Where:
- `username` - username
- `avatar` - avatar link
- `name` - display name

## API Endpoint

The script uses the following API endpoint:
```
https://www.xeet.ai/api/tournaments/5ea420b7-17c1-4a9d-9501-0fcaa60387f9/leaderboard
```

Parameters:
- `page` - page number (1-431)
- `limit` - number of records per page (20)

## Error Handling

The script includes:
- Network error handling
- JSON parsing error handling
- Request timeouts (30 seconds)
- Skipping problematic pages with continued operation

## Performance

- Delay between requests: 0.5 seconds
- Expected execution time: ~4 minutes
- Expected number of records: ~8,620 (431 pages × 20 records)

## Project Structure

```
├── xeet_leaderboard_parser.py  # Main parser script
├── analyze_data.py             # Data analysis script
├── requirements.txt            # Python dependencies
├── README.md                  # Documentation
├── index.html                 # Web application for data viewing
├── index_with_avatars.html    # Enhanced version with avatar support
├── index_standalone.html      # 🚀 STANDALONE application with built-in parsing
├── xeet_crypto_creators_stats.csv  # Main data (statistics)
├── xeet_avatars.csv           # Avatar data (usernames + links)
└── xeet_metadata.json         # Parsing metadata
```

## Usage Example

```python
from xeet_leaderboard_parser import XeetLeaderboardParser

# Create parser instance
parser = XeetLeaderboardParser()

# Run parsing
parser.run()
```

## Notes

- The script uses User-Agent headers to mimic browser requests
- All data is saved in UTF-8 encoding for proper character display
- If errors occur on individual pages, the script continues with the remaining pages
