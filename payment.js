'use strict';
const $ = id => document.getElementById(id);
const luhn = n => { let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt && (d *= 2) > 9) d -= 9; s += d; alt = !alt; } return s % 10 === 0; };
const setInvalid = (id, bad) => { $(id).closest('.form-control').classList.toggle('invalid', bad); return !bad; };

function validate() {
  const name = $('card-name').value.trim(), num = $('card-number').value.replace(/\s/g, '');
  const exp = $('card-expiry').value, cvv = $('card-cvv').value, m = /^(\d{2})\/(\d{2})$/.exec(exp);
  let expOK = false;
  if (m) { const mo = +m[1], yr = 2000 + +m[2], now = new Date(); expOK = mo >= 1 && mo <= 12 && (yr > now.getFullYear() || (yr === now.getFullYear() && mo >= now.getMonth() + 1)); }
  return [setInvalid('card-name', name.length < 3), setInvalid('card-number', !(num.length === 16 && luhn(num))),
          setInvalid('card-expiry', !expOK), setInvalid('card-cvv', !/^\d{3}$/.test(cvv))].every(Boolean);
}
function resetForm() {
  $('payment-form').reset();
  document.querySelectorAll('.form-control').forEach(f => f.classList.remove('invalid'));
  $('cc-number').textContent = '•••• •••• •••• ••••'; $('cc-name').textContent = 'YOUR NAME';
  $('cc-exp').textContent = 'MM/YY'; $('cc-cvv').textContent = '•••'; $('flip').classList.remove('flipped');
}
function playSuccess() {
  const box = $('lottie-success'), fallback = () => box.innerHTML = '<div class="fallback-check">✔</div>';
  try {
    if (!window.lottie) throw 0;
    lottie.loadAnimation({container:box, renderer:'svg', loop:false, autoplay:true, path:'https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json'}).addEventListener('data_failed', fallback);
  } catch (_) { fallback(); }
}

$('card-name').addEventListener('input', e => $('cc-name').textContent = e.target.value.toUpperCase() || 'YOUR NAME');
$('card-number').addEventListener('input', e => {
  const d = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = d.replace(/(.{4})/g, '$1 ').trim();
  $('cc-number').textContent = (d + '•'.repeat(16)).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
});
$('card-expiry').addEventListener('input', e => {
  let d = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (d.length > 2) d = d.slice(0, 2) + '/' + d.slice(2);
  e.target.value = d; $('cc-exp').textContent = d || 'MM/YY';
});
$('card-cvv').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); $('cc-cvv').textContent = e.target.value.padEnd(3, '•'); });
$('card-cvv').addEventListener('focus', () => $('flip').classList.add('flipped'));
$('card-cvv').addEventListener('blur', () => $('flip').classList.remove('flipped'));
$('btn-form-reset').addEventListener('click', resetForm);

$('payment-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) return;
  $('btn-pay').disabled = true; $('payment-processing').classList.remove('hidden');
  setTimeout(() => {
    $('payment-processing').classList.add('hidden');
    $('payment-success').classList.remove('hidden'); $('btn-pay').classList.add('hidden'); $('btn-form-reset').classList.add('hidden');
    playSuccess();
    localStorage.setItem('techifyPremium', '1');   // only a premium flag is stored, never card data
    setTimeout(() => location.href = 'index.html', 4000);
  }, 2000);
});