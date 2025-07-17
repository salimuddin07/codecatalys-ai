const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Simple MIME type mapping
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};

// Self-signed certificate for HTTPS (for testing only)
const options = {
    key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8Q7HgL2QeZzGJ
...simplified for brevity...
-----END PRIVATE KEY-----`,
    cert: `-----BEGIN CERTIFICATE-----
MIICljCCAX4CCQDAOxKQlRK+mTANBgkqhkiG9w0BAQsFADANMQswCQYDVQQGEwJV
...simplified for brevity...
-----END CERTIFICATE-----`
};

const server = https.createServer(options, (req, res) => {
    let filePath = '.' + url.parse(req.url).pathname;
    
    // Default to index.html
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Get file extension
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Set CORS headers for PWA
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8443;
server.listen(PORT, () => {
    console.log('🚀 HTTPS Server running at https://localhost:' + PORT);
    console.log('📱 PWA Test Page: https://localhost:' + PORT + '/pwa-test.html');
    console.log('⚠️  You may see a security warning - click "Advanced" and "Proceed" for testing');
    console.log('🛑 Press Ctrl+C to stop the server');
});
