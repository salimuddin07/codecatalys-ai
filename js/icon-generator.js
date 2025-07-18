// Simple PWA icon creator - creates PNG icons from canvas
function createPWAIcons() {
    // Create 192x192 icon
    const canvas192 = document.createElement('canvas');
    canvas192.width = 192;
    canvas192.height = 192;
    const ctx192 = canvas192.getContext('2d');
    
    // Draw background
    ctx192.fillStyle = '#1a1a1a';
    ctx192.fillRect(0, 0, 192, 192);
    
    // Draw robot icon
    drawRobotIcon(ctx192, 96, 96, 80);
    
    // Create 512x512 icon
    const canvas512 = document.createElement('canvas');
    canvas512.width = 512;
    canvas512.height = 512;
    const ctx512 = canvas512.getContext('2d');
    
    // Draw background
    ctx512.fillStyle = '#1a1a1a';
    ctx512.fillRect(0, 0, 512, 512);
    
    // Draw robot icon
    drawRobotIcon(ctx512, 256, 256, 200);
    
    // Convert to blob and download
    canvas192.toBlob(blob => {
        downloadBlob(blob, 'icon-192.png');
    });
    
    canvas512.toBlob(blob => {
        downloadBlob(blob, 'icon-512.png');
    });
}

function drawRobotIcon(ctx, centerX, centerY, size) {
    const scale = size / 100;
    
    // Save context
    ctx.save();
    ctx.translate(centerX - size/2, centerY - size/2);
    ctx.scale(scale, scale);
    
    // Robot gradient
    const gradient = ctx.createLinearGradient(0, 0, 100, 100);
    gradient.addColorStop(0, '#a7a459');
    gradient.addColorStop(0.5, '#8b8746');
    gradient.addColorStop(1, '#6f6d37');
    
    // Robot head
    ctx.fillStyle = gradient;
    ctx.fillRect(25, 20, 50, 40);
    
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(35, 35, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(65, 35, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(35, 35, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(65, 35, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Mouth
    ctx.fillStyle = '#333';
    ctx.fillRect(40, 45, 20, 3);
    
    // Antenna
    ctx.strokeStyle = '#a7a459';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, 10);
    ctx.stroke();
    
    ctx.fillStyle = '#a7a459';
    ctx.beginPath();
    ctx.arc(50, 10, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Body
    ctx.fillStyle = gradient;
    ctx.fillRect(30, 60, 40, 30);
    
    // Arms
    ctx.fillRect(15, 65, 15, 8);
    ctx.fillRect(70, 65, 15, 8);
    
    // Legs
    ctx.fillRect(35, 90, 8, 15);
    ctx.fillRect(57, 90, 8, 15);
    
    ctx.restore();
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createPWAIcons };
}
