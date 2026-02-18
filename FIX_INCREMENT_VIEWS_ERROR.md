# Fix: "shop.incrementViews is not a function" Error

## Problem
When trying to fetch a shop by ID, the backend returns:
```
{status: 'error', type: 'UnknownError', message: 'shop.incrementViews is not a function', code: 500, ...}
```

## Root Cause
The backend shop route (`GET /api/v1/shops/:id`) is calling `shop.incrementViews()` but this method doesn't exist on the Shop model.

## Solution

Choose one of the following approaches:

### Option 1: Remove incrementViews Call (Quick Fix)

**File**: Backend shops route handler (typically `routes/shops.js` or similar)

Find the GET shop by ID route and remove the incrementViews call:

```javascript
// BEFORE:
router.get('/shops/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('campus');
    await shop.incrementViews();  // ❌ REMOVE THIS LINE
    res.json({ data: shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AFTER:
router.get('/shops/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('campus');
    // incrementViews removed
    res.json({ data: shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Option 2: Add incrementViews Method to Shop Model (Recommended)

**File**: Backend Shop model (typically `models/Shop.js` or similar)

Add the `incrementViews` method to your Shop schema:

```javascript
// Add this method to your Shop model
shopSchema.methods.incrementViews = async function() {
  this.views = (this.views || 0) + 1;
  return await this.save();
};

// Or if you want to track view count in a separate field:
shopSchema.methods.incrementViews = async function() {
  this.viewCount = (this.viewCount || 0) + 1;
  return await this.save();
};
```

Then make sure your Shop schema has the views/viewCount field:

```javascript
const shopSchema = new Schema({
  // ... other fields ...
  views: {
    type: Number,
    default: 0
  },
  // or
  viewCount: {
    type: Number,
    default: 0
  },
  // ... other fields ...
});
```

And keep the route handler:

```javascript
router.get('/shops/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('campus');
    await shop.incrementViews();  // ✅ Now this works
    res.json({ data: shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Option 3: Use updateOne Instead of Method

**File**: Backend shops route handler

Replace the method call with a direct database update:

```javascript
router.get('/shops/:id', async (req, res) => {
  try {
    // Increment views and fetch in one operation
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },  // Increment views by 1
      { new: true }  // Return updated document
    ).populate('campus');
    
    res.json({ data: shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Recommended Approach

**Option 2** is recommended because:
1. Keeps the logic clean and organized in the model
2. Can be reused throughout the backend
3. Follows MongoDB best practices
4. Easy to add additional logic later (timestamps, analytics, etc.)

## Testing

After applying the fix:

1. Restart your backend server
2. Navigate to a shop details page: `/shops/[shopid]`
3. The shop should load successfully without the `incrementViews` error
4. Logo and campus information should display properly

## Verification

You should see console logs like:
```
fetchShopById: Fetching shop with ID: 69431148734bbaf2ab7a4778
fetchShopById response: {data: {_id: '69431148734bbaf2ab7a4778', name: '...', ...}}
fetchShopById extracted data: {_id: '69431148734bbaf2ab7a4778', name: '...', ...}
```

Instead of:
```
fetchShopById error: {status: 'error', message: 'shop.incrementViews is not a function', ...}
```
