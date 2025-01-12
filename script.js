const delay = 10; //delay
let swaps = 0;
let arraySize = 100;

function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 400) + 1);
    }
    return array;
}

function renderArray(array) {
    const barContainer = document.getElementById('barContainer');
    barContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value}px`;
        bar.style.width = `${100 / array.length}%`;
        barContainer.appendChild(bar);
    });
}

async function swap(bars, i, j) {
    [bars[i].style.height, bars[j].style.height] = [bars[j].style.height, bars[i].style.height];
    swaps++;
    document.getElementById('swaps').innerText = `Swaps: ${swaps}`;
    await new Promise(resolve => setTimeout(resolve, delay));
}

async function bubbleSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < bars.length - 1; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            if (parseInt(bars[j].style.height) > parseInt(bars[j + 1].style.height)) {
                await swap(bars, j, j + 1);
            }
        }
    }
}

async function insertionSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 1; i < bars.length; i++) {
        let j = i;
        while (j > 0 && parseInt(bars[j].style.height) < parseInt(bars[j - 1].style.height)) {
            await swap(bars, j, j - 1);
            j--;
        }
    }
}

async function selectionSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < bars.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < bars.length; j++) {
            if (parseInt(bars[j].style.height) < parseInt(bars[minIndex].style.height)) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            await swap(bars, i, minIndex);
        }
    }
}

async function mergeSort(array) {
    if (array.length < 2) return;

    const mid = Math.floor(array.length / 2);
    const left = array.slice(0, mid);
    const right = array.slice(mid);

    await mergeSort(left);
    await mergeSort(right);
    await mergeArrays(array, left, right);
}

async function mergeArrays(array, left, right) {
    const bars = document.querySelectorAll('.bar');
    let i = 0, j = 0, k = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            array[k] = left[i];
            bars[k].style.height = `${left[i]}px`;
            i++;
        } else {
            array[k] = right[j];
            bars[k].style.height = `${right[j]}px`;
            j++;
        }
        k++;
        swaps++;
        document.getElementById('swaps').innerText = `Swaps: ${swaps}`;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    while (i < left.length) {
        array[k] = left[i];
        bars[k].style.height = `${left[i]}px`;
        i++;
        k++;
    }

    while (j < right.length) {
        array[k] = right[j];
        bars[k].style.height = `${right[j]}px`;
        j++;
        k++;
    }
}

document.getElementById('start').addEventListener('click', async () => {
    const algorithm = document.getElementById('algorithm').value;
    arraySize = parseInt(document.getElementById('arraySize').value);
    const array = generateRandomArray(arraySize);
    renderArray(array);
    swaps = 0;
    document.getElementById('swaps').innerText = 'Swaps: 0';
    let startTime = performance.now();

    const updateTimer = setInterval(() => {
        const currentTime = performance.now();
        document.getElementById('time').innerText = `Time: ${(currentTime - startTime).toFixed(2)} ms`;
    }, 10);

    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'merge':
            await mergeSort(array);
            break;
        case 'quick':
            await quickSort(array);
            break;
    }

    clearInterval(updateTimer);
    document.getElementById('time').innerText += ' (Final)';
});


async function quickSort(array, low = 0, high = array.length - 1) {
    if (low < high) {
        const pivotIndex = await partition(array, low, high);
        await quickSort(array, low, pivotIndex - 1);
        await quickSort(array, pivotIndex + 1, high);
    }
}

async function partition(array, low, high) {
    const bars = document.querySelectorAll('.bar');
    let pivot = parseInt(bars[high].style.height);
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (parseInt(bars[j].style.height) <= pivot) {
            i++;
            await swap(bars, i, j);
        }
    }
    await swap(bars, i + 1, high);
    return i + 1;
}

document.getElementById('themeColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--primary-color', e.target.value);
    document.documentElement.style.setProperty('--hover-color', lightenColor(e.target.value, 0.2));
});

function lightenColor(hex, factor) {
    const rgb = parseInt(hex.slice(1), 16);
    let r = (rgb >> 16) + Math.round(255 * factor);
    let g = ((rgb >> 8) & 0xff) + Math.round(255 * factor);
    let b = (rgb & 0xff) + Math.round(255 * factor);
    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

renderArray(generateRandomArray(arraySize));



