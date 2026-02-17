# Simple Explanation of Logger Service

The Logger Service is like the **Captain's Log** (or a Diary) for your application. It writes down what's happening so developers can read it later to understand the story.

## 🧠 Think of it like this:

- **Log Levels**: These are **Filters**. Imagine you are writing a diary.
  - **DEBUG**: "I moved my finger 1 inch." (Too much detail, usually ignored).
  - **INFO**: "I ate breakfast." (Normal events).
  - **WARN**: "The milk smelled funny." (Something might be wrong).
  - **ERROR**: "I threw up." (Something is definitely wrong).
- **Transports**: These are **Destinations**. You can write the diary entry in a notebook (Console) AND mail a copy to the headquarters (Server) at the same time.

## 🔑 Key Features

- **Configurable**: You can tell it "Only show me Errors" so the console isn't flooded with junk.
- **Extensible**: You can add new places to save logs (Transports) without changing the main code.
- **Unified**: Everyone uses the same logger, so all messages look the same.

## 🛠️ Functions Explained

### 1. `info(message, data)` / `warn(...)` / `error(...)`

**What it does:** Writes a log entry at that specific severity level.

**Usage:**

- `info('User logged in')`
- `error('Payment failed', { id: 123 })`

### 2. `addTransport(transport)`

**What it does:** Adds a new place to send logs.

**Example:** You could create a `FileTransport` that writes errors to a text file, or a `SlackTransport` that posts errors to a Slack channel.

### 3. `configureLevel()`

_(Private Helper)_

**What it does:** Checks the settings to decide what to ignore.

**How it works:** If the level is set to `ERROR`, the logger will silently ignore all `info` and `warn` messages.
