const puppeteer = require('puppeteer');
const path = require('path');

async function testGallery() {
    console.log('🎯 Starting Visual Codex Gallery Test with Puppeteer\n');
    
    const browser = await puppeteer.launch({
        headless: false, // Show browser for visual testing
        devtools: true,  // Open devtools automatically
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--allow-running-insecure-content',
            '--disable-features=VizDisplayCompositor'
        ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport for desktop testing
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Enable console logging
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error') {
            console.log('❌ PAGE ERROR:', text);
        } else if (text.includes('WebGL Pool') || text.includes('Context') || text.includes('Queue')) {
            console.log('🎯 CONTEXT POOL:', text);
        } else if (type === 'log') {
            console.log('📝 PAGE LOG:', text);
        }
    });
    
    // Catch JavaScript errors
    page.on('pageerror', error => {
        console.error('🚨 JAVASCRIPT ERROR:', error.message);
    });
    
    // Monitor failed requests
    page.on('requestfailed', request => {
        console.error('🚫 REQUEST FAILED:', request.url(), request.failure().errorText);
    });
    
    // Monitor network responses
    page.on('response', response => {
        if (!response.ok() && response.url().includes('.html')) {
            console.error('⚠️ RESPONSE ERROR:', response.url(), response.status());
        }
    });
    
    try {
        console.log('🌐 Loading GitHub Pages gallery...');
        await page.goto('https://domusgpt.github.io/visual-codex/gallery.html', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });
        
        console.log('✅ Page loaded successfully\n');
        
        // Wait for gallery to render
        await page.waitForSelector('.effect-card', { timeout: 10000 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check if effect cards are present
        const cardCount = await page.$$eval('.effect-card', cards => cards.length);
        console.log(`📊 Found ${cardCount} effect cards\n`);
        
        // Check server status
        const serverStatus = await page.evaluate(() => {
            const statusEl = document.getElementById('server-status');
            return statusEl ? statusEl.textContent : 'No server status element';
        });
        console.log('🔧 Server Status:', serverStatus.replace(/\s+/g, ' ').trim(), '\n');
        
        // Check for context pool status
        await new Promise(resolve => setTimeout(resolve, 2000));
        const contextStatus = await page.evaluate(() => {
            const statusEl = document.getElementById('context-status');
            return statusEl ? statusEl.textContent : 'No context status yet';
        });
        console.log('🎯 Context Pool Status:', contextStatus.replace(/\s+/g, ' ').trim(), '\n');
        
        // Check for lazy-iframe elements
        const lazyIframes = await page.$$eval('.lazy-iframe', iframes => {
            return iframes.map((iframe, index) => ({
                index,
                hasDataSrc: !!iframe.dataset.src,
                dataSrc: iframe.dataset.src,
                innerHTML: iframe.innerHTML.substring(0, 100) + '...'
            }));
        });
        
        console.log('🖼️ Lazy iframe status:');
        lazyIframes.forEach(iframe => {
            console.log(`   Card ${iframe.index}: ${iframe.hasDataSrc ? 'HAS data-src' : 'NO data-src'}`);
            if (iframe.dataSrc) {
                console.log(`     Source: ${iframe.dataSrc}`);
            }
            console.log(`     Content: ${iframe.innerHTML.replace(/\s+/g, ' ').trim()}`);
        });
        console.log();
        
        // Take initial screenshot
        await page.screenshot({
            path: 'gallery-initial.png',
            fullPage: true
        });
        console.log('📸 Initial screenshot saved: gallery-initial.png\n');
        
        // Scroll down to trigger lazy loading
        console.log('📜 Scrolling to trigger lazy loading...');
        await page.evaluate(() => {
            window.scrollTo(0, 800);
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check context pool status after scroll
        const contextStatusAfterScroll = await page.evaluate(() => {
            const statusEl = document.getElementById('context-status');
            return statusEl ? statusEl.textContent : 'No context status';
        });
        console.log('🎯 Context Pool After Scroll:', contextStatusAfterScroll.replace(/\s+/g, ' ').trim(), '\n');
        
        // Check for loaded iframes
        const loadedIframes = await page.$$eval('.lazy-iframe iframe', iframes => iframes.length);
        console.log(`✅ Loaded iframes: ${loadedIframes}\n`);
        
        // Scroll more to test queue system
        console.log('📜 Scrolling more to test queue system...');
        await page.evaluate(() => {
            window.scrollTo(0, 1600);
        });
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer for queue processing
        
        // Final status check
        const finalContextStatus = await page.evaluate(() => {
            const statusEl = document.getElementById('context-status');
            return statusEl ? statusEl.textContent : 'No context status';
        });
        console.log('🎯 Final Context Pool Status:', finalContextStatus.replace(/\s+/g, ' ').trim(), '\n');
        
        const finalLoadedIframes = await page.$$eval('.lazy-iframe iframe', iframes => iframes.length);
        console.log(`✅ Final loaded iframes: ${finalLoadedIframes}\n`);
        
        // Take final screenshot
        await page.screenshot({
            path: 'gallery-after-scroll.png',
            fullPage: true
        });
        console.log('📸 Final screenshot saved: gallery-after-scroll.png\n');
        
        // Test scroll back up (cleanup test)
        console.log('📜 Testing scroll back up (cleanup test)...');
        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const cleanupStatus = await page.evaluate(() => {
            const statusEl = document.getElementById('context-status');
            return statusEl ? statusEl.textContent : 'No context status';
        });
        console.log('🧹 After Cleanup Scroll:', cleanupStatus.replace(/\s+/g, ' ').trim(), '\n');
        
        // Check for cleanup messages
        const cleanupMessages = await page.$$eval('.lazy-iframe', iframes => {
            return iframes.map(iframe => iframe.textContent.includes('Context Cleaned Up')).filter(Boolean).length;
        });
        console.log(`💤 Cleanup messages found: ${cleanupMessages}\n`);
        
        console.log('🎯 TEST SUMMARY:');
        console.log(`   Cards found: ${cardCount}`);
        console.log(`   Max loaded iframes: ${Math.max(loadedIframes, finalLoadedIframes)}`);
        console.log(`   Cleanup messages: ${cleanupMessages}`);
        console.log(`   Context pool working: ${finalContextStatus.includes('WebGL Pool') ? 'YES' : 'NO'}`);
        
        console.log('\n🔍 Test complete - closing browser...');
        
        // Close browser after test
        await browser.close();
        
    } catch (error) {
        console.error('🚨 TEST ERROR:', error);
        await browser.close();
    }
}

// Run the test
testGallery();