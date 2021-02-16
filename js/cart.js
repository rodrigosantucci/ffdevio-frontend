const localhost = 'http://localhost:9999/api';


/** CARRINHO *** */

const cartTable = document.getElementById('cartTable');
const cartErr = document.getElementById('cartErr');
const checkoutBtn = document.getElementById('checkoutBtn');

const generalModal = document.getElementById('generalModal');
const msg = document.getElementById('generalInfo');
const span1 = document.getElementsByClassName('close')[1]; // Get the <span> element that closes the modal

// Preço total de carrinho
const total = document.getElementById('totalPrice');
const totalItems = document.getElementById('totalItems');
let totalPrice = 0;

// Transferir o array para historico de pedidos
let cartCellArr = [];
let trArr = [];

// Helper function that appends row containing data to table
function appendtoTable(cellArr, tr, tableName) {
  cellArr.forEach((cell) => { // append each cell to td then to tr
    const td = document.createElement('TD'); // create table data
    td.appendChild(cell);
    tr.appendChild(td);
  });
  tableName.appendChild(tr); // append to table
}

function displayModal(modal, close) {
  modal.style.display = 'block';
  // Close the modal when the user clicks on <span> (x)
  close.onclick = () => {
    modal.style.display = 'none';
  };
  // Also close when anywhere in the window is clicked
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

// orders with price for cart manipulation
let pedidos = [];
// Array to send to server
let carrinhoArray = [];
// CartQuantity
let totalQtd = 0;


setTimeout(() => {
  const cartBtns = document.getElementsByClassName('cartBtn');
  // Listen for a click event on each 'Add to Cart' button and append order info to shopping cart
  [...cartBtns].forEach((cartBtn) => {
    cartBtn.addEventListener('click', () => {
      if (!document.getElementById('menuWelcome').textContent.includes('Welcome ')) {
      // open modal asking user to sign up
        msg.innerHTML = ('Por favor <a href="/signup.html"><b>cadastre-se</b></a> ou faça <a href="/login.html"><b>login</b></a> para concluir seu pedido!');
        displayModal(generalModal, span1);
        return;
      }
      const btnID = cartBtn.id;
      const uniqueId = btnID.slice(3);

      const nome = document.getElementById(`item${uniqueId}`).innerHTML;
      const img = document.getElementById(`img${uniqueId}`);
      let quantidade = Number(document.querySelector(`select#selectQty${uniqueId}`).value);
      let valor = document.getElementById(`price${uniqueId}`).innerHTML;
      valor = quantidade * Number(valor.slice(4));

      totalQtd += quantidade;
      totalItems.innerHTML = totalQtd;
      localStorage.setItem('cartCount', `${totalQtd}`);

      pedidos.forEach((pedido) => {
        if (pedido.nome === nome) {
        // remove everything associated with similar order of which updated one will be re-added
          quantidade += pedido.quantidade;
          valor += pedido.valor;
          totalPrice -= pedido.valor;
          const i = pedidos.indexOf(pedido);
          pedidos.splice(i, 1);
          carrinhoArray.splice(i, 1);

          trArr.forEach((tr) => {
            if (tr.textContent.includes(pedido.nome)) {
            // remove row from trArr
              trArr.splice(trArr.indexOf(tr), 1);
              // remove row from cartTable
              cartTable.removeChild(tr);
              // remove row from cartCellArr
              cartCellArr.forEach((cell) => {
                if (cell[1].textContent === pedido.nome) {
                  cartCellArr.splice(cartCellArr.indexOf(cell), 1);
                }
              });
            }
          });
        }
      });
      // Add new or updated item to orders and cartArray
      pedidos.push({ nome, quantidade, valor });
      carrinhoArray.push({ nome, quantidade });

      // cart item quantity update
      let qtd = 0;
      pedidos.forEach((pedido) => {
        if (pedido.nome === nome) {
          qtd = pedido.quantidade;
        }
      });

      totalPrice += Number(valor);
      total.innerHTML = totalPrice.toFixed(2);
      localStorage.setItem('totalPrice', JSON.stringify(totalPrice));

      // Open a modal
      msg.innerHTML = (`<b>${qtd}x ${nome}</b> Adicionado no carrinho`);
      displayModal(generalModal, span1);

      // Create contents for the table data cells in each row
      const cartImg = img.cloneNode();

      cartImg.style.height = '80px';
      cartImg.style.width = '80px';

      const cell1 = document.createTextNode(nome);
      const cell2 = document.createTextNode(quantidade);
      const cell3 = document.createTextNode(valor);

      // Create a cancel order button
      const cancelBtn = document.createElement('BUTTON');
      cancelBtn.className = 'cancelOdr';
      const cancel = document.createTextNode('Remover item');
      cancelBtn.appendChild(cancel);

      const tr = document.createElement('TR');

      const cells = [cartImg, cell1, cell2, cell3, cancelBtn];
      appendtoTable(cells, tr, cartTable);
      // append row to array to be used to delete cart table upon checkout
      trArr.push(tr);
      // Append cells to array to be used to fill orderHistory
      cartCellArr.push(cells);
      localStorage.setItem('orders', JSON.stringify(pedidos));
      localStorage.setItem('cartArray', JSON.stringify(cartCellArr));

      // *** Ao clicar cancelar *** //
      cancelBtn.onclick = () => {
        cartErr.innerHTML = '';
        totalQtd -= quantidade;
        totalItems.innerHTML = totalQtd;
        localStorage.setItem('cartCount', `${totalQtd}`);
        quantity = 0;
        // remove row from cartTable
        cartTable.removeChild(tr);
        // remove row from trArr
        const index = trArr.indexOf(tr);
        // call splice() if indexOf() didn't return -1:
        if (index !== -1) {
          trArr.splice(index, 1);
        }
        // remove linha do carrinho
        cartCellArr.forEach((cell) => {
          if (cell[cell.length - 1].id === cancelBtn.id) {
          // Deletar celula
            cartCellArr.splice(cartCellArr.indexOf(cell), 1);
            // remove linha do pedido e do carrinho
            pedidos.forEach((pedido) => {
              if (pedido.nome === cell[1].textContent) {
                const i = pedidos.indexOf(pedido);
                pedidos.splice(i, 1);
                carrinhoArray.splice(i, 1);
              }
            });
          }
        });

        // atualizar pedidos no local storage
        localStorage.setItem('orders', JSON.stringify(pedidos));
        localStorage.setItem('cartArray', JSON.stringify(carrinhoArray));

        totalPrice -= Number(valor);
        total.innerHTML = totalPrice.toFixed(2);
        localStorage.setItem('totalPrice', JSON.stringify(totalPrice));

        if (totalPrice === 0) {
          checkoutBtn.style.backgroundColor = '#212121';
          checkoutBtn.style.cursor = 'not-allowed';
          checkoutBtn.style.color = 'goldenrod';
          checkoutBtn.style.opacity = 0.6;
        }
      };
    });
  });
}, 1000);

//* **********MODAL**********/
const modal = document.getElementById('modalDiv'); // Get the modal
const cart = document.getElementById('cartInfo'); // Get the cart that opens the modal
const span = document.getElementsByClassName('close')[0]; // Get the <span> element that closes the modal

const endereco = document.getElementById('userAddr');
const telefone = document.getElementById('userPhone');
// Open the modal when the user clicks on the cart,
cart.onclick = () => {
  if (localStorage.getItem('endereco')) {
    endereco.value = localStorage.getItem('address');
  }
  if (localStorage.getItem('telefone')) {
    telefone.value = localStorage.getItem('phone');
  }

  modal.style.display = 'block';
  const condition = Number(total.innerHTML) === 0;

  // Style checkout button
  checkoutBtn.style.cursor = condition ? 'not-allowed' : 'pointer';
  checkoutBtn.style.backgroundColor = condition ? '#212121' : '#2ec371';
  checkoutBtn.style.color = condition ? 'goldenrod' : 'white';
  checkoutBtn.style.opacity = condition ? 0.6 : 1;

  displayModal(modal, span);
};

// Historico de pedidos
const orderHistory = document.getElementById('tableHistory');

// CHECKOUT BUTTON
checkoutBtn.onclick = () => {
  if (!endereco.value || endereco.value === '') {
    cartErr.innerHTML = 'Por favor preencha com o endereco da entrega';
    return;
  }
  if (!telefone.value || telefone.value === '') {
    cartErr.innerHTML = 'Por favor preencha com o telefone de contato';
    return;
  }
  cartErr.innerHTML = '';
  if (totalPrice > 0) {
    if (!pedidos) {
      pedidos = JSON.parse(localStorage.pedidos);
    }

    if (!carrinhoArray) {
      carrinhoArray = JSON.parse(localStorage.carrinhoArray);
    }

    const req = new Request(`${localhost}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.token,
      },
      body: JSON.stringify({ carrinhoArray, endereco: endereco.value, telefone: telefone.value }),
    });
    fetch(req).then((resp) => {
      resp.json().then((res) => {
        if (res.error) {
          msg.innerHTML = `<p style="color: red">Error: ${res.error.message || res.error}</p>`;
          displayModal(generalModal, span1);
        } else if (res.status === 'fail') {

          cartErr.innerHTML = `<p>${res.message}</p>`;
        } else if (res.status === 'success') {
          let i = 0;
          const { pedidoId, usuarioId, comida } = res.pedido;
          msg.innerHTML = `<span style="color: green"><b>${res.message}!</b></span>
          <h4 style="text-decoration: underline"> Detalhes de seu pedido: </h4>
          <p><span style="color: blue">Pedido ID</span>: <b>#${usuarioId}FFF${pedidoId}</b></p>`;

          comida.forEach((item) => {
            const { nome, quantidade } = item;
            i += 1;
            const p = document.createElement('P');
            p.innerHTML = `<span style="color: blue">Food${i}</span>: <b>${quantidade}x ${nome}</b>`;
            msg.appendChild(p);
          });

          const div = document.createElement('DIV');
          div.innerHTML = `  
          <p><span style="color: blue">Quantidade Total</span>: <b>${res.pedido.quantidade}</b></p>
          <p><span style="color: blue">Valor</span>: <b>&#x20a6; ${res.pedido.valor}.00</b></p>
          <br>Contataremos o numero de telefone: <b>${telefone.value}</b> ou Email: <b>${localStorage.email}</b> com mais detalhes`;
          

          msg.appendChild(div);
          displayModal(generalModal, span1);

          totalPrice = 0;
          total.innerHTML = totalPrice.toFixed(2);
          // Remove rows from cart table
          trArr.forEach(((tr) => {
            cartTable.removeChild(tr); // remove row from table
          }));
          // Clear trArr
          trArr = [];

          // Record order in order history table
          cartCellArr.forEach((cells) => {
            // Add date as first element in cell
            const date = document.createTextNode(`${new Date()}`);
            cells.unshift(date);
            cells.pop();
            const trHist = document.createElement('TR');
            appendtoTable(cells, trHist, orderHistory);
          });
          // Reset data
          cartCellArr = [];
          pedidos = [];
          cartArray.length = 0;
          totalQtd = 0;
          totalItems.innerHTML = 0;
          localStorage.removeItem(pedidos);
          localStorage.removeItem(carrinhoArray);
          // Style button
          checkoutBtn.style.backgroundColor = '#212121';
          checkoutBtn.style.cursor = 'not-allowed';
          checkoutBtn.style.color = 'goldenrod';
          checkoutBtn.style.opacity = 0.6;
        }
      }).catch((err) => {
        console.error('Erro ao efetuar pedido:', err);
      });
    }).catch(fetchErr => console.error('fetcherr:', fetchErr));
  }
};
