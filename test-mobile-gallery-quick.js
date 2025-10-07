const puppeteer = require('puppeteer');

console.log('🚀 Quick mobile gallery test with Puppeteer...\n');

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Show browser for visual verification
        defaultViewport: {
            width: 375,  // iPhone SE width
            height: 667, // iPhone SE height
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 2
        },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const testResults = {};

    try {
        const page = await browser.newPage();
        
        // Set mobile user agent
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');
        
        // Capture console logs and errors
        const errors = [];
        page.on('console', msg => {
            console.log(`📱 Console [${msg.type()}]:`, msg.text());
        });
        
        page.on('pageerror', error => {
            errors.push(error.message);
            console.error('❌ Page Error:', error.message);
        });

        console.log('==== Testing Main Mobile Gallery ====\n');
        
        // Test main gallery
        const galleryUrl = 'https://domusgpt.github.io/visual-codex/gallery-mobile-native.html';
        console.log(`📱 Navigating to: ${galleryUrl}`);
        
        const response = await page.goto(galleryUrl, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        console.log(`✅ Response Status: ${response.status()}`);
        
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for initial loading
        
        // Check if page loaded successfully
        const title = await page.title();
        console.log(`✅ Page Title: ${title}`);
        
        // Take initial screenshot
        await page.screenshot({ path: 'mobile-gallery-loading.png', fullPage: true });
        console.log('📸 Screenshot saved: mobile-gallery-loading.png');
        
        // Check for key elements
        const elementsCheck = await page.evaluate(() => {
            return {
                header: !!document.querySelector('.mobile-header'),
                nav: !!document.querySelector('.mobile-nav'),
                cards: document.querySelectorAll('.mobile-card').length,
                galleryContainer: !!document.querySelector('.mobile-gallery'),
                performanceIndicator: !!document.querySelector('#performanceIndicator'),
                zingTouchLoaded: typeof ZT !== 'undefined'
            };
        });
        
        console.log('\n📊 Element Check Results:');
        console.log(`Header: ${elementsCheck.header ? '✅' : '❌'}`);
        console.log(`Navigation: ${elementsCheck.nav ? '✅' : '❌'}`);
        console.log(`Cards Found: ${elementsCheck.cards} ${elementsCheck.cards > 0 ? '✅' : '❌'}`);
        console.log(`Gallery Container: ${elementsCheck.galleryContainer ? '✅' : '❌'}`);
        console.log(`Performance Monitor: ${elementsCheck.performanceIndicator ? '✅' : '❌'}`);
        console.log(`ZingTouch Loaded: ${elementsCheck.zingTouchLoaded ? '✅' : '❌'}`);
        
        // Test touch interaction
        if (elementsCheck.cards > 0) {
            console.log('\n👆 Testing touch interaction...');
            
            // Get first card and tap it
            const cardElement = await page.$('.mobile-card');
            if (cardElement) {
                await cardElement.tap();
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('✅ Card tap interaction tested');
            }
        }
        
        // Test navigation
        console.log('\n🧭 Testing navigation...');
        const navButtons = await page.$$('.nav-button');
        if (navButtons.length > 0) {
            await navButtons[1].tap(); // Tap second nav button
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(`✅ Navigation tested (${navButtons.length} buttons found)`);
        }
        
        // Check for JavaScript errors
        const errorCount = errors.length;
        console.log(`\n${errorCount === 0 ? '✅' : '❌'} JavaScript Errors: ${errorCount}`);
        if (errorCount > 0) {
            errors.forEach(error => console.log(`  - ${error}`));
        }
        
        // Performance check
        const performanceMetrics = await page.evaluate(() => {
            return {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                resources: performance.getEntriesByType('resource').length
            };
        });
        
        console.log(`\n📊 Performance Metrics:`);
        console.log(`Load Time: ${performanceMetrics.loadTime}ms`);
        console.log(`DOM Ready: ${performanceMetrics.domReady}ms`);
        console.log(`Resources Loaded: ${performanceMetrics.resources}`);
        
        // Take final screenshot
        await page.screenshot({ path: 'mobile-gallery-final.png', fullPage: true });
        console.log('📸 Final screenshot saved: mobile-gallery-final.png');
        
        // Test mobile demos quickly
        console.log('\n==== Testing Mobile Demos ====\n');
        
        // Test neomorphic cards
        const neomorphicUrl = 'https://domusgpt.github.io/visual-codex/demos/neoskeuomorphic-cards-mobile.html';
        console.log(`📱 Testing: ${neomorphicUrl}`);
        
        const neomorphicResponse = await page.goto(neomorphicUrl, { waitUntil: 'networkidle0' });
        console.log(`${neomorphicResponse.status() === 200 ? '✅' : '❌'} Neomorphic demo status: ${neomorphicResponse.status()}`);
        
        // Quick element check
        const neomorphicCards = await page.$$eval('.neomorphic-card', cards => cards.length);
        console.log(`${neomorphicCards > 0 ? '✅' : '❌'} Neomorphic cards found: ${neomorphicCards}`);
        
        // Test state dots
        const stateDotsUrl = 'https://domusgpt.github.io/visual-codex/demos/state-control-dots-mobile.html';
        console.log(`📱 Testing: ${stateDotsUrl}`);
        
        const stateResponse = await page.goto(stateDotsUrl, { waitUntil: 'networkidle0' });
        console.log(`${stateResponse.status() === 200 ? '✅' : '❌'} State dots demo status: ${stateResponse.status()}`);
        
        // Quick element check
        const stateDots = await page.$$eval('.state-dot', dots => dots.length);
        console.log(`${stateDots > 0 ? '✅' : '❌'} State control dots found: ${stateDots}`);
        
        // Generate summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 QUICK TEST SUMMARY');
        console.log('='.repeat(50));
        
        const allChecks = [
            elementsCheck.header,
            elementsCheck.nav,
            elementsCheck.cards > 0,
            elementsCheck.zingTouchLoaded,
            errorCount === 0,
            neomorphicCards > 0,
            stateDots > 0
        ];
        
        const passedChecks = allChecks.filter(Boolean).length;
        const totalChecks = allChecks.length;
        const successRate = Math.round(passedChecks / totalChecks * 100);
        
        console.log(`\n🎯 Success Rate: ${successRate}% (${passedChecks}/${totalChecks})`);
        console.log(`📱 Mobile gallery is ${successRate >= 80 ? 'WORKING WELL' : 'NEEDS ATTENTION'}`);
        
        if (successRate >= 80) {
            console.log('🎉 Mobile gallery test PASSED! Ready for mobile use.');
        } else {
            console.log('⚠️ Mobile gallery needs optimization before mobile deployment.');
        }
        
        testResults.summary = {
            successRate,
            passedChecks,
            totalChecks,
            elements: elementsCheck,
            errors: errors,
            performance: performanceMetrics,
            demos: {
                neomorphicCards,
                stateDots
            }
        };
        
        // Save results
        require('fs').writeFileSync('mobile-test-results.json', JSON.stringify(testResults, null, 2));
        console.log('\n💾 Test results saved to: mobile-test-results.json');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
    } finally {
        console.log('\n👀 Keeping browser open for 10 seconds for inspection...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        await browser.close();
        console.log('✅ Test complete!');
    }
})();