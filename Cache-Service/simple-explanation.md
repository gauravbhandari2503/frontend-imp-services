# Simple Explanation of Cache Service

The Cache Service is like a smart storage system for your application to make it faster. It remembers data so you don't have to fetch it from the server every time.

## 🧠 Think of it like this:

- **L1 Cache (Memory/RAM)**: This is your **Backpack**. It's super fast to reach, but it's small. If you turn off the app (close the tab), it empties.
- **L2 Cache (IndexedDB)**: This is your **Closet**. It's bigger and keeps things even if you close the app, but it takes a tiny bit longer to open than your backpack.

## 🔑 Key Features

- **LRU (Least Recently Used)**: Your backpack only holds **100 items**. If you try to put in the 101st item, the service automatically throws out the item you haven't used in the longest time.
- **TTL (Time To Live)**: Items expire after a set time (default **5 minutes**). If you ask for an expired item, the service throws it away and tells you "I don't have it."

## 🛠️ Functions Explained

### 1. `get(key)`

**What it does:** Asks "Do we have this saved?"

**How it works:**

1. Checks **L1 (Backpack)** first. If found and not expired, returns it immediately.
2. If not in L1, checks **L2 (Closet/IndexedDB)**.
3. If found in L2, it moves it to L1 (so it's faster next time) and returns it.
4. If nowhere, returns `null`.

### 2. `set(key, value, options)`

**What it does:** Saves data for later.

**How it works:**

1. Puts the data into **L1 (Backpack)**.
2. If `options.persist` is true, it also puts a copy in **L2 (Closet)** so it survives a page reload.

### 3. `invalidate(key)`

**What it does:** Forces the service to forget a specific item.

**Usage:** checking out new data? Delete the old cached version to ensure you start fresh.

### 4. `clear()`

**What it does:** Empties everything.

**Usage:** Useful when a user logs out to remove all their private data.

### 5. `setL1(key, entry)`

_(Private Helper)_

**What it does:** This is the "Smart Packer".

**How it works:** Before putting an item in the memory list, it checks if the list is full (100 items). If full, it deletes the oldest item to make space.
