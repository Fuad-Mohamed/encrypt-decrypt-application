# AES-128-CBC Encrypt / Decrypt App
> Node.js · Express · MongoDB · EJS

A full-stack web application that encrypts and decrypts text using the **AES-128-CBC** cipher, stores all operations in MongoDB, and renders views with EJS.

---

## Features

| Feature | Details |
|---|---|
| **Encrypt** | AES-128-CBC with a 128-bit key + random IV per encryption |
| **Decrypt** | Provide ciphertext + key + IV to recover plaintext |
| **History** | All operations stored in MongoDB, viewable & deletable |
| **Key Generator** | Auto-generate cryptographically secure 16-byte keys |
| **One-click Decrypt** | History page links directly to decrypt form pre-filled |

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Views**: EJS (Embedded JavaScript Templates)
- **Crypto**: Node.js built-in `crypto` module (no external crypto libs)

---

## Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- MongoDB running locally on port 27017 (or update `.env`)

### 2. Install dependencies
```bash
cd crypto-app
npm install
```

### 3. Configure environment
Edit `.env` if needed:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cryptodb
```

### 4. Run
```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

### 5. Open browser
```
http://localhost:3000
```

---

## How AES-128-CBC Works

```
Plaintext  ─► XOR ─► AES Block Cipher ─► Ciphertext Block 1
                ▲               │
               IV               │
                                ▼
Ciphertext 1 ─► XOR ─► AES Block Cipher ─► Ciphertext Block 2
                                │
                                ▼
                              ... (chained)
```

1. **Key**: 128 bits (16 bytes), expressed as 32 hex characters.
2. **IV**: 16 random bytes generated fresh for every encryption (ensures identical plaintexts produce different ciphertexts).
3. **Padding**: PKCS#7 — plaintext is padded to a multiple of 16 bytes.
4. **CBC**: Each plaintext block is XOR'd with the previous ciphertext block before encryption.

---

## Project Structure

```
crypto-app/
├── app.js                  # Express entry point
├── .env                    # Environment variables
├── package.json
├── models/
│   └── CryptoEntry.js      # Mongoose schema
├── routes/
│   └── index.js            # All route handlers + crypto logic
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs           # Encrypt page
│   ├── decrypt.ejs         # Decrypt page
│   ├── history.ejs         # History page
│   └── error.ejs
└── public/
    ├── css/style.css
    └── js/main.js
```

---

## ⚠️ Security Notice

This app is a **cryptography learning demo**. In production:
- **Never store secret keys in a database** — use a KMS (Key Management Service).
- Use HTTPS to protect keys/ciphertexts in transit.
- Consider authenticated encryption (AES-GCM) to detect tampering.
