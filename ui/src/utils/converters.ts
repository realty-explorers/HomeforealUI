
const priceFormatter = (value: number | string) =>
    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const percentFormatter = (value: number) => `%${value.toFixed(2)}`;
const distanceFormatter = (value: number) => `${value.toFixed(2)} Miles`;


const priceScale = (value: number) => {
    let price: number = 0;
    const levels = [
        { max: 300000, step: 10000 },
        { max: 1000000, step: 50000 },
        { max: 3000000, step: 100000 }
    ];
    let levelConsecutiveMax = 0;
    let levelConsecutiveSteps = 0;
    for (const level of levels) {
        const newLevelConsecutiveSteps =
            levelConsecutiveSteps + (level.max - levelConsecutiveMax) / level.step;
        if (value < newLevelConsecutiveSteps) {
            price =
                levelConsecutiveMax + (value - levelConsecutiveSteps) * level.step;
            break;
        }
        levelConsecutiveSteps += (level.max - levelConsecutiveMax) / level.step;
        levelConsecutiveMax = level.max;
    }

    return price;
};

const priceReverseScale = (value: number) => {
    const levels = [
        { max: 1000000, step: 100000 },
        { max: 300000, step: 50000 },
        { max: 0, step: 10000 },
    ];
    let sum = value;
    let index = 0;
    for (const level of levels) {
        while (sum > level.max) {
            sum -= level.step;
            index++;
        }
    }
    return index;
};


const ageScale = (value: number) => {
    const units = [
        1,
        7,
        14,
        30,
        90,
        180,
        360,
        540,
        720,
    ];
    return units[value];
}

const ageReverseScale = (value: number) => {
    const units = {
        1: 0,
        7: 1,
        14: 2,
        30: 3,
        90: 4,
        180: 5,
        360: 6,
        540: 7,
        720: 8
    };
    return units[value];
}

const ageFormatter = (value: number) => {
    const units = [
        '1 day',
        '7 days',
        '14 days',
        '30 days',
        '90 days',
        '6 months',
        '12 months',
        '24 months',
        '36 months',
    ];
    return `${units[ageReverseScale(value)]} `;
}



export { priceFormatter, distanceFormatter, percentFormatter, ageFormatter, priceScale, priceReverseScale, ageScale, ageReverseScale };