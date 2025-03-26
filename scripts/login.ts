// src/scripts/login.ts

interface User {
    username: string;
    password: string;
    role?: string;
}

class AuthService {
    private static readonly AUTH_KEY = 'isLoggedIn';
    private static readonly USER_KEY = 'loggedInUser';
    private static readonly ROLE_KEY = 'userRole';

    static isAuthenticated(): boolean {
        return localStorage.getItem(this.AUTH_KEY) === 'true';
    }

    static login(username: string, role: string = 'volunteer'): void {
        localStorage.setItem(this.AUTH_KEY, 'true');
        localStorage.setItem(this.USER_KEY, username);
        localStorage.setItem(this.ROLE_KEY, role);
    }

    static logout(): void {
        localStorage.removeItem(this.AUTH_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.ROLE_KEY);
    }

    static getCurrentUser(): string | null {
        return localStorage.getItem(this.USER_KEY);
    }

    static getCurrentRole(): string | null {
        return localStorage.getItem(this.ROLE_KEY);
    }
}

class LoginUI {
    private form: HTMLFormElement;
    private alert: HTMLElement;
    private alertMessage: HTMLElement;

    constructor() {
        this.form = document.getElementById('loginForm') as HTMLFormElement;
        this.alert = document.createElement('div');
        this.alert.id = 'loginAlert';
        this.alert.className = 'alert alert-dismissible fade show';
        this.alert.style.display = 'none';
        this.alert.innerHTML = `
            <span id="alertMessage"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.form.parentNode?.insertBefore(this.alert, this.form);
        this.alertMessage = document.getElementById('alertMessage') as HTMLElement;
        this.init();
    }

    private init(): void {
        if (AuthService.isAuthenticated()) {
            this.redirectAfterLogin();
            return;
        }

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
    }

    private async handleLogin(): Promise<void> {
        if (!this.validateForm()) return;

        const username = this.getInputValue('username');
        const password = this.getInputValue('password');

        try {
            const user = await this.authenticateUser(username, password);

            if (user) {
                this.handleSuccessfulLogin(user);
            } else {
                this.showAlert('Invalid username or password', 'danger');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Login failed. Please try again later.', 'danger');
        }
    }

    private getInputValue(id: string): string {
        return (document.getElementById(id) as HTMLInputElement).value.trim();
    }

    private async authenticateUser(username: string, password: string): Promise<User | undefined> {
        const response = await fetch('../Data/users.json');
        const users = await response.json();
        return users.find((u: User) => u.username === username && u.password === password);
    }

    private validateForm(): boolean {
        let isValid = true;
        const inputs = this.form.querySelectorAll<HTMLInputElement>('input[required]');

        inputs.forEach(input => {
            const hasValue = !!input.value.trim();
            input.classList.toggle('is-invalid', !hasValue);
            if (!hasValue) isValid = false;
        });

        return isValid;
    }

    private handleSuccessfulLogin(user: User): void {
        AuthService.login(user.username, user.role);
        this.showAlert('Login successful! Redirecting...', 'success');

        // Update navbar before redirect
        if (window.router) {
            window.router.updateNavbar();
        }

        this.redirectAfterLogin();
    }

    private showAlert(message: string, type: 'success' | 'danger' | 'info'): void {
        this.alertMessage.textContent = message;
        this.alert.className = `alert alert-${type} alert-dismissible fade show`;
        this.alert.style.display = 'block';

        setTimeout(() => {
            this.alert.style.display = 'none';
        }, 5000);
    }

    private redirectAfterLogin(): void {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || '/';
        setTimeout(() => {
            if (window.router) {
                window.router.navigate(redirect);
            } else {
                window.location.href = redirect;
            }
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginUI();
});

export const auth = AuthService;