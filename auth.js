// Helper to grab whichever Supabase client variable your page uses
function getSupabase() {
    if (typeof supabaseClient !== 'undefined') return supabaseClient;
    if (typeof _supabase !== 'undefined') return _supabase;
    return null;
}

// Check if user is logged in. If not, redirect to login.html and bring them back after.
async function requireCustomerLogin() {
    const sb = getSupabase();
    if (!sb) return null;

    const { data: { session } } = await sb.auth.getSession();

    if (!session) {
        alert("Please login or create an account to continue.");
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        return null;
    }

    return session.user; // Returns the logged-in user object
}

// Logout function (can be called from any Logout button in your header)
async function logoutCustomer() {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
    window.location.reload();
}
