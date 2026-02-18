# Multi-User Authentication Cache Fix - DEBUGGING GUIDE

## What Was Changed

The cache invalidation flow was reordered to prevent race conditions:

**Before (Broken):**
```
1. Set token
2. Clear cache  ❌ (query might use old token to refetch)
3. Refetch
```

**After (Fixed):**
```
1. Clear cache  ✅ (removes all old user data)
2. Set token   ✅ (re-enables query with new token)
3. Refetch     ✅ (query refetches with new token)
```

---

## How to Test the Fix

### Step 1: Open Browser DevTools
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Keep the console visible while testing

### Step 2: Logout Current User
1. Look for `eadepoju67@gmail.com` user in header
2. Click logout button
3. Watch console for: `🔐 LOGIN...` messages

### Step 3: Login as Different User
```
Email: marvin67@gmail.com
Password: Ifeoluwa123?
```

### Step 4: Watch Console for This Flow

You should see messages in this order:

```
🔐 LOGIN SUCCESS - Email: marvin67@gmail.com
🔐 Setting token for user: marvin67@gmail.com
🗑️ CLEARING 31 query types
🔄 REFETCHING user query...
```

After a moment:

```
Current user object: {
  email: "marvin67@gmail.com",
  fullName: "...",
  ...
}
```

### Step 5: Verify Data

Navigate to:
- `/requests` - Should show marvin67's requests (if any)
- `/my-offers` - Should show marvin67's offers (if any)
- `/profile` - Should show marvin67's profile

**NOT** eadepoju67's data

---

## Debugging: What Could Go Wrong

### Problem 1: Still seeing old user's data
**Signs:**
- Console shows `marvin67@gmail.com` but UI shows Ekundayo's data
- Or console shows correct data but page displays wrong data

**Solutions:**
1. Check if a different component is caching the user separately
2. Verify the header.jsx or dashboard is using the `user` from useAuth hook
3. Check if there's a useEffect that's not depending on `user` properly

### Problem 2: Console doesn't show cache clearing logs
**Signs:**
- No `🔐 LOGIN SUCCESS` message
- No `🗑️ CLEARING` message

**What it means:**
- Login mutation's `onSuccess` isn't being called
- The login API might be failing silently
- Check Network tab for failed `/api/v1/auth/login` request

**Fix:**
- Open Network tab
- Attempt login
- Check the login POST response
- Look for error message in response body

### Problem 3: "REFETCHING" logs show but data still old
**Signs:**
- Console shows refetch message
- But user data doesn't update

**What it means:**
- Query refetch was called but returned old data
- Possible causes:
  1. Server is caching the user request
  2. API request has wrong Authorization header
  3. Database returned wrong user

**Fix:**
- Open Network tab
- Login with new user
- Look for `/api/v1/auth/me` request
- Check the response - is it the correct user?
- If wrong, problem is in backend

### Problem 4: Token updates but query doesn't refetch
**Signs:**
- `localStorage.token` changes in Application tab
- But no `/api/v1/auth/me` request in Network tab
- Or 401 error on the request

**What it means:**
- Query isn't being re-enabled
- OR request sent with wrong/old token

**Fix:**
- Check if `enabled: !!token` in useQuery is working
- Verify cookies/localStorage are synced properly

---

## Console Output Explanation

### Success Flow (What you want to see):

```
🔐 LOGIN SUCCESS - Email: marvin67@gmail.com
🔐 Setting token for user: marvin67@gmail.com
🗑️ CLEARING 31 query types
🔄 REFETCHING user query...
```

Then the query will refetch, and you should see:

```
GET /api/v1/auth/me (Network tab)
200 OK
```

And finally:

```
Current user object: {avatar: {...}, _id: '...', email: 'marvin67@gmail.com', ...}
```

---

## Manual Testing Checklist

### Test Case 1: Basic Login
- [ ] Logout
- [ ] Login as marvin67@gmail.com
- [ ] Console shows SUCCESS message
- [ ] Header shows marvin67's name
- [ ] No old user data visible

### Test Case 2: Token Storage
- [ ] Open DevTools → Application → localStorage
- [ ] Verify `token` changes after login
- [ ] Token is a valid JWT string (not old one)

### Test Case 3: API Request
- [ ] Open DevTools → Network
- [ ] Login as marvin67
- [ ] Look for POST `/api/v1/auth/login` - should return marvin67's user object
- [ ] Look for GET `/api/v1/auth/me` - should return marvin67's user object

### Test Case 4: UI Update
- [ ] Login as marvin67
- [ ] Wait 2 seconds for query to complete
- [ ] Navigate to `/dashboard` or `/requests`
- [ ] Verify page shows marvin67's data, not Ekundayo's

### Test Case 5: Multiple Users
- [ ] Logout
- [ ] Login as user A
- [ ] Logout
- [ ] Login as user B
- [ ] Verify user B's data (not user A's)

---

## Enable Extra Debugging (Optional)

Add this to AuthContext.jsx to see refetch progress:

```javascript
queryClient.refetchQueries({ queryKey: ['user'] }).then(() => {
  console.log('✅ User query refetch complete');
}).catch((err) => {
  console.log('❌ User query refetch failed:', err);
});
```

---

## What to Report If Still Broken

If the fix doesn't work, provide:

1. **Console Output**
   - Screenshot or copy full console log during login

2. **Network Tab**
   - Screenshot of `/api/v1/auth/login` request/response
   - Screenshot of `/api/v1/auth/me` request/response

3. **Application Tab**
   - Current `token` value in localStorage
   - Current `jwt` cookie value

4. **Current User Object**
   - Copy the console log output of "Current user object"

This will help identify exactly where the issue is (frontend or backend).

---

**Updated:** December 22, 2025  
**Fix Status:** Testing Phase  
**Confidence Level:** High (race condition was root cause)
