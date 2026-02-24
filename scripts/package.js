#!/usr/bin/env node

/**
 * Package the Companion module for distribution
 * Creates a .tgz file that can be installed in Companion
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT_DIR = path.join(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const PACKAGE_JSON = require(path.join(ROOT_DIR, 'package.json'))

console.log('='.repeat(60))
console.log('Packaging Companion Module for Distribution')
console.log('='.repeat(60))
console.log()

// Get version from package.json
const VERSION = PACKAGE_JSON.version
const MODULE_NAME = PACKAGE_JSON.name
const OUTPUT_FILE = `${MODULE_NAME}-${VERSION}.tgz`

console.log(`Module: ${MODULE_NAME}`)
console.log(`Version: ${VERSION}`)
console.log(`Output: ${OUTPUT_FILE}`)
console.log()

// Create dist directory if it doesn't exist
if (!fs.existsSync(DIST_DIR)) {
	fs.mkdirSync(DIST_DIR, { recursive: true })
	console.log('✓ Created dist directory')
}

// Check if node_modules exists and has production dependencies
const NODE_MODULES = path.join(ROOT_DIR, 'node_modules')
if (!fs.existsSync(NODE_MODULES)) {
	console.log('⚠ node_modules not found. Installing production dependencies...')
	try {
		execSync('npm install --production', { 
			cwd: ROOT_DIR, 
			stdio: 'inherit' 
		})
		console.log('✓ Dependencies installed')
	} catch (error) {
		console.error('✗ Failed to install dependencies')
		process.exit(1)
	}
}

console.log()
console.log('Creating package...')
console.log()

try {
	// Companion expects the package to extract into a folder with the module name
	// Create a temporary directory with the proper structure
	const TEMP_DIR = path.join(ROOT_DIR, '.tmp-package')
	const MODULE_DIR = path.join(TEMP_DIR, MODULE_NAME)
	
	// Clean up any previous temp directory
	if (fs.existsSync(TEMP_DIR)) {
		execSync(`rm -rf "${TEMP_DIR}"`)
	}
	
	// Create module directory structure
	fs.mkdirSync(MODULE_DIR, { recursive: true })
	console.log('✓ Created temporary package directory')
	
	// Copy files to temp directory
	const filesToCopy = [
		'src',
		'companion',
		'node_modules',
		'package.json',
		'package-lock.json',
		'README.md',
		'PROTOCOL.md'
	]
	
	// Add optional files
	if (fs.existsSync(path.join(ROOT_DIR, 'LICENSE'))) {
		filesToCopy.push('LICENSE')
	}
	if (fs.existsSync(path.join(ROOT_DIR, '.gitignore'))) {
		filesToCopy.push('.gitignore')
	}
	
	console.log('✓ Copying files...')
	for (const file of filesToCopy) {
		const srcPath = path.join(ROOT_DIR, file)
		const destPath = path.join(MODULE_DIR, file)
		
		if (fs.existsSync(srcPath)) {
			execSync(`cp -R "${srcPath}" "${destPath}"`)
		}
	}
	
	// Create tar from temp directory
	const tarCommand = [
		'tar',
		'-czf',
		path.join(DIST_DIR, OUTPUT_FILE),
		'-C',
		TEMP_DIR,
		MODULE_NAME
	]
	
	console.log('✓ Creating archive...')
	execSync(tarCommand.join(' '), { stdio: 'pipe' })
	
	// Clean up temp directory
	execSync(`rm -rf "${TEMP_DIR}"`)
	console.log('✓ Cleaned up temporary files')
	
	console.log()
	console.log('✓ Package created successfully!')
	console.log()
	
	// Get file size
	const stats = fs.statSync(path.join(DIST_DIR, OUTPUT_FILE))
	const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
	
	console.log('Package Details:')
	console.log(`  File: ${OUTPUT_FILE}`)
	console.log(`  Size: ${fileSizeInMB} MB`)
	console.log(`  Location: ${path.join(DIST_DIR, OUTPUT_FILE)}`)
	console.log()
	
	console.log('Installation Instructions:')
	console.log('  1. Copy the .tgz file to your Companion modules directory:')
	console.log('     macOS: ~/Library/Application Support/companion-modules/')
	console.log('     Windows: %APPDATA%\\companion-modules\\')
	console.log('     Linux: ~/.local/share/companion-modules/')
	console.log()
	console.log('  2. Extract: tar -xzf ' + OUTPUT_FILE)
	console.log('     Or: npm install ' + path.join(DIST_DIR, OUTPUT_FILE))
	console.log()
	console.log('  3. Restart Companion')
	console.log()
	
} catch (error) {
	console.error('✗ Failed to create package:', error.message)
	process.exit(1)
}

console.log('='.repeat(60))
console.log('Packaging Complete!')
console.log('='.repeat(60))
