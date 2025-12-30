const { chromium } = require('playwright');

// Configuration
const CONFIG = {
  url: 'https://dialpad.com/app/history/new',
  email: 'login email here',
  password: 'password here',
  pollInterval: 10 // Check for calls every 10ms
};

async function startDialpadAutoAnswer() {
  console.log('🚀 Starting Dialpad Auto-Answer System...\n');

  let browser;
  try {
    // Launch browser
    console.log('📱 Launching browser...');
    browser = await chromium.launch({
      headless: false, // Keep visible so you can see what's happening
      args: [
        '--use-fake-ui-for-media-stream', // Auto-allow microphone
        '--use-fake-device-for-media-stream'
      ]
    });

    const context = await browser.newContext({
      permissions: ['microphone', 'notifications']
    });
    const page = await context.newPage();

    // Navigate to Dialpad
    console.log('🌐 Navigating to Dialpad...');
    await page.goto(CONFIG.url);
    await page.waitForLoadState('networkidle');

    // Check if already logged in
    const currentUrl = page.url();
    const isLoggedIn = currentUrl.includes('/app/');

    if (!isLoggedIn) {
      console.log('🔐 Logging in via Microsoft SSO...\n');

      // Check if we're on the Dialpad login page
      if (currentUrl.includes('/login')) {
        console.log('📋 Dialpad login page detected');
        console.log('🖱️  Clicking "Log in with Microsoft" button...');

        // Click the "Log in with Microsoft" button
        await page.locator('button:has-text("Log in with Microsoft")').click();

        console.log('✅ Button clicked, redirecting...\n');
      }

      // Wait for redirect to Microsoft login
      console.log('⏳ Waiting for Microsoft login page...');
      await page.waitForURL('**/login.microsoftonline.com/**', { timeout: 30000 });
      console.log('✅ Microsoft login page loaded\n');

      // Enter email
      console.log('📧 Entering email...');
      const emailField = await page.locator('input[type="email"], input[type="text"]').first();
      await emailField.waitFor({ state: 'visible', timeout: 10000 });
      await emailField.fill(CONFIG.email);

      // Click Next button
      console.log('➡️  Clicking Next...');
      await page.locator('input[type="submit"], button:has-text("Next")').click();

      // Wait for password page
      console.log('⏳ Waiting for password page...\n');
      await page.waitForTimeout(2000);

      // Enter password
      console.log('🔑 Entering password...');
      const passwordField = await page.locator('input[type="password"]').first();
      await passwordField.waitFor({ state: 'visible', timeout: 10000 });
      await passwordField.fill(CONFIG.password);

      // Click Sign in button
      console.log('➡️  Clicking Sign in...\n');
      await page.locator('input[type="submit"], button:has-text("Sign in")').click();

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📲 WAITING FOR 2FA APPROVAL ON YOUR PHONE');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('   👆 Check your mobile device now!');
      console.log('   ⏰ Waiting up to 2 minutes...\n');

      // Wait for redirect to Dialpad app (indicates successful login)
      await page.waitForURL('**/dialpad.com/app/**', { timeout: 120000 }); // 2 minute timeout for 2FA

      console.log('✅ Login successful!\n');
    } else {
      console.log('✅ Already logged in!\n');
    }

    // Give the page a moment to fully load
    await page.waitForTimeout(3000);

    // Deploy auto-answer script
    console.log('🤖 Deploying auto-answer system...');
    await page.evaluate((pollInterval) => {
      console.log('[AUTO-ANSWER] Starting auto-answer monitoring...');

      const tryAnswerCall = () => {
        const acceptButtons = [
          ...Array.from(document.querySelectorAll('button')).filter(btn =>
            btn.textContent.includes('Accept') &&
            btn.getAttribute('aria-label') !== 'Accept'
          ),
          ...Array.from(document.querySelectorAll('[role="button"]')).filter(btn =>
            btn.textContent.includes('Accept')
          )
        ];

        for (const button of acceptButtons) {
          const rect = button.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            console.log('[AUTO-ANSWER] ✅ INCOMING CALL DETECTED! Answering now...');
            button.click();
            return true;
          }
        }
        return false;
      };

      const pollIntervalId = setInterval(() => {
        tryAnswerCall();
      }, pollInterval);

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const text = node.textContent || '';
                if (text.includes('Incoming call') || text.includes('Accept')) {
                  console.log('[AUTO-ANSWER] 🚨 DOM change detected - checking for call...');
                  setTimeout(tryAnswerCall, 10);
                }
              }
            }
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });

      console.log('[AUTO-ANSWER] 🤖 Auto-answer system ACTIVE!');
      console.log('[AUTO-ANSWER] Monitoring every ' + pollInterval + 'ms + DOM changes');
      console.log('[AUTO-ANSWER] Will automatically answer all incoming calls');

      window.autoAnswerSystem = {
        pollIntervalId,
        observer,
        stop: () => {
          clearInterval(pollIntervalId);
          observer.disconnect();
          console.log('[AUTO-ANSWER] ⛔ Auto-answer system STOPPED');
        }
      };
    }, CONFIG.pollInterval);

    console.log('\n✅ AUTO-ANSWER SYSTEM IS NOW ACTIVE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📞 All incoming calls will be answered automatically');
    console.log('🖥️  Keep this browser window open');
    console.log('⛔ Press Ctrl+C to stop the system\n');

    // Keep the script running
    await new Promise(() => {}); // Run indefinitely

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n⛔ Shutting down Auto-Answer System...');
  console.log('👋 Goodbye!\n');
  process.exit(0);
});

// Start the system
startDialpadAutoAnswer();
