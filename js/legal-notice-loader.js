document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('legal_notice_textbox');
    if (!container) {
        return;
    }

    fetch('legal-notice.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load legal notice: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
        })
        .catch(error => {
            console.error(error);
            if (!container.innerHTML.trim()) {
                container.innerHTML = '<p>Legal notice could not be loaded.</p>';
            }
        });
});
