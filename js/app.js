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

    inputCantidad.onclick = function(){
      const cantidad = inputCantidad.value;
      adicionarPlatilho({...platilho, cantidad})
    }

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

function adicionarPlatilho(produto){
  //extrair o pedido atual
  let { pedido } = cliente;

  //verificar que a quantidade seja maior que 0
  if(produto.cantidad > 0){

    //verificar se o platilho já existe no pedido
    if(pedido.some(articulo => articulo.id === produto.id)){

      //o platilho já existe, agora atualizo a quantidade
      const pedidoAtualizado = pedido.map(platilho => {
        if(platilho.id === produto.id){
          platilho.cantidad = produto.cantidad
          //console.log(platilho.cantidad);
        }
        return platilho;
      });
      //adicionadmos o pedidoAtualizado a cliente.pedido
      cliente.pedido = [...pedidoAtualizado]
    } else {
      cliente.pedido = [...pedido, produto];
    }
     
  } else {
    //eliminar platilho se sua propiedade quantidade é igual a 0
    const listaPlatilhos = pedido.filter(platilho => platilho.id !== produto.id)
    cliente.pedido = [...listaPlatilhos]
  }

  //limpar o código html anterior do pedido
  limparHTML();

  if(cliente.pedido.length){
    //mostrar o resumo do pedido
    atualizarResumo();
  } else {
    mensagemPedidoVacio();
  }

  
}

function atualizarResumo(){
  const conteudo = document.querySelector('#resumen .contenido');

  const resumo = document.createElement('div');
  resumo.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

  //informação da mesa
  const mesa = document.createElement('p');
  mesa.classList.add('fw-bold');
  mesa.textContent = 'Mesa: ';

  const mesaSpan = document.createElement('span');
  mesaSpan.classList.add('fw-normal');
  mesaSpan.textContent = cliente.mesa;

  //informação da hora
  const hora = document.createElement('p');
  hora.classList.add('fw-bold');
  hora.textContent = 'Hora: ';

  const horaSpan = document.createElement('span');
  horaSpan.classList.add('fw-normal');
  horaSpan.textContent = cliente.hora;

  mesa.appendChild(mesaSpan);
  hora.appendChild(horaSpan);

  //titulo da seção
  const heading = document.createElement('h3');
  heading.classList.add('my-4', 'text-center');
  heading.textContent = 'Platilhos consumidos';

  //iterar sobre os o array de platilhos
  const grupo = document.createElement('ul');
  grupo.classList.add('list-group');

  const { pedido } = cliente;

  pedido.forEach(articulo => {
    const { nombre, precio, id, cantidad } = articulo;

    const elementoDaLista = document.createElement('li');
    elementoDaLista.classList.add('list-group-item');

    const nombreDoElemento = document.createElement('h4');
    nombreDoElemento.classList.add('my-4');
    nombreDoElemento.textContent = nombre;

    //quantidade do itens
    const quantidadeElemento = document.createElement('p');
    quantidadeElemento.classList.add('fw-bold');
    quantidadeElemento.textContent = 'Quantidade: ';

    const quantidadeValor = document.createElement('span');
    quantidadeValor.classList.add('fw-normal');
    quantidadeValor.textContent = cantidad;
    
    //preço do item
    const precoElemento = document.createElement('p');
    precoElemento.classList.add('fw-bold');
    precoElemento.textContent = 'Preço: ';

    const precoValor = document.createElement('span');
    precoValor.classList.add('fw-normal');
    precoValor.textContent = `$${precio}`;

    //preço do item
    const subtotalElemento = document.createElement('p');
    subtotalElemento.classList.add('fw-bold');
    subtotalElemento.textContent = 'Subtotal: ';

    const subtotalValor = document.createElement('span');
    subtotalValor.classList.add('fw-normal');
    subtotalValor.textContent = calcularSubtotal(precio, cantidad);

    //botão para remover itens
    const btnRemover = document.createElement('button');
    btnRemover.classList.add('btn', 'btn-danger');
    btnRemover.textContent = 'Remover do pedido';

    btnRemover.onclick = function(){
      removerProduto(id)
    }


    //adicionar valores dentro de seus contenedores
    quantidadeElemento.appendChild(quantidadeValor);
    precoElemento.appendChild(precoValor);
    subtotalElemento.appendChild(subtotalValor);


    //adicionar elementos ao li
    elementoDaLista.appendChild(nombreDoElemento);
    elementoDaLista.appendChild(quantidadeElemento);
    elementoDaLista.appendChild(precoElemento);
    elementoDaLista.appendChild(subtotalElemento);
    elementoDaLista.appendChild(btnRemover);

    //adicionar lista ao grupo principal
    grupo.appendChild(elementoDaLista);
  })

  //adicionar ao conteudo
  resumo.appendChild(heading);
  resumo.appendChild(mesa); 
  resumo.appendChild(hora);
  
  resumo.appendChild(grupo);

  conteudo.appendChild(resumo);

  //mostrar formulário de gorjetas
  formularioGorjetas();
}

function limparHTML(){
  const conteudo = document.querySelector('#resumen .contenido');

  while (conteudo.firstChild) {
    conteudo.removeChild(conteudo.firstChild);
  }
}

function calcularSubtotal(precio, cantidad){
  return `$${precio * cantidad}`;
}


function removerProduto(id){
  const { pedido } = cliente;

  const itensRestantes = pedido.filter( item => item.id !== id);
  cliente.pedido = [...itensRestantes]
  
  //limpar o código html anterior do pedido
  limparHTML();
  

  if(cliente.pedido.length){
    //mostrar o resumo do pedido
    atualizarResumo();
  } else {
    mensagemPedidoVacio();
  }

  //o produto se eliminou portanto a devemos colocar a quantidade a 0 no formulário
  const produtoRemovido = `#produto-${id}`;
  const inputRemovido = document.querySelector(produtoRemovido);
  inputRemovido.value = 0;
}


function mensagemPedidoVacio(){
  const conteudo = document.querySelector('#resumen .contenido');

  const texto = document.createElement('p');
  texto.classList.add('text-center');
  texto.textContent = 'Adiciona os elementos do pedido';

  conteudo.appendChild(texto);

}

function formularioGorjetas(){
  const conteudo = document.querySelector('#resumen .contenido');

  const formulario = document.createElement('div');
  formulario.classList.add('col-md-6', 'formulario');

  const divFormulario = document.createElement('div');
  divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');
  
  const heading = document.createElement('h3');
  heading.classList.add('my-4', 'text-center');
  heading.textContent = 'Gorjeta';

  //radio button 10%
  const radio10 = document.createElement('input');
  radio10.type = 'radio';
  radio10.name = 'gorjeta';
  radio10.value = '10';
  radio10.classList.add('form-check-input');
  radio10.onclick = calcularGorjeta;

  const radio10Label = document.createElement('label');
  radio10Label.textContent = '10%';
  radio10Label.classList.add('form-check-label');

  const radio10Div = document.createElement('div');
  radio10Div.classList.add('form-check');

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(radio10Label);

  //radio button 25%
  const radio25 = document.createElement('input');
  radio25.type = 'radio';
  radio25.name = 'gorjeta';
  radio25.value = '25';
  radio25.classList.add('form-check-input');
  radio25.onclick = calcularGorjeta;

  const radio25Label = document.createElement('label');
  radio25Label.textContent = '25%';
  radio25Label.classList.add('form-check-label');

  const radio25Div = document.createElement('div');
  radio25Div.classList.add('form-check');

  radio25Div.appendChild(radio25);
  radio25Div.appendChild(radio25Label);
  
  //radio button 50%
  const radio50 = document.createElement('input');
  radio50.type = 'radio';
  radio50.name = 'gorjeta';
  radio50.value = '50';
  radio50.classList.add('form-check-input');
  radio50.onclick = calcularGorjeta;


  const radio50Label = document.createElement('label');
  radio50Label.textContent = '50%';
  radio50Label.classList.add('form-check-label');

  const radio50Div = document.createElement('div');
  radio50Div.classList.add('form-check');

  radio50Div.appendChild(radio50);
  radio50Div.appendChild(radio50Label);
  
  //adicoinar ao div principal
  divFormulario.appendChild(heading);
  divFormulario.appendChild(radio10Div);
  divFormulario.appendChild(radio25Div);
  divFormulario.appendChild(radio50Div);

  //adicionar ao formulario
  formulario.appendChild(divFormulario);

  conteudo.appendChild(formulario);

}

function calcularGorjeta(){
  const { pedido } = cliente;
  let subTotal = 0;

  //calcular o subtotal a pagar
  pedido.forEach(item => {
    subTotal += item.precio * item.cantidad;
  })

  //selecionar o radio button com a gorjeta selecionada
  const gorjetaSelecionada = document.querySelector('[name="gorjeta"]:checked').value;

  //calcular gorjeta
  const gorjeta = (subTotal * parseInt(gorjetaSelecionada)) / 100;
  
  //calcular total a pagar
  const total = subTotal + gorjeta;
  
  mostrarTotalHTML(subTotal, gorjeta, total);
}

function mostrarTotalHTML(subTotal, gorjeta, total){
  const divTotais = document.createElement('div');
  divTotais.classList.add('total-pagar', 'my-5')

  //subtotal
  const subTotalParrafo = document.createElement('p');
  subTotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  subTotalParrafo.textContent = 'Subtotal consumo: ';

  const subTotalSpan = document.createElement('span');
  subTotalSpan.classList.add('fw-normal');
  subTotalSpan.textContent = `$${subTotal}`;

  subTotalParrafo.appendChild(subTotalSpan);


   //gorjeta
   const gorjetaParrafo = document.createElement('p');
   gorjetaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
   gorjetaParrafo.textContent = 'Gorjeta: ';
 
   const gorjetaSpan = document.createElement('span');
   gorjetaSpan.classList.add('fw-normal');
   gorjetaSpan.textContent = `$${gorjeta}`;  
 
   gorjetaParrafo.appendChild(gorjetaSpan);


   //total
   const totalParrafo = document.createElement('p');
   totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
   totalParrafo.textContent = 'Total a pagar: ';
 
   const totalSpan = document.createElement('span');
   totalSpan.classList.add('fw-normal');
   totalSpan.textContent = `$${total}`;  
 
   totalParrafo.appendChild(totalSpan);

   //atualizar total a pagar
   const totalPagarDiv = document.querySelector('.total-pagar');
   if(totalPagarDiv){
    totalPagarDiv.remove();
   }


  divTotais.appendChild(subTotalParrafo);
  divTotais.appendChild(gorjetaParrafo);
  divTotais.appendChild(totalParrafo);

  const formulario = document.querySelector('.formulario > div');
  formulario.appendChild(divTotais);
  
}