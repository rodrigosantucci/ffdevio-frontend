document.addEventListener('DOMContentLoaded', () => {
  const meArr = document.getElementsByClassName('me');
  const nome = localStorage.getItem('username');
  if (nome) {
    meArr[0].innerHTML = `<i class="fa fa-user fa-1x" style="padding: 0;" aria-hidden="true"></i> ${nome}`;
    if (meArr.length > 1) {
      [...meArr].slice(1).forEach((me) => {
        me.textContent = nome;
      });
    }
  }
  const content = document.getElementsByClassName('dropdown-content')[1];

  if (localStorage.getItem(nome) && localStorage.getItem(nome) === 'an') {
    content.innerHTML = '<a href="admin.html">Gerenciamento</a><a href="history.html">Ver Pedidos</a>';
  } else {
    content.innerHTML = '<a href="history.html">Histórico de pedidos</a>';
  }
});

// Logout
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});
