const { fork } = require('child_process');

// Function to run a bot with a given name and log prefix
const runBot = (botName, indexPath) => {
  const botProcess = fork(indexPath);

  botProcess.on('message', (message) => {
    console.log(`[${botName}] ${message}`);
  });

  botProcess.on('exit', (code) => {
    console.log(`[${botName}] Child process exited with code ${code}`);
  });

  return botProcess;
};

// Run Mira bot
const miraProcess = runBot('Mira', './mira/index.js');

// Run Nyano bot
const nyanoProcess = runBot('Nyano', './nyano/index.js');

// Uncomment the lines below if you want to keep the main process running
// miraProcess.unref();
// nyanoProcess.unref();