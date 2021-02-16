
// BARRA LATERAL
const open = document.getElementById('openBtn');
const close = document.getElementById('closeBtn');

function toggleSideNav(width) {
  document.getElementById('mySidenav').style.width = width;
  document.getElementById('main').style.marginLeft = width;
}

open.onclick = () => {
  toggleSideNav('250px');// 0,0,0,0.4
};

close.onclick = () => {
  toggleSideNav('0');
};

window.onclick = (event) => {
  if (event.target !== open) {
    toggleSideNav('0');
  }
};

// Modal display
const generalAdminModal = document.getElementById('generalAdminModal');
const modalTxt = document.getElementById('generalInfo');
const span0 = document.getElementsByClassName('close')[0];
const yes = document.getElementById('yes');
const no = document.getElementById('no');
// Display modal
function displayModal(modal, span) {
  modal.style.display = 'block';
  // Close the modal when the user clicks on <span> (x)
  span.onclick = () => {
    modal.style.display = 'none';
  };
  no.onclick = () => {
    modal.style.display = 'none';
  };
  // Also close when anywhere in the window is clicked
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

// Filter table according to order column value
const search = document.getElementById('orderSearch');

search.onkeyup = () => {
  const table = document.getElementById('adminOrdersTable');
  const tRows = table.getElementsByTagName('tr');

  [...tRows].slice(1).forEach((tr) => {
    const input = search.value.toUpperCase();
    if (tr.textContent.includes(input)) {
      tr.style.display = '';
    } else {
      tr.style.display = 'none';
    }
  });
};

const host = 'http://localhost:9999/api';


document.addEventListener('DOMContentLoaded', () => {
  // ============================================================================================ //
  /** ************************************ MANAGE ORDERS ************************************* */
  // ============================================================================================ //
  let req = {};

  const ordersMsg = document.getElementById('manageOrdersMsg');
  const manageMenuMsg = document.getElementById('manageMenuMsg');

  const getOrdersBtn = document.getElementById('getOrders');
  getOrdersBtn.onclick = () => {
    req = new Request(`${host}/pedidos`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.token,
      },
    });
    fetch(req).then((resp) => {
      resp.json().then((res) => {
        ordersMsg.className = 'err';
        ordersMsg.innerHTML = res.message;
        const { status, data } = res;
        if (status === 'success') {
          ordersMsg.className = 'success';
          data.pedidos.forEach((order) => {
            const {
              pedidoId, usuarioId, comida, quantidade, valor,
            } = pedido;

            let odrStatus = pedido.status;

            const pedidoIdCell = document.createTextNode(`#${usuarioId}FFF${pedidoId}`);
            const comidaCell = document.createTextNode(comida);
            const qtdCell = document.createTextNode(quantidade);
            const valorCell = document.createTextNode(valor);
            const statusCell = document.createTextNode(odrStatus);
            statusCell.id = `status${pedidoId}`;
            const date1Cell = document.createTextNode(order.criado_dat.slice(0, 19));
            const date2Cell = document.createTextNode(order.modificado_dat.slice(0, 19));

            const approveBtn = document.createElement('BUTTON');
            approveBtn.className = 'approveBtn';
            approveBtn.id = `approveBtn${pedidoId}`;
            const approveTxt = document.createTextNode('Aprovar pedido');
            approveBtn.appendChild(approveTxt);

            const declineBtn = document.createElement('BUTTON');
            declineBtn.className = 'declineBtn';
            declineBtn.id = `declineBtn${pedidoId}`;
            const declineTxt = document.createTextNode('Rejeitar pedido');
            declineBtn.appendChild(declineTxt);

            const input = document.createElement('INPUT');
            input.className = 'checkbox';
            input.id = `checkbox${pedidoId}`;
            input.type = 'checkbox';
            input.style.cursor = 'pointer';

            const cellArr = [
              pedidoIdCell, comidaCell, qtdCell, valorCell, statusCell,
              date1Cell, date2Cell, approveBtn, declineBtn, input,
            ];
            const tr = document.createElement('TR');
            tr.className = 'orderRow';

            const tbody = document.getElementById('adminOrdersTableBody');
            cellArr.forEach((cell) => {
              const td = document.createElement('TD');
              td.appendChild(cell);
              tr.appendChild(td);
            });

            const styleComplete = () => {
              tr.style.backgroundColor = 'greenyellow';
              approveBtn.style.opacity = 0.5;
              approveBtn.style.cursor = 'not-allowed';
              declineBtn.style.opacity = 0.5;
              declineBtn.style.cursor = 'not-allowed';
              input.style.cursor = 'not-allowed';
              input.checked = true;
              input.disabled = true;
            };
            const styleProcessing = () => {
              tr.style.backgroundColor = 'goldenrod';
              approveBtn.style.opacity = 0.5;
              approveBtn.style.cursor = 'not-allowed';
            };
            const styleCancelled = () => {
              tr.style.backgroundColor = 'rgb(247, 134, 134)';
              approveBtn.style.opacity = 0.5;
              approveBtn.style.cursor = 'not-allowed';
              declineBtn.style.opacity = 0.5;
              declineBtn.style.cursor = 'not-allowed';
              input.style.cursor = 'not-allowed';
              input.disabled = true;
            };

            if (odrStatus === 'Processando') {
              styleProcessing();
            } else if (odrStatus === 'Cancelado') {
              styleCancelled();
            } else if (odrStatus === 'Pronto') {
              styleComplete();
            }
            tbody.appendChild(tr);
            
            const pedidosId = `#${usuarioId}FFF${pedidoId}`;
            /** BTN APROVAR PEDIDO */
            approveBtn.onclick = () => {
              if (odrStatus === 'Novo') {
                modalTxt.innerHTML = `Tem certeza que deseja aprovar o pedido ${pedidosId}?`;
                displayModal(generalAdminModal, span0);
                yes.onclick = () => {
                  const updateReq = new Request(`${host}/pedidos/${pedidoId}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-access-token': localStorage.token,
                    },
                    body: JSON.stringify({ status: 'Processando' }),
                  });
                  fetch(updateReq).then((upResp) => {
                    upResp.json().then((upRes) => {
                      if (upRes.status === 'success') {
                        ordersMsg.className = 'success';
                        ordersMsg.innerHTML = `${pedidoIdCell.textContent} ${upRes.message}`;
                        odrStatus = upRes.pedido.status;
                        statusCell.textContent = odrStatus;
                        date2Cell.textContent = upRes.pedidos.modificado_dat;
                        styleProcessing();
                      } else {
                        ordersMsg.className = 'err';
                        ordersMsg.innerHTML = upRes.message;
                        if (upRes.message === 'undefined' || upRes.message === 'jwt expired') {
                          localStorage.clear();
                          window.location.href = 'login';
                        }
                      }
                    }).catch(resErr => console.log('res err:', resErr));
                  }).catch(fetchErr => console.log('fetch err:', fetchErr));
                  generalAdminModal.style.display = 'none';
                };
              }
            };

            /** Reieitar Pedido BTN */
            declineBtn.onclick = () => {
              if (odrStatus === 'Novo' || odrStatus === 'Preparando') {
                modalTxt.innerHTML = `Tem certeza que deseja rejeitar o pedido: ${pedidosId}?
                <p><textarea id="cancelReason" placeholder="Por favor insira um motivo para o cancelamento..."></textarea></p>
                <p>Voce nao pode reverter esta ação</p>
                <div class="err" id="cancelErr"></div>`;
                displayModal(generalAdminModal, span0);
                yes.onclick = () => {
                  const reason = document.getElementById('cancelReason').value;
                  if (!reason || !reason.trim()) {
                    document.getElementById('cancelErr').textContent = 'Por favor insira um motivo para o cancelamento.';
                    return;
                  }
                  const updateReq = new Request(`${host}/pedidos/${pedidoId}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-access-token': localStorage.token,
                    },
                    body: JSON.stringify({ status: 'Cancelado', reason: reason.trim() }),
                  });
                  fetch(updateReq).then((upResp) => {
                    upResp.json().then((upRes) => {
                      if (upRes.status === 'success') {
                        ordersMsg.className = 'success';
                        ordersMsg.innerHTML = `${pedidoIdCell.textContent} ${upRes.message}`;
                        odrStatus = upRes.pedidos.status;
                        statusCell.textContent = odrStatus;
                        date2Cell.textContent = upRes.pedidos.modificado_dat;
                        styleCancelled();
                      } else {
                        ordersMsg.className = 'err';
                        ordersMsg.innerHTML = upRes.message;
                      }
                    }).catch(resErr => console.log('res err:', resErr));
                  }).catch(fetchErr => console.log('fetch err:', fetchErr));
                  generalAdminModal.style.display = 'none';
                };
              }
            };

            /** CHECKBOX INPUT */
            input.onclick = () => {
              input.checked = false;
              modalTxt.innerHTML = `Voce tem certeza se o pedido ${pedidosId} esta Pronto?
              <p>Voce nao poderá reverter essa acao</p>`;
              displayModal(generalAdminModal, span0);
              yes.onclick = () => {
                const updateReq = new Request(`${host}/pedidos/${pedidoId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.token,
                  },
                  body: JSON.stringify({ status: 'COMPLETE' }),
                });

                fetch(updateReq).then((upResp) => {
                  upResp.json().then((upRes) => {
                    if (upRes.status === 'success') {
                      ordersMsg.className = 'success';
                      ordersMsg.innerHTML = `${pedidoIdCell.textContent} ${upRes.message}`;
                      odrStatus = upRes.pedidos.status;
                      statusCell.textContent = odrStatus;
                      date2Cell.textContent = upRes.pedidos.modificado_dat;
                      styleComplete();
                    } else {
                      ordersMsg.className = 'err';
                      ordersMsg.innerHTML = upRes.message;
                      if (upRes.message === 'undefined' || upRes.message === 'jwt expired') {
                        localStorage.clear();
                        window.location.href = 'login';
                      }
                    }
                  }).catch(resErr => console.log('res err:', resErr));
                }).catch(fetchErr => console.log('fetch err:', fetchErr));
                generalAdminModal.style.display = 'none';
              };
            };
            // NEXT
          });
        } else if (status === 'fail') {
          ordersMsg.className = 'err';
          ordersMsg.innerHTML = res.message;
          if (res.message === 'undefined' || res.message === 'jwt expired') {
            localStorage.clear();
            window.location.href = 'login';
          }
        }
      }).catch(err => console.error('resp json error:', err));
    }).catch(fetchErr => console.error('fetch err:', fetchErr));
    document.getElementById('manageOrdersDiv').style.display = 'block';
    // SHOW ONLY ORDER TABLE
    manageMenuMsg.innerHTML = '';
    document.getElementById('allStats').style.display = 'none';
    document.getElementById('allFood').style.display = 'none';
    document.getElementById('allOrders').style.display = 'block';
  };

  // ============================================================================================ //
  /** ************************************ ADD comida TO MENU ************************************ */
  // ============================================================================================ //
  const addForm = document.getElementById('addForm');
  const createMenuLink = document.getElementById('createMenu');
  const createMenuModal = document.getElementById('createMenuModal');
  const span1 = document.getElementsByClassName('close')[1];
  const addBtnInput = document.getElementById('addBtn');
  const menuMsg = document.getElementById('createMenuMsg');

  createMenuLink.onclick = () => {
    displayModal(createMenuModal, span1);
    toggleSideNav('0');
  };

  addBtnInput.onclick = () => {
    const formData = new FormData(addForm);

    req = new Request(`${host}/produtos`, {
      method: 'POST',
      headers: {
        'x-access-token': localStorage.token,
      },
      body: formData,
    });
    fetch(req).then((resp) => {
      resp.json().then((res) => {
        if (res.status === 'success') {
          menuMsg.className = 'success';
        } else {
          menuMsg.className = 'err';
        }
        if (res.error && res.error.includes('Nao foi possivel encontrar \'path\'')) {
          menuMsg.className = 'err';
          menuMsg.innerHTML = 'Por favor insira uma imagem para o produto.';
          return;
        }
        if (res.error && res.error.includes('duplicate')) {
          menuMsg.className = 'err';
          menuMsg.innerHTML = 'Produto ja existente!';
          return;
        }
        if (res.error === 'undefined' || res.error === 'jwt expired') {
          localStorage.clear();
          window.location.href = 'login.html';
        }
        if (res.error) {
          menuMsg.className = 'err';
          menuMsg.innerHTML = 'Server Error. Tente novamente em alguns minutos.';
          return;
        }
        menuMsg.innerHTML = res.message;
      }).catch((err) => {
        menuMsg.innerHTML = err.message;
        menuMsg.className = 'err';
      });
    }).catch(fetchErr => `Server Error: ${fetchErr}. Tente novamente em alguns minutos.`);
  };

  // ============================================================================================ //
  /** ************************************ MANAGE MENU ITEMS ************************************ */
  // ============================================================================================ //
  // Filter table according to order column value
  const searchMenu = document.getElementById('menuSearchInp');

  searchMenu.onkeyup = () => {
    const table = document.getElementById('adminMenuTable');
    const tRows = table.getElementsByTagName('tr');

    [...tRows].slice(1).forEach((tr) => {
      if (tr.textContent.toUpperCase().includes(searchMenu.value.toUpperCase())) {
        tr.style.display = '';
      } else {
        tr.style.display = 'none';
      }
    });
  };

  const getMenuBtn = document.getElementById('getMenu');

  getMenuBtn.onclick = () => {
    toggleSideNav('0');
    req = new Request(`${host}/produtos`, {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.token,
      },
    });
    fetch(req).then((resp) => {
      resp.json().then((res) => {
        manageMenuMsg.className = 'success';
        manageMenuMsg.innerHTML = res.message;
        const { status, products } = res;
        if (status === 'success') {
          manageMenuMsg.className = 'success';
          products.forEach((comida) => {
            const { comidaId } = comida;
            let {
              name, valor, genero, img, disponivel, descricao,
            } = comida;

            const comidaIdCell = document.createTextNode(`#${comidaId}`);
            const nameCell = document.createTextNode(name);
            const valorCell = document.createTextNode(valor);
            const generoCell = document.createTextNode(genero);
            const availableCell = document.createTextNode(disponivel);
            const date1Cell = document.createTextNode(comida.criado_dat.slice(0, 19));
            const date2Cell = document.createTextNode(comida.modificado_dat.slice(0, 19));

            const editBtn = document.createElement('BUTTON');
            editBtn.className = 'approveBtn';
            editBtn.id = `editBtn${comidaId}`;
            const editTxt = document.createTextNode('Edit Item');
            editBtn.appendChild(editTxt);

            const deleteBtn = document.createElement('BUTTON');
            deleteBtn.className = 'declineBtn'
            deleteBtn.id = `deleteBtn${comidaId}`;
            const delTxt = document.createTextNode('Delete Item');
            deleteBtn.appendChild(delTxt);

            const cellArr = [
              comidaIdCell, nameCell, valorCell, generoCell,
              availableCell, date1Cell, date2Cell, editBtn, deleteBtn,
            ];
            const tr = document.createElement('TR');
            tr.className = 'menuRow';

            const tbody = document.getElementById('adminMenuTableBody');
            cellArr.forEach((cell) => {
              const td = document.createElement('TD');
              td.appendChild(cell);
              tr.appendChild(td);
            });
            tbody.appendChild(tr);

            const editModal = document.getElementById('editMenuModal');
            const span2 = document.getElementsByClassName('close')[2];

            /** EDIT BTN */
            editBtn.onclick = () => {
              const imgDiv = document.querySelector('#origImg');
              imgDiv.innerHTML = `<a href="${img}" target="_blank"><img src="${img}" alt="${nome}" style="height: 100px; width:100px;"></a>`;

              document.querySelector('#editForm #name').value = nome;
              document.querySelector('#editForm #valor').value = valor;
              document.querySelector('#editForm #genero').value = genero;
              document.querySelector('#editForm #disponivel').value = disponivel;
              document.querySelector('#editForm #descricao').value = descricao;

              document.getElementById('editModalTitle').innerHTML = `<h1>Edit comida #${comidaId}</h1>`;
              displayModal(editModal, span2);

              const saveBtn = document.getElementById('saveBtn');
              saveBtn.onclick = () => {
                nome = document.querySelector('#editForm #name').value;
                valor = document.querySelector('#editForm #valor').value;
                genero = document.querySelector('#editForm #genero').value;
                disponivel = document.querySelector('#editForm #disponivel').value;
                descricao = document.querySelector('#editForm #descricao').value;

                const editForm = document.getElementById('editForm');
                const imgURL = document.querySelector('#editForm #imgURL');
                const imgUpload = document.querySelector('#editForm #img');
                const editMenuMsg = document.getElementById('editMenuMsg');

                if (imgURL.value && imgUpload.files[0]) {
                  editMenuMsg.className = 'err';
                  editMenuMsg.innerHTML = 'Faca Upload OU insira uma URL';
                  return;
                }

                if (imgURL.value) {
                  img = imgURL.value;
                }
                let headers = {
                  'Content-Type': 'application/json',
                  'x-access-token': localStorage.token,
                };
                let body = JSON.stringify({
                  name, valor, genero, disponivel: disponivel, img, descricao,
                });

                if (imgUpload.files[0]) {
                  headers = {
                    'x-access-token': localStorage.token,
                  };
                  body = new FormData(editForm);
                }
                req = new Request(`${host}/produtos/${comidaid}`, {
                  method: 'PUT',
                  headers,
                  body,
                });
                fetch(req).then((editResp) => {
                  editResp.json().then((editRes) => {
                    editMenuMsg.innerHTML = '';
                    if (editRes.status === 'success') {
                      editMenuMsg.className = 'success';
                      imgDiv.innerHTML = `<a href="${editRes.comida.img}" target="_blank"><img src="${editRes.comida.img}" alt="${editRes.comida.nome}" style="height: 100px; width:100px;"></a>`;
                      nameCell.textContent = editRes.comida.nome;
                      valorCell.textContent = editRes.comida.valor;
                      generoCell.textContent = editRes.comida.genero;
                      availableCell.textContent = editRes.comida.disponivel;
                      date2Cell.textContent = editRes.comida.modificado_dat;
                    } else {
                      editMenuMsg.className = 'err';
                    }
                    editMenuMsg.innerHTML = editRes.message;
                  }).catch((resErr) => {
                    editMenuMsg.innerHTML = `Server error: ${resErr}. Tente novamente em alguns instantes`;
                  });
                }).catch((fetchErr) => {
                  editMenuMsg.innerHTML = `Error: ${fetchErr}. Voce esta offline? Tente novamente em alguns instantes`;
                });
              };
            };

            /** DELETE BTN */
            deleteBtn.onclick = () => {
              modalTxt.innerHTML = `Tem certeza que deseja deletar ${name} (ID #${comidaId})?
                <p>Essa ação nao poderá ser desfeita!</p>`;
              displayModal(generalAdminModal, span0);
              yes.onclick = () => {
                req = new Request(`${host}/produtos/${comidaId}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.token,
                  },
                });
                fetch(req).then((delResp) => {
                  delResp.json().then((delRes) => {
                    if (delRes.status === 'success') {
                      tbody.removeChild(tr);
                      manageMenuMsg.className = 'success';
                    } else {
                      manageMenuMsg.className = 'err';
                    }
                    manageMenuMsg.innerHTML = delRes.message;
                  }).catch((resErr) => {
                    manageMenuMsg.innerHTML = `Server error: ${resErr}. Tente novamente em alguns instantes`;
                  });
                }).catch((fetchErr) => {
                  manageMenuMsg.innerHTML = `Error: ${fetchErr}. voce esta offline? Tente novamente em alguns instantes`;
                });
                generalAdminModal.style.display = 'none';
              };
            };
            // NEXT
          });
        } else if (status === 'fail') {
          manageMenuMsg.className = 'err';
          manageMenuMsg.innerHTML = res.message;
          if (res.message === 'undefined' || res.message === 'jwt expired') {
            localStorage.clear();
            window.location.href = 'login';
          }
        }
      }).catch(err => console.error('resp json error:', err));
    }).catch(fetchErr => console.error('fetch err:', fetchErr));
    // SHOW TABLE
    ordersMsg.innerHTML = '';
    document.getElementById('allStats').style.display = 'none';
    document.getElementById('allOrders').style.display = 'none';
    document.getElementById('allFood').style.display = 'block';
  };

  document.getElementById('viewStats').onclick = () => {
    toggleSideNav('0');
    document.getElementById('allOrders').style.display = 'none';
    document.getElementById('allFood').style.display = 'none';
    document.getElementById('allStats').style.display = 'block';
  };
});
