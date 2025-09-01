// DARK MODE FIX - Copy and paste this into your browser console
console.log('🔧 Dark Mode Debug Script Starting...');

// 1. Check if button exists
const btn = document.getElementById('themeToggle');
console.log('Button found:', !!btn);

if (btn) {
    // 2. Manually set dark mode
    console.log('🌙 Setting dark mode manually...');
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // 3. Update button appearance
    const icon = btn.querySelector('.theme-icon');
    const label = btn.querySelector('.theme-label');
    
    if (icon) {
        icon.className = 'fas fa-sun theme-icon';
        console.log('✅ Icon updated to sun');
    }
    
    if (label) {
        label.textContent = 'Light';
        console.log('✅ Label updated to Light');
    }
    
    // 4. Save to localStorage
    localStorage.setItem('theme', 'dark');
    console.log('✅ Theme saved to localStorage');
    
    // 5. Add click event if not working
    btn.onclick = function() {
        console.log('🖱️ Button clicked!');
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log('Current:', currentTheme, '| New:', newTheme);
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button
        if (icon) icon.className = newTheme === 'dark' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
        if (label) label.textContent = newTheme === 'dark' ? 'Light' : 'Dark';
        
        console.log('✅ Theme switched to:', newTheme);
    };
    
    console.log('🎉 Dark mode fix applied! Try clicking the button now.');
    
} else {
    console.error('❌ Theme toggle button not found!');
}

// Test CSS variables
const style = getComputedStyle(document.documentElement);
console.log('CSS Variables Test:');
console.log('--bg-light:', style.getPropertyValue('--bg-light'));
console.log('--text-dark:', style.getPropertyValue('--text-dark'));

// Quick toggle function for testing
window.toggleDarkMode = function() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    console.log('🔄 Toggled to:', newTheme);
    return newTheme;
};
