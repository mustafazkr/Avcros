// Avcros — Auth module
// Thin wrapper over Supabase Auth. Loads the Supabase client from CDN
// on demand, initializes it once, and exposes simple helpers.

(function () {
  'use strict';

  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

  let _client = null;
  let _initPromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }

  async function init() {
    if (_initPromise) return _initPromise;
    _initPromise = (async () => {
      if (!window.AVCROS_SUPABASE || !window.AVCROS_SUPABASE.url) {
        throw new Error('Supabase config not loaded.');
      }
      await loadScript(SUPABASE_CDN);
      if (!window.supabase || !window.supabase.createClient) {
        throw new Error('Supabase client library failed to load from CDN.');
      }
      _client = window.supabase.createClient(
        window.AVCROS_SUPABASE.url,
        window.AVCROS_SUPABASE.anonKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'avcros_auth'
          }
        }
      );
      return _client;
    })();
    return _initPromise;
  }

  async function getClient() {
    if (_client) return _client;
    return init();
  }

  /* ---------- Signup ---------- */
  async function signUp(email, password, username) {
    const client = await getClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username }
      }
    });
    if (error) throw error;
    return data;
  }

  /* ---------- Signin with password ---------- */
  async function signIn(email, password) {
    const client = await getClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  /* ---------- Signin with OAuth provider ---------- */
  async function signInWithOAuth(provider, redirectTo) {
    const client = await getClient();
    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo || window.location.origin }
    });
    if (error) throw error;
    return data;
  }

  /* ---------- Sign out ---------- */
  async function signOut() {
    const client = await getClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  /* ---------- Current user / session ---------- */
  async function getUser() {
    const client = await getClient();
    const { data: { user } } = await client.auth.getUser();
    return user;
  }

  async function getSession() {
    const client = await getClient();
    const { data: { session } } = await client.auth.getSession();
    return session;
  }

  async function getProfile() {
    const user = await getUser();
    if (!user) return null;
    const client = await getClient();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  }

  /* ---------- Username availability ---------- */
  async function checkUsernameAvailable(username) {
    const client = await getClient();
    const { data, error } = await client
      .from('users')
      .select('username')
      .ilike('username', username)
      .limit(1);
    if (error) throw error;
    return !data || data.length === 0;
  }

  /* ---------- Password reset ---------- */
  async function sendPasswordReset(email, redirectTo) {
    const client = await getClient();
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo
    });
    if (error) throw error;
    return data;
  }

  async function updatePassword(newPassword) {
    const client = await getClient();
    const { data, error } = await client.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  }

  /* ---------- Resend confirmation email ---------- */
  async function resendConfirmation(email) {
    const client = await getClient();
    const { data, error } = await client.auth.resend({
      type: 'signup',
      email
    });
    if (error) throw error;
    return data;
  }

  /* ---------- Auth state observer ---------- */
  async function onAuthChange(callback) {
    const client = await getClient();
    const { data } = client.auth.onAuthStateChange(callback);
    return data.subscription;
  }

  window.AvcrosAuth = {
    init,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    getUser,
    getSession,
    getProfile,
    checkUsernameAvailable,
    sendPasswordReset,
    updatePassword,
    resendConfirmation,
    onAuthChange,
    getClient
  };
})();
