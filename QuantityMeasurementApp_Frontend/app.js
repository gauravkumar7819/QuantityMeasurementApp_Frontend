const BASE_URL = "http://localhost:3000";
const API_USERS = `${BASE_URL}/users`;
const API_MEASUREMENTS = `${BASE_URL}/QuantityMeasurements`;

/**
 * Enhanced fetch with timeout and error handling
 */
async function apiFetch(url, options = {}) {
    const timeout = 8000;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check if the server is running.');
        }
        throw error;
    }
}

/**
 * Authentication state management
 */
function checkAuth() {
    const user = JSON.parse(localStorage.getItem("user"));
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const protectedPages = ['dashboard.html', 'history.html'];
    const authPages = ['login.html', 'signup.html'];
    
    if (protectedPages.includes(currentPage) && !user) {
        showToast("Please login to access this page", "info");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 800);
        return false;
    }
    
    if (authPages.includes(currentPage) && user) {
        window.location.href = "dashboard.html";
        return false;
    }
    
    updateNavbarAuth();
    return true;
}

/**
 * Updates navbar UI based on authentication state
 */
function updateNavbarAuth() {
    const user = localStorage.getItem('user');
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const historyLink = document.getElementById('historyLink');
    
    if (loginLink && logoutLink && dashboardLink && historyLink) {
        const isAuth = !!user;
        loginLink.style.display = isAuth ? 'none' : 'inline-block';
        logoutLink.style.display = isAuth ? 'inline-block' : 'none';
        dashboardLink.style.display = isAuth ? 'inline-block' : 'none';
        historyLink.style.display = isAuth ? 'inline-block' : 'none';
    }
}

/**
 * Handles user login
 */
async function handleLogin(event) {
    if (event) event.preventDefault();
    
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value.trim();

    if (!email || !password) {
        showToast("Please enter both email and password", "error");
        return;
    }

    const submitBtn = document.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Authenticating...';
    submitBtn.disabled = true;

    try {
        const users = await apiFetch(`${API_USERS}?email=${encodeURIComponent(email)}`);
        const user = users.find(u => u.password === password);

        if (!user) {
            showToast("Invalid email or password", "error");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        localStorage.setItem("user", JSON.stringify(user));
        showToast("Welcome back, " + user.name, "success");
        
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (err) {
        console.error('Login error:', err);
        showToast(err.message || "Connection error. Is the server running?", "error");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Handles user signup
 */
async function handleSignup(event) {
    if (event) event.preventDefault();
    
    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!name || !email || !password) {
        showToast("Please fill in all required fields", "error");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
    }

    const submitBtn = document.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;

    try {
        const existingUsers = await apiFetch(`${API_USERS}?email=${encodeURIComponent(email)}`);
        
        if (existingUsers.length > 0) {
            showToast("This email is already registered", "error");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        await apiFetch(API_USERS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, createdAt: new Date().toISOString() })
        });

        showToast("Account created! Redirecting to login...", "success");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
        
    } catch (err) {
        console.error('Signup error:', err);
        showToast(err.message || "Connection error. Is the server running?", "error");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Handles user logout
 */
function logout() {
    localStorage.removeItem("user");
    showToast("Logged out successfully", "success");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 500);
}

/**
 * Toggles the mobile navigation menu
 */
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

/**
 * Displays toast notifications
 */
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 300);
    }, 3000);
}

/**
 * Loads the navbar dynamically
 */
async function loadNavbar() {
    try {
        const response = await fetch('navbar.html');
        if (!response.ok) throw new Error('Navbar fetch failed');
        const data = await response.text();
        document.getElementById('navbar-container').innerHTML = data;
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        updateNavbarAuth();
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

/**
 * Application initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (document.getElementById('navbar-container')) {
        loadNavbar();
    }
});
