🔗 Linko Pro
Linko Pro is a modern, high-performance URL shortener built with Node.js and SQLite. It transforms long, unsightly URLs into clean, branded aliases while providing real-time analytics and QR code generation.

🚀 Features
⚡ Instant Shortening: Generate unique, secure 6-character short links in milliseconds.

✨ Custom Aliases: Create branded links (e.g., localhost:3000/my-portfolio).

📊 Advanced Analytics: Track total click counts and precisely when a link was last used.

📱 QR Code Engine: Every link automatically generates a high-resolution QR code for physical marketing.

⌛ Link Expiration: Built-in "self-destruct" feature to make links expire after 24 hours.

🗑️ Management Dashboard: View, copy, and delete your links from a single, responsive interface.

🛠️ Tech Stack
Runtime:  (v24.14.0+)

Framework: 

Database:  (File-based, zero-config)

ID Engine: nanoid (Cryptographically strong IDs)

Utilities: qrcode (Dynamic image generation)

📂 Project Structure
⚙️ Installation & Setup
Clone the Repository

Install Dependencies

Prepare the Database
Ensure you have a data folder in the root directory:

Launch the App

View in Browser
Navigate to http://localhost:3000

🧠 Core Logic Overview
The Redirection Loop
When a user visits a short link, the server performs the following steps:

Lookup: Queries the SQLite database for the short_code.

Validation: Checks if the link has an expires_at timestamp and verifies it hasn't passed.

Analytics: Atomically increments the clicks count and updates the last_clicked timestamp.

Handoff: Issues a 302 Redirect to the original long_url.