// src/scripts/login.ts
class AuthService {
    static isAuthenticated() {
        return localStorage.getItem(this.AUTH_KEY) === 'true';
    }
    static login(username, role = 'volunteer') {
        localStorage.setItem(this.AUTH_KEY, 'true');
        localStorage.setItem(this.USER_KEY, username);
        localStorage.setItem(this.ROLE_KEY, role);
    }
    static logout() {
        localStorage.removeItem(this.AUTH_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.ROLE_KEY);
    }
    static getCurrentUser() {
        return localStorage.getItem(this.USER_KEY);
    }
    static getCurrentRole() {
        return localStorage.getItem(this.ROLE_KEY);
    }
}
AuthService.AUTH_KEY = 'isLoggedIn';
AuthService.USER_KEY = 'loggedInUser';
AuthService.ROLE_KEY = 'userRole';
class LoginUI {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.alert = document.createElement('div');
        this.alert.id = 'loginAlert';
        this.alert.className = 'alert alert-dismissible fade show';
        this.alert.style.display = 'none';
        this.alert.innerHTML = `
            <span id="alertMessage"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.form.parentNode?.insertBefore(this.alert, this.form);
        this.alertMessage = document.getElementById('alertMessage');
        this.init();
    }
    init() {
        if (AuthService.isAuthenticated()) {
            this.redirectAfterLogin();
            return;
        }
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
    }
    async handleLogin() {
        if (!this.validateForm())
            return;
        const username = this.getInputValue('username');
        const password = this.getInputValue('password');
        try {
            const user = await this.authenticateUser(username, password);
            if (user) {
                this.handleSuccessfulLogin(user);
            }
            else {
                this.showAlert('Invalid username or password', 'danger');
            }
        }
        catch (error) {
            console.error('Login error:', error);
            this.showAlert('Login failed. Please try again later.', 'danger');
        }
    }
    getInputValue(id) {
        return document.getElementById(id).value.trim();
    }
    async authenticateUser(username, password) {
        const response = await fetch('../Data/users.json');
        const users = await response.json();
        return users.find((u) => u.username === username && u.password === password);
    }
    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            const hasValue = !!input.value.trim();
            input.classList.toggle('is-invalid', !hasValue);
            if (!hasValue)
                isValid = false;
        });
        return isValid;
    }
    handleSuccessfulLogin(user) {
        AuthService.login(user.username, user.role);
        this.showAlert('Login successful! Redirecting...', 'success');
        // Update navbar before redirect
        if (window.router) {
            window.router.updateNavbar();
        }
        this.redirectAfterLogin();
    }
    showAlert(message, type) {
        this.alertMessage.textContent = message;
        this.alert.className = `alert alert-${type} alert-dismissible fade show`;
        this.alert.style.display = 'block';
        setTimeout(() => {
            this.alert.style.display = 'none';
        }, 5000);
    }
    redirectAfterLogin() {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || '/';
        setTimeout(() => {
            if (window.router) {
                window.router.navigate(redirect);
            }
            else {
                window.location.href = redirect;
            }
        }, 1500);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new LoginUI();
});
export const auth = AuthService;
//# sourceMappingURL=login.js.map