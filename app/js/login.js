
// CONSUME LOGIN ENDPOINT
const loginBtn = document.getElementById('loginBtn');
const userField = document.getElementById('nomeEmail');
const passwordField = document.getElementById('senha');

const usernameErr = document.querySelector('div#usernameErr');
const emailErr = document.querySelector('div#emailErr');
const passwordErr = document.querySelector('div#passwordErr');
const password2Err = document.querySelector('div#password2Err');

loginBtn.onmouseover = () => {
  if (!userField.value || !passwordField.value || emailErr.innerHTML !== '' || passwordErr.innerHTML !== '' || password2Err.innerHTML !== '') {
    loginBtn.style.opacity = 0.6;
  } else {
    loginBtn.style.opacity = 1;
  }
};

const localhost = 'http://localhost:9999/api';


loginBtn.onclick = () => {
  const nomeEmail = userField.value;
  const senha = passwordField.value;

  if (!nomeEmail.trim() || !senha.trim()) {
    password2Err.innerHTML = 'Preencha todos os campos';
    return;
  }
  password2Err.innerHTML = '';
  if (emailErr.innerHTML !== '' || passwordErr.innerHTML !== '' || password2Err.innerHTML !== '') {
    usernameErr.innerHTML = 'Por favor, verifique os erros abaixo';
  } else {
    usernameErr.innerHTML = '';
   // const nomeEmail = document.getElementById('nomeEmail').value;
    const req = new Request(`${localhost}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nomeEmail, senha }),
    });
    fetch(req).then(resp => resp.json().then((res) => {
      if (res.status === 'fail') {
        password2Err.innerHTML = res.message;
      }
      if (res.status === 'success' && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.usuarios.nome);
        localStorage.setItem('address', res.usuarios.endereco);
        localStorage.setItem('phone', res.usuarios.telefone);
        localStorage.setItem('email', res.usuarios.email);
        localStorage.setItem('id', res.usuarios.usuarioId);

        password2Err.innerHTML = `<span style='color: greenyellow'>${res.message}...Redirecionando...</span>`;
        if (res.usuarios.perfil === 'admin') {
          localStorage.setItem(res.usuarios.nome, 'an');
          setTimeout(() => {
            window.location.href = 'admin.html';
          }, 100);
          return;
        }
        setTimeout(() => {
          window.location.href = 'userMenu.html';
        }, 100);
      }
    }).catch((err) => {
      password2Err.innerHTML = err.message;
    }))
      .catch(((fetchErr) => {
        usernameErr.innerHTML = fetchErr;
      }));
  }
};
