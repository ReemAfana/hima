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
            background: #fff;
            border-bottom: 1px solid #ece7df;
            padding: 0 34px;
            height: 72px;
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
            box-shadow: 0 4px 15px rgba(0,0,0,0.04);
        ">
            <a href="index.html" style="
                display: flex;
                align-items: center;
                gap: 11px;
                font-size: 24px;
                font-weight: 800;
                color: #1d5c2e;
                text-decoration: none;
            ">
                <span style="
                    width: 38px;
                    height: 38px;
                    border-radius: 11px;
                    background: #1d5c2e;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 16px rgba(29,92,46,.18);
                ">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                        <path d="M4 11.5 12 5l8 6.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 10.5V19h12v-8.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.5 19v-4.5h3V19" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                حِمى
            </a>

            <div style="display:flex;align-items:center;gap:16px;">
                <span style="color:#6f6a5d;font-size:14px;font-weight:700;">
                    ${name} — ${roleMap[role] || role}
                </span>
                <button onclick="logout()" style="
                    width:auto;
                    background: #f3efe8;
                    border: none;
                    color: #6f6a5d;
                    border-radius: 10px;
                    padding: 9px 16px;
                    font-family: Cairo, sans-serif;
                    font-size: 13px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#edf8ed';this.style.color='#1d5c2e'"
                   onmouseout="this.style.background='#f3efe8';this.style.color='#6f6a5d'">
                    تسجيل الخروج
                </button>
            </div>
        </nav>
        <div style="height: 72px;"></div>
    `;
}


document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }
    renderNavbar();
});
