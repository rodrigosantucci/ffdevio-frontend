// CONSUME SIGNUP ENDPOINT
const signupBtn = document.getElementById('signupBtn');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const senha = document.getElementById('senha');
const password2 = document.getElementById('password2');

const usernameErr = document.querySelector('div#usernameErr');
const emailErr = document.querySelector('div#emailErr');
const passwordErr = document.querySelector('div#passwordErr');
const password2Err = document.querySelector('div#password2Err');

/**
 * isValidPassword method
 * @param {string} senha
 * @returns {string} true or error messages
 */
function isValidPassword(value) {
  if (!/[a-z]/.test(value)) {
    return 'Your password must contain at least one lowercase letter';
  } if (!/[A-Z]/.test(value)) {
    return 'Your password must contain at least one uppercase letter';
  } if (!/\d/.test(value)) {
    return 'Your password must contain at least one number';
  } if (!/[@$!%*?&]/.test(value)) {
    return 'Your password must contain at least one of these special characters: @, $, !, %, *, ?, &';
  } if (value.length < 6) {
    return 'Your password must be composed of at least 6 characters';
  }
  return 'true';
}

name.onchange = () => {
  password2Err.innerHTML = '';
};
email.onchange = () => {
  emailErr.innerHTML = /\S+@\S+\.\S+/.test(email.value) ? '' : 'Por favor, entre com um endereco de email ou nome válidos.';
  usernameErr.innerHTML = '';
  password2Err.innerHTML = '';
};
password.onchange = () => {
  passwordErr.innerHTML = isValidPassword(senha.value) === 'true' ? '' : isValidPassword(senha.value);
  password2Err.innerHTML = password2.value === senha.value ? '' : 'Senhas não conferem';
};
password2.oninput = () => {
  password2Err.innerHTML = password2.value === senha.value ? '' : 'Senhas não conferem';
};

signupBtn.onmouseover = () => {
  if (emailErr.innerHTML !== '' || passwordErr.innerHTML !== '' || password2Err.innerHTML !== '') {
    signupBtn.style.opacity = 0.6;
  } else {
    signupBtn.style.opacity = 1;
    signupBtn.style.cursor = 'pointer';
  }
};

const localhost = 'http://localhost:9999/api';



signupBtn.onclick = () => {
  if (emailErr.innerHTML !== '' || passwordErr.innerHTML !== '' || password2Err.innerHTML !== '') {
    usernameErr.innerHTML = 'Por favor verifique os erros em vermelho.';
  } else {
    const nome = nome.value;
    usernameErr.innerHTML = '';
    const req = new Request(`${localhost}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // mode: 'no-cors',
      body: JSON.stringify({ nome, email: email.value, senha: senha.value }),
    });
    fetch(req).then(resp => resp.json().then((res) => {
      if (res.status === 'fail') {
        password2Err.innerHTML = res.message;
      }
      if (res.status === 'success' && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('nome', res.usuarios.nome);
        localStorage.setItem('endereco', res.usuarios.endereco);
        localStorage.setItem('telefone', res.usuarios.telefone);
        localStorage.setItem('id', res.usuarios.usuarioId);

        password2Err.innerHTML = `<span style='color: greenyellow'>${res.message}</span>`;

        if (res.usuarios.perfil === 'admin') {
          setTimeout(() => {
            localStorage.setItem(res.usuarios.nome, 'an');
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
        usernameErr.innerHTML = `Error: ${fetchErr}... Offline?`;
      }));
  }
};
