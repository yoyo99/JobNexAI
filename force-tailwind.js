// Force Tailwind CSS processing for Netlify build
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure that Tailwind CSS is properly processed during build
console.log('🔧 Forcing Tailwind CSS processing...');

// Make sure all necessary dependencies are installed
const requiredDeps = ['tailwindcss', 'postcss', 'autoprefixer', 'postcss-cli'];
let installNeeded = false;

try {
  // Check for existing package.json
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check if we need to install any dependencies
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      console.log(`⚠️ Missing dependency: ${dep}`);
      installNeeded = true;
    }
  }
  
  // Add our custom build scripts
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  // Add script to build CSS directly
  packageJson.scripts['build:css'] = 'npx tailwindcss -i ./src/index.css -o ./dist/styles.css --minify';
  
  // Make sure our CSS build happens before the regular build
  if (packageJson.scripts['build:netlify'] && !packageJson.scripts['build:netlify'].includes('build:css')) {
    const originalScript = packageJson.scripts['build:netlify'];
    packageJson.scripts['build:netlify'] = 'npm run build:css && ' + originalScript;
    console.log('✅ Updated build:netlify script to include CSS processing');
  }
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json updated with CSS build scripts');
  
  // Install any missing dependencies
  if (installNeeded) {
    console.log('📦 Installing missing dependencies...');
    try {
      execSync('npm install --save-dev ' + requiredDeps.join(' '), { stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.error('⚠️ Could not install dependencies automatically, continuing anyway...');
    }
  }
} catch (error) {
  console.error('❌ Error updating package.json:', error);
}

// Create an enhanced postcss.config.js
console.log('📝 Creating enhanced PostCSS config...');
const postcssConfig = `module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

// Write the enhanced PostCSS config
fs.writeFileSync(path.join(__dirname, 'postcss.config.js'), postcssConfig);
console.log('✅ Enhanced postcss.config.js created');

// Make sure tailwind.config.js is correctly configured
console.log('🔍 Verifying tailwind.config.js...');
let tailwindConfigContent;

try {
  tailwindConfigContent = fs.readFileSync(path.join(__dirname, 'tailwind.config.js'), 'utf8');
  console.log('✅ Found existing tailwind.config.js');
  
  // Look for the color definitions we need
  if (!tailwindConfigContent.includes('background:') || 
      !tailwindConfigContent.includes('primary:') || 
      !tailwindConfigContent.includes('secondary:')) {
    console.log('⚠️ Warning: tailwind.config.js may be missing color definitions');
  }
} catch (error) {
  console.error('❌ Could not read tailwind.config.js:', error);
}

// Create a direct CSS import for the HTML
console.log('🎨 Creating direct CSS styles for the application...');

// Generate a minimal CSS file with essential styles
const minimalCss = `
/* Essential styles to ensure the application has the correct theme */
:root {
  color-scheme: dark;
}

body {
  background-color: #0F172A;
  color: white;
  min-height: 100vh;
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-primary-400 {
  --tw-gradient-from: #f472b6;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(244, 114, 182, 0));
}

.to-secondary-400 {
  --tw-gradient-to: #a78bfa;
}

.from-primary-600 {
  --tw-gradient-from: #db2777;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(219, 39, 119, 0));
}

.to-secondary-600 {
  --tw-gradient-to: #7c3aed;
}

/* These classes ensure the text gradient works */
.text-transparent {
  color: transparent;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
`;

// Write the minimal CSS file
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

fs.writeFileSync(path.join(distPath, 'essential-styles.css'), minimalCss);
console.log('✅ Created essential-styles.css');

// Create a script to inject essential styles into the HTML
const injectStylesScript = `
const fs = require('fs');
const path = require('path');

console.log('💉 Injecting essential styles...');

const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Ensure our essential styles are loaded
  if (!html.includes('essential-styles.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="/essential-styles.css">\n</head>');
    fs.writeFileSync(indexHtmlPath, html);
    console.log('✅ Injected essential styles into index.html');
  }
} else {
  console.log('⚠️ Warning: index.html not found in dist folder');
}
`;

fs.writeFileSync(path.join(__dirname, 'inject-styles.js'), injectStylesScript);
console.log('✅ Created inject-styles.js script');

// Update netlify.toml to use our inject-styles script
try {
  const netlifyTomlPath = path.join(__dirname, 'netlify.toml');
  if (fs.existsSync(netlifyTomlPath)) {
    let netlifyToml = fs.readFileSync(netlifyTomlPath, 'utf8');
    
    // Check if our script is already included
    if (!netlifyToml.includes('inject-styles.js')) {
      netlifyToml = netlifyToml.replace(
        'create-standalone-version.js && node inject-supabase-preloader.js',
        'create-standalone-version.js && node inject-styles.js && node inject-supabase-preloader.js'
      );
      fs.writeFileSync(netlifyTomlPath, netlifyToml);
      console.log('✅ Updated netlify.toml to inject styles');
    }
  }
} catch (error) {
  console.error('❌ Error updating netlify.toml:', error);
}

console.log('✨ Tailwind CSS force-processing setup complete!');
