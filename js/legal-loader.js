document.addEventListener('DOMContentLoaded', () => {
    loadHtmlIntoContainer('legal_notice_textbox', 'legal-notice.html', 'Legal notice');
    loadHtmlIntoContainer('privacy_policy_textbox', 'privacy-policy.html', 'Privacy policy');
});

function loadHtmlIntoContainer(containerId, url, label) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${label}: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
        })
        .catch(error => {
            console.error(error);
            if (!container.innerHTML.trim()) {
                container.innerHTML = `<p>${label} could not be loaded.</p>`;
            }
        });
}
