const host = 'http://localhost:9999/api';


document.addEventListener('DOMContentLoaded', () => {
  const usuarioId = localStorage.id;
  const req = new Request(`${host}/usuarios/${usuarioId}/pedidos`, {
    method: 'GET',
    headers: {
      'x-access-token': localStorage.token,
    },
  });

  fetch(req).then((resp) => {
    resp.json().then((res) => {
      const { message, pedidos } = res;
      if (message === 'Pedidos selecionados com sucesso') {
        pedidos.forEach((pedido) => {
          const {
            pedidoId, comida, quantidade, valor, status,
          } = pedido;

          const orderIdCell = document.createTextNode(`#${usuarioId}FFF${pedidoId}`);
          const foodCell = document.createTextNode(comida);
          const qtyCell = document.createTextNode(quantidade);
          const priceCell = document.createTextNode(valor);
          const statusCell = document.createTextNode(status);
          const dateCell = document.createTextNode(pedido.criado_dat.slice(0, 19));

          const cellArr = [
            orderIdCell, foodCell, qtyCell, priceCell, statusCell, dateCell,
          ];
          const tr = document.createElement('TR');

          const tbody = document.getElementById('histTableBody');
          cellArr.forEach((cell) => { // append each cell to td then to tr
            const td = document.createElement('TD'); // create table data
            td.appendChild(cell);
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
      } else {
        const msg = document.getElementById('msg');
        msg.innerHTML = `<h3><b>Voce nao possui nenhum pedido ainda.</b></h3>
        <p>Proceed to <a href='/userMenu.html'>menu</a> para iniciar</p>`;
      }
    }).catch(err => console.error('resp json error:', err));
  }).catch(fetchErr => console.error('fetch err:', fetchErr));
});
