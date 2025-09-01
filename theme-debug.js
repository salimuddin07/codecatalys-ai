// Simple theme toggle test
console.log('🔍 Testing theme toggle functionality...');

// Test 1: Check if button exists
const themeToggle = document.getElementById('themeToggle');
console.log('Theme toggle button found:', !!themeToggle);

if (themeToggle) {
    // Test 2: Check button structure
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeLabel = themeToggle.querySelector('.theme-label');
    
    console.log('Theme icon found:', !!themeIcon);
    console.log('Theme label found:', !!themeLabel);
    
    // Test 3: Manual theme toggle
    function testThemeToggle() {
        console.log('🌙 Manual theme toggle test...');
        
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log('Current theme:', currentTheme);
        console.log('Switching to:', newTheme);
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button if elements exist
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
        }
        
        if (themeLabel) {
            themeLabel.textContent = newTheme === 'dark' ? 'Light' : 'Dark';
        }
        
        console.log('✅ Theme switched successfully!');
        return newTheme;
    }
    
    // Test 4: Add click event
    themeToggle.addEventListener('click', testThemeToggle);
    
    console.log('✅ Theme toggle test setup complete!');
    console.log('💡 Click the theme toggle button to test manually.');
    
} else {
    console.error('❌ Theme toggle button not found! Check HTML structure.');
}

// Test 5: Check CSS variables
function testCSSVariables() {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--primary-color');
    const bgLight = rootStyles.getPropertyValue('--bg-light');
    
    console.log('CSS Variables loaded:');
    console.log('  --primary-color:', primaryColor);
    console.log('  --bg-light:', bgLight);
    
    return primaryColor && bgLight;
}

console.log('CSS Variables test:', testCSSVariables());

// Auto-test after 2 seconds
setTimeout(() => {
    if (themeToggle) {
        console.log('🚀 Auto-testing theme toggle in 2 seconds...');
        testThemeToggle();
    }
}, 2000);
