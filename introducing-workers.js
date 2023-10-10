/*
- Workers give the ability to run some tasks in a different thread so a task can be started then continue with the other processing, such as handling user actions.
- One concern is if multiple threads have access to the same shared data, it is possible for them to change independently and unexpectedly (can cause hard to find bugs)
- Main code and worker code can never get direct access to one another's variables to make avoid these problems
- Worker code and main code run in completely separate worlds
- Three types of workers:
    - dedicated workers
    - shared workers
    - service workers 
*/


// Example 1
// program becomes completely unresponsive

function generatePrimes(quota) {
    function isPrime(n) {
      for (let c = 2; c <= Math.sqrt(n); ++c) {
        if (n % c === 0) {
          return false;
        }
      }
      return true;
    }
  
    const primes = [];
    const maximum = 1000000;
  
    while (primes.length < quota) {
      const candidate = Math.floor(Math.random() * (maximum + 1));
      if (isPrime(candidate)) {
        primes.push(candidate);
      }
    }
  
    return primes;
  }
  
  document.querySelector("#generate").addEventListener("click", () => {
    const quota = document.querySelector("#quota").value;
    const primes = generatePrimes(quota);
    document.querySelector(
      "#output",
    ).textContent = `Finished generating ${quota} primes!`;
  });
  
  document.querySelector("#reload").addEventListener("click", () => {
    document.querySelector("#user-input").value =
      'Try typing in here immediately after pressing "Generate primes"';
    document.location.reload();
  });

  
  // Prime generation with a worker example

  // HTML Code 
  <!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Prime numbers</title>
    <script src="main.js" defer></script>
    <link href="style.css" rel="stylesheet" />
  </head>

  <body>
    <label for="quota">Number of primes:</label>
    <input type="text" id="quota" name="quota" value="1000000" />

    <button id="generate">Generate primes</button>
    <button id="reload">Reload</button>

    <textarea id="user-input" rows="5" cols="62">
Try typing in here immediately after pressing "Generate primes"
    </textarea>

    <div id="output"></div>
  </body>
</html>

// CSS code 
textarea {
    display: block;
    margin: 1rem 0;
  }

  
// Main JS file
// Create a new worker, giving it the code in "generate.js"
const worker = new Worker("./generate.js");

// When the user clicks "Generate primes", send a message to the worker.
// The message command is "generate", and the message also contains "quota",
// which is the number of primes to generate.
document.querySelector("#generate").addEventListener("click", () => {
  const quota = document.querySelector("#quota").value;
  worker.postMessage({
    command: "generate",
    quota,
  });
});

// When the worker sends a message back to the main thread,
// update the output box with a message for the user, including the number of
// primes that were generated, taken from the message data.
worker.addEventListener("message", (message) => {
  document.querySelector(
    "#output",
  ).textContent = `Finished generating ${message.data} primes!`;
});

document.querySelector("#reload").addEventListener("click", () => {
  document.querySelector("#user-input").value =
    'Try typing in here immediately after pressing "Generate primes"';
  document.location.reload();
});

/*
- The worker is created using the Worker() constructor 
- A URL is pointing to the worker script
- A click event handler is added to "Generate primes"
- A message is sent to the worker using worker.postMessage()
*/

//Generate JS file


// Listen for messages from the main thread.
// If the message command is "generate", call `generatePrimes()`
addEventListener("message", (message) => {
    if (message.data.command === "generate") {
      generatePrimes(message.data.quota);
    }
  });
  
  // Generate primes (very inefficiently)
  function generatePrimes(quota) {
    function isPrime(n) {
      for (let c = 2; c <= Math.sqrt(n); ++c) {
        if (n % c === 0) {
          return false;
        }
      }
      return true;
    }
  
    const primes = [];
    const maximum = 1000000;
  
    while (primes.length < quota) {
      const candidate = Math.floor(Math.random() * (maximum + 1));
      if (isPrime(candidate)) {
        primes.push(candidate);
      }
    }
  
    // When we have finished, send a message to the main thread,
    // including the number of primes we generated.
    postMessage(primes.length);
  }

  
  /*
  - Worker firsts listens for messages from the main script 
  - Uses the addEventListener(), a global function, in a worker
  - In the message event handler, the data property of the event obtains a copy of the argument passed from the main script
  */

  /* Other types of workers
  - Shared workers can be shared by several different scripts running in different windows
  - Service workers act like proxy servers, they cache resources so web apps can work when the user is offline

  */