// URL do seu banco de dados
const API_URL = 'http://localhost:3000/livros';

// ===========================================
// LÓGICA DE RENDERIZAÇÃO (Leitura de dados)
// ===========================================

/**
 * Busca os livros da API e preenche o carrossel
 */
async function renderizarCarrossel() {
    const indicatorsContainer = document.getElementById('carousel-indicators-container');
    const innerContainer = document.getElementById('carousel-inner-container');
    
    // Se não estiver na index.html, não faz nada
    if (!indicatorsContainer || !innerContainer) return;

    try {
        // Busca os dados da API (db.json)
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Falha ao buscar livros');
        const livros = await response.json();

        let indicatorsHTML = '';
        let innerHTML = '';

        livros.forEach((livro, index) => {
            const activeClass = index === 0 ? 'active' : ''; 
            indicatorsHTML += `
                <button type="button" data-bs-target="#meuCarrossel" data-bs-slide-to="${index}" class="${activeClass}" aria-current="true" aria-label="Slide ${index + 1}"></button>
            `;
            innerHTML += `
                <div class="carousel-item ${activeClass}">
                    <img src="${livro.imagemURL}" class="d-block w-100" alt="Capa do livro ${livro.titulo}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${livro.titulo}</h5>
                        <p>${livro.resenha}</p>
                    </div>
                </div>
            `;
        });
        indicatorsContainer.innerHTML = indicatorsHTML;
        innerContainer.innerHTML = innerHTML;
    } catch (error) {
        console.error("Erro ao renderizar carrossel:", error);
        innerContainer.innerHTML = `<div class="alert alert-danger">Erro ao carregar livros. Você iniciou o json-server?</div>`;
    }
}

/**
 * Busca os livros da API e preenche os cards
 */
async function renderizarCardsNaInicial() {
    const containerCards = document.getElementById('container-cards');
    if (!containerCards) return;

    try {
        containerCards.innerHTML = ''; // Limpa
        
        // Busca os dados da API (db.json)
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Falha ao buscar livros');
        const livros = await response.json();

        livros.forEach(livro => {
            const cardColuna = document.createElement('div');
            cardColuna.className = 'col-lg-4 col-md-6 mb-4';
            cardColuna.innerHTML = `
                <div class="card h-100">
                    <a href="detalhes.html?id=${livro.id}">
                        <img src="${livro.imagemURL}" class="card-img-top" alt="Capa do livro ${livro.titulo}">
                    </a>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${livro.titulo}</h5>
                        <p class="card-text text-muted">Autor(a): ${livro.autor}</p>
                        <p class="card-text mt-2 flex-grow-1">${livro.resenha}</p>
                        <a href="detalhes.html?id=${livro.id}" class="btn btn-primary align-self-start mt-auto">Ver Mais Detalhes</a>
                    </div>
                </div>
            `;
            containerCards.appendChild(cardColuna);
        });
    } catch (error) {
        console.error("Erro ao renderizar cards:", error);
        containerCards.innerHTML = `<div class="alert alert-danger">Erro ao carregar livros. Você iniciou o json-server?</div>`;
    }
}

/**
 * Busca um livro específico da API (para a página de detalhes)
 */
async function renderizarDetalhesDoLivro() {
    const detalhesContainer = document.getElementById('detalhes-livro');
    if (!detalhesContainer) return; // Só roda na página de detalhes

    const urlParams = new URLSearchParams(window.location.search);
    const livroId = urlParams.get('id'); // ID agora é string
    
    if (!livroId) return;

    try {
        // Busca um livro específico pelo ID
        const response = await fetch(`${API_URL}/${livroId}`);
        if (!response.ok) throw new Error('Livro não encontrado');
        const livro = await response.json();

        if (livro) {
            detalhesContainer.innerHTML = `
                <img src="${livro.imagemURL}" alt="Capa do livro ${livro.titulo}" style="width: 300px; display: block; margin: 20px auto;">
                <h1>${livro.titulo}</h1>
                <h2>Por: ${livro.autor}</h2>
                <p><strong>Resumo:</strong> ${livro.resenha}</p>
                <p><strong>Detalhes Completos:</strong> ${livro.descricaoCompleta}</p>
                <a href="index.html">← Voltar para a página inicial</a>
            `;
        } else {
            detalhesContainer.innerHTML = '<h1>Livro não encontrado.</h1>';
        }
    } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        detalhesContainer.innerHTML = `<h1>Livro não encontrado.</h1> <p>Verifique o ID e se o json-server está rodando.</p>`;
    }
}

// CHAMA AS FUNÇÕES QUANDO A PÁGINA CARREGA
document.addEventListener('DOMContentLoaded', () => {
    // Tenta rodar todas. Elas só vão funcionar se acharem os IDs
    // corretos em cada página (index.html ou detalhes.html)
    renderizarCarrossel();
    renderizarCardsNaInicial();
    renderizarDetalhesDoLivro();
});