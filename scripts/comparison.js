import { Dick, DickCollection } from './dick.js';
import { rateDick } from './rating.js';

let DicksCounter = 0;
let DICKS = new DickCollection();
let countries = [];
let editingDickId = null;

async function populateOriginOptions() {
    const originSelect = document.getElementById('dick-origin');
    const response = await fetch('assets/data.json');
    if (!response.ok) {
        throw new Error(`Nie udało się wczytać listy krajów: ${response.status}`);
    }

    const data = await response.json();
    countries = data.countries;
    countries.sort((first, second) => {
        const firstName = first.namePl || first.name;
        const secondName = second.namePl || second.name;
        return firstName.localeCompare(secondName, 'pl');
    });
    countries.forEach((country) => {
        const option = document.createElement('option');
        option.value = country.code || country.name;
        option.textContent = country.namePl || country.name;
        originSelect.appendChild(option);
    });
    updateComparisonControls();
}

populateOriginOptions().catch((error) => {
    const originSelect = document.getElementById('dick-origin');
    originSelect.disabled = true;
    originSelect.options[0].textContent = 'Nie udało się wczytać listy krajów';
    console.error(error);
});

function getComparisonItemCount() {
    return document.getElementById('resultsDicks').children.length;
}

function setDickRating(dick) {
    dick.rating = rateDick({
        length: dick.size,
        girth: dick.girth,
        ethnicity: dick.color,
        country: dick.origin,
        shape: dick.shape
    }, countries);

    return Boolean(dick.rating);
}

function renderDickViews(dick) {
    const previewItem = document.createElement('div');
    previewItem.className = 'dick-preview-item';
    previewItem.id = `dick-preview-${dick.id}`;
    previewItem.dataset.dickId = dick.id;
    previewItem.appendChild(dick.renderPreview());

    const actions = document.createElement('div');
    actions.className = 'dick-preview-actions';
    [
        ['edit', 'edit_square.svg', 'Edytuj'],
        ['delete', 'delete.svg', 'Usuń']
    ].forEach(([action, icon, label]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.action = action;
        button.setAttribute('aria-label', `${label} ${dick.name}`);

        const img = document.createElement('img');
        img.src = `assets/icons/${icon}`;
        img.alt = '';
        button.appendChild(img);

        actions.appendChild(button);
    });
    previewItem.appendChild(actions);

    const result = dick.render();
    result.id = `real-dick-${dick.id}`;
    result.dataset.dickId = dick.id;

    const country = countries.find((entry) => entry.code === dick.origin || entry.name === dick.origin);
    const rating = dick.renderRate(country?.namePl || country?.name || dick.origin);
    rating.dataset.dickId = dick.id;

    return { previewItem, result, rating };
}

function getRenderedItem(container, id) {
    return Array.from(container.children).find((element) => element.dataset.dickId === id);
}

function replaceDickViews(dick) {
    const containers = [
        document.getElementById('previews'),
        document.getElementById('resultsDicks'),
        document.getElementById('ratings')
    ];
    const currentItems = containers.map((container) => getRenderedItem(container, dick.id));
    if (currentItems.some((item) => !item)) {
        return false;
    }

    const updatedViews = renderDickViews(dick);
    [updatedViews.previewItem, updatedViews.result, updatedViews.rating]
        .forEach((view, index) => currentItems[index].replaceWith(view));
    return true;
}

function addDickToComparison(dick) {
    if (!countries.length || getComparisonItemCount() >= 4) {
        return false;
    }

    if (!setDickRating(dick)) {
        return false;
    }

    DicksCounter += 1;
    dick.id = String(DicksCounter);
    if (!DICKS.addDick(dick)) {
        return false;
    }

    const views = renderDickViews(dick);
    document.getElementById('previews').appendChild(views.previewItem);
    document.getElementById('resultsDicks').appendChild(views.result);
    document.getElementById('ratings').appendChild(views.rating);

    updateComparisonControls();
    return true;
}

export function updateComparisonControls() {
    const itemCount = getComparisonItemCount();
    const hasCan = Boolean(document.querySelector('#resultsDicks .can'));
    const hasBottle = Boolean(document.querySelector('#resultsDicks .bottle'));

    document.querySelector('#dickForm button[type="submit"]').disabled = !countries.length || itemCount >= 4;
    document.getElementById('addRandomDick').disabled = !countries.length || itemCount >= 4;
    document.getElementById('addCan').disabled = itemCount >= 4 && !hasCan;
    document.getElementById('addCan').setAttribute('aria-pressed', String(hasCan));
    document.getElementById('addCan').textContent = hasCan
        ? 'USUŃ PUSZKĘ Z PORÓWNANIA'
        : 'DODAJ PUSZKĘ DO PORÓWNANIA';
    document.getElementById('addBottle').disabled = itemCount >= 4 && !hasBottle;
    document.getElementById('addBottle').setAttribute('aria-pressed', String(hasBottle));
    document.getElementById('addBottle').setAttribute('aria-label', hasBottle
        ? 'Usuń butelkę z porównania'
        : 'Dodaj butelkę do porównania');
}

export function addDick(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const name = form.elements.namedItem('name').value;
    const size = Number(form.elements.namedItem('size').value);
    const color = form.elements.namedItem('color').value;
    const origin = form.elements.namedItem('origin').value;
    const shape = form.elements.namedItem('shape').value;

    if (editingDickId) {
        const dick = DICKS.getDick(editingDickId);
        if (!dick) {
            cancelDickEdit();
            return;
        }

        Object.assign(dick, { name, size, color, shape, origin });
        if (!setDickRating(dick) || !replaceDickViews(dick)) {
            return;
        }

        cancelDickEdit();
        updateComparisonControls();
        return;
    }

    const dick = new Dick(name, size, color, shape, origin);

    if (!addDickToComparison(dick)) {
        return;
    }

    form.reset();
}

function startDickEdit(id) {
    const dick = DICKS.getDick(id);
    if (!dick) {
        return;
    }

    const form = document.getElementById('dickForm');
    form.elements.namedItem('name').value = dick.name;
    form.elements.namedItem('size').value = dick.size;
    form.elements.namedItem('color').value = dick.color;
    form.elements.namedItem('origin').value = dick.origin;
    form.elements.namedItem('shape').value = dick.shape;
    editingDickId = id;
    form.querySelector('button[type="submit"]').textContent = 'ZAPISZ ZMIANY';
    document.getElementById('cancelDickEdit').hidden = false;
    form.elements.namedItem('name').focus();
}

export function handlePreviewAction(event) {
    const button = event.target.closest('button[data-action]');
    const id = button?.closest('.dick-preview-item')?.dataset.dickId;
    if (!button || !id) {
        return;
    }

    if (button.dataset.action === 'edit') {
        startDickEdit(id);
        return;
    }

    if (button.dataset.action === 'delete') {
        DICKS.removeDick(id);
        [
            document.getElementById('previews'),
            document.getElementById('resultsDicks'),
            document.getElementById('ratings')
        ].forEach((container) => getRenderedItem(container, id)?.remove());

        if (editingDickId === id) {
            cancelDickEdit();
        }
        updateComparisonControls();
    }
}

export function cancelDickEdit() {
    editingDickId = null;
    const form = document.getElementById('dickForm');
    form.reset();
    form.querySelector('button[type="submit"]').textContent = 'DODAJ DO PORÓWNANIA';
    document.getElementById('cancelDickEdit').hidden = true;
}

export function addRandomDick() {
    const randomChoice = (options) => options[Math.floor(Math.random() * options.length)];
    const countriesWithAverage = countries.filter((country) => Number.isFinite(country.averageErectLengthCm));
    const country = randomChoice(countriesWithAverage);
    const size = Math.round(country.averageErectLengthCm + Math.random() * 10 - 5);
    const color = randomChoice(['white', 'latino', 'asian', 'black']);
    const dick = new Dick(
        `Losowy #${DicksCounter + 1}`,
        size,
        color,
        randomChoice(['normal', 'foreskin', 'phimosis']),
        country.code || country.name
    );

    addDickToComparison(dick);
}

export function addCan(label = 'COLA') {
    const existingCan = document.querySelector('#resultsDicks .can');
    if (existingCan) {
        existingCan.remove();
        updateComparisonControls();
        return;
    }

    if (getComparisonItemCount() >= 4) {
        return;
    }

    const can = document.createElement('div');
    can.className = 'can';
    can.setAttribute('role', 'img');
    can.setAttribute('aria-label', `Puszka: ${label}`);

    const canLabel = document.createElement('span');
    canLabel.className = 'can-label';
    canLabel.textContent = label;
    can.appendChild(canLabel);

    document.getElementById('resultsDicks').appendChild(can);
    updateComparisonControls();
}

export function addBottle() {
    const existingBottle = document.querySelector('#resultsDicks .bottle');
    if (existingBottle) {
        existingBottle.remove();
        updateComparisonControls();
        return;
    }

    if (getComparisonItemCount() >= 4) {
        return;
    }

    const bottle = document.createElement('div');
    const cap = document.createElement('div');
    const body = document.createElement('div');
    const label = document.createElement('span');

    bottle.className = 'bottle';
    bottle.setAttribute('role', 'img');
    bottle.setAttribute('aria-label', 'Butelka wody 500 ml');
    cap.className = 'bottle-cap';
    body.className = 'bottle-body';
    label.className = 'bottle-label';
    label.textContent = 'WODA 500 ml';

    body.appendChild(label);
    bottle.append(cap, body);
    document.getElementById('resultsDicks').appendChild(bottle);
    updateComparisonControls();
}

export function clearComparison() {
    document.getElementById('previews').replaceChildren();
    document.getElementById('resultsDicks').replaceChildren();
    document.getElementById('ratings').replaceChildren();
    DICKS = new DickCollection();
    DicksCounter = 0;
    cancelDickEdit();
    updateComparisonControls();
}
