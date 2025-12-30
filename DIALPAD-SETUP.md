# Dialpad Auto-Answer System

Automatically answers all incoming Dialpad calls instantly.

## Quick Start

### Option 1: Double-click to start (Easiest)
1. Double-click `start-dialpad.bat`
2. Wait for browser to open and login
3. Approve the login on your phone when prompted
4. System will automatically answer all calls
5. Press `Ctrl+C` in the terminal to stop

### Option 2: Run from command line
```bash
node dialpad-autoanswer.js
```

## How It Works

1. **Opens browser** - Launches Chrome/Edge automatically
2. **Logs in** - Enters your credentials automatically
3. **Waits for 2FA** - Pauses for you to approve on your phone
4. **Deploys auto-answer** - Installs JavaScript that monitors for calls every 50ms
5. **Answers calls** - Automatically clicks "Accept" within milliseconds

## Features

- ✅ Answers calls in **milliseconds**
- ✅ Runs completely in the **background**
- ✅ **Zero manual intervention** needed
- ✅ Easy **start/stop** control
- ✅ Visual browser window (can see what's happening)

## Stopping the System

Press `Ctrl+C` in the terminal window (or close the terminal)

## Configuration

Edit `dialpad-autoanswer.js` to change:
- Email/password credentials
- Poll interval (default: 50ms)
- Browser settings

## Requirements

- Node.js installed
- Playwright installed (`npm install playwright`)

## Troubleshooting

**Error: "Cannot find module 'playwright'"**
```bash
npm install playwright
```

**Browser doesn't open**
```bash
npx playwright install chromium
```

**Login fails**
- Check credentials in `dialpad-autoanswer.js`
- Make sure 2FA is set up on your account

## Notes

- Keep the browser window open
- Keep the terminal window open
- System runs until you press Ctrl+C
- All calls are answered automatically - no exceptions!
