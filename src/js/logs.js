document.addEventListener('DOMContentLoaded', () => {

    const listaLogs = document.getElementById('listaLogs');
    const btnLimpar = document.getElementById('limparLogs');

    let logs = JSON.parse(localStorage.getItem('logs')) || [];

    function renderizarLogs() {
        listaLogs.innerHTML = '';

        if (logs.length === 0) {
            listaLogs.innerHTML = `
                <p style="text-align:center; color:#64748b;">
                    Nenhum log registrado.
                </p>
            `;
            return;
        }

        // Mais recente primeiro
        logs.slice().reverse().forEach(log => {

            listaLogs.innerHTML += `
                <div class="log-item">
                    <strong>${log.usuario}</strong> 
                    ${log.acao} 
                    <strong>${log.certificado}</strong>
                    <div class="log-date">
                        ${log.data}
                    </div>
                </div>
            `;
        });
    }

    btnLimpar.addEventListener('click', () => {
        if (confirm('Deseja apagar todos os logs?')) {
            localStorage.removeItem('logs');
            logs = [];
            renderizarLogs();
        }
    });

    renderizarLogs();

});