# 🎨 Browser Pretty Logger

A lightweight, zero-dependency, styled console logger for the browser. It uses a modern tagged template literal API to provide rich, colorful logging while preserving the original source code line numbers for easy debugging.


---
## Features

* ✅ **Rich, Customizable Styling:** Create distinct, easy-to-read logs with custom icons, colors, and backgrounds.
* 🔗 **Perfect Source Links:** Always links to the correct line in your application code, not the logger's internals.
* ✨ **Modern API:** Uses tagged template literals for a clean and intuitive logging experience.
* 📦 **Zero Dependencies:** A single, self-contained JavaScript file with no external libraries.
* 🗂️ **Group Scoping:** Create pre-configured loggers for different parts of your application (e.g., `API`, `Payment`).
* 🔍 **Interactive Data:** Logs objects and errors in a way that lets you inspect them in the DevTools.

---
## Setup

This logger is a single, self-contained file.

1.  Copy the `logger.js` file into your project (e.g., in a `utils` or `lib` folder).
2.  Import it where you need it.

```javascript
import { createLogger, baseLogger } from './utils/logger.js';
```

---
## Usage

The logger works by preparing arguments for the native `console` methods. You use the logger method as a **tag** for a template literal, and then spread the result into the console method of your choice.

### Basic Logging

A `baseLogger` is exported for immediate, general-purpose use.

```javascript
import { baseLogger } from './utils/logger.js';

console.info(...baseLogger.info`Application has started.`);
console.log(...baseLogger.success`Configuration loaded successfully.`);
```

### Creating a scoped Logger

The `createLogger` factory lets you create a logger with a pre-configured `group` name, which will appear as its own styled badge.

```javascript
import { createLogger } from './utils/logger.js';

const apiLogger = createLogger({ group: 'API' });

console.log(...apiLogger.debug`Fetching user data...`);
```

### Destructuring for a Cleaner API (Recommended)

This is the cleanest way to use the logger. Create a scoped logger and destructure its methods into standalone variables.

```javascript
import { createLogger } from './utils/logger.js';

const { success, error, warn } = createLogger({ group: 'Payment' });

const transactionId = 'txn_12345';
const amount = 99.50;

console.log(...success`Payment of ${amount} for transaction ${transactionId} was successful.`);
console.warn(...warn`The payment gateway reported high latency.`);

try {
  throw new Error("Invalid card details.");
} catch (err) {
  // You can interpolate error objects directly into the string
  console.error(...error`Failed to process transaction ${transactionId}: ${err}`);
}
```
