document.addEventListener('DOMContentLoaded', () => {
    
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    
    const meuGrafico = new Chart(ctx, {
        type: 'pie', // TIPO GRÁFICO DE PIZZA
        data: {
            labels: ['Carregando...'],
            datasets: [{
                label: 'Quantidade',
                data: [0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'cursive', // Sua fonte
                            size: 14
                        }
                    }
                }
            }
        }
    });

    /**
     * Função para buscar os dados da Etapa 1 e atualizar o gráfico
     */
    async function carregarDadosDoCRUD() {
        try {
            const response = await fetch('http://localhost:3000/livros');
            const livros = await response.json();

            if (livros.length === 0) {
                atualizarGrafico(['Nenhum livro cadastrado'], [0]);
                return;
            }

            // --- LÓGICA DE CONTAR GÊNEROS ---
            // 1. Cria um objeto para contar: ex: { Fantasia: 1, Romance: 2 }
            const contagemGeneros = {};
            livros.forEach(livro => {
                const genero = livro.genero || 'Sem Gênero'; // Agrupa livros sem gênero
                if (contagemGeneros[genero]) {
                    contagemGeneros[genero]++; // Incrementa a contagem
                } else {
                    contagemGeneros[genero] = 1; // Inicia a contagem
                }
            });

            // 2. Transforma o objeto em arrays que o Chart.js entende
            const labels = Object.keys(contagemGeneros);
            const data = Object.values(contagemGeneros);
            
            // 3. ATUALIZAÇÃO DA APRESENTAÇÃO
            atualizarGrafico(labels, data);

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            atualizarGrafico(['Erro ao carregar'], [0]);
        }
    }

    /**
     * Função que atualiza a instância do gráfico com novos dados
     */
    function atualizarGrafico(labels, data) {
        meuGrafico.data.labels = labels;
        meuGrafico.data.datasets[0].data = data;
        meuGrafico.update();
    }

    // Carrega os dados assim que a página abre
    carregarDadosDoCRUD();
});