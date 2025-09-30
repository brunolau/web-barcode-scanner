const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to run a shell command
function runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { stdio: 'inherit', shell: true });

        process.on('error', (error) => {
            console.error(`Error: ${error.message}`);
            reject(error);
        });

        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Command failed with exit code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

// Define post-processing logic here
async function postProcessing() {
    console.log('Starting post-processing...');

    // Example: Copy a file after build
    const outputDir = path.resolve(__dirname, 'dist');
    const fileToCopy = path.resolve(outputDir, 'index.js');
    const destination = path.resolve(outputDir, 'copied-index.js');

    try {
        fs.copyFileSync(fileToCopy, destination);
        console.log(`Copied ${fileToCopy} to ${destination}`);
    } catch (error) {
        console.error('Error in post-processing:', error.message);
        process.exit(1);
    }

    console.log('Post-processing completed!');
}

// Main function
(async () => {


    try {
        // Step 1: Run the tsup command
        console.log('Running tsup build...');
        await runCommand('tsup src/index.ts --format cjs,esm --dts --minify');

        const outputDir = path.resolve(__dirname, '..', 'dist');

        // Step 2: Perform post-processing
        await postProcessing();

        console.log('All tasks completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error occurred:', error.message);
        process.exit(1);
    }
})();