// src/scripts/router.ts
class Router {
    constructor() {
        this.routes = {};
        this.protectedRoutes = ['/statistics', '/events-planning'];
    }
    addRoute(path, template) {
        this.routes[path] = template;
    }
    async navigate(path) {
        if (this.routes[path]) {
            if (this.protectedRoutes.includes(path) && !this.isAuthenticated()) {
                this.navigate(`/login?redirect=${encodeURIComponent(path)}`);
                return;
            }
            try {
                const response = await fetch(this.routes[path]);
                const html = await response.text();
                const contentElement = document.getElementById('content');
                if (contentElement) {
                    contentElement.innerHTML = html;
                    this.loadScriptForRoute(path);
                    this.updateNavbar();
                }
                history.pushState({}, '', path);
            }
            catch (error) {
                console.error(`Failed to load route ${path}:`, error);
            }
        }
    }
    isAuthenticated() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    updateNavbar() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const loginLogoutLink = document.getElementById('loginLogoutLink');
        if (loginLogoutLink) {
            if (loggedInUser) {
                loginLogoutLink.innerHTML = `
                    <a class="nav-link" href="#" id="logoutLink">Welcome, ${loggedInUser} | Logout</a>
                `;
                const logoutBtn = document.getElementById('logoutLink');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('loggedInUser');
                        this.updateNavbar();
                        this.navigate('/');
                    });
                }
            }
            else {
                loginLogoutLink.innerHTML = '<a class="nav-link" href="/login">Login</a>';
            }
        }
    }
    loadScriptForRoute(path) {
        const routeScripts = {
            '/': '../dist/main.js',
            '/login': '../dist/login.js',
            '/events': '../dist/main.js',
            '/statistics': '../dist/statistics.js',
            '/events-planning': '../dist/eventsPlanning.js'
        };
        const scriptPath = routeScripts[path];
        if (scriptPath) {
            const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = scriptPath;
                script.type = 'module';
                document.body.appendChild(script);
            }
        }
    }
}
const router = new Router();
router.addRoute('/', '../views/index.html');
router.addRoute('/login', '../views/login.html');
router.addRoute('/events', '../views/events.html');
router.addRoute('/about', '../views/about.html');
router.addRoute('/contact', '../views/contact.html');
router.addRoute('/statistics', '../views/statistics.html');
router.addRoute('/events-planning', '../views/eventsPlanning.html');
window.addEventListener('popstate', () => router.navigate(window.location.pathname));
document.addEventListener('DOMContentLoaded', () => {
    router.navigate(window.location.pathname);
    router.updateNavbar();
    document.addEventListener('click', (e) => {
        const target = e.target;
        const link = target.closest('[data-nav-link]');
        if (link) {
            e.preventDefault();
            const path = link.getAttribute('href');
            if (path)
                router.navigate(path);
        }
    });
});
window.router = router;
export default router;
//# sourceMappingURL=router.js.map