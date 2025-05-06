// Ensure Tailwind CSS is properly processed in Netlify builds
console.log('Configuring Tailwind CSS for Netlify build...');

const fs = require('fs');
const path = require('path');

// Force tailwind-config.js to be properly loaded
try {
  const tailwindConfig = require('./tailwind.config.js');
  console.log('✅ Successfully loaded tailwind.config.js');
  
  // Make sure the CSS imports are properly set
  const indexCssPath = path.join(__dirname, 'src', 'index.css');
  if (fs.existsSync(indexCssPath)) {
    const content = fs.readFileSync(indexCssPath, 'utf8');
    console.log('✅ Successfully loaded index.css');
    
    // Check if Tailwind directives are present
    if (content.includes('@tailwind base') && 
        content.includes('@tailwind components') && 
        content.includes('@tailwind utilities')) {
      console.log('✅ Tailwind directives found in index.css');
    } else {
      console.log('⚠️ Warning: Tailwind directives not found in index.css');
    }
  } else {
    console.log('⚠️ Warning: index.css not found');
  }
  
  // Check if postcss.config.js exists
  const postcssPath = path.join(__dirname, 'postcss.config.js');
  if (fs.existsSync(postcssPath)) {
    console.log('✅ postcss.config.js found');
  } else {
    console.log('⚠️ Warning: postcss.config.js not found');
  }
  
} catch (error) {
  console.error('❌ Error loading tailwind configuration:', error);
}

console.log('Tailwind CSS configuration check complete');
