
const local = 'http://localhost:9999/api';


const buyBtns = document.getElementsByClassName('buyBtn');

const genModal = document.getElementById('generalModal');
const info = document.getElementById('generalInfo');
const close = document.getElementsByClassName('close')[1]; // Get the <span> element that closes the modal

function displayModal(modal, spanClass) {
  modal.style.display = 'block';
  // Close the modal when the user clicks on <span> (x)
  spanClass.onclick = () => {
    modal.style.display = 'none';
  };
  // Also close when anywhere in the window is clicked
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

//Compra rapida - User Stories
setTimeout(() => {
  [...buyBtns].forEach((buyBtn) => {
    buyBtn.addEventListener('click', () => {
      if (!document.getElementById('menuWelcome').textContent.includes('Bem-vindo(a) ')) {
        //Fazer um cadastro
        info.innerHTML = ('Faca o <a href="/signup.html"><b>Cadastro</b></a> ou <a href="/login.html"><b>Login</b></a> para continuar esta compra.');
        displayModal(genModal, close);
        return;
      }

      const btnID = buyBtn.id;
      const uniqueId = btnID.slice(3);

      const nome = document.getElementById(`item${uniqueId}`).innerHTML;
      const quantidade = Number(document.querySelector(`select#selectQty${uniqueId}`).value);
      let valor = document.getElementById(`valor${uniqueId}`).innerHTML;
      valor = quantidade * Number(valor.slice(4));

      // Open a modal
      info.innerHTML = `Por favor preencha os dados do pedido, e verifique o pedido: 
      <b>${quantidade}x ${nome}</b> for <b>&#x20a6; ${valor}.00</b>
          <p><b>Endereco: <input type="text" placeholder="Por favor insira o endereco para entrega" id="buyNowAddr"></b></p>
          <p><b>Telefone: <input type="number" placeholder="Por favor insira o telefone para contato" id="buyNowPhone"></b></p>

          <p class="err" id="buyErr"><p>
          <button id="buyCheckoutBtn">Finalizar Pedido</button>`;

      const endereco = document.getElementById('buyNowAddr');
      const telefone = document.getElementById('buyNowPhone');
      if (localStorage.endereco) {
        address.value = localStorage.getItem('endereco');
      }
      if (localStorage.telefone) {
        phone.value = localStorage.getItem('telefone');
      }

      displayModal(genModal, close);

      document.getElementById('buyCheckoutBtn').onclick = () => {
        const buyErr = document.getElementById('buyErr');
        buyErr.innerHTML = '';
        if (!address.value || address.value === 'null') {
          buyErr.innerHTML = 'Por favor insira o endereco de entrega';
          return;
        }
        if (!phone.value || phone.value === 'null') {
          buyErr.innerHTML = 'Por favor insira o telefone para contato';
          return;
        }

        const req = new Request(`${local}/pedidos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.token,
          },
          body: JSON.stringify({
            nome, quantidade, endereco: endereco.value, telefone: telefone.value,
          }),
        });
        fetch(req).then((resp) => {
          resp.json().then((res) => {
            if (res.error) {
              info.innerHTML = `<p style="color: red">Error: ${res.error.message || res.error}</p>`;
              displayModal(genModal, close);
            } else if (res.status === 'fail') {
              buyErr.innerHTML = `<p>${res.message}</p>`;
            } else if (res.status === 'success') {
              info.innerHTML = `<span style="color: green"><b>${res.message}!</b></span>
              <h4 style="text-decoration: underline"> Detalhes do seu pedido: </h4>
              <p><span style="color: blue">Pedido ID</span>: <b>#${res.pedido.usuarioId}FFF${res.pedido.pedidoId}</b></p>
              <span style="color: blue">Produto</span>: <b>${res.pedido.comida}</b>
              <p><span style="color: blue">Quantidade</span>: <b>${res.pedido.quantidade}</b></p>
              <p><span style="color: blue">Valor</span>: <b>&#x20a6; ${res.pedido.valor}.00</b></p>
              <br>Entraremos em contato em breve <b>${telefone.value}</b> or <b>${localStorage.email}</b> com mais detalhes. `;

              displayModal(genModal, close);
            }
          }).catch((err) => {
            buyErr.innerHTML = `Server error: ${err.message}. Tente novamente em breve`;
          });
        }).catch((fetchErr) => {
          buyErr.innerHTML = `Server Error: ${fetchErr.message}. Tente novamente em breve`;
        });
      };
    });
  });
}, 1000);
