# Shop Creation Campus Validation Fix

## Problem

When attempting to create a shop with image upload, users received a **500 Internal Server Error** with the message:

```
ValidationError: A shop must belong to a campus. A shop must have a name
```

## Root Cause

The `campus` field was being sent as an empty string to the backend because:

1. The form state initialization tries to get the campus from `user?.campus?._id`
2. If the user object doesn't have a campus property immediately available, it defaults to an empty string
3. When FormData is created with empty string values, they are still appended to the form data
4. The backend validation then rejects the request because campus is empty/invalid

## Solution

Three fixes were implemented:

### 1. **Service Layer Enhancement** (`src/services/shops.js`)

Updated `createShop()` to filter out empty strings from FormData:

```javascript
// Before: appended all fields including empty strings
Object.keys(shopData).forEach((key) => {
  if (shopData[key] !== null && shopData[key] !== undefined) {
    formData.append(key, shopData[key]);
  }
});

// After: also checks for empty strings
Object.keys(shopData).forEach((key) => {
  if (shopData[key] !== null && shopData[key] !== undefined && shopData[key] !== '') {
    formData.append(key, shopData[key]);
  }
});
```

Added debug logging to track what's being sent:
- Logs the shopData and logoFile parameters
- Logs all FormData entries before sending
- Helps diagnose FormData issues

### 2. **Form Validation** (`src/components/shops/ShopForm.jsx`)

Added campus validation for new shop creation:

```javascript
// Check campus is provided for new shops
if (!initialData?._id && (!formData.campus || formData.campus.trim() === '')) {
  newErrors.campus = 'Campus is required. Please ensure you are logged in with a campus assigned.';
}
```

This ensures the form won't submit if campus is missing.

### 3. **Error Display**

Added error message display for campus field so users see validation feedback:

```jsx
{errors.campus && <ErrorText>{errors.campus}</ErrorText>}
```

Added debug logging in `handleSubmit()` to track:
- User object content
- Form data being submitted
- Both before and after mutation

## Why This Happened

- The campus is obtained from the authenticated user's profile
- During development/testing, if the user session doesn't properly load campus info, it becomes empty
- FormData doesn't automatically filter empty values, so they get sent to the API
- The backend correctly rejects invalid (empty) campus IDs

## Testing the Fix

1. **Verify campus loads properly**: Check browser console logs showing `user` object with `campus` property
2. **Try creating a shop**: The form should now either:
   - Show a campus error if the user doesn't have one assigned
   - Create successfully if campus is properly populated
3. **Check console output**: The debug logs will show what data is actually being sent to the API

## What Users Should Do

If they see the campus error:
1. Ensure they're logged in with an account that has a campus assigned
2. Check that their user profile includes campus information
3. Contact support if campus is missing from their account
