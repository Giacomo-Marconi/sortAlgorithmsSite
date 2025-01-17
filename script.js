const delay = 10; //delay
let swaps = 0;
let arraySize = 100;

const buttStart = document.getElementById('start');
const algorithmSelect = document.getElementById('algorithm');
const arraySizeInput = document.getElementById('arraySize');


arraySizeInput.addEventListener('change', () => {
    arraySize = parseInt(arraySizeInput.value);
    renderArray(generateRandomArray(arraySize));
});

function disable(dis) {
    buttStart.disabled = dis;
    algorithmSelect.disabled = dis;
    arraySizeInput.disabled = dis;
}



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

    disable(true);

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
        case 'bucket':
            await bucketSort(array);
            break;
        case 'heap':
            await heapSort(array);
            break;
        case 'bogo':
            await bogoSort(array);
            break;
        case 'shell':
            await shellSort(array);
            break;
        case 'tim':
            await timSort(array);
            break;
        case 'binary':
            await binarySort(array);
            break;
        default:
            console.log('Invalid algorithm');
        }
            
    disable(false);
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





async function bucketSort(array) {
    const bars = document.querySelectorAll('.bar');
    const bucketCount = Math.floor(array.length / 2);
    const buckets = Array.from({ length: bucketCount }, () => []);


    array.forEach(value => {
        const index = Math.floor((value / 400) * bucketCount);
        buckets[index].push(value);
    });


    let index = 0;
    for (const bucket of buckets) {
        bucket.sort((a, b) => a - b);
        for (const value of bucket) {
            array[index] = value;
            bars[index].style.height = `${value}px`;
            index++;
            swaps++;
            document.getElementById('swaps').innerText = `Swaps: ${swaps}`;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function heapSort(array) {
    const bars = document.querySelectorAll('.bar');

    async function heapify(size, root) {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        if (left < size && parseInt(bars[left].style.height) > parseInt(bars[largest].style.height)) {
            largest = left;
        }

        if (right < size && parseInt(bars[right].style.height) > parseInt(bars[largest].style.height)) {
            largest = right;
        }

        if (largest !== root) {
            await swap(bars, root, largest);
            await heapify(size, largest);
        }
    }

    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        await heapify(array.length, i);
    }

    for (let i = array.length - 1; i > 0; i--) {
        await swap(bars, 0, i);
        await heapify(i, 0);
    }
}

async function bogoSort() {
    const bars = document.querySelectorAll('.bar');

    function isSorted() {
        for (let i = 0; i < bars.length - 1; i++) {
            if (parseInt(bars[i].style.height) > parseInt(bars[i + 1].style.height)) {
                return false;
            }
        }
        return true;
    }

    while (!isSorted()) {
        for (let i = 0; i < bars.length; i++) {
            const j = Math.floor(Math.random() * bars.length);
            await swap(bars, i, j);
        }
    }
}

async function shellSort(array) {
    const bars = document.querySelectorAll('.bar');
    let gap = Math.floor(array.length / 2);

    while (gap > 0) {
        for (let i = gap; i < bars.length; i++) {
            let j = i;
            while (j >= gap && parseInt(bars[j].style.height) < parseInt(bars[j - gap].style.height)) {
                await swap(bars, j, j - gap);
                j -= gap;
            }
        }
        gap = Math.floor(gap / 2);
    }
}

async function timSort(array) {
    const bars = document.querySelectorAll('.bar');
    const RUN = 32;

    async function insertionSortTim(left, right) {
        for (let i = left + 1; i <= right; i++) {
            const temp = parseInt(bars[i].style.height);
            let j = i - 1;
            while (j >= left && parseInt(bars[j].style.height) > temp) {
                bars[j + 1].style.height = bars[j].style.height;
                swaps++;
                document.getElementById('swaps').innerText = `Swaps: ${swaps}`;
                j--;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            bars[j + 1].style.height = `${temp}px`;
        }
    }

    async function mergeTim(left, mid, right) {
        const tempArray = [];
        let i = left, j = mid + 1;

        while (i <= mid && j <= right) {
            if (parseInt(bars[i].style.height) <= parseInt(bars[j].style.height)) {
                tempArray.push(bars[i].style.height);
                i++;
            } else {
                tempArray.push(bars[j].style.height);
                j++;
            }
        }

        while (i <= mid) tempArray.push(bars[i++].style.height);
        while (j <= right) tempArray.push(bars[j++].style.height);

        for (let k = left; k <= right; k++) {
            bars[k].style.height = tempArray[k - left];
            swaps++;
            document.getElementById('swaps').innerText = `Swaps: ${swaps}`;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    for (let i = 0; i < array.length; i += RUN) {
        await insertionSortTim(i, Math.min(i + RUN - 1, array.length - 1));
    }

    for (let size = RUN; size < array.length; size = 2 * size) {
        for (let left = 0; left < array.length; left += 2 * size) {
            const mid = Math.min(left + size - 1, array.length - 1);
            const right = Math.min(left + 2 * size - 1, array.length - 1);
            if (mid < right) {
                await mergeTim(left, mid, right);
            }
        }
    }
}


async function binarySort(array) {
    const bars = document.querySelectorAll('.bar');

    function binarySearch(subArray, item, low, high) {
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (parseInt(bars[mid].style.height) === item) {
                return mid + 1;
            } else if (parseInt(bars[mid].style.height) < item) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return low;
    }

    for (let i = 1; i < array.length; i++) {
        const key = parseInt(bars[i].style.height);
        let j = i - 1;
        const loc = binarySearch(array, key, 0, j);

        while (j >= loc) {
            bars[j + 1].style.height = bars[j].style.height;
            swaps++;
            document.getElementById('swaps').innerText = `Swaps: ${swaps}`;
            j--;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        bars[j + 1].style.height = `${key}px`;
    }
}


const stop = document.getElementById('stop');
stop.addEventListener('click', () => {
    location.reload();
});

