// ===== CONFIGURAÇÃO =====
const WHATSAPP = '5521983522793'; // 55 (Brasil) + 21 (DDD) + número

// ===== MENU DO CELULAR =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuToggle.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
  })
);

// ===== TOPO MUDA AO ROLAR =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== ELEMENTOS APARECEM AO ROLAR =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== CONTADORES ANIMADOS =====
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const fim = Number(el.dataset.count);
    const duracao = 1500;
    const inicio = performance.now();
    const passo = agora => {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      el.textContent = Math.floor(progresso * fim).toLocaleString('pt-BR');
      if (progresso < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ===== BOTÕES "COTAR AUTO/MOTO" JÁ SELECIONAM O TIPO =====
document.querySelectorAll('[data-tipo]').forEach(botao => {
  botao.addEventListener('click', () => {
    const radio = document.querySelector(`input[name="tipo"][value="${botao.dataset.tipo}"]`);
    if (radio) radio.checked = true;
  });
});

// ===== MÁSCARAS DOS CAMPOS =====
const campoPlaca = document.getElementById('placa');
const campoAno = document.getElementById('ano');
const campoCep = document.getElementById('cep');

campoPlaca.addEventListener('input', () => {
  campoPlaca.value = campoPlaca.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
});
campoAno.addEventListener('input', () => {
  campoAno.value = campoAno.value.replace(/\D/g, '');
});
campoCep.addEventListener('input', () => {
  let v = campoCep.value.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  campoCep.value = v;
});

// ===== ENVIO PARA O WHATSAPP =====
const form = document.getElementById('formCotacao');
const erro = document.getElementById('formErro');

form.addEventListener('submit', e => {
  e.preventDefault();
  form.querySelectorAll('input').forEach(i => i.classList.remove('erro'));
  erro.textContent = '';

  const tipo = form.querySelector('input[name="tipo"]:checked').value;
  const nome = document.getElementById('nome');
  const modelo = document.getElementById('modelo');

  const anoAtual = new Date().getFullYear();
  const placaValida = /^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/.test(campoPlaca.value); // antiga e Mercosul
  const anoValido = /^\d{4}$/.test(campoAno.value) && +campoAno.value >= 1950 && +campoAno.value <= anoAtual + 1;
  const cepValido = /^\d{5}-\d{3}$/.test(campoCep.value);

  const problemas = [];
  if (nome.value.trim().length < 3) { problemas.push('nome'); nome.classList.add('erro'); }
  if (!placaValida) { problemas.push('placa'); campoPlaca.classList.add('erro'); }
  if (!anoValido) { problemas.push('ano'); campoAno.classList.add('erro'); }
  if (modelo.value.trim().length < 2) { problemas.push('modelo'); modelo.classList.add('erro'); }
  if (!cepValido) { problemas.push('CEP'); campoCep.classList.add('erro'); }

  if (problemas.length) {
    erro.textContent = 'Confira: ' + problemas.join(', ') + '.';
    return;
  }

  const mensagem =
`Olá Danilo! Gostaria de uma cotação de *seguro ${tipo.toLowerCase()}*.

*Nome:* ${nome.value.trim()}
*Placa:* ${campoPlaca.value}
*Marca/Modelo:* ${modelo.value.trim()}
*Ano:* ${campoAno.value}
*CEP:* ${campoCep.value}`;

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`, '_blank');
});

// ===== ANO NO RODAPÉ =====
document.getElementById('anoAtual').textContent = new Date().getFullYear();