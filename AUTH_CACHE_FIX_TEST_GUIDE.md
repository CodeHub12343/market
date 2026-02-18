# Authentication Cache Fix - Testing Guide

## Problem Fixed
Previously, when logging in as a different user, the application would display the previous user's data (requests, offers, chats, etc.) until you restarted the backend.

**Root Cause:** React Query was aggressively caching user-dependent queries for 5-10 minutes, and the cache invalidation on login was incomplete.

## Solution Implemented

### 1. **User Query Cache Settings** (AuthContext.jsx)
```javascript
staleTime: 0,  // Always fetch fresh user data
gcTime: 0      // Don't cache in garbage collection
```

### 2. **Comprehensive Cache Invalidation on All Auth Mutations**
When user logs in (via email, Google sign-in, or signup), ALL user-dependent query caches are cleared:
- `user`, `myRequests`, `requests`, `request`
- `myOffers`, `requestOffers`, `requestOffer`, `mySentOffers`, `offersForRequest`
- `chats`, `chat`, `conversations`, `conversation`, `messages`
- `myShop`, `myShops`, `allShops`, `shops`
- `myServices`, `services`, `myHostels`, `hostels`, `myEvents`, `events`
- `searchRequests`

### 3. **Reduced Cache Time for Conversations** (useConversations.js)
```javascript
CACHE_TIME = 5 * 60 * 1000; // Reduced from 30 to 5 minutes
```

### 4. **Complete Cache Wipe on Logout**
```javascript
queryClient.removeQueries();  // Remove all queries
queryClient.clear();           // Clear entire cache
sessionStorage.clear();         // Clear browser storage
```

---

## Test Cases

### Test 1: Basic Multi-User Login/Logout
**Objective:** Verify that User B sees their own data after User A logs out

**Steps:**
1. Create/use Test User A account (e.g., `userA@test.com`)
2. Create/use Test User B account (e.g., `userB@test.com`)
3. Ensure User A has some requests/offers created
4. Ensure User B has different requests/offers created

**Procedure:**
1. Login as **User A**
2. Navigate to `/requests` or dashboard
3. Verify you see **User A's requests** (not User B's)
4. **Do NOT restart backend**
5. Click logout
6. Login as **User B**
7. Navigate to `/requests` or dashboard
8. **✅ Expected:** See **User B's requests** immediately (no backend restart needed)
9. **❌ If Failed:** See User A's requests instead

---

### Test 2: Sequential User Switching
**Objective:** Verify correct data display when switching between 3+ users

**Steps:**
1. Login as **User A** → Verify their data
2. Logout
3. Login as **User B** → Verify their data (not User A's)
4. Logout
5. Login as **User C** → Verify their data (not User A's or User B's)
6. Logout
7. Login as **User A again** → Verify their original data (not stale from earlier)

**✅ Expected:** Each user sees only their own unique data at every step

---

### Test 3: Cache Clearing on Different Auth Flows
**Objective:** Verify cache works with all 4 authentication methods

**Procedure A - Email Signup:**
1. Signup as new user with email
2. Verify you see correct initial data (empty requests/offers)
3. Create a request
4. Logout
5. Signup as different new user
6. ✅ Verify you see empty state (not previous user's request)

**Procedure B - Email Login:**
1. Login as existing user A
2. Navigate to requests/offers
3. Logout
4. Login as different user B
5. ✅ Verify different data (not User A's)

**Procedure C - Google Sign-In:**
1. Sign in with Google (if available)
2. Verify correct data
3. Logout
4. Sign in with different Google account
5. ✅ Verify different data

---

### Test 4: Specific Feature Pages
**Objective:** Verify cache clearing works across all pages

**Pages to Test:**
- `/requests` - My Requests List
- `/requests/[id]` - Request Detail
- `/chats` - My Chats
- `/my-offers` - My Sent Offers
- `/profile` or `/settings` - User Profile

**For Each Page:**
1. Login as User A → See User A's data
2. Logout → Login as User B
3. ✅ Should see User B's data (not A's)

---

### Test 5: Real-Time Updates (Socket.IO)
**Objective:** Verify socket connections use fresh user data

**Procedure:**
1. Login as User A
2. Check browser console for socket connection message
3. Logout → Login as User B
4. ✅ Should show new socket connection for User B (in console)
5. ✅ Should receive messages/updates for User B only

---

## What to Watch For (Red Flags)

❌ **Still seeing old user's data after login:**
- Check browser console for errors
- Verify token is actually changing (DevTools → Application → localStorage)
- Check if different query keys are being used

❌ **Data takes a long time to update:**
- May indicate staleTime is too high
- Check if refetchQueries is actually being called

❌ **Logged out but seeing data:**
- Session storage wasn't cleared
- Check if logout mutation was called

❌ **Socket not reconnecting for new user:**
- Socket might be maintaining old user context
- Check useSocket hook in browser console

---

## Browser Developer Tools Checklist

### Local Storage Tab
- ✅ `token` value should change when logging in as different user
- ✅ Token should be removed after logout

### Application → Cookies
- ✅ `jwt` cookie should be updated on login
- ✅ `jwt` cookie should be deleted on logout

### Console
- ✅ Should see user refetch query after login
- ✅ Should see socket connection/disconnection messages
- ✅ No "stale data" or "cache miss" errors

### Network Tab
- ✅ `/api/v1/auth/me` should be called immediately after login
- ✅ Other user-dependent queries should be fresh (no 304 cache responses)

---

## How to Debug If Tests Fail

### Enable React Query DevTools (Optional)
```bash
npm install @tanstack/react-query-devtools
```

In your layout or app root:
```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function Layout() {
  return (
    <>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
```

Then use `Ctrl+Space` to open the DevTools panel and inspect query cache state.

### Check Console Logs
Add temporary console.log in AuthContext.jsx:
```javascript
const loginMutation = useMutation({
  onSuccess: (res) => {
    console.log('🔓 LOGIN: Clearing cache for user:', res.data.user.email);
    console.log('📊 Cache size before:', queryClient.getQueryCache().getAll().length);
    
    // ... cache removal code ...
    
    console.log('📊 Cache size after:', queryClient.getQueryCache().getAll().length);
  }
});
```

---

## Success Criteria

✅ All tests pass when:
- [ ] User B sees only their data immediately after User A logs out (no delay)
- [ ] No backend restart required between user switches
- [ ] All pages show correct user-specific data
- [ ] Works with email login, email signup, and Google auth
- [ ] Socket.IO reconnects for new user automatically
- [ ] Browser storage (localStorage, sessionStorage, cookies) properly updated

---

## Questions?

If tests still fail after this fix:
1. Check if there are OTHER caching layers (e.g., database query result caching)
2. Verify backend is returning correct user ID in responses
3. Check if custom hooks have additional cacheTime settings
4. Ensure API calls include correct authentication token

---

**Last Updated:** 2025-12-22
**Fix Applied:** Comprehensive React Query cache invalidation on all auth mutations + reduced conversation cache time
