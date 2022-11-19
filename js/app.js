let cliente = {
  mesa: '',
  hora: '',
  pedido: []
}

const categorias = {
  1: 'Comida',
  2: 'Suco',
  3: 'Sobremesa'
}

const btnSalvarCliente = document.querySelector('#guardar-cliente');

btnSalvarCliente.addEventListener('click', salvarCliente);

function salvarCliente() {
  const hora = document.querySelector('#hora').value;
  const mesa = document.querySelector('#mesa').value;

  

  const camposVacios = [ mesa, hora ].some( campo => campo === '');

  if(camposVacios){
    //verificar se está mostrando-se a alerta
    const existaAlerta = document.querySelector('.invalid-feedback');

    if(!existaAlerta) {
      const alerta = document.createElement('div');
      alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
      alerta.textContent = 'Todos os campos são obrigatórios';
      document.querySelector('.modal-body form').appendChild(alerta);

      setTimeout(() => {
        alerta.remove();
      }, 2500);
    }

    return;

  }
  
  //adicionar os dados do formulário ao objeto cliente
  cliente = {...cliente, mesa, hora};

  //fechar o modal
  const modal = document.querySelector('.modal');
  const modalInstancia = bootstrap.Modal.getInstance(modal);
  modalInstancia.hide();

  //mostar seções
  mostrarSecoes();

  //obter platilhos da API de JSON-SERVER
  obterPlatilhos();

}

function mostrarSecoes(){
  const secoes = document.querySelectorAll('.d-none');

  secoes.forEach(secao => secao.classList.remove('d-none'));
}

function obterPlatilhos() {
  const url = 'http://localhost:4000/platillos';

  fetch(url)
    .then(resposta => resposta.json() )
    .then(resultado => mostrarPlatilhos(resultado))
    .catch(erro => console.log(erro))
}

function mostrarPlatilhos(platilhos){

  const conteudo = document.querySelector('#platillos .contenido');
  
  platilhos.forEach(platilho => {
    const row = document.createElement('div');
    row.classList.add('row', 'py-2', 'border-top');

    const nombre = document.createElement('div');
    nombre.classList.add('col-md-4')
    nombre.textContent = platilho.nombre;

    const preco = document.createElement('div');
    preco.classList.add('col-md-3', 'fw-bold');
    preco.textContent = `$${platilho.precio}`;

    const categoria = document.createElement('div');
    categoria.classList.add('col-md-3')
    categoria.textContent = categorias[platilho.categoria];

    const inputCantidad = document.createElement('input');
    inputCantidad.classList.add('form-control');
    inputCantidad.type = 'number';
    inputCantidad.value = 0;
    inputCantidad.min = 0;
    inputCantidad.id = `produto-${platilho.id}`;

    const caixaDoInput = document.createElement('div');
    caixaDoInput.classList.add('col-md-2');
    caixaDoInput.appendChild(inputCantidad);

    row.appendChild(nombre);
    row.appendChild(preco);
    row.appendChild(categoria);
    row.appendChild(caixaDoInput);

    conteudo.appendChild(row);
  })
}