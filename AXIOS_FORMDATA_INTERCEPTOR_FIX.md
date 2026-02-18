# Axios Interceptor FormData Fix

## 🔴 The Real Problem

The error was persisting because of the **axios request interceptor** interfering with FormData:

```javascript
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',  // ❌ This gets inherited by ALL requests!
  },
});
```

**What Happens:**
1. You create a FormData object
2. Axios detects it and tries to set `Content-Type: multipart/form-data; boundary=...`
3. **BUT** the interceptor runs and keeps the `Content-Type: application/json` header
4. Backend receives corrupted data → File becomes `{}`

## ✅ The Solution

Update the request interceptor to **delete the Content-Type header when FormData is detected**:

```javascript
api.interceptors.request.use(
  (config) => {
    const token = getCookie('jwt') || localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ CRITICAL: Remove Content-Type for FormData
    // This allows axios/browser to set correct multipart/form-data boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);
```

## 🎯 How It Works Now

### Before (Broken):
```
FormData created
    ↓
axios detects FormData, tries to set multipart header
    ↓
Interceptor overrides with 'application/json' ❌
    ↓
Backend receives corrupted file: {}
```

### After (Fixed):
```
FormData created
    ↓
axios detects FormData
    ↓
Interceptor sees FormData, deletes conflicting header ✅
    ↓
axios sets proper 'multipart/form-data; boundary=...'
    ↓
Backend receives proper File object ✅
```

## 📝 What Changed

**File:** `src/services/api.js`

```javascript
// Added this check in request interceptor:
if (config.data instanceof FormData) {
  delete config.headers['Content-Type'];
}
```

This single check ensures that:
- ✅ FormData requests have the correct boundary marker
- ✅ JSON requests still use 'application/json'
- ✅ JWT auth token is still added
- ✅ File is properly encoded as multipart

## 🧪 How to Test

1. Navigate to `/shops/new`
2. Fill in shop details
3. **Select an image file** for logo
4. Click "Create Shop"
5. **Check console** - should NOT see the `Cast to string failed for value "{}"` error anymore
6. ✅ Shop should be created successfully with image

## 🔍 Verification Checklist

After the fix, when you submit the form with an image:

✅ **Console logs show proper FormData:**
```
FormData created, entries:
  name: Abike Clothing Collections
  description: ...
  campus: 68e5d74b9e9ea2f53162e9ae
  logo: File(filename.jpg, image/jpeg, 18215 bytes)
```

✅ **Network tab shows correct header:**
```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
(NOT 'application/json')
```

✅ **Backend receives proper file:**
```javascript
req.file = {
  fieldname: 'logo',
  originalname: 'filename.jpg',
  mimetype: 'image/jpeg',
  size: 18215,
  ...
}
(NOT req.file = {})
```

## 🎓 Key Learning

**Why This Matters:**

When using axios with interceptors AND FormData:
1. The **default headers** apply to every request
2. FormData needs special handling - it must set its own Content-Type with a boundary
3. Any interceptor that sets headers **will override** axios's FormData detection
4. Solution: **Detect FormData in interceptor and remove conflicting headers**

## 📋 Complete Fix Summary

Three levels of fixes were needed:

1. **Service Layer** (`src/services/shops.js`)
   - ✅ Proper FormData creation
   - ✅ 3-parameter append for files
   - ✅ File validation

2. **Component Layer** (`src/components/shops/ShopForm.jsx`)
   - ✅ File validation before storing
   - ✅ Proper error handling
   - ✅ Debug logging

3. **API Layer** (`src/services/api.js`) ← **THIS WAS THE MISSING PIECE**
   - ✅ Detect FormData in interceptor
   - ✅ Remove conflicting Content-Type header
   - ✅ Let axios handle multipart encoding

## ✨ Expected Result

After applying this fix:
- ✅ FormData properly created with File object
- ✅ Axios interceptor respects FormData
- ✅ Backend receives actual File, not `{}`
- ✅ Shop creation with logo **succeeds!** 🎉

---

**Status:** ✅ FIXED - This was the final piece of the puzzle!
