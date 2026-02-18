# Backend FormData Parsing Issue

## Problem

When uploading a shop with an image file, the frontend sends all the data correctly via FormData:
- All shop fields: name, description, location, category, campus, allowOffers, allowMessages
- Logo file under the 'logo' key

However, the backend returns a 500 error:
```
ValidationError: A shop must belong to a campus. A shop must have a name
```

This indicates the backend is **not receiving the form fields**, only the file.

## Root Cause

The backend's multer middleware (used for file uploads) is likely configured to only handle the file field, not parse the other form fields that come with it.

When using FormData with files, you need:
1. **multer** to handle the file upload
2. A **form body parser** (like express.json + form-urlencoded) to parse the text fields

## Solution Needed on Backend

Your backend needs to configure multer with `.fields()` or use middleware in the correct order:

### Option 1: Using multer single + form parser (RECOMMENDED)

```javascript
// Before your route handler
const multer = require('multer');
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// In your router:
router.post('/shops', 
  upload.single('logo'),  // Parse 'logo' file field
  express.urlencoded({ extended: true }),  // Parse form fields
  createShopController  // Your handler
);
```

### Option 2: Using express-fileupload (alternative)

```javascript
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Then in route:
router.post('/shops', 
  express.json(),  // Also parse JSON fields
  express.urlencoded({ extended: true }),
  createShopController
);
```

## What the Frontend is Sending

The frontend now correctly sends FormData with:

```
name: "Abike Clothing Collections"
description: "..."
location: "yemi and yemi hostel"
category: "electronics"
campus: "68e5d74b9e9ea2f53162e9ae"
allowOffers: true
allowMessages: true
logo: File (18215 bytes)
```

## Backend Handler Expected Structure

Your shop creation handler should receive:

```javascript
async (req, res) => {
  const { name, description, location, category, campus, allowOffers, allowMessages } = req.body;
  const logoFile = req.file; // From multer single('logo')

  // Validate
  if (!name) throw new Error('Name is required');
  if (!campus) throw new Error('Campus is required');
  
  // Create shop...
}
```

## Debugging Steps

1. **Add logging in your backend route** to check if `req.body` and `req.file` are populated:

```javascript
router.post('/shops', upload.single('logo'), (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  // ... rest of handler
});
```

2. **Check middleware order** - multer must come BEFORE the validation logic

3. **Verify field name** - Frontend sends file as 'logo', so multer should use `.single('logo')`

## Frontend Implementation Status

✅ FormData properly constructed with all fields and file  
✅ File validated (type and size)  
✅ Correct axios configuration (letting it auto-set Content-Type)  
✅ All required fields populated

**The backend needs to be updated to parse FormData correctly.**
