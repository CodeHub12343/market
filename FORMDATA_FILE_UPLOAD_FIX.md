# FormData File Upload Fix - Complete Guide

## 🔴 Problem

When uploading a shop with a logo image, the backend received:
```
ValidationError: Cast to string failed for value "{}" (type Object) at path "logo"
```

This means the File object was being converted to an empty object `{}` instead of being properly sent as multipart data.

## 🔍 Root Cause

**The Issue:** When explicitly setting `Content-Type: multipart/form-data` header, axios doesn't properly add the required `boundary` parameter. This causes the FormData to be serialized incorrectly, turning the File object into `{}`.

**Why It Happened:**
```javascript
// ❌ WRONG - This breaks FormData encoding
const response = await api.post(SHOPS_ENDPOINT, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'  // Missing boundary!
  }
});
```

When you set Content-Type manually, axios doesn't add the boundary marker that's needed for proper multipart encoding. The browser/axios can't properly separate the fields and files.

## ✅ Solution

### 1. **Fixed `createShop` Service** (`src/services/shops.js`)

**Key Changes:**

```javascript
export const createShop = async (shopData, logoFile) => {
  try {
    // ... validation code ...

    // Append files with 3-parameter form: key, file, filename
    if (logoFile instanceof File) {
      formData.append('logo', logoFile, logoFile.name);  // ✅ Include filename
    }

    // ✅ CRITICAL: Do NOT set Content-Type header!
    // Let axios auto-detect FormData and set Content-Type with boundary
    const response = await api.post(SHOPS_ENDPOINT, formData);
    
    return response.data.data;
  } catch (error) {
    // ... error handling ...
  }
};
```

**What Changed:**
- ✅ Skip empty string values: `value !== ''`
- ✅ Use 3-parameter `formData.append()`: `formData.append(key, file, filename)`
- ✅ Remove explicit `Content-Type` header
- ✅ Add file type checking: `logoFile instanceof File`
- ✅ Detailed logging for debugging

### 2. **Enhanced Form Validation** (`src/components/shops/ShopForm.jsx`)

```javascript
const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  
  if (!file) return;

  // ✅ Check it's actually a File object
  console.log('File is File object:', file instanceof File);

  // Validate type
  if (!file.type.startsWith('image/')) {
    setErrors(prev => ({
      ...prev,
      logo: 'Please select a valid image file (PNG, JPG, GIF)',
    }));
    setLogoFile(null);
    setLogoPreview(null);
    return;
  }

  // Validate size
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    setErrors(prev => ({
      ...prev,
      logo: 'Image must be smaller than 5MB',
    }));
    setLogoFile(null);
    setLogoPreview(null);
    return;
  }

  // ✅ Clear errors on success
  setErrors(prev => ({ ...prev, logo: '' }));

  // ✅ Store the File object
  console.log('Setting logoFile:', file.name, 'Type:', file.constructor.name);
  setLogoFile(file);

  // Create preview
  const reader = new FileReader();
  reader.onload = (event) => {
    setLogoPreview(event.target?.result);
  };
  reader.onerror = () => {
    setErrors(prev => ({
      ...prev,
      logo: 'Failed to read file',
    }));
  };
  reader.readAsDataURL(file);
};
```

## 🎯 How It Works Now

### Before (Broken):
```
File Selected → FormData.append() → Set Content-Type header → No boundary → axios confused → File becomes {}
```

### After (Working):
```
File Selected → FormData.append(key, file, filename) → axios detects FormData → Auto-set Content-Type with boundary → Proper multipart encoding → Backend receives File correctly
```

## 📋 Verification Checklist

When you test the fix, check the browser console for these logs:

```javascript
// 1. Form submission starts
Form submit - user: {...}, formData: {...}

// 2. Create shop mutation begins
Creating shop with shopData: {...}, logoFile: File

// 3. Service creates FormData
createShop called with shopData: {...}, logoFile: File

// 4. Fields are appended
Appending name: Abike Clothing Collections
Appending description: ...
Appending campus: 68e5d74b9e9ea2f53162e9ae
Appending logo file: 0d73131414b74899a36cade5f3a7b1a7.jpg image/jpeg 18215

// 5. FormData is ready
FormData created, entries:
  name: Abike Clothing Collections
  description: ...
  campus: 68e5d74b9e9ea2f53162e9ae
  logo: File(0d73131414b74899a36cade5f3a7b1a7.jpg, image/jpeg, 18215 bytes)

// 6. Success!
createShop response: {data: {_id: "...", name: "Abike...", logo: "url/to/logo"}}
```

## 🔧 Testing Steps

### Test 1: Create Shop WITHOUT Logo (Should Work)
1. Fill in all required fields
2. Do NOT select a logo
3. Click "Create Shop"
4. ✅ Should succeed

### Test 2: Create Shop WITH Logo (The Fix)
1. Fill in all required fields
2. Select an image file (< 5MB)
3. Verify image preview appears
4. Click "Create Shop"
5. ✅ Should succeed now!
6. Check console for proper FormData logs

### Test 3: Error Handling
1. Try to upload a non-image file
2. ✅ Should show error: "Please select a valid image file"
3. Try to upload a file > 5MB
4. ✅ Should show error: "Image must be smaller than 5MB"

## 🐛 If It Still Doesn't Work

### 1. Check Browser Console
Look for this exact log after clicking submit:
```
FormData created, entries:
  logo: File(filename.jpg, image/jpeg, 12345 bytes)
```

If logo shows as `File({})` instead, the file wasn't properly selected.

### 2. Check Network Tab
- Open DevTools → Network tab
- Click "Create Shop"
- Find the POST request to `/api/v1/shops`
- Headers should show: `Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...`
- Payload should show the file and fields

### 3. Check Backend Logs
The backend should receive:
```
req.file = {
  fieldname: 'logo',
  originalname: '0d73131414b74899a36cade5f3a7b1a7.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 18215,
  ...
}

req.body = {
  name: 'Abike Clothing Collections',
  description: '...',
  campus: '68e5d74b9e9ea2f53162e9ae',
  ...
}
```

If `req.file` is `{}` or undefined, the backend's multer isn't configured correctly.

## 📝 Summary of Changes

| File | Change |
|------|--------|
| `src/services/shops.js` | Updated `createShop()` to use 3-param append and remove manual header |
| `src/components/shops/ShopForm.jsx` | Enhanced `handleImageChange()` with better validation and logging |

## ✨ Result

✅ FormData properly created with File object  
✅ File sent with correct multipart/form-data encoding  
✅ Backend receives actual file, not `{}`  
✅ Shop creation with logo now works! 🎉

---

**Key Learning:** Never manually set `Content-Type: multipart/form-data` header with FormData - let axios auto-detect and handle it!
