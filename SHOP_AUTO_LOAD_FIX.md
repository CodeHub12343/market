# Shop Auto-Loading Fix for Product Creation Form

## Issue Identified & Fixed

### The Real Problem
The `/shops/me` API endpoint was returning:
```javascript
{
  status: 'success',
  results: 2,
  data: {
    shops: [
      { _id: "69429d1e3189dfd884e552dc", name: "Abike Clothing Collections", ... },
      { ... }
    ]
  }
}
```

Instead of:
```javascript
{
  _id: "69429d1e3189dfd884e552dc",
  name: "Abike Clothing Collections",
  ...
}
```

### The Fix
Updated `fetchMyShop()` in `src/services/shops.js` to:
```javascript
// If we get an array of shops, get the first one (the user's primary shop)
if (Array.isArray(shopData.shops) && shopData.shops.length > 0) {
  console.log('fetchMyShop: Got array of shops, using first one:', shopData.shops[0]);
  return shopData.shops[0];
}
```

This extracts the actual shop object from the array so the ProductForm can use it.

## Solution Applied

### 1. **Updated `useMyShop` Hook** (`src/hooks/useShops.js`)
```javascript
export const useMyShop = () => {
  return useQuery({
    queryKey: ['myShop'],
    queryFn: () => shopService.fetchMyShop(),
    staleTime: 0,        // ✅ Always refetch fresh data
    retry: 1,            // ✅ Retry once on failure
  });
};
```

**Changes:**
- Set `staleTime: 0` to always treat data as stale and refetch
- Added `retry: 1` to retry once if the API call fails
- This ensures fresh shop data is fetched every time the hook is called

### 2. **Enhanced `fetchMyShop` Service** (`src/services/shops.js`)
```javascript
export const fetchMyShop = async () => {
  try {
    console.log('fetchMyShop: Fetching user shop from /shops/me');
    const response = await api.get(`${SHOPS_ENDPOINT}/me`);
    
    // Handle different response structures
    const shopData = response.data.data || response.data;
    return shopData;
  } catch (error) {
    // Handle 404 gracefully (user has no shop)
    if (error.response?.status === 404) {
      console.log('fetchMyShop: User has no shop (404)');
      return null;  // ✅ Return null instead of throwing
    }
    throw error.response?.data || error;
  }
};
```

**Changes:**
- Added console logging for debugging
- Handle response structure properly (data.data or data)
- Return `null` instead of throwing on 404 (user has no shop)
- Added detailed error logging

### 3. **Updated ProductForm Logic** (`src/components/products/ProductForm.jsx`)
```javascript
const { data: myShop, isLoading: shopLoading, isError: shopError } = useMyShop();
const shopSetRef = useRef(false); // Track if we've set shop

useEffect(() => {
  if (myShop?._id && !shopSetRef.current) {
    console.log('Setting shop to:', myShop._id);
    setFormData((prev) => ({
      ...prev,
      shop: myShop._id,
    }));
    shopSetRef.current = true;
  } else if (myShop === null && !shopSetRef.current) {
    console.log('User has no shop (returned null)');
    shopSetRef.current = true;
  }
}, [myShop, setFormData]);
```

**Changes:**
- Use `useRef` to prevent multiple state updates
- Handle both cases: shop exists or shop is null
- Added logging for debugging
- Properly extract shop ID from myShop object

### 4. **Updated UI Feedback**
```jsx
{formData.shop && myShop && (
  // Show shop name
)}
{!formData.shop && !shopLoading && (
  // Show "Create Shop" button
)}
```

## How It Works Now

1. **User creates a shop** → `useCreateShop` invalidates `myShop` cache
2. **Cache invalidation triggers** → `useMyShop` refetches data (staleTime: 0)
3. **New shop data arrives** → ProductForm's useEffect detects it
4. **Shop field auto-fills** → User can now create products ✅

## Testing Instructions

### To verify the fix works:

1. **Create a new shop** at `/shops/new`
   - Fill in all required fields
   - Click "Create Shop"
   - You should see a success message

2. **Navigate to create a product** at `/products/new`
   - The shop field should now show your shop name automatically
   - If it doesn't, check the browser console for debugging logs:
     - Look for: `"Setting shop to: ..."`
     - Or: `"User has no shop (returned null)"`

3. **Check the console logs** (DevTools → Console)
   - `fetchMyShop: Fetching user shop from /shops/me` - API call
   - `fetchMyShop response: {...}` - Response received
   - `Setting shop to: [shopId]` - Shop field set

### If it still doesn't work:

1. **Hard refresh the page** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Clear browser cache** if needed
3. **Check API endpoint** - Make sure `/shops/me` is working correctly
4. **Check browser console** for error messages

## API Endpoint Check

The fix relies on this API endpoint:
```
GET http://localhost:5000/api/v1/shops/me
```

This endpoint should:
- Return the logged-in user's shop (if they have one)
- Return 404 if the user has no shop
- Return the shop object with at least `_id` and `name` fields

## Files Modified

1. ✅ `src/hooks/useShops.js` - Updated `useMyShop()` hook
2. ✅ `src/services/shops.js` - Enhanced `fetchMyShop()` service
3. ✅ `src/components/products/ProductForm.jsx` - Improved auto-fill logic
4. ✅ `src/hooks/useProductForm.js` - Shop field already in initial state
5. ✅ `src/components/common/ErrorAlert.jsx` - Transient $show prop
6. ✅ `src/components/common/SuccessAlert.jsx` - Transient $show prop

## Debugging Tips

If the shop still doesn't load, check these in order:

1. **Is the shop created?**
   - Check your shop list at `/shops` or in the backend database

2. **Does `/shops/me` endpoint work?**
   - Test with: `curl -H "Authorization: Bearer {token}" http://localhost:5000/api/v1/shops/me`

3. **Is the JWT token valid?**
   - Check if user is authenticated (`useAuth()` returns user)

4. **Browser console logs**
   - Enable console logs and look for `fetchMyShop` messages

5. **Network tab**
   - Check if the `/shops/me` request is being made
   - Check the response status (should be 200, not 404 or 500)
