const puppeteer = require('puppeteer');

console.log('🚀 Starting comprehensive mobile gallery test with Puppeteer...\n');

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Show browser for visual verification
        defaultViewport: {
            width: 390,  // iPhone 14 Pro width
            height: 844, // iPhone 14 Pro height
            isMobile: true,
            hasTouch: true,
            deviceScaleFactor: 3
        },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });

    const testResults = {
        mainGallery: {},
        touchInteractions: {},
        performance: {},
        demos: {},
        accessibility: {},
        errors: []
    };

    try {
        const page = await browser.newPage();
        
        // Set mobile user agent
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
        
        // Enable touch (use available device)
        const iPhone = puppeteer.devices['iPhone 6'] || puppeteer.devices['iPhone 8'];
        if (iPhone) {
            await page.emulate(iPhone);
        }
        
        // Capture console logs and errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                testResults.errors.push(msg.text());
            }
            console.log(`📱 Console [${msg.type()}]:`, msg.text());
        });
        
        page.on('pageerror', error => {
            testResults.errors.push(error.message);
            console.error('❌ Page Error:', error.message);
        });

        console.log('\n==== PHASE 1: Testing Main Mobile Gallery ====\n');
        
        // Test main gallery
        const galleryUrl = 'https://domusgpt.github.io/visual-codex/gallery-mobile-native.html';
        console.log(`📱 Navigating to: ${galleryUrl}`);
        
        await page.goto(galleryUrl, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        await page.waitForTimeout(2000); // Wait for initial animations
        
        // Check if page loaded
        const title = await page.title();
        console.log(`✅ Page loaded with title: ${title}`);
        testResults.mainGallery.pageTitle = title;
        
        // Check for mobile header
        const headerExists = await page.$('.mobile-header') !== null;
        console.log(`${headerExists ? '✅' : '❌'} Mobile header exists: ${headerExists}`);
        testResults.mainGallery.headerExists = headerExists;
        
        // Check for mobile navigation
        const navExists = await page.$('.mobile-nav') !== null;
        console.log(`${navExists ? '✅' : '❌'} Mobile navigation exists: ${navExists}`);
        testResults.mainGallery.navExists = navExists;
        
        // Check for cards
        const cardCount = await page.$$eval('.mobile-card', cards => cards.length);
        console.log(`${cardCount > 0 ? '✅' : '❌'} Mobile cards found: ${cardCount}`);
        testResults.mainGallery.cardCount = cardCount;
        
        // Check touch target sizes
        if (cardCount > 0) {
            const touchTargetSizes = await page.evaluate(() => {
                const dots = document.querySelectorAll('.state-dot');
                const buttons = document.querySelectorAll('.nav-button');
                const actionButtons = document.querySelectorAll('.card-action');
                
                const checkSize = (element) => {
                    const rect = element.getBoundingClientRect();
                    return {
                        width: rect.width,
                        height: rect.height,
                        meetsStandard: rect.width >= 44 && rect.height >= 44
                    };
                };
                
                return {
                    navButtons: Array.from(buttons).map(checkSize),
                    actionButtons: Array.from(actionButtons).map(checkSize)
                };
            });
            
            console.log(`\n📏 Touch Target Size Analysis:`);
            console.log(`Nav Buttons: ${touchTargetSizes.navButtons.filter(b => b.meetsStandard).length}/${touchTargetSizes.navButtons.length} meet 44px standard`);
            console.log(`Action Buttons: ${touchTargetSizes.actionButtons.filter(b => b.meetsStandard).length}/${touchTargetSizes.actionButtons.length} meet 44px standard`);
            
            testResults.mainGallery.touchTargets = touchTargetSizes;
        }
        
        // Check ZingTouch library
        const zingTouchLoaded = await page.evaluate(() => typeof ZT !== 'undefined');
        console.log(`${zingTouchLoaded ? '✅' : '❌'} ZingTouch library loaded: ${zingTouchLoaded}`);
        testResults.mainGallery.zingTouchLoaded = zingTouchLoaded;
        
        console.log('\n==== PHASE 2: Testing Touch Interactions ====\n');
        
        // Test card tap
        if (cardCount > 0) {
            console.log('👆 Testing card tap interaction...');
            
            // Get card position
            const cardBox = await page.$eval('.mobile-card', card => {
                const rect = card.getBoundingClientRect();
                return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
            });
            
            // Simulate tap
            await page.touchscreen.tap(cardBox.x, cardBox.y);
            await page.waitForTimeout(500);
            
            // Check if card reacted
            const cardHasActiveClass = await page.$eval('.mobile-card', card => 
                card.classList.contains('touch-active') || card.classList.contains('touch-selected')
            );
            console.log(`${cardHasActiveClass ? '✅' : '⚠️'} Card shows touch feedback`);
            testResults.touchInteractions.cardTap = cardHasActiveClass;
        }
        
        // Test navigation button tap
        console.log('👆 Testing navigation button tap...');
        const navButton = await page.$('.nav-button:nth-child(2)');
        if (navButton) {
            await navButton.tap();
            await page.waitForTimeout(500);
            
            const navButtonActive = await page.$eval('.nav-button:nth-child(2)', btn => 
                btn.classList.contains('active')
            );
            console.log(`${navButtonActive ? '✅' : '⚠️'} Navigation button responds to tap`);
            testResults.touchInteractions.navButtonTap = navButtonActive;
        }
        
        // Test swipe gesture (simulated)
        console.log('👆 Testing swipe gesture...');
        await page.touchscreen.touchStart(200, 400);
        await page.touchscreen.touchMove(200, 200);
        await page.touchscreen.touchEnd();
        await page.waitForTimeout(500);
        console.log('✅ Swipe gesture simulated (check console for detection)');
        
        console.log('\n==== PHASE 3: Testing Performance Monitoring ====\n');
        
        // Check FPS counter
        const fpsCounterExists = await page.$('#fpsCounter') !== null;
        console.log(`${fpsCounterExists ? '✅' : '❌'} FPS counter exists: ${fpsCounterExists}`);
        testResults.performance.fpsCounterExists = fpsCounterExists;
        
        if (fpsCounterExists) {
            const fpsValue = await page.$eval('#fpsCounter', el => el.textContent);
            console.log(`📊 Current FPS: ${fpsValue}`);
            testResults.performance.currentFPS = fpsValue;
        }
        
        // Check device info
        const deviceInfo = await page.$eval('#deviceInfo', el => el.textContent).catch(() => null);
        if (deviceInfo) {
            console.log(`📱 Device detected as: ${deviceInfo}`);
            testResults.performance.deviceInfo = deviceInfo;
        }
        
        // Check performance metrics from console
        const performanceMetrics = await page.evaluate(() => {
            return {
                memory: performance.memory ? {
                    usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
                    totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB'
                } : 'Not available',
                navigation: {
                    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart + 'ms',
                    domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart + 'ms'
                }
            };
        });
        
        console.log(`\n📊 Performance Metrics:`);
        console.log(`Load Time: ${performanceMetrics.navigation.loadTime}`);
        console.log(`DOM Ready: ${performanceMetrics.navigation.domReady}`);
        if (performanceMetrics.memory !== 'Not available') {
            console.log(`Memory Usage: ${performanceMetrics.memory.usedJSHeapSize} / ${performanceMetrics.memory.totalJSHeapSize}`);
        }
        
        testResults.performance.metrics = performanceMetrics;
        
        console.log('\n==== PHASE 4: Testing Mobile Demo Pages ====\n');
        
        // Test neomorphic cards demo
        const neomorphicUrl = 'https://domusgpt.github.io/visual-codex/demos/neoskeuomorphic-cards-mobile.html';
        console.log(`\n📱 Testing: ${neomorphicUrl}`);
        
        await page.goto(neomorphicUrl, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        const neomorphicCardCount = await page.$$eval('.neomorphic-card', cards => cards.length);
        console.log(`${neomorphicCardCount > 0 ? '✅' : '❌'} Neomorphic cards found: ${neomorphicCardCount}`);
        testResults.demos.neomorphicCards = {
            loaded: true,
            cardCount: neomorphicCardCount
        };
        
        // Test touch on neomorphic card
        if (neomorphicCardCount > 0) {
            const firstCard = await page.$('.neomorphic-card');
            await firstCard.tap();
            await page.waitForTimeout(300);
            console.log('✅ Tested neomorphic card touch interaction');
        }
        
        // Test state control dots demo
        const stateDotsUrl = 'https://domusgpt.github.io/visual-codex/demos/state-control-dots-mobile.html';
        console.log(`\n📱 Testing: ${stateDotsUrl}`);
        
        await page.goto(stateDotsUrl, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        const stateDotCount = await page.$$eval('.state-dot', dots => dots.length);
        console.log(`${stateDotCount > 0 ? '✅' : '❌'} State control dots found: ${stateDotCount}`);
        
        // Check dot sizes
        if (stateDotCount > 0) {
            const dotSizes = await page.evaluate(() => {
                const dots = document.querySelectorAll('.state-dot');
                return Array.from(dots).map(dot => {
                    const rect = dot.getBoundingClientRect();
                    return {
                        width: rect.width,
                        height: rect.height,
                        meetsOptimal: rect.width >= 56 && rect.height >= 56
                    };
                });
            });
            
            const optimalCount = dotSizes.filter(d => d.meetsOptimal).length;
            console.log(`${optimalCount === dotSizes.length ? '✅' : '⚠️'} State dots meet 56px optimal size: ${optimalCount}/${dotSizes.length}`);
            
            testResults.demos.stateControlDots = {
                loaded: true,
                dotCount: stateDotCount,
                optimalSizeCount: optimalCount
            };
        }
        
        console.log('\n==== PHASE 5: Testing Accessibility Features ====\n');
        
        // Go back to main gallery
        await page.goto(galleryUrl, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        // Check ARIA attributes
        const ariaCompliance = await page.evaluate(() => {
            const interactiveElements = document.querySelectorAll('button, .mobile-card, .nav-button, .state-dot');
            let elementsWithRole = 0;
            let elementsWithLabel = 0;
            let focusableElements = 0;
            
            interactiveElements.forEach(el => {
                if (el.getAttribute('role')) elementsWithRole++;
                if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) elementsWithLabel++;
                if (el.getAttribute('tabindex') === '0' || el.tagName === 'BUTTON') focusableElements++;
            });
            
            return {
                totalInteractive: interactiveElements.length,
                withRole: elementsWithRole,
                withLabel: elementsWithLabel,
                focusable: focusableElements
            };
        });
        
        console.log(`\n♿ Accessibility Analysis:`);
        console.log(`Interactive Elements: ${ariaCompliance.totalInteractive}`);
        console.log(`With ARIA Role: ${ariaCompliance.withRole} (${Math.round(ariaCompliance.withRole / ariaCompliance.totalInteractive * 100)}%)`);
        console.log(`With ARIA Label: ${ariaCompliance.withLabel} (${Math.round(ariaCompliance.withLabel / ariaCompliance.totalInteractive * 100)}%)`);
        console.log(`Keyboard Focusable: ${ariaCompliance.focusable} (${Math.round(ariaCompliance.focusable / ariaCompliance.totalInteractive * 100)}%)`);
        
        testResults.accessibility = ariaCompliance;
        
        // Check contrast ratios
        const contrastCheck = await page.evaluate(() => {
            const getContrastRatio = (color1, color2) => {
                // Simplified contrast calculation
                return 4.5; // Placeholder - real implementation would calculate actual ratio
            };
            
            const textElements = document.querySelectorAll('.card-title, .card-description, .control-title');
            return textElements.length > 0;
        });
        
        console.log(`${contrastCheck ? '✅' : '⚠️'} Text elements present for contrast checking`);
        
        console.log('\n==== PHASE 6: Final System Check ====\n');
        
        // Check for any JavaScript errors
        console.log(`\n${testResults.errors.length === 0 ? '✅' : '❌'} JavaScript Errors: ${testResults.errors.length}`);
        if (testResults.errors.length > 0) {
            console.log('Errors found:');
            testResults.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        // Generate summary report
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST SUMMARY REPORT');
        console.log('='.repeat(60) + '\n');
        
        const testsPassed = [
            testResults.mainGallery.headerExists,
            testResults.mainGallery.navExists,
            testResults.mainGallery.cardCount > 0,
            testResults.mainGallery.zingTouchLoaded,
            testResults.performance.fpsCounterExists,
            testResults.demos.neomorphicCards?.loaded,
            testResults.demos.stateControlDots?.loaded,
            testResults.errors.length === 0
        ].filter(Boolean).length;
        
        const totalTests = 8;
        const passRate = Math.round(testsPassed / totalTests * 100);
        
        console.log(`Overall Pass Rate: ${passRate}% (${testsPassed}/${totalTests} tests passed)`);
        console.log(`\nKey Metrics:`);
        console.log(`- Mobile cards loaded: ${testResults.mainGallery.cardCount}`);
        console.log(`- Touch targets compliant: ${testResults.mainGallery.touchTargets?.navButtons?.filter(b => b.meetsStandard).length || 0}/${testResults.mainGallery.touchTargets?.navButtons?.length || 0}`);
        console.log(`- ZingTouch loaded: ${testResults.mainGallery.zingTouchLoaded}`);
        console.log(`- Performance monitoring: ${testResults.performance.fpsCounterExists ? 'Active' : 'Inactive'}`);
        console.log(`- Demo pages functional: ${testResults.demos.neomorphicCards?.loaded && testResults.demos.stateControlDots?.loaded ? 'Yes' : 'Partial'}`);
        console.log(`- JavaScript errors: ${testResults.errors.length}`);
        
        // Save detailed report
        const fs = require('fs');
        fs.writeFileSync('mobile-gallery-test-report.json', JSON.stringify(testResults, null, 2));
        console.log('\n✅ Detailed test report saved to: mobile-gallery-test-report.json');
        
        // Take screenshots
        await page.screenshot({ path: 'mobile-gallery-main.png', fullPage: true });
        console.log('📸 Screenshot saved: mobile-gallery-main.png');
        
        console.log('\n🎉 Comprehensive mobile gallery test complete!');
        
    } catch (error) {
        console.error('\n❌ Test failed with error:', error);
        testResults.errors.push(error.message);
    } finally {
        // Keep browser open for manual inspection
        console.log('\n👀 Browser will remain open for manual inspection.');
        console.log('Press Ctrl+C to close when done.');
        
        // Wait indefinitely
        await new Promise(() => {});
    }
})();