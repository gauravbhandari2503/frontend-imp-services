# Simple Explanation of Environment Config Service

The Environment Config Service is like the **Rulebook** or **Settings Menu** for your application. It tells the app how to behave depending on where it's running (like on your laptop vs. in the real world).

## 🧠 Think of it like this:

- **Defaults**: These are the **Factory Settings**. If you don't change anything, the app uses these safe, standard options.
- **Environment Variables**: These are like **Secret Codes** passed to the app when it starts up. They can override the factory settings (e.g., "Connect to the real bank, not the test bank").
- **Runtime Config**: This is like a **Sticky Note** attached to the app window. It can change settings even after the app is built, without needing to rebuild it.

## 🔑 Key Features

- **Centralized Control**: Instead of asking "What is the API URL?" in 50 different places, everyone asks this one service.
- **Priority System**: It's smart about conflicts.
  1. **Sticky Note (Runtime)** wins first.
  2. **Secret Codes (Env Vars)** win second.
  3. **Factory Settings (Defaults)** are the backup.
- **Region Detection**: It can look at the website address (like `us.example.com`) to figure out where the user is.

## 🛠️ Functions Explained

### 1. `get(key)`

**What it does:** Asks for a specific setting.

**Example:** `get('apiUrl')` -> returns `"https://api.myapp.com"`

### 2. `getAll()`

**What it does:** Gives you the entire Rulebook at once.

**Usage:** Useful for debugging to see exactly what settings the app is using right now.

### 3. `detectRegion()`

**What it does:** Figures out where the user is.

**How it works:**

1. Checks the website address (URL). If it starts with `us.`, `eu.`, or `asia.`, it knows your region.
2. If the URL doesn't say, it looks at the loaded configuration settings.

### 4. `loadConfig()`

_(Private Helper)_

**What it does:** The Librarian that gathers all the rules.

**How it works:** When the app starts, this function grabs the Defaults, reads the Secret Codes, and checks for Sticky Notes. It mixes them all together (following the priority rules) to create the final Rulebook.
