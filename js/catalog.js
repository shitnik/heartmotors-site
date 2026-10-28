// ============================================================
// Каталог: загрузка CSV, фильтры и рендеринг карточек товаров.
// ============================================================

let products = [];

// Допустимые бренды для фильтра.
const FILTER_BRANDS = [
  'Volkswagen',
  'Skoda',
  'Hyundai',
  'KIA',
  'Toyota',
  'Audi',
];

// Фото связываются с карточками по коду двигателя; имена соответствуют файлам в папке img.
const ENGINE_IMAGES = {
  cwva: 'img/cwva.jpg',
  cwvb: 'img/cwvb',
  cfna: 'img/cfna.jpg',
  cfnb: 'img/cfnb.jpeg',
  g4fc: 'img/g4fc.jfif',
  g4fa: 'img/g4fa.jpg',
  g4fg: 'img/g4fg.jfif',
  g4kd: 'img/g4kd.jfif',
  g4na: 'img/g4na.jfif',
  g4lc: 'img/g4lc.jfif',
  g4kj: 'img/g4kj.jfif',
  czca: 'img/czca.jpg',
  caxa: 'img/caxa.jfif',
  '2nz': 'img/2nz.jpg',
  '2az': 'img/2az.jpg',
  '2tr': 'img/2tr.jpg',
  '2zr': 'img/2zr.jfif',
  '1nz': 'img/1nz.jfif',
  '1zz': 'img/1zz.jfif',
};

function getEngineImage(engineCode) {
  return ENGINE_IMAGES[String(engineCode || '').trim().toLowerCase()] || '';
}

// Делит значения CSV по точке с запятой.
function splitField(value) {
  return String(value || '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

// Простой CSV-парсер с поддержкой кавычек и переносов строк внутри ячейки.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"' && nextCharacter === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      quoted = !quoted;
      continue;
    }

    if (character === ';' && !quoted) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && nextCharacter === '\n') {
        index += 1;
      }

      row.push(cell);

      if (row.some(Boolean)) {
        rows.push(row);
      }

      row = [];
      cell = '';
      continue;
    }

    cell += character;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const headers = rows.shift().map((header) => header.trim());

  return rows.map((currentRow) => Object.fromEntries(
    headers.map((header, index) => [header, (currentRow[index] || '').trim()]),
  ));
}

// Приводит строку CSV к единому объекту товара для интерфейса.
function normalizeProduct(row) {
  return {
    sku: row.SKU,
    category: row.Category,
    title: row.Title,
    description: row.Description,
    price: Number(String(row.Price || 0).replace(/\s/g, '')) || 0,
    brand: splitField(row['Characteristics:Марка автомобиля']),
    models: splitField(row['Characteristics:Модель автомобиля']),
    engineVolume: row['Characteristics:Объём двигателя'],
    power: row['Characteristics:Мощность'],
    engineCode: row['Characteristics:Код двигателя'],
    timingDrive: row['Characteristics:Тип привода ГРМ'],
    image: getEngineImage(row['Characteristics:Код двигателя']),
  };
}

// Загружает каталог из CSV. При открытии через file:// используется data.js.
async function loadCatalog() {
  if (window.location.protocol === 'file:') {
    // file:// не разрешает fetch локальных файлов; берём уже загруженный резервный массив.
    products = (window.PRODUCTS || []).map((product) => ({
      ...product,
      image: getEngineImage(product.engineCode),
    }));
  } else {
    try {
      const response = await fetch('data/catalog.csv', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('CSV недоступен');
      }

      products = parseCsv(await response.text()).map(normalizeProduct);
    } catch (error) {
      console.warn('CSV не загрузился. Используется резервный data.js.', error);
      products = (window.PRODUCTS || []).map((product) => ({
        ...product,
        image: getEngineImage(product.engineCode),
      }));
    }
  }

  buildFilters();
  renderProducts();
}

// Создаёт HTML одного пункта фильтра.
function filterHtml(group, value) {
  return `
    <label class="filter-option">
      <input
        type="checkbox"
        data-filter="${escapeHtml(group)}"
        value="${escapeHtml(value)}"
      >
      <span>${escapeHtml(value)}</span>
    </label>
  `;
}

// Строит списки брендов и кодов двигателя на основе загруженных данных.
function buildFilters() {
  const brands = [...new Set(products.flatMap((product) => product.brand))]
    .filter((brand) => FILTER_BRANDS.includes(brand));
  const engineCodes = [...new Set(
    products.map((product) => product.engineCode).filter(Boolean),
  )].sort();

  document.querySelector('#brand-filters').innerHTML = brands
    .map((brand) => filterHtml('brand', brand))
    .join('');

  document.querySelector('#engine-filters').innerHTML = engineCodes
    .map((code) => filterHtml('engine', code))
    .join('');

  document.querySelectorAll('.filters input').forEach((input) => {
    input.addEventListener('change', renderProducts);
  });
}

// Возвращает выбранные значения конкретной группы фильтров.
function getSelectedFilters(group) {
  return [...document.querySelectorAll(`input[data-filter="${group}"]:checked`)]
    .map((input) => input.value);
}

// Фильтрует товары: OR внутри группы, AND между брендом и кодом двигателя.
function renderProducts() {
  const selectedBrands = getSelectedFilters('brand');
  const selectedEngines = getSelectedFilters('engine');

  const filteredProducts = products.filter((product) => {
    const brandMatches = !selectedBrands.length
      || product.brand.some((brand) => selectedBrands.includes(brand));
    const engineMatches = !selectedEngines.length
      || selectedEngines.includes(product.engineCode);

    return brandMatches && engineMatches;
  });

  document.querySelector('#results-count').textContent = `${filteredProducts.length} товаров`;
  document.querySelector('#product-grid').innerHTML = filteredProducts
    .map(renderProductCard)
    .join('') || '<p>Ничего не найдено.</p>';

  // Если конкретное фото не загрузилось, показываем прежнюю заглушку.
  document.querySelectorAll('.card-photo img').forEach((image) => {
    image.addEventListener('error', () => {
      image.parentElement.textContent = 'Фото двигателя';
    }, { once: true });
  });

  document.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', () => {
      const product = products.find((item) => item.sku === card.dataset.sku);
      openProductModal(product);
    });
  });
}

// Шаблон карточки товара.
function renderProductCard(product) {
  const photo = product.image
    ? `<img src="${product.image}" alt="Двигатель ${escapeHtml(product.engineCode)}" loading="lazy">`
    : 'Фото двигателя';

  return `
    <article class="product-card" data-sku="${escapeHtml(product.sku)}">
      <div class="card-photo">
        ${photo}
      </div>
      <div class="sku">SKU ${escapeHtml(product.sku)}</div>
      <h3>${escapeHtml(product.title)}</h3>
      <div class="card-meta">
        <span class="card-price">${formatPrice(product.price)}</span>
        <span class="card-models">${product.models.length} моделей</span>
      </div>
    </article>
  `;
}

// Запуск каталога после загрузки HTML.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#reset-filters')?.addEventListener('click', () => {
    document.querySelectorAll('.filters input').forEach((input) => {
      input.checked = false;
    });

    renderProducts();
  });

  loadCatalog();
});
