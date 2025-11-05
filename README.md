# CTFD Scoreboard

A sophisticated, real-time scoreboard dashboard for CTFD (Capture The Flag Development) platforms with engaging animations and audio feedback.

## Features

### Core Functionality
- **Real-time Data Tracking**: Automatic polling of CTFD API with configurable intervals
- **Comprehensive Dashboard**: Live scoreboard, challenge grid, submissions feed, and notifications
- **Event Detection**: Automatic detection of first bloods, rank changes, and top position changes
- **Session-based Storage**: All data stored securely in browser (localStorage/sessionStorage)

### User Experience
- **Framer Motion Animations**: Smooth transitions, rank change animations, and first blood celebrations
- **Sound Effects System**: Configurable audio alerts for important events
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Responsive Design**: Perfect display on desktop, tablet, and mobile devices
- **Real-time Notifications**: Unread counter and notification panel

### Technical Excellence
- **React 18 + TypeScript**: Type-safe, modern React development
- **Tailwind CSS**: Utility-first styling with custom theme
- **Zustand State Management**: Efficient, lightweight state management with persistence
- **Axios API Client**: Robust HTTP client with error handling
- **Performance Optimized**: Efficient re-rendering, memoization, and caching

## Getting Started

### Prerequisites
- A CTFD instance URL (e.g., `https://your-ctfd-instance.com`)
- CTFD API key with read permissions

### How to Use

1. **Access the Application**
   - Visit: https://3sukzzsjo1tw.space.minimax.io

2. **Connect to Your CTFD Instance**
   - Enter your CTFD instance URL
   - Enter your API key
   - Click "Connect"

3. **Navigate the Dashboard**
   - **Overview Tab**: View live scoreboard and recent notifications
   - **Challenges Tab**: Browse all challenges by category with solve status
   - **Activity Tab**: Monitor recent submissions and events

4. **Customize Settings**
   - Click the settings icon in the header
   - Configure auto-refresh interval (5-300 seconds)
   - Enable/disable sound effects
   - Adjust volume levels

5. **Monitor Events**
   - First blood celebrations appear automatically
   - Rank changes are highlighted in the leaderboard
   - Notifications panel tracks all events
   - Unread counter shows new activities

## API Endpoints Used

The application integrates with these CTFD API v1 endpoints:
- `GET /api/v1/users` - User data and scores
- `GET /api/v1/challenges` - Challenge information
- `GET /api/v1/solves` - Solve data with timestamps
- `GET /api/v1/submissions` - Recent submissions
- `GET /api/v1/scoreboard` - Leaderboard data

## Architecture

### Component Structure
```
App
├── LoginForm (authentication gate)
└── Dashboard
    ├── Header (navigation & controls)
    ├── StatsCards (overview metrics)
    ├── Tabs (Overview/Challenges/Activity)
    │   ├── Scoreboard (live leaderboard)
    │   ├── ChallengeGrid (challenge browser)
    │   ├── RecentSubmissions (activity feed)
    │   └── NotificationsPanel (event tracker)
    ├── SettingsModal (configuration)
    └── FirstBloodCelebration (animated alerts)
```

### State Management
- **Zustand Store**: Global state with localStorage persistence
- **Custom Hooks**: 
  - `useDataRefresh`: Automatic API polling
  - `useSoundEffects`: Event-triggered audio
- **Local State**: Component-specific UI state

### Sound System
- Web Audio API for tone generation
- Custom sound manager with volume controls
- Event-triggered playback (first bloods, rank changes)

## Development

### Local Development
```bash
cd ctfd-scoreboard
pnpm install
pnpm dev
```

#### CORS Issues and Proxy Setup
If you encounter CORS errors when connecting to your CTFd instance in development, the application uses a Vite proxy to bypass these restrictions.

**The proxy is automatically configured and will route requests through `/ctfd-proxy` in development mode.**

To set the proxy target URL (optional, for testing with a specific instance):
```bash
# Update the .env file with your CTFd URL
echo "VITE_CTFD_URL=https://your-ctfd-instance.com" > .env

# Then restart your dev server
pnpm dev
```

Or use the helper script:
```bash
node update-proxy.js https://your-ctfd-instance.com
# Then restart dev server
```

**Note:** 
- The proxy only works in **development mode** (`pnpm dev`)
- In production builds, requests go directly to the CTFd instance you configure at runtime
- You still need to enter your CTFd URL and API key in the login form
- The proxy uses the URL from `.env` as a fallback target during development

### Build for Production
```bash
pnpm build
```

### Project Structure
```
ctfd-scoreboard/
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities (API client, sound manager)
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── dist/                # Production build output
└── package.json         # Dependencies and scripts
```

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Security
- API keys stored securely in browser localStorage
- No third-party data transmission
- Client-side only application
- HTTPS recommended for production use

## Performance
- Optimized bundle size: ~430KB (gzipped: ~121KB)
- Efficient re-rendering with React.memo
- Debounced API requests
- Lazy loading where applicable

## License
MIT License - Feel free to use and modify for your CTF events!

## Troubleshooting

### Connection Issues
- Verify CTFD instance URL is accessible
- Check API key has proper permissions
- Ensure CORS is configured on CTFD instance

### Performance Issues
- Increase refresh interval in settings
- Disable sound effects if needed
- Clear browser cache and localStorage

### Display Issues
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Check browser console for errors
- Verify browser supports required features

## Credits
Built with modern web technologies and best practices for CTF competitions.
