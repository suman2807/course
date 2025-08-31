// build.js - Build script for Vercel deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories
const rootDir = process.cwd();
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');
const distDir = path.join(frontendDir, 'dist');

// Main build function
async function build() {
  console.log('🔨 Starting build process...');

  // Ensure directories exist
  if (!fs.existsSync(frontendDir)) {
    console.error('❌ Frontend directory not found at:', frontendDir);
    process.exit(1);
  }
  
  // Install dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: frontendDir });

  // Build frontend
  console.log('🏗️ Building frontend...');
  execSync('npm run build', { stdio: 'inherit', cwd: frontendDir });

  // Verify build
  if (!fs.existsSync(distDir)) {
    console.error('❌ Build failed: dist directory not created');
    process.exit(1);
  }

  // Create empty vercel.json in dist for fallback
  const vercelJsonPath = path.join(distDir, 'vercel.json');
  if (!fs.existsSync(vercelJsonPath)) {
    console.log('📄 Creating vercel.json in dist directory...');
    fs.writeFileSync(vercelJsonPath, JSON.stringify({
      "routes": [
        { "handle": "filesystem" },
        { "src": "/(.*)", "dest": "/index.html" }
      ]
    }, null, 2));
  }

  console.log('✅ Build completed successfully!');
}

// Run build
build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});