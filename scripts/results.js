export function renderResults() {
    const table = document.createElement('table');
    table.id = 'results-table';

    for (let i = 25; i > 0; i--) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i}</td>`;
        table.appendChild(row);
    }

    return table;
}

export async function downloadResultsAsImage() {
    const resultsContainer = document.getElementById('results');

    if (typeof window.html2canvas !== 'function') {
        alert('Nie udało się załadować funkcji zapisu obrazu. Sprawdź połączenie z internetem.');
        return;
    }

    const canvas = await window.html2canvas(resultsContainer, {
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        scale: window.devicePixelRatio || 1,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        width: resultsContainer.getBoundingClientRect().width,
        height: resultsContainer.getBoundingClientRect().height,
        onclone: async (clonedDocument) => {
            const clonedResults = clonedDocument.getElementById('results');
            const watermarkLayer = clonedDocument.createElement('div');
            const svgNamespace = 'http://www.w3.org/2000/svg';
            const createSvgElement = (name, attributes = {}) => {
                const element = clonedDocument.createElementNS(svgNamespace, name);
                Object.entries(attributes).forEach(([attribute, value]) => {
                    element.setAttribute(attribute, value);
                });
                return element;
            };
            const createGradient = (id, colors) => {
                const gradient = createSvgElement('linearGradient', {
                    id,
                    x1: '0%',
                    y1: '0%',
                    x2: '100%',
                    y2: '0%'
                });
                colors.forEach(([offset, color, opacity]) => {
                    const stop = createSvgElement('stop', {
                        offset,
                        'stop-color': color
                    });
                    if (opacity) {
                        stop.setAttribute('stop-opacity', opacity);
                    }
                    gradient.appendChild(stop);
                });
                return gradient;
            };
            let exportedHeadCount = 0;
            const createExportHead = (head) => {
                const headId = `dick-head-${exportedHeadCount++}`;
                const colors = {
                    white: ['lightpink', 'pink', 'lightpink'],
                    black: ['saddlebrown', 'peru', 'saddlebrown'],
                    asian: ['sandybrown', 'peru', 'sandybrown'],
                    latino: ['peru', 'sandybrown', 'peru']
                }[head.dataset.color];
                const svg = createSvgElement('svg', {
                    viewBox: '0 0 64 54',
                    width: '64',
                    height: '54',
                    'aria-hidden': 'true'
                });
                svg.style.cssText = 'display:block;width:64px;height:54px;flex:0 0 54px';

                const defs = createSvgElement('defs');
                const skinGradientId = `${headId}-skin`;
                const normalGradientId = `${headId}-normal`;
                const clipId = `${headId}-clip`;
                defs.append(
                    createGradient(skinGradientId, [
                        ['0%', colors[0]], ['50%', colors[1]], ['100%', colors[2]]
                    ]),
                    createGradient(normalGradientId, [
                        ['0%', 'indianred'], ['50%', 'lightcoral'], ['100%', 'indianred']
                    ])
                );

                const clipPath = createSvgElement('clipPath', {
                    id: clipId,
                    clipPathUnits: 'userSpaceOnUse'
                });
                if (head.dataset.shape === 'phimosis') {
                    clipPath.appendChild(createSvgElement('polygon', {
                        points: '32,0 35.2,0.54 39.04,2.16 44.8,5.94 51.84,11.34 58.24,17.28 62.08,22.14 64,26.46 64,54 0,54 0,26.46 1.92,22.14 5.76,17.28 12.16,11.34 19.2,5.94 24.96,2.16 28.8,0.54'
                    }));
                } else {
                    clipPath.appendChild(createSvgElement('path', {
                        d: 'M0 54 V27 A32 27 0 0 1 64 27 V54 Z'
                    }));
                }
                defs.appendChild(clipPath);
                svg.appendChild(defs);

                if (head.dataset.shape === 'foreskin') {
                    svg.appendChild(createSvgElement('rect', {
                        x: '0', y: '27', width: '64', height: '27',
                        fill: `url(#${skinGradientId})`, 'clip-path': `url(#${clipId})`
                    }));
                    svg.appendChild(createSvgElement('rect', {
                        x: '0', y: '0', width: '64', height: '27',
                        fill: `url(#${normalGradientId})`, 'clip-path': `url(#${clipId})`
                    }));
                } else {
                    svg.appendChild(createSvgElement('rect', {
                        x: '0', y: '0', width: '64', height: '54',
                        fill: `url(#${head.dataset.shape === 'phimosis' ? skinGradientId : normalGradientId})`,
                        'clip-path': `url(#${clipId})`
                    }));
                }

                head.replaceWith(svg);
            };
            const createExportCan = (can) => {
                const svg = createSvgElement('svg', {
                    viewBox: '0 0 165 324.5',
                    width: '165',
                    height: '324.5',
                    role: 'img',
                    'aria-label': can.getAttribute('aria-label')
                });
                svg.style.cssText = 'display:block;flex:0 0 165px;overflow:visible';

                const defs = createSvgElement('defs');
                defs.append(
                    createGradient('can-metal', [
                        ['0%', '#85898c'], ['22%', '#e4e6e7'],
                        ['76%', '#b8bdc0'], ['100%', '#777c7f']
                    ]),
                    createGradient('can-rim', [
                        ['0%', '#f4f5f5'], ['100%', '#9da2a5']
                    ]),
                    createGradient('can-label', [
                        ['0%', '#a7192d'], ['50%', '#e33b4e'],
                        ['100%', '#a7192d']
                    ])
                );
                svg.appendChild(defs);
                svg.appendChild(createSvgElement('path', {
                    d: 'M10 0.5 H155 Q164.5 0.5 164.5 10 V310.5 Q164.5 324 150.5 324 H14.5 Q0.5 324 0.5 310.5 V10 Q0.5 0.5 10 0.5 Z',
                    fill: 'url(#can-metal)', stroke: '#85898c'
                }));
                svg.appendChild(createSvgElement('path', {
                    d: 'M13.2 0.5 A69.3 3.5 0 0 0 151.8 0.5',
                    fill: 'none', stroke: '#777c7f'
                }));
                svg.appendChild(createSvgElement('rect', {
                    x: '0.5', y: '144', width: '164', height: '37',
                    fill: 'url(#can-label)'
                }));
                const label = createSvgElement('text', {
                    x: '82.5', y: '167',
                    fill: 'white',
                    'font-family': 'Fira Sans, sans-serif',
                    'font-size': '14',
                    'font-weight': 'bold',
                    'text-anchor': 'middle'
                });
                label.textContent = can.querySelector('.can-label').textContent;
                svg.appendChild(label);
                can.replaceWith(svg);
            };
            const createExportBottle = (bottle) => {
                const svg = createSvgElement('svg', {
                    viewBox: '0 0 145 525',
                    width: '145',
                    height: '525',
                    role: 'img',
                    'aria-label': bottle.getAttribute('aria-label')
                });
                svg.style.cssText = 'display:block;flex:0 0 145px;overflow:visible;filter:drop-shadow(0 1px 2px #5555)';

                const defs = createSvgElement('defs');
                const bodyGradient = createGradient('bottle-body', [
                    ['0%', '#79c4bd', '0.8'], ['20%', '#ecfffc', '0.87'],
                    ['58%', '#b8e4df', '0.85'], ['100%', '#68b7ae', '0.8']
                ]);
                defs.append(
                    bodyGradient,
                    createGradient('bottle-cap', [
                        ['0%', '#267f78'], ['58%', '#267f78'],
                        ['58%', '#49a69c'], ['100%', '#49a69c']
                    ]),
                    createGradient('bottle-label', [
                        ['0%', '#f8ffff'], ['50%', '#d9f3ef'],
                        ['100%', '#f8ffff']
                    ])
                );
                const capPattern = createSvgElement('pattern', {
                    id: 'bottle-cap-ridges',
                    width: '7', height: '7',
                    patternUnits: 'userSpaceOnUse'
                });
                capPattern.append(
                    createSvgElement('rect', {
                        width: '4', height: '7', fill: '#267f78'
                    }),
                    createSvgElement('rect', {
                        x: '4', width: '3', height: '7', fill: '#49a69c'
                    })
                );
                defs.appendChild(capPattern);
                svg.appendChild(defs);
                svg.appendChild(createSvgElement('path', {
                    d: 'M54.35 24 H90.65 V84.12 H104 L118.48 119.19 L126.95 159.27 V525 H18.05 V159.27 L26.52 119.19 L41 84.12 H54.35 Z',
                    fill: 'url(#bottle-body)',
                    stroke: '#4f9e96',
                    'stroke-width': '2'
                }));
                svg.appendChild(createSvgElement('rect', {
                    x: '50.5', y: '0.5', width: '44', height: '29',
                    rx: '5', fill: 'url(#bottle-cap-ridges)',
                    stroke: '#347e79'
                }));
                svg.appendChild(createSvgElement('rect', {
                    x: '18.05', y: '264.5', width: '108.9', height: '42',
                    fill: 'url(#bottle-label)'
                }));
                svg.appendChild(createSvgElement('path', {
                    d: 'M18.05 264.5 H126.95 M18.05 306.5 H126.95',
                    fill: 'none', stroke: '#79b7ae'
                }));
                const label = createSvgElement('text', {
                    x: '72.5', y: '290',
                    fill: '#26766e',
                    'font-family': 'Fira Sans, sans-serif',
                    'font-size': '12',
                    'font-weight': 'bold',
                    'text-anchor': 'middle'
                });
                label.textContent = bottle.querySelector('.bottle-label').textContent;
                svg.appendChild(label);
                bottle.replaceWith(svg);
            };

            clonedResults.querySelectorAll('.dick-head').forEach(createExportHead);
            clonedResults.querySelectorAll('.can').forEach(createExportCan);
            clonedResults.querySelectorAll('.bottle').forEach(createExportBottle);
            await Promise.all([
                clonedDocument.fonts.load('8px "Fira Sans"'),
                clonedDocument.fonts.load('100px "Ranchers"')
            ]);

            const measureCanvas = clonedDocument.createElement('canvas');
            const measureContext = measureCanvas.getContext('2d');
            const diagonalLength = Math.hypot(resultsContainer.clientWidth, resultsContainer.clientHeight);
            measureContext.font = '8px "Fira Sans"';
            const bylineWidth = measureContext.measureText('by AnnieLovesFeet').width;
            const diagonalBylineFontSize = diagonalLength * 0.9 * 8 / bylineWidth;
            measureContext.font = '100px "Ranchers"';
            const brandNameWidth = measureContext.measureText('SizeCheck').width;
            const diagonalNameFontSize = diagonalLength * 0.54 * 100 / brandNameWidth;
            const brandNameFontSize = 100 * bylineWidth / brandNameWidth;

            Object.assign(watermarkLayer.style, {
                position: 'absolute',
                inset: '0',
                overflow: 'hidden',
                zIndex: '3',
                pointerEvents: 'none'
            });

            const createBrandMark = (positionStyles) => {
                const mark = clonedDocument.createElement('div');
                const name = clonedDocument.createElement('span');
                const byline = clonedDocument.createElement('span');

                name.textContent = 'SizeCheck';
                byline.textContent = 'by AnnieLovesFeet';
                Object.assign(mark.style, {
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#333',
                    lineHeight: '1.2',
                    opacity: '0.72',
                    ...positionStyles
                });
                Object.assign(name.style, {
                    fontFamily: 'Ranchers, cursive',
                    fontSize: `${brandNameFontSize}px`
                });
                Object.assign(byline.style, {
                    fontFamily: 'Fira Sans, sans-serif',
                    fontSize: '8px'
                });
                mark.append(name, byline);
                return mark;
            };

            const diagonalMark = clonedDocument.createElement('div');
            const diagonalName = clonedDocument.createElement('span');
            const diagonalByline = clonedDocument.createElement('span');
            diagonalName.textContent = 'SizeCheck';
            diagonalByline.textContent = 'by AnnieLovesFeet';
            Object.assign(diagonalMark.style, {
                position: 'absolute',
                top: '46%',
                left: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 'max-content',
                color: '#222',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: '0.06',
                transform: 'translate(-50%, -50%) rotate(-45deg)'
            });
            Object.assign(diagonalName.style, {
                display: 'inline-block',
                fontFamily: 'Ranchers, cursive',
                fontSize: `${diagonalNameFontSize}px`
            });
            Object.assign(diagonalByline.style, {
                display: 'inline-block',
                fontFamily: 'Fira Sans, sans-serif',
                fontSize: `${diagonalBylineFontSize}px`
            });
            diagonalMark.append(diagonalName, diagonalByline);

            watermarkLayer.append(
                createBrandMark({ top: '12px', left: '12px' }),
                createBrandMark({ right: '12px', bottom: '12px', alignItems: 'flex-end' }),
                diagonalMark
            );
            clonedResults.appendChild(watermarkLayer);

            const nameWidth = diagonalName.getBoundingClientRect().width;
            const renderedBylineWidth = diagonalByline.getBoundingClientRect().width;
            diagonalByline.style.fontSize = `${diagonalBylineFontSize * nameWidth / renderedBylineWidth}px`;
        }
    });

    canvas.toBlob((blob) => {
        if (!blob) {
            return;
        }

        const downloadLink = document.createElement('a');
        const imageUrl = URL.createObjectURL(blob);
        downloadLink.href = imageUrl;
        downloadLink.download = 'sizecheck-results.png';
        downloadLink.click();
        setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    }, 'image/png');
}
