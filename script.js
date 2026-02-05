const statsData = [
  { label: '24h Volume', value: '$2.84B' },
  { label: 'Open Interest', value: '$732M' },
  { label: 'Funding Rate', value: '0.012%' },
  { label: 'Active Traders', value: '184,921' }
];

const marketData = [
  { pair: 'BTC/USDT', price: 68422.6, change: 2.92, volume: '$1.21B' },
  { pair: 'ETH/USDT', price: 3811.9, change: 1.88, volume: '$842M' },
  { pair: 'SOL/USDT', price: 182.44, change: 8.22, volume: '$334M' },
  { pair: 'XRP/USDT', price: 0.6421, change: -1.24, volume: '$188M' },
  { pair: 'DOGE/USDT', price: 0.1842, change: 5.03, volume: '$164M' }
];

const statsContainer = document.getElementById('stats');
statsData.forEach(item => {
  const node = document.createElement('div');
  node.className = 'stat';
  node.innerHTML = `<small>${item.label}</small><strong>${item.value}</strong>`;
  statsContainer.appendChild(node);
});

const rows = document.getElementById('marketRows');
marketData.forEach((item) => {
  const tr = document.createElement('tr');
  const cls = item.change >= 0 ? 'positive' : 'negative';
  tr.innerHTML = `
    <td>${item.pair}</td>
    <td>$${item.price.toLocaleString()}</td>
    <td class="${cls}">${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%</td>
    <td>${item.volume}</td>
  `;
  rows.appendChild(tr);
});

function renderBook(id, type = 'bid') {
  const container = document.getElementById(id);
  const base = 68400;
  container.className = type === 'bid' ? 'bids' : 'asks';
  for (let i = 0; i < 14; i++) {
    const price = base + (type === 'bid' ? -i * 8 : i * 8);
    const amount = (Math.random() * 3 + 0.15).toFixed(3);
    const li = document.createElement('li');
    li.innerHTML = `<span>${price.toLocaleString()}</span><span>${amount}</span>`;
    container.appendChild(li);
  }
}
renderBook('asks', 'ask');
renderBook('bids', 'bid');

const canvas = document.getElementById('priceChart');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const points = Array.from({ length: 70 }, (_, i) => ({
  x: (i / 69) * W,
  y: H * 0.52 + Math.sin(i * 0.18) * 60 + (Math.random() - 0.5) * 30
}));

function drawLine(progress = 1) {
  ctx.clearRect(0, 0, W, H);

  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, 'rgba(6,182,212,0.38)');
  gradient.addColorStop(1, 'rgba(6,182,212,0.02)');

  const line = ctx.createLinearGradient(0, 0, W, 0);
  line.addColorStop(0, '#06b6d4');
  line.addColorStop(1, '#8b5cf6');

  const visible = Math.floor(points.length * progress);
  const subset = points.slice(0, Math.max(2, visible));

  ctx.beginPath();
  subset.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });

  ctx.lineTo(subset[subset.length - 1].x, H);
  ctx.lineTo(subset[0].x, H);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  subset.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.strokeStyle = line;
  ctx.lineWidth = 3;
  ctx.stroke();
}

let start = null;
function animateChart(timestamp) {
  if (!start) start = timestamp;
  const elapsed = timestamp - start;
  const t = Math.min(1, elapsed / 1200);
  drawLine(t);
  if (t < 1) requestAnimationFrame(animateChart);
}
requestAnimationFrame(animateChart);

const last = points[points.length - 1].y;
const first = points[0].y;
const diff = ((first - last) / first) * 100;
const price = 68422.6 + (Math.random() * 120 - 60);
document.getElementById('lastPrice').textContent = `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const ch = document.getElementById('priceChange');
ch.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%`;
ch.className = diff >= 0 ? 'positive' : 'negative';
