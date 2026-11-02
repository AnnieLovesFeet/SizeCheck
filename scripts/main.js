import {
    addBottle,
    addCan,
    addDick,
    addRandomDick,
    cancelDickEdit,
    clearComparison,
    handlePreviewAction
} from './comparison.js';
import { downloadResultsAsImage, renderResults } from './results.js';

const results = document.getElementById('results');
results.appendChild(renderResults());

document.getElementById('dickForm').addEventListener('submit', addDick);
document.getElementById('cancelDickEdit').addEventListener('click', cancelDickEdit);
document.getElementById('previews').addEventListener('click', handlePreviewAction);
document.getElementById('addCan').addEventListener('click', () => addCan());
document.getElementById('addBottle').addEventListener('click', addBottle);
document.getElementById('addRandomDick').addEventListener('click', addRandomDick);
document.getElementById('clear').addEventListener('click', clearComparison);
document.getElementById('download').addEventListener('click', downloadResultsAsImage);
