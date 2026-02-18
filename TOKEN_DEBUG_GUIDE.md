# Critical: Token Authentication Debug

## What The Console Shows
✅ Login succeeded for marvin67@gmail.com  
✅ Cache cleared  
✅ Refetch triggered  
❌ **But /auth/me returns eadepoju67's data**

## Root Cause Analysis

The frontend is working correctly. The problem is **backend-side**: the `/api/v1/auth/me` endpoint is returning the old user's data even though a new token should be active.

This can happen because:
1. **Token not being sent properly** - Check Network tab
2. **Backend session caching** - Server memory holds old session
3. **JWT decode issue** - Token is valid but decoded user ID is wrong
4. **Database query issue** - Wrong user fetched from DB

## Immediate Action Required

### Step 1: Check Network Tab
1. Open DevTools → Network tab
2. Login as marvin67@gmail.com
3. Look for these requests in order:
   - POST `/api/v1/auth/login` - Check response for token
   - GET `/api/v1/auth/me` - Check request headers

### Step 2: Verify POST `/api/v1/auth/login` Response

Click on the POST request, go to Response tab. You should see:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "...",
      "email": "marvin67@gmail.com",
      "fullName": "Marvin...",
      // NOT eadepoju67@gmail.com
    }
  }
}
```

**If you see marvin67 here** → Login API is correct  
**If you see eadepoju67 here** → Backend login endpoint is broken

### Step 3: Verify GET `/api/v1/auth/me` Request Headers

Click on the GET request, go to Headers tab. You should see:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get the first 30 characters of this token.

Then check the browser console for the log:
```
📤 Sending /auth/me request with token: eyJhbGciOiJIUzI1NiIsInR5cCI...
```

**Do the first 30 characters match?** 
- **YES** → Token is being sent correctly
- **NO** → Token is not being read from localStorage/cookie properly

### Step 4: Check Backend Token Decode

If the token is being sent correctly but returning wrong user, the issue is in backend JWT decode. Add this temporary debugging to your backend:

In `authController.js` getMe function:
```javascript
exports.getMe = catchAsync(async (req, res, next) => {
  console.log('🔍 GET ME - Current user in req:', {
    id: req.user._id,
    email: req.user.email,
    decoded_from: 'JWT in protect middleware'
  });
  
  const user = await User.findById(req.user.id).populate('campus', 'name shortCode');
  if (!user) return next(new AppError('User not found', 404));
  
  console.log('🔍 GET ME - User returned from DB:', {
    id: user._id,
    email: user.email
  });
  
  res.status(200).json({ status: 'success', data: { user } });
});
```

Then login again and check backend logs for:
```
🔍 GET ME - Current user in req: { id: '...', email: 'marvin67@gmail.com', ... }
🔍 GET ME - User returned from DB: { id: '...', email: 'marvin67@gmail.com', ... }
```

---

## What To Report

After checking Network tab, provide:

1. **Browser Console during login:**
   - Full output from `🔓 UPDATING TOKEN` section
   - What tokens are logged?

2. **Network tab - POST /api/v1/auth/login:**
   - Screenshot of Response
   - Does response show marvin67 or eadepoju67?

3. **Network tab - GET /api/v1/auth/me:**
   - Screenshot of Headers
   - What is the Authorization header?
   - What is in the Response?

4. **Backend logs (if you add the logging above):**
   - What email is in req.user?
   - What email is returned from User.findById?

This will pinpoint exactly where the problem is.

---

## Possible Scenarios

### Scenario A: Frontend Reads Wrong Token
**Signs:**
- Console shows token is different than Network tab Authorization header

**Fix:** Issue with getCookie/localStorage read

### Scenario B: Backend Receives Wrong Token  
**Signs:**
- Network tab Authorization header has old token
- But frontend console showed new token

**Fix:** Timing issue, need to wait for token to actually be set

### Scenario C: Backend JWT Decode Wrong
**Signs:**
- Authorization header has new token
- But req.user in backend logs shows old user ID

**Fix:** Backend JWT secret mismatch or token generation issue

### Scenario D: Backend Cache/Session
**Signs:**
- Everything looks correct but backend keeps returning old user

**Fix:** Backend session middleware caching, need to invalidate session on login

---

## Enhanced Logging Now Added

The following has been added to help debug:

1. **AuthContext.jsx** - Logs token updates:
   ```
   🔓 UPDATING TOKEN in localStorage and cookie
      Token first 30 chars: ...
   ✅ Token updated in localStorage: ...
   ✅ Token updated in cookie: ...
   ```

2. **api.js** - Logs tokens being sent:
   ```
   📤 Sending /auth/me request with token: eyJhbGciOiJIUzI1NiIsInR5cCI...
   ```

Next login attempt will show all this information.
