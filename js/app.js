let cliente = {
  mesa: '',
  hora: '',
  pedido: []
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

}