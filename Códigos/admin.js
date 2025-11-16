const API_URL = 'http://localhost:3000/livros';
const form = document.getElementById('form-cadastro');
const tabelaBody = document.getElementById('tabela-livros');

// 1. READ (Ler e exibir na tabela)
async function carregarLivros() {
    const livros = await fetch(API_URL).then(res => res.json());
    tabelaBody.innerHTML = ''; // Limpa a tabela
    livros.forEach(livro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.genero || 'N/A'}</td> <td>
                <button class="btn btn-danger btn-sm btn-deletar" data-id="${livro.id}">Deletar</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });
}

// 2. CREATE (Postar novo livro)
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento
    
    const novoLivro = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        genero: document.getElementById('genero').value, // SALVA O GÊNERO
        resenha: document.getElementById('resenha').value,
        imagemURL: document.getElementById('imagemURL').value,
        vendas: parseInt(document.getElementById('vendas').value, 10) || 0
    };

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoLivro)
    });

    form.reset(); // Limpa o formulário
    carregarLivros(); // Recarrega a tabela
});

// 3. DELETE (Deletar livro)
tabelaBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-deletar')) {
        const id = e.target.dataset.id;
        if (confirm('Tem certeza que deseja deletar este livro?')) {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            carregarLivros(); // Recarrega a tabela
        }
    }
});

// Carrega os livros quando a página abre
carregarLivros();