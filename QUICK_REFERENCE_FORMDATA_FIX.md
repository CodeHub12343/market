# FormData Upload Fix - Quick Reference

## 🔴 Error You Were Seeing
```
Cast to string failed for value "{}" (type Object) at path "logo"
```

This meant the File object was being corrupted to `{}` when sent to backend.

## 🎯 The Root Cause (Finally Found!)

Your axios interceptor was **forcing** all requests to use:
```javascript
'Content-Type': 'application/json'
```

This conflicted with FormData's multipart encoding, corrupting the file.

## ✅ The Fix (3 Simple Parts)

### 1️⃣ Service Layer (`src/services/shops.js`)
- ✅ Create FormData properly
- ✅ Use 3-param append: `formData.append(key, file, filename)`
- ✅ Validate file with `instanceof File`

### 2️⃣ Component Layer (`src/components/shops/ShopForm.jsx`)
- ✅ Validate file type and size
- ✅ Add proper error handling
- ✅ Add console logging

### 3️⃣ API Interceptor (`src/services/api.js`) ⭐ THE KEY FIX
```javascript
if (config.data instanceof FormData) {
  delete config.headers['Content-Type'];  // ✅ This was the missing piece!
}
```

## 🧪 Test It

```bash
npm run dev
# Go to /shops/new
# Fill form
# SELECT AN IMAGE FILE  ← Important!
# Click Create Shop
# ✅ Should work now!
```

## ✨ What's Different Now

| Before | After |
|--------|-------|
| File received as `{}` | File received as proper File object |
| Content-Type forced to JSON | Content-Type auto-set to multipart with boundary |
| Form submission fails | Form submission succeeds |
| Logo field gets `{}` | Logo field gets file path |

## 🔑 Key Insight

When using axios with:
- ❌ Default headers that set Content-Type
- ❌ Request interceptors that modify headers
- ✅ FormData uploads

You **MUST** delete the conflicting Content-Type header in the interceptor for FormData requests!

```javascript
if (config.data instanceof FormData) {
  delete config.headers['Content-Type'];
}
```

---

**Status:** ✅ FIXED - Ready to test shop creation with image upload!
