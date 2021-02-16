
const host = 'http://localhost:9999/api';

document.addEventListener('DOMContentLoaded', () => {
  const req = new Request(`${host}/produtos`, {
    method: 'GET',
    headers: {
      'x-access-token': localStorage.token,
    },
  });

  const menuErr = document.getElementById('menuErr');
  const divsArr = [];
  const sectionArr = [
    { name: 'meals', foodDivs: [], count: 0 },
    { name: 'snacks', foodDivs: [], count: 0 },
    { name: 'drinks', foodDivs: [], count: 0 },
    { name: 'combos', foodDivs: [], count: 0 },
    { name: 'desserts', foodDivs: [], count: 0 },
  ];

  const pg1 = document.getElementById('page1');
  const prevPg = document.getElementById('prevPg');
  const nextPg = document.getElementById('nextPg');

  const pgsArr = [pg1];
  const pgsId = ['page1'];

  function pagination(pgId, startIndex) {
    sectionArr.forEach((genreSect) => {
      document.getElementById(genreSect.nome).style.display = 'none';
      genreSect.foodDivs.forEach((div) => {
        div.style.display = 'none';
      });
      // 4 Produtos por Secao
      const divSlice = genreSect.foodDivs.slice(startIndex, startIndex + 4);
      divSlice.forEach((div) => {
        document.getElementById(genreSect.nome).style.display = 'block';
        div.style.display = 'block';
      });
    });
    pgsArr.forEach((pg) => {
      pg.className = '';
    });
    if (pgId === 'page1') {
      document.getElementById(pgId).className = 'current';
      prevPg.style.display = 'none';
      nextPg.style.display = 'block';
    } else if (pgId === `page${pgsArr.length}`) {
      prevPg.style.display = 'block';
      nextPg.style.display = 'none';
    } else {
      prevPg.style.display = 'block';
      nextPg.style.display = 'block';
    }
  }

  fetch(req).then((resp) => {
    resp.json().then((res) => {
      if (res.error.message === 'undefined' || res.error.message === 'jwt expired') {
        localStorage.clear();
        window.location.href = 'login';
      }
      if (res.status === 'success') {
        res.products.forEach((comida) => {
          if (comida.disponivel) {
            const {
              comidaId, nome, valor, genero,
            } = comida;

            let { img, descricao } = comida;
            if (img && img.startsWith('uploads')) {
              img = `../${img}`;
            }
            if (descricao === null) {
              descricao = `Delicioso ${nome} feito com os melhores ingredientes`;
            }
            const div = document.createElement('DIV');
            div.className = 'responsive';
            div.id = `${nome}_${genero}`;
            div.innerHTML = `
            <div class="gallery">
              <div class="flip-box">
                <div class="flip-box-inner">
                  <div class="flip-box-front">
                    <img src="${img}" alt="${nome}" id="img${comidaId}">
                  </div>
                  <div class="flip-box-back">
                    <h2>Description:</h2>
                    <p>${descricao}</p>
                  </div>
                </div>
              </div>
              <div class="desc">
                <h1 id="item${comidaId}">${nome}</h1>
                <p class="price" id="price${comidaId}">&#x20a6; ${valor}.00</p>
                <p><span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                </p>
                <p>Selecione a quantidade: 
                  <select id="selectQty${comidaId}">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </p>
                <button class="buyBtn" id="buy${comidaId}">Comprar agora</button>
                <button class="cartBtn" id="btn${comidaId}">Adicionar ao carrinho</button>
              </div>
            </div>`;

            // Dynamically add pages based on no of food items per section
            sectionArr.forEach((genreSect) => {
              if (genreSect.nome === `${genero}s`) {
                genreSect.foodDivs.push(div);
                const { length } = genreSect.foodDivs;
                // 4 food items per section
                if (length !== 1 && (length - 1) % 4 === 0) {
                  const a = document.createElement('a');
                  a.id = `page${((length - 1) / 4) + 1}`;
                  a.textContent = ((length - 1) / 4) + 1;

                  if (pgsId.indexOf(a.id) === -1) {
                    document.getElementById('pgs').appendChild(a);
                    pgsArr.push(a);
                    pgsId.push(a.id);
                  }
                }
              }
            });
            document.getElementById(`${genero}s`).appendChild(div);
            divsArr.push(div);
          }
        });
        pagination('page1', 0);

        // Listen for a click event and display corresponding food items upon click
        pgsArr.forEach((pg) => {
          const { id } = pg;
          document.getElementById(id).onclick = () => {
            // Formula below displays 4 food items per section upon pg click
            pagination(id, (id.slice(-1) ** 2) - ((id.slice(-1) - 2) ** 2));
            pg.className = 'current';
          };
        });

        [...document.getElementsByClassName('pgNav')].forEach((nav) => {
          nav.onclick = () => {
            let id = '';
            pgsArr.forEach((pg) => {
              if (pg.className.includes('current')) {
                if (nav.id === 'prevPg') {
                  id = `page${Number(pg.id.slice(-1)) - 1}`;
                }
                if (nav.id === 'nextPg') {
                  id = `page${Number(pg.id.slice(-1)) + 1}`;
                }
                pagination(id, (id.slice(-1) ** 2) - ((id.slice(-1) - 2) ** 2));
              }
            });
            document.getElementById(id).className = 'current';
          };
        });

        let count = 0;
        const totalFood = divsArr.length;
        const divFoundArr = [];
        const searchFood = document.getElementById('menuSearch');
        searchFood.onkeyup = () => {
          // hide all sections
          [...document.querySelectorAll('section.menu')].forEach((section) => {
            section.style.display = 'none';
          });
          // hide pagination
          document.getElementById('pgsDiv').style.display = 'none';
          divsArr.forEach((div) => {
            const input = searchFood.value.toUpperCase();
            // show only relevant sections and divs
            if (div.id.includes(input)) {
              const index = div.id.indexOf('_');
              document.getElementById(`${div.id.slice(index + 1)}s`).style.display = 'block';
              div.style.display = 'block';
              if (divFoundArr.indexOf(div) === -1) {
                divFoundArr.push(div);
              }
            } else {
              div.style.display = 'none';
              if (divFoundArr.indexOf(div) !== -1) {
                divFoundArr.splice(divFoundArr.indexOf(div), 1);
              }
            }
            count = divFoundArr.length;
            if (count === 0) {
              menuErr.className = 'err';
              menuErr.innerHTML = 'Nenhum produto encontrado';
            } else if (count === 1) {
              menuErr.className = 'success';
              menuErr.innerHTML = `${count} produtos encontrados`;
            } else {
              menuErr.className = 'success';
              menuErr.innerHTML = `${count} produtos encontrados`;
            }
            if (!input) {
              // show pagination
              document.getElementById('pgsDiv').style.display = 'block';
              pagination(pg1.id, 0);
            }
          });
          if (count === totalFood) {
            menuErr.innerHTML = '';
          }
        };
      }
    }).catch((err) => {
      menuErr.innerHTML = err;
    });
  }).catch((fetchErr) => {
    menuErr.innerHTML = `${fetchErr}... Voce esta Offline? Tente novamente em alguns minutos`;
  });
});
