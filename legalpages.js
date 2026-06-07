// legalpages.js
function setLanguage(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.lang-btn[onclick="setLanguage('${lang}')"]`).classList.add('active');
    
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.getAttribute(`data-${lang}`)) {
            el.innerHTML = el.getAttribute(`data-${lang}`);
        } else {
            el.innerHTML = el.getAttribute('data-en'); 
        }
    });
    sessionStorage.setItem('preferredLang', lang);
}

window.onload = () => {
    const savedLang = sessionStorage.getItem('preferredLang') || 'en';
    setLanguage(savedLang);
};