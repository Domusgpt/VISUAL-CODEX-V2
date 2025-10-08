function createStatusElement() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'context-status';
    statusDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #00ffff;
        padding: 10px 15px;
        border: 1px solid #00ffff;
        border-radius: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    return statusDiv;
}

export function initContextStatus(contextPool) {
    setTimeout(() => {
        const statusDiv = createStatusElement();
        document.body.appendChild(statusDiv);

        setInterval(() => {
            const status = contextPool.getStatus();
            statusDiv.innerHTML = `
                🎯 WebGL Pool: ${status.active}/${status.max} active<br>
                📋 Queue: ${status.queue} waiting<br>
                ✅ Available: ${status.available} slots
            `;
        }, 1000);
    }, 1000);
}

function renderOnlineStatus(container) {
    container.innerHTML = '';
    container.style.display = 'block';
    container.style.background = 'rgba(0, 255, 0, 0.2)';
    container.style.borderColor = '#00ff00';

    const title = document.createElement('h3');
    title.style.color = '#00ff00';
    title.style.marginBottom = '0.5rem';
    title.textContent = '✅ Server Running!';

    const body = document.createElement('p');
    body.textContent = 'All visual effects should load properly. Scroll down to see them!';

    container.append(title, body);

    setTimeout(() => {
        container.style.display = 'none';
    }, 3000);
}

function renderOfflineStatus(container) {
    container.innerHTML = '';
    container.style.display = 'block';
    container.style.background = 'rgba(255, 0, 128, 0.1)';
    container.style.borderColor = '#ff0080';

    const title = document.createElement('h3');
    title.style.color = '#ff0080';
    title.style.marginBottom = '0.5rem';
    title.textContent = '❌ No Server Detected';

    const description = document.createElement('p');
    description.style.marginBottom = '1rem';
    description.textContent = 'Visual effects will not load without a local server.';

    const button = document.createElement('button');
    button.textContent = '📖 Show Setup Instructions';
    button.style.cssText = 'background: rgba(255,255,0,0.2); border: 1px solid #ffff00; color: #ffff00; padding: 0.5rem 1rem; cursor: pointer; border-radius: 5px;';
    button.addEventListener('click', () => renderInstructions(container));

    container.append(title, description, button);
}

function renderInstructions(container) {
    container.innerHTML = '';
    container.style.display = 'block';
    container.style.background = 'rgba(0, 255, 255, 0.1)';
    container.style.borderColor = '#00ffff';

    const title = document.createElement('h3');
    title.style.color = '#00ffff';
    title.style.marginBottom = '1rem';
    title.textContent = '🚀 Start Local Server';

    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'left';
    wrapper.style.maxWidth = '600px';
    wrapper.style.margin = '0 auto';

    wrapper.innerHTML = `
        <p style="margin-bottom: 1rem;"><strong>Option 1 - Python (Recommended):</strong></p>
        <code style="display: block; background: #000; padding: 10px; margin-bottom: 1rem; border-radius: 5px;">
            cd /mnt/c/Users/millz/visual_codex<br>
            python3 start-gallery.py
        </code>

        <p style="margin-bottom: 1rem;"><strong>Option 2 - Simple Python Server:</strong></p>
        <code style="display: block; background: #000; padding: 10px; margin-bottom: 1rem; border-radius: 5px;">
            cd /mnt/c/Users/millz/visual_codex<br>
            python3 -m http.server 8080
        </code>

        <p style="margin-bottom: 1rem;"><strong>Option 3 - Windows Batch:</strong></p>
        <code style="display: block; background: #000; padding: 10px; margin-bottom: 1rem; border-radius: 5px;">
            Double-click: start-gallery.bat
        </code>

        <p style="margin-bottom: 1rem;">Then visit: <strong>http://localhost:8080/gallery.html</strong></p>
    `;

    const recheckButton = document.createElement('button');
    recheckButton.textContent = '🔄 Recheck Server';
    recheckButton.style.cssText = 'background: rgba(0,255,255,0.2); border: 1px solid #00ffff; color: #00ffff; padding: 0.5rem 1rem; cursor: pointer; border-radius: 5px; margin-top: 1rem;';
    recheckButton.addEventListener('click', () => checkServer(container));

    container.append(title, wrapper, recheckButton);
}

async function checkServer(container) {
    try {
        const response = await fetch('./gallery.html');
        if (response.ok) {
            renderOnlineStatus(container);
        } else {
            renderOfflineStatus(container);
        }
    } catch (error) {
        console.error('Server check failed', error);
        renderOfflineStatus(container);
    }
}

export function initServerStatusCheck() {
    const serverStatus = document.getElementById('server-status');
    if (!serverStatus) return;

    const recheckButton = document.querySelector('[data-action="recheck-server"]');
    if (recheckButton) {
        recheckButton.addEventListener('click', () => checkServer(serverStatus));
    }

    const instructionsButton = document.querySelector('[data-action="show-instructions"]');
    if (instructionsButton) {
        instructionsButton.addEventListener('click', () => renderInstructions(serverStatus));
    }

    setTimeout(() => checkServer(serverStatus), 1000);
}
