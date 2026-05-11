function renderNavbar() {
    const name = localStorage.getItem('name') || '';
    const role = localStorage.getItem('role') || '';

    const roleMap = {
        'admin':  'مشرف',
        'host':   'صاحب عقار',
        'tenant': 'مستأجر',
    };

    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    navbar.innerHTML = `
        <nav style="
            background: #0D2B1F;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            direction: rtl;
            font-family: Cairo, sans-serif;
            width: 100%;
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        ">
            <a href="index.html" style="
                font-size: 1.5rem;
                font-weight: 900;
                color: #D4A853;
                text-decoration: none;
            ">حمى <span style="color:white;font-weight:300">| منصة إيجار</span></a>

            <div style="display:flex;align-items:center;gap:1rem;">
                <span style="color:rgba(255,255,255,0.7);font-size:0.9rem;">
                    ${name} — ${roleMap[role] || role}
                </span>
                <button onclick="logout()" style="
                    background: transparent;
                    border: 1.5px solid #D4A853;
                    color: #D4A853;
                    border-radius: 8px;
                    padding: 0.4rem 1rem;
                    font-family: Cairo, sans-serif;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#D4A853';this.style.color='#0D2B1F'"
                   onmouseout="this.style.background='transparent';this.style.color='#D4A853'">
                    تسجيل الخروج
                </button>
            </div>
        </nav>
        <div style="height: 65px;"></div>
    `;
}


document.addEventListener('DOMContentLoaded', function() {
        if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }
    renderNavbar();
});