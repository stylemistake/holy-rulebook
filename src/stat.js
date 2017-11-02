'use strict';

const AVAILABILITY = [
    { cost: 0, modifier: 40 },  // 0. Ubiquitos
    { cost: 0, modifier: 30 },  // 1. Abundant
    { cost: 0, modifier: 20 },  // 2. Plentiful
    { cost: 0, modifier: 10 },  // 3. Common
    { cost: 0, modifier: 0 },   // 4. Average
    { cost: 1, modifier: -10 }, // 5. Scarce
    { cost: 2, modifier: -20 }, // 6. Rare
    { cost: 3, modifier: -30 }, // 7. Very Rare
    { cost: 4, modifier: -40 }, // 8. Extremely Rare
    { cost: 5, modifier: -50 }, // 9. Near Unique
    { cost: 6, modifier: -60 }, // 10. Unique
];

const PUSH = [
    { cost: 0, modifier: 0 }, // No push
    { cost: 2, modifier: 10 }, // Small push
    { cost: 5, modifier: 20 }, // Major push
];

function d100() {
    return Math.random() * 100 + 1 | 0;
}

function test(roll, threshold) {
    const result = threshold - roll;
    const successful = result >= 0;
    const degrees = Math.abs(result / 10 | 0);
    return {
        result,
        successful,
        DoS: successful ? degrees : 0,
        DoF: successful ? 0 : degrees,
    };
}

function requisition(status, influence, availability, push) {
    const threshold = influence + availability.modifier + push.modifier;
    const roll = d100();
    const result = test(roll, threshold);
    const output = { roll, result, status, influence };
    output.successful = result.successful;
    // Linear influence loss
    const totalCost = availability.cost + push.cost;
    if (result.DoF >= 6) {
        // Lose status on 6+ DoF
        output.status -= Math.max(result.DoF - 5, 0);
        output.influence -= totalCost;
    }
    else if (result.DoF >= 5) {
        // Trash influence
        output.influence -= Math.max(Math.floor(influence / 2), totalCost);
    }
    else if (result.DoF >= 3) {
        // Trash influence
        output.influence -= Math.max(1, totalCost * 2);
    }
    else {
        output.influence -= totalCost;
    }
    return output;
}

function requisitionLinear(status, influence, availability, push) {
    const threshold = influence + availability.modifier + push.modifier;
    const roll = d100();
    const result = test(roll, threshold);
    const output = { roll, result, status, influence };
    output.successful = result.successful;
    // Linear influence loss
    output.influence -= result.DoF + availability.cost + push.cost;
    // Lose status on 6+ DoF
    output.status -= Math.max(result.DoF - 5, 0);
    return output;
}

function benchmark(init, iterations) {
    const stats = {
        init,
        rollsAvg: 0,
        roll: [
            { chance: 0, ILA: 0, IL1: 0, IL5: 0, IL15: 0, SLA: 0, SL1: 0 },
            { chance: 0, ILA: 0, IL1: 0, IL5: 0, IL15: 0, SLA: 0, SL1: 0 },
            { chance: 0, ILA: 0, IL1: 0, IL5: 0, IL15: 0, SLA: 0, SL1: 0 },
            { chance: 0, ILA: 0, IL1: 0, IL5: 0, IL15: 0, SLA: 0, SL1: 0 },
            { chance: 0, ILA: 0, IL1: 0, IL5: 0, IL15: 0, SLA: 0, SL1: 0 },
            { chance: 0, ILA: 0, IL1: 0, IL5: 0, IL15: 0, SLA: 0, SL1: 0 },
            { chance: 0, ILA: 0, IL1: 0, IL5: 0, IL15: 0, SLA: 0, SL1: 0 },
            { chance: 0, ILA: 0, IL1: 0, IL5: 0, IL15: 0, SLA: 0, SL1: 0 },
        ],
    };
    const { availability, push } = init;
    for (let i = 0; i < iterations; i++) {
        let { status, influence } = init;
        let successful = false;
        // Roll requisitions
        for (let reqI = 0; reqI < stats.roll.length; reqI++) {
            if (!successful) {
                stats.rollsAvg += 1;
                let res = requisition(status, influence, availability, push);
                status = res.status;
                influence = res.influence;
                successful = res.successful;
            }
            if (successful) {
                stats.roll[reqI].chance += 1;
            }
            const infLoss = init.influence - influence;
            const statusLoss = init.status - status;
            stats.roll[reqI].ILA += infLoss;
            stats.roll[reqI].SLA += statusLoss;
            if (infLoss > 1) {
                stats.roll[reqI].IL1 += 1;
            }
            if (infLoss > 5) {
                stats.roll[reqI].IL5 += 1;
            }
            if (infLoss > 15) {
                stats.roll[reqI].IL15 += 1;
            }
            if (statusLoss > 1) {
                stats.roll[reqI].SL1 += 1;
            }
        }
    }
    stats.rollsAvg /= iterations;
    for (let i = 0; i < stats.roll.length; i++) {
        stats.roll[i].chance /= iterations;
        stats.roll[i].ILA /= iterations;
        stats.roll[i].IL1 /= iterations;
        stats.roll[i].IL5 /= iterations;
        stats.roll[i].IL15 /= iterations;
        stats.roll[i].SLA /= iterations;
        stats.roll[i].SL1 /= iterations;
    }
    return stats;
}

function pct(number) {
    return (Math.round(number * 100) + '%').padStart(4);
}

function ct(number) {
    return (Math.round(number * 100) / 100 + '').padStart(5);
}

// const result = requisition(30, 30, AVAILABILITY[4], PUSH[1]);
// console.log(result);

const initial = {
    status: 30,
    influence: 5,
    availability: AVAILABILITY[4],
    push: PUSH[0],
};

console.log('+--------------------------------------------------------------+');
console.log('| Status: 30   Influence:  5   Availability: x                 |');
console.log('+--------------------------------------------------------------+');
console.log();

for (let j = 0; j < 3; j++) {
    initial.push = PUSH[j];
    const stats = benchmark(initial, 1000000);
    console.log('Push:', j);
    console.log(`Average rolls: ${stats.rollsAvg}`);
    console.log('#    CH   ILA  IL1  IL5 IL15   SLA  SL1');
    for (let i = 0; i < stats.roll.length; i++) {
        let x = stats.roll[i];
        console.log(i + '.', pct(x.chance),
            ct(x.ILA), pct(x.IL1), pct(x.IL5), pct(x.IL15),
            ct(x.SLA), pct(x.SL1));
    }
    console.log();
}
