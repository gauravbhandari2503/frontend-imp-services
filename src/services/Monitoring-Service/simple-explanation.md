# Simple Explanation of Monitoring Service

The Monitoring Service is like the **Black Box (Flight Recorder)** of your application. It quietly watches everything in the background, recording crashes and measuring how fast the engine is running, so if something goes wrong, you know exactly why.

## 🧠 Think of it like this:

- **Error Tracking**: This is the **Alarm System**. If a part of the app breaks (an error throws), it immediately takes a picture of what happened, where, and when.
- **Performance Layout**: This is the **Speedometer**. It measures how fast the page loads (LCP), how quickly it reacts to clicks (FID), and if things jump around (CLS).
- **Event Queue**: This is a **Bucket**. Instead of running to the server every single time an error happens (which is slow), it throws them in a bucket and empties it every 5 seconds.

## 🔑 Key Features

- **Reliability**: It uses a special trick called `sendBeacon`. Even if the user closes the tab _right_ as an error happens, the browser guarantees the report gets sent.
- **Batched Reporting**: It groups events together to save battery and data.
- **Automatic**: It automatically catches errors you didn't expect (Global Error Handling).

## 🛠️ Functions Explained

### 1. `init()`

**What it does:** Turns the system on.

**How it works:**

- It starts listening for global errors (`window.onerror`).
- It starts watching for slow performance.
- It starts the 5-second timer to empty the bucket.

### 2. `trackError(error)`

**What it does:** Manually reports a problem.

**Usage:** `try { ... } catch (e) { monitoringService.trackError(e) }`
Use this when you catch an error but want the developers to know about it anyway.

### 3. `logMetric(name, value)`

**What it does:** Records a custom measurement.

**Example:** `logMetric('checkout_time', 200)` -> "User took 200ms to checkout."

### 4. `flush()`

_(Private Helper)_

**What it does:** Empties the bucket.

**How it works:** It takes all the errors and metrics in the queue, bundles them into one package, and sends them to the server.
