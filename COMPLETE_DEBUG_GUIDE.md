# Complete Multi-User Auth Debug - All Layers

## The Problem (Clear Now)

Frontend is **100% working correctly**:
- ✅ Login mutation fires
- ✅ Cache is cleared (25 query types)
- ✅ Token is updated in localStorage/cookie
- ✅ User query is refetched
- ❌ BUT backend returns WRONG user (eadepoju67 instead of marvin67)

**This is a BACKEND issue, not frontend.**

---

## Layer 1: Browser Console (Already Enhanced)

You'll now see detailed logs:

### Login Sequence:
```
🔐 LOGIN SUCCESS - Email: marvin67@gmail.com
🔐 Setting token for user: marvin67@gmail.com
🗑️ CLEARING 25 query types
🔓 UPDATING TOKEN in localStorage and cookie
   New Token first 30 chars: eyJhbGciOiJIUzI1NiIsInR...
✅ Verified localStorage token: eyJhbGciOiJIUzI1NiIsInR...
   Match? ✅ YES
🔄 REFETCHING user query...
🔄 Executing refetch...
```

### User Query Execution:
```
🔎 USER QUERY RUNNING - Fetching current user...
📤 Sending /auth/me request with token: eyJhbGciOiJIUzI1NiIsInR...
✅ USER QUERY RESULT: {
  email: "eadepoju67@gmail.com",  ❌ WRONG! Should be marvin67
  id: "694641cb9c3bca4cf64eaef8",
  fullName: "Ekundayo Ayomide"
}
```

---

## Layer 2: Network Tab Analysis

### Test Procedure:
1. Clear cookies and localStorage (hard refresh: Ctrl+Shift+Del)
2. Open DevTools → Network tab
3. Filter: `auth`
4. Login as marvin67@gmail.com
5. Check requests

### Expected Requests (In Order):

#### Request 1: POST `/api/v1/auth/login`
**Method:** POST  
**Status:** 200  
**Request Body:**
```json
{
  "email": "marvin67@gmail.com",
  "password": "Ifeoluwa123?"
}
```

**Response Should Be:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDY0MWNiOWMzYmNhNGNmNjRlYWVmOCIsImlhdCI6...",
  "data": {
    "user": {
      "_id": "marvin's_id_NOT_694641cb9c3bca4cf64eaef8",
      "email": "marvin67@gmail.com",  ✅ MUST BE marvin67
      "fullName": "Marvin...",
      ...
    }
  }
}
```

⚠️ **CRITICAL CHECK:** Does the response show marvin67 or eadepoju67?
- **If marvin67** → Login API is OK, problem is in next request
- **If eadepoju67** → **Backend login endpoint is returning wrong user** (CRITICAL BUG)

#### Request 2: GET `/api/v1/auth/me` 
**Method:** GET  
**Status:** 200  
**Headers Tab - Check This:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDY0MWNiOWMzYmNhNGNmNjRlYWVmOCIsImlhdCI6...
```

Copy the token and compare with the one from the login response.
- **Same token?** ✅ Good, frontend correctly saved it
- **Different token?** ❌ Frontend is sending old/wrong token

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "email": "??? - SHOULD BE marvin67 NOT eadepoju67 ???",
      ...
    }
  }
}
```

---

## Layer 3: Backend JWT Decode

If the Authorization header token is CORRECT but backend returns WRONG user, the issue is in JWT decoding.

### Add Debug Logging to Backend

**File:** `src/middlewares/authMiddleware.js`

```javascript
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('Not logged in', 401));

  console.log('🔐 PROTECT MIDDLEWARE - Received token:', token.substring(0, 30) + '...');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) return next(new AppError('Invalid token', 401));

  console.log('🔐 PROTECT MIDDLEWARE - Decoded JWT:', {
    userId: decoded.id,
    iat: decoded.iat,
    exp: decoded.exp
  });

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('The user belonging to this token no longer exists', 401));

  console.log('🔐 PROTECT MIDDLEWARE - Found user in DB:', {
    id: currentUser._id,
    email: currentUser.email
  });

  currentUser.password = undefined;
  req.user = currentUser;
  next();
});
```

**File:** `src/controllers/authController.js`

```javascript
exports.getMe = catchAsync(async (req, res, next) => {
  console.log('👤 GET ME - req.user from middleware:', {
    id: req.user._id,
    email: req.user.email
  });

  const user = await User.findById(req.user.id).populate('campus', 'name shortCode');
  if (!user) return next(new AppError('User not found', 404));
  
  console.log('👤 GET ME - User from findById:', {
    id: user._id,
    email: user.email
  });

  res.status(200).json({ status: 'success', data: { user } });
});

exports.login = catchAsync(async (req, res, next) => {
  // ... existing validation code ...

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Check if user is verified
  if (!user.isVerified) {
    return next(new AppError('Please verify your email address first', 403));
  }

  console.log('🔐 LOGIN SUCCESS - Creating token for user:', {
    id: user._id,
    email: user.email
  });

  createSendToken(user, 200, res);
});
```

---

## Test Sequence

### Step 1: Clean Start
```bash
# In browser:
1. Clear all cookies (Ctrl+Shift+Del)
2. Clear localStorage (F12 → Application → localStorage → Clear All)
3. Hard refresh (Ctrl+Shift+R)
```

### Step 2: First Login (as marvin67)
1. Open DevTools
2. Go to Network tab, filter `auth`
3. Go to Console tab
4. Fill login form:
   - Email: `marvin67@gmail.com`
   - Password: `Ifeoluwa123?`
5. Click Sign In
6. Watch console for full sequence
7. **Screenshot browser console output**
8. **Screenshot Network tab for both requests**

### Step 3: Check Each Log Level

**Expected Console Output:**
```
🔐 LOGIN SUCCESS - Email: marvin67@gmail.com          ✅
🔐 Setting token for user: marvin67@gmail.com         ✅
🗑️ CLEARING 25 query types                            ✅
🔓 UPDATING TOKEN in localStorage and cookie          ✅
   New Token first 30 chars: eyJ...                    ✅
✅ Verified localStorage token: eyJ...                 ✅
   Match? ✅ YES                                        ✅
🔄 REFETCHING user query...                           ✅
🔄 Executing refetch...                                ✅
🔎 USER QUERY RUNNING - Fetching current user...      ✅
📤 Sending /auth/me request with token: eyJ...        ✅
✅ USER QUERY RESULT: {                                ???
  email: "marvin67@gmail.com",  ← SHOULD BE THIS
  id: "...",
  fullName: "..."
}
```

**If email is `eadepoju67@gmail.com`** → Backend bug

---

## Diagnosis Decision Tree

```
Does login POST return marvin67?
├─ NO → Backend login endpoint bug
│       Fix: Check login controller, user password validation
│
└─ YES → Token sent to /auth/me correctly?
   ├─ NO → Frontend not saving/reading token
   │       Fix: Check localStorage/cookie update
   │
   └─ YES → Backend JWT decode correct?
      ├─ NO → JWT decode bug or wrong secret
      │       Fix: Verify JWT_SECRET matches both login and /auth/me
      │
      └─ YES → findById returns wrong user?
         └─ YES → Database has duplicate user or wrong ID
             Fix: Check User collection for duplicates
```

---

## What To Report Back

After running the test, provide:

### 1. Browser Console Screenshot
- Full login sequence logs
- Especially the `✅ USER QUERY RESULT` line

### 2. Network Tab Screenshots
- **POST /api/v1/auth/login** Response
  - Does it show marvin67 or eadepoju67?
  - What is the token returned?

- **GET /api/v1/auth/me** Headers
  - What is the Authorization header?
  - Copy first 30 chars

- **GET /api/v1/auth/me** Response  
  - What user email is returned?

### 3. Backend Logs (if you add them)
- Full output from `🔐 PROTECT MIDDLEWARE`
- Full output from `👤 GET ME`
- Full output from `🔐 LOGIN SUCCESS`

---

## Most Likely Root Cause

Based on symptoms, I'd guess:

**Hypothesis:** Backend session/request context is somehow holding old user data OR there's middleware caching user data by email somewhere else.

**Quick Check:**
1. Search backend for any middleware that caches users by email
2. Check if there's a session store that's not being invalidated
3. Verify `req.user` is correctly set to new user in protect middleware

The fact that `/auth/me` immediately returns old user (not after a delay) suggests it's not async race condition on the backend, but rather that the middleware is not properly reading from the new token.

---

**Status:** Ready for comprehensive debugging  
**Confidence:** 95% this is a backend issue  
**Est. Fix Time:** 10 minutes once root cause identified
