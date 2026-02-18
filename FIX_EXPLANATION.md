# Race Condition Fix - Code Changes Summary

## The Core Issue

**Race Condition:** When you logged in, this sequence happened:

```javascript
// OLD (Broken) Code Order:
setToken(res.data.token);              // 1. Token updated
localStorage.setItem('token', ...);    // 2. localStorage updated
setCookie('jwt', ...);                 // 3. Cookie updated
queryClient.removeQueries(...);        // 4. Cache cleared (TOO LATE!)
queryClient.refetchQueries(...);       // 5. Query re-runs, might use old cached data
```

**Problem:** When step 4 runs, the user query might have already started fetching with the old token (from step 1-3), causing it to return old user data.

---

## The Fix

**New (Fixed) Code Order:**

```javascript
// NEW (Fixed) Code Order:
// 1. Clear cache FIRST - removes all old user data
queryClient.removeQueries({ queryKey: ['user'] });
queryClient.removeQueries({ queryKey: ['myRequests'] });
// ... etc for all user-dependent queries

// 2. THEN set token - this re-enables the query
setToken(res.data.token);
localStorage.setItem('token', token);
setCookie('jwt', token);

// 3. FINALLY refetch with next tick - ensures token is set first
Promise.resolve().then(() => {
  queryClient.refetchQueries({ queryKey: ['user'] });
});
```

**Why this works:** Cache is cleared before token is set, so when the query re-enables, it finds no old data and must fetch fresh data with the new token.

---

## Files Modified

### 1. `src/context/AuthContext.jsx`

**Changes in 4 mutations:**
1. `googleVerifyMutation` (Google Sign-In)
2. `completeGoogleMutation` (Complete Google Signup)
3. `signupMutation` (Email Signup)
4. `loginMutation` (Email Login)

#### Pattern Applied to Each:

**Before:**
```javascript
const loginMutation = useMutation({
  mutationFn: (data) => authService.loginWithEmail(data.email, data.password),
  onSuccess: (res) => {
    if (res.data.token) {
      // Set token FIRST
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setCookie('jwt', res.data.token);
      
      // Then clear cache (too late!)
      queryClient.removeQueries({ queryKey: ['user'] });
      // ... more removeQueries
      
      // Finally refetch
      queryClient.refetchQueries({ queryKey: ['user'] });
    }
  }
});
```

**After:**
```javascript
const loginMutation = useMutation({
  mutationFn: (data) => authService.loginWithEmail(data.email, data.password),
  onSuccess: (res) => {
    console.log('🔐 LOGIN SUCCESS - Email:', res.data.data?.user?.email);
    
    if (res.data.token) {
      console.log('🔐 Setting token for user:', res.data.data?.user?.email);
      
      // CLEAR CACHE FIRST
      const userDependentQueryKeys = [
        'user', 'myRequests', 'requests', 'request',
        'myOffers', 'requestOffers', 'requestOffer', 'mySentOffers',
        // ... all 31 user-dependent query types
      ];
      
      console.log('🗑️ CLEARING', userDependentQueryKeys.length, 'query types');
      userDependentQueryKeys.forEach(key => {
        queryClient.removeQueries({ queryKey: [key] });
      });
      
      // NOW set token
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setCookie('jwt', res.data.token);
      
      // FINALLY refetch with next tick
      console.log('🔄 REFETCHING user query...');
      Promise.resolve().then(() => {
        queryClient.refetchQueries({ queryKey: ['user'] });
      });
    }
  },
  onError: (error) => {
    console.error('❌ LOGIN ERROR:', error);
  }
});
```

---

## Key Improvements

### 1. **Correct Order**
Cache cleared → Token set → Query refetch
(Not: Token set → Cache cleared → Query refetch)

### 2. **Comprehensive Logging**
Added console logs at each step so you can debug if it doesn't work:
- `🔐 LOGIN SUCCESS` - Mutation succeeded
- `🔐 Setting token for user` - Which user is logging in
- `🗑️ CLEARING` - How many query types removed
- `🔄 REFETCHING` - When refetch starts

### 3. **Promise.resolve() Timing**
```javascript
Promise.resolve().then(() => {
  queryClient.refetchQueries({ queryKey: ['user'] });
});
```
This ensures:
- Token state is updated (setToken is batched)
- Query is re-enabled (enabled: !!token)
- Fresh fetch happens with new token

### 4. **Error Handling**
Added `onError` to log login failures:
```javascript
onError: (error) => {
  console.error('❌ LOGIN ERROR:', error);
}
```

---

## Why Order Matters (React State Updates)

In React, state updates are **batched** and asynchronous:

```javascript
// These don't happen immediately:
setToken(newToken);
localStorage.setItem('token', newToken);

// They're batched, so this might run BEFORE token actually updates:
queryClient.refetchQueries({ queryKey: ['user'] });

// This caused the query to refetch with old token!
```

**Solution:** Use `Promise.resolve().then()` to defer refetch to next microtask:

```javascript
setToken(newToken);  // Scheduled
localStorage.setItem('token', newToken);  // Scheduled

Promise.resolve().then(() => {
  // Runs AFTER state batching is done
  queryClient.refetchQueries({ queryKey: ['user'] });
});
```

---

## Testing the Fix

### Quick Test (30 seconds)
1. Open Browser Console
2. Logout
3. Login as different user
4. Look for console messages in order:
   - `🔐 LOGIN SUCCESS`
   - `🗑️ CLEARING 31 query types`
   - `🔄 REFETCHING user query...`

### Full Test (2 minutes)
1. Do quick test above
2. Check header shows new user's name
3. Navigate to `/requests` or `/profile`
4. Verify data is for new user, not old user

### Network Test
1. Open DevTools Network tab
2. Login as marvin67@gmail.com
3. Look for POST `/api/v1/auth/login` - response shows marvin67
4. Look for GET `/api/v1/auth/me` - response shows marvin67
5. UI should update within 2 seconds

---

## Fallback: If This Still Doesn't Work

If the fix doesn't work, the problem is likely in one of these areas:

### Backend Issue
- Server caching user queries
- `/api/v1/auth/me` returns wrong user
- JWT token validation failing

### Header/Dashboard Issue
- Component not using `user` from useAuth()
- Component has local state that's not updating
- Parent component re-renders with cached data

### React Query Issue
- Another component still holding old cache
- Custom hooks with separate caches
- `enabled` condition not working properly

---

## Related Code

### useAuth Hook
Location: `src/hooks/useAuth.js`
```javascript
const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
```

### User Query in AuthContext
Location: `src/context/AuthContext.jsx` (Lines 25-35)
```javascript
const { data: user, isLoading } = useQuery({
  queryKey: ['user'],
  queryFn: () =>
    authService.getCurrentUser().then((res) => res.data.data.user),
  enabled: !!token,  // Re-enables when token changes
  staleTime: 0,      // Always fetch fresh
  gcTime: 0,         // Don't keep in memory
  retry: false,
});
```

### Header Usage
Location: `src/components/header.jsx` (Line 157)
```javascript
const { user } = useAuth();
console.log('Current user object:', user);
```

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Order** | Token → Cache → Refetch | Cache → Token → Refetch |
| **Timing** | Refetch immediate | Refetch on next tick |
| **Logging** | None | Full traceability |
| **Error Handling** | Silent failures | Logged errors |
| **Race Condition** | ❌ Yes | ✅ No |

---

**Status:** ✅ Implemented and Ready for Testing  
**Complexity:** Low (reordering existing code)  
**Risk:** Very Low (no API changes, only client-side state management)  
**Testing Time:** 2-5 minutes
