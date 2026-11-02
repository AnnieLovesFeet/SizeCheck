export class Dick {
    constructor(name, size, color, shape, origin = '') {
        this.name = name;
        this.size = size;
        this.color = color;
        this.shape = shape;
        this.origin = origin;
        this.rating = null;
    }

    renderRate(countryName = this.origin) {
        if (!this.rating) {
            return null;
        }

        const rating = document.createElement('article');
        rating.className = 'rating';

        const header = document.createElement('div');
        header.className = 'rating-header';

        const title = document.createElement('h2');
        title.textContent = this.name;
        header.appendChild(title);

        const score = document.createElement('p');
        score.className = 'rating-score';
        score.textContent = `${this.rating.score}/10`;
        header.appendChild(score);
        rating.appendChild(header);

        const meter = document.createElement('div');
        meter.className = 'rating-meter';
        meter.setAttribute('role', 'progressbar');
        meter.setAttribute('aria-label', `Ocena ${this.rating.score} na 10`);
        meter.setAttribute('aria-valuemin', '0');
        meter.setAttribute('aria-valuemax', '10');
        meter.setAttribute('aria-valuenow', String(this.rating.score));

        const meterValue = document.createElement('span');
        meterValue.style.width = `${this.rating.score * 10}%`;
        meter.appendChild(meterValue);
        rating.appendChild(meter);

        const colorNames = {
            white: 'Biały',
            black: 'Czarny',
            asian: 'Azjatycki',
            latino: 'Latynoski'
        };
        const shapeNames = {
            normal: 'Normalny',
            foreskin: 'Napletek',
            phimosis: 'Stulejka'
        };
        const facts = document.createElement('dl');
        facts.className = 'rating-facts';

        [
            ['Rozmiar', `${this.size} cm`],
            ['Kolor', colorNames[this.color] || this.color],
            ['Kształt', shapeNames[this.shape] || this.shape],
            ['Kraj', countryName || 'Nie podano']
        ].forEach(([label, value]) => {
            const fact = document.createElement('div');
            const term = document.createElement('dt');
            const description = document.createElement('dd');
            term.textContent = label;
            description.textContent = value;
            fact.append(term, description);
            facts.appendChild(fact);
        });
        rating.appendChild(facts);

        const summary = document.createElement('div');
        summary.className = 'rating-summary';

        const countryComparison = document.createElement('p');
        countryComparison.textContent = `Średnia kraju: ${this.rating.percentVsCountry > 0 ? '+' : ''}${this.rating.percentVsCountry}%`;
        summary.appendChild(countryComparison);

        const satisfaction = document.createElement('p');
        satisfaction.textContent = `Poziom: ${this.rating.satisfaction}`;
        summary.appendChild(satisfaction);
        rating.appendChild(summary);

        const description = document.createElement('p');
        description.className = 'rating-description';
        description.textContent = this.rating.description;
        rating.appendChild(description);

        const notes = document.createElement('div');
        notes.className = 'rating-notes';
        [
            ['Plusy', this.rating.advantages, 'rating-advantages'],
            ['Do uwzględnienia', this.rating.disadvantages, 'rating-disadvantages']
        ].forEach(([heading, items, className]) => {
            const section = document.createElement('section');
            section.className = className;
            const sectionHeading = document.createElement('h3');
            sectionHeading.textContent = heading;
            section.appendChild(sectionHeading);

            const list = document.createElement('ul');
            (items.length ? items : ['Brak']).forEach((item) => {
                const listItem = document.createElement('li');
                listItem.textContent = item;
                list.appendChild(listItem);
            });
            section.appendChild(list);
            notes.appendChild(section);
        });
        rating.appendChild(notes);

        return rating;
    }

    renderPreview() {
        const previewBorder = document.createElement('div');
        previewBorder.className = 'dick-preview-border';

        const preview = document.createElement('div');
        preview.className = 'dick-preview';
        previewBorder.appendChild(preview);

        const dickContainer = document.createElement('div');
        dickContainer.style.display = 'flex';
        preview.appendChild(dickContainer);

        const leftBall = document.createElement('div');
        leftBall.style.width = '20px';
        leftBall.style.height = '20px';
        leftBall.style.marginTop = 'auto';

        if (this.color === 'white') {
            leftBall.style.backgroundColor = 'LightPink';
        } else if (this.color === 'black') {
            leftBall.style.backgroundColor = 'SaddleBrown';
        } else if (this.color === 'asian') {
            leftBall.style.backgroundColor = 'SandyBrown';
        } else if (this.color === 'latino') {
            leftBall.style.backgroundColor = 'Peru';
        }

        leftBall.style.borderRadius = '50% 50% 0 0';
        dickContainer.appendChild(leftBall);

        const dickMain = document.createElement('div');
        dickMain.style.display = 'flex';
        dickMain.style.flexDirection = 'column';
        dickMain.style.alignItems = 'center';
        dickContainer.appendChild(dickMain);

        const dickHead = document.createElement('div');
        dickHead.style.width = '20px';
        dickHead.style.height = '20px';

        if (this.shape === 'phimosis') {
            if (this.color === 'white') {
                dickHead.style.backgroundImage = 'linear-gradient(to right, lightpink, pink, lightpink)';
            } else if (this.color === 'black') {
                dickHead.style.backgroundImage = 'linear-gradient(to right, saddlebrown, peru, saddlebrown)';
            } else if (this.color === 'asian') {
                dickHead.style.backgroundImage = 'linear-gradient(to right, sandybrown, peru, sandybrown)';
            } else if (this.color === 'latino') {
                dickHead.style.backgroundImage = 'linear-gradient(to right, peru, sandybrown, peru)';
            }

            dickHead.style.clipPath = 'polygon(50% 0, 55% 1%, 61% 4%, 70% 11%, 81% 21%, 91% 32%, 97% 41%, 100% 49%, 100% 100%, 0 100%, 0 49%, 3% 41%, 9% 32%, 19% 21%, 30% 11%, 39% 4%, 45% 1%)';
        } else if (this.shape === 'foreskin') {
            const shaftGradient = this.color === 'white'
                ? 'linear-gradient(to right, lightpink, pink, lightpink)'
                : this.color === 'black'
                    ? 'linear-gradient(to right, saddlebrown, peru, saddlebrown)'
                    : this.color === 'asian'
                        ? 'linear-gradient(to right, sandybrown, peru, sandybrown)'
                        : 'linear-gradient(to right, peru, sandybrown, peru)';

            dickHead.style.backgroundImage = `${shaftGradient}, linear-gradient(to right, indianred, lightcoral, indianred)`;
            dickHead.style.backgroundSize = '100% 50%, 100% 50%';
            dickHead.style.backgroundPosition = 'bottom, top';
            dickHead.style.backgroundRepeat = 'no-repeat';
            dickHead.style.borderRadius = '50% 50% 0 0';
        } else if (this.shape === 'normal') {
            dickHead.style.backgroundImage = 'linear-gradient(to right, indianred, lightcoral, indianred)';
            dickHead.style.borderRadius = '50% 50% 0 0';
        }

        dickMain.appendChild(dickHead);

        const dickElement = document.createElement('div');
        dickElement.style.width = '20px';
        dickElement.style.height = '60px';

        if (this.color === 'white') {
            dickElement.style.backgroundImage = 'linear-gradient(to right, lightpink, pink, lightpink)';
        } else if (this.color === 'black') {
            dickElement.style.backgroundImage = 'linear-gradient(to right, saddlebrown, peru, saddlebrown)';
        } else if (this.color === 'asian') {
            dickElement.style.backgroundImage = 'linear-gradient(to right, sandybrown, peru, sandybrown)';
        } else if (this.color === 'latino') {
            dickElement.style.backgroundImage = 'linear-gradient(to right, peru, sandybrown, peru)';
        }

        dickElement.style.borderRadius = this.shape === 'round' ? '50%' : '0';
        dickMain.appendChild(dickElement);

        const rightBall = document.createElement('div');
        rightBall.style.width = '20px';
        rightBall.style.height = '20px';
        rightBall.style.marginTop = 'auto';

        if (this.color === 'white') {
            rightBall.style.backgroundColor = 'LightPink';
        } else if (this.color === 'black') {
            rightBall.style.backgroundColor = 'SaddleBrown';
        } else if (this.color === 'asian') {
            rightBall.style.backgroundColor = 'SandyBrown';
        } else if (this.color === 'latino') {
            rightBall.style.backgroundColor = 'Peru';
        }

        rightBall.style.borderRadius = '50% 50% 0 0';
        dickContainer.appendChild(rightBall);

        const dickName = document.createElement('p');
        dickName.textContent = `${this.name}, ${this.size} [cm]`;
        preview.appendChild(dickName);

        return previewBorder;
    }

    render() {
        const dickContainer = document.createElement('div');

        const dickInfo = document.createElement('div');
        dickInfo.className = 'dick-info';
        dickInfo.textContent = `${this.name}, ${this.size} [cm]`;
        dickContainer.appendChild(dickInfo);

        const dick = document.createElement('div');
        dick.style.display = 'flex';
        dickContainer.appendChild(dick);

        const leftBall = document.createElement('div');
        leftBall.style.width = '64px';
        leftBall.style.height = '64px';
        leftBall.style.marginTop = 'auto';

        if (this.color === 'white') {
            leftBall.style.backgroundColor = 'LightPink';
        } else if (this.color === 'black') {
            leftBall.style.backgroundColor = 'SaddleBrown';
        } else if (this.color === 'asian') {
            leftBall.style.backgroundColor = 'SandyBrown';
        } else if (this.color === 'latino') {
            leftBall.style.backgroundColor = 'Peru';
        }

        leftBall.style.borderRadius = '50% 50% 0 0';
        dick.appendChild(leftBall);

        const dickMain = document.createElement('div');
        dickMain.style.display = 'flex';
        dickMain.style.flexDirection = 'column';
        dickMain.style.alignItems = 'center';
        dick.appendChild(dickMain);

        const dickHead = document.createElement('div');
        dickHead.className = 'dick-head';
        dickHead.dataset.shape = this.shape;
        dickHead.dataset.color = this.color;
        dickHead.style.width = '64px';
        dickHead.style.height = '54px';

        if(this.shape === 'phimosis') {
            if (this.color === 'white') {
                dickHead.style.backgroundImage = 'linear-gradient(to right, lightpink, pink, lightpink)';
            } else if (this.color === 'black') {
                dickHead.style.backgroundImage = 'linear-gradient(to right, saddlebrown, peru, saddlebrown)';
            } else if (this.color === 'asian') {
                dickHead.style.backgroundImage = 'linear-gradient(to right, sandybrown, peru, sandybrown)';
            } else if (this.color === 'latino') {
                dickHead.style.backgroundImage = 'linear-gradient(to right, peru, sandybrown, peru)';
            }

            dickHead.style.clipPath = 'polygon(50% 0, 55% 1%, 61% 4%, 70% 11%, 81% 21%, 91% 32%, 97% 41%, 100% 49%, 100% 100%, 0 100%, 0 49%, 3% 41%, 9% 32%, 19% 21%, 30% 11%, 39% 4%, 45% 1%)';
        } else if (this.shape === 'foreskin') {
            const shaftGradient = this.color === 'white'
                ? 'linear-gradient(to right, lightpink, pink, lightpink)'
                : this.color === 'black'
                    ? 'linear-gradient(to right, saddlebrown, peru, saddlebrown)'
                    : this.color === 'asian'
                        ? 'linear-gradient(to right, sandybrown, peru, sandybrown)'
                        : 'linear-gradient(to right, peru, sandybrown, peru)';

            dickHead.style.backgroundImage = `${shaftGradient}, linear-gradient(to right, indianred, lightcoral, indianred)`;
            dickHead.style.backgroundSize = '100% 50%, 100% 50%';
            dickHead.style.backgroundPosition = 'bottom, top';
            dickHead.style.backgroundRepeat = 'no-repeat';

            dickHead.style.borderRadius = '50% 50% 0 0';
        } else if (this.shape === 'normal') {
            dickHead.style.backgroundImage = 'linear-gradient(to right, indianred, lightcoral, indianred)';
            dickHead.style.borderRadius = '50% 50% 0 0';
        }

        dickMain.appendChild(dickHead);

        const dickElement = document.createElement('div');
        dickElement.style.width = '64px';
        dickElement.style.height = `${(this.size - 2) * 27}px`;

        if (this.color === 'white') {
            dickElement.style.backgroundImage = 'linear-gradient(to right, lightpink, pink, lightpink)';
        } else if (this.color === 'black') {
            dickElement.style.backgroundImage = 'linear-gradient(to right, saddlebrown, peru, saddlebrown)';
        } else if (this.color === 'asian') {
            dickElement.style.backgroundImage = 'linear-gradient(to right, sandybrown, peru, sandybrown)';
        } else if (this.color === 'latino') {
            dickElement.style.backgroundImage = 'linear-gradient(to right, peru, sandybrown, peru)';
        }

        dickElement.style.borderRadius = this.shape === 'round' ? '50%' : '0';
        dickMain.appendChild(dickElement);

        const rightBall = document.createElement('div');
        rightBall.style.width = '64px';
        rightBall.style.height = '64px';
        rightBall.style.marginTop = 'auto';

        if (this.color === 'white') {
            rightBall.style.backgroundColor = 'LightPink';
        } else if (this.color === 'black') {
            rightBall.style.backgroundColor = 'SaddleBrown';
        } else if (this.color === 'asian') {
            rightBall.style.backgroundColor = 'SandyBrown';
        } else if (this.color === 'latino') {
            rightBall.style.backgroundColor = 'Peru';
        }

        rightBall.style.borderRadius = '50% 50% 0 0';
        dick.appendChild(rightBall);
        dick.style.zIndex = '2';

        return dickContainer;
    }
}

export class DickCollection {
    constructor() {
        this.dicks = [];
    }

    addDick(dick) {
        this.dicks.push(dick);
        return true;
    }

    getDick(id) {
        return this.dicks.find((dick) => dick.id === id) || null;
    }

    removeDick(id) {
        const index = this.dicks.findIndex((dick) => dick.id === id);
        if (index === -1) {
            return false;
        }

        this.dicks.splice(index, 1);
        return true;
    }
}
