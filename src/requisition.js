'use strict';

const AVAILABILITY = [
  { name: 'ubiquitous',     cost: 0, modifier: 40 },  // 0. Ubiquitos
  { name: 'abundant',       cost: 0, modifier: 30 },  // 1. Abundant
  { name: 'plentiful',      cost: 0, modifier: 20 },  // 2. Plentiful
  { name: 'common',         cost: 0, modifier: 10 },  // 3. Common
  { name: 'average',        cost: 0, modifier: 0 },   // 4. Average
  { name: 'scarce',         cost: 1, modifier: -10 }, // 5. Scarce
  { name: 'rare',           cost: 2, modifier: -20 }, // 6. Rare
  { name: 'veryrare',       cost: 3, modifier: -30 }, // 7. Very Rare
  { name: 'extremelyrare',  cost: 4, modifier: -40 }, // 8. Extremely Rare
  { name: 'nearunique',     cost: 5, modifier: -50 }, // 9. Near Unique
  { name: 'unique',         cost: 6, modifier: -60 }, // 10. Unique
];

const PUSH = [
  { name: 'none',  cost: 0, statusCost: 0, modifier: 0 }, // No push
  { name: 'small', cost: 2, statusCost: 0, modifier: 10 }, // Small push
  { name: 'major', cost: 5, statusCost: 0, modifier: 20 }, // Major push
  { name: 'allin', cost: 5, statusCost: 1, modifier: 40 }, // All-in push
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

function requisition(status, influence, availability, push, useFate = false) {
  const threshold = influence + availability.modifier + push.modifier;
  const roll = d100();
  const result = test(roll, threshold);
  const output = {
    roll,
    result,
    status,
    influence,
    fpUsed: 0,
  };
  output.successful = result.successful;
  // Linear influence loss
  const totalCost = availability.cost + push.cost;
  if (result.DoF >= 6) {
    // Use fatepoint and retry requisition
    if (useFate) {
      const output = requisition(status, influence, availability, push);
      output.fpUsed = 1;
      return output;
    }
    // Lose status on 6+ DoF
    output.status -= Math.max(result.DoF - 5, 0);
    output.influence -= totalCost;
  }
  else if (result.DoF >= 5) {
    // Use fatepoint and retry requisition
    if (useFate) {
      const output = requisition(status, influence, availability, push);
      output.fpUsed = 1;
      return output;
    }
    // Trash influence
    output.influence -= Math.max(Math.floor(influence / 2), totalCost);
  }
  else if (result.DoF >= 3) {
    // Use fatepoint and retry requisition
    if (useFate) {
      const output = requisition(status, influence, availability, push);
      output.fpUsed = 1;
      return output;
    }
    // Double influence loss
    output.influence -= Math.max(1, totalCost * 2);
  }
  else {
    output.influence -= totalCost;
  }
  output.status -= push.statusCost;
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
    roll: [],
  };
  for (let i = 0; i < 20; i++) {
    stats.roll.push({
    chance: 0,
    ILA: 0, IL1: 0, IL5: 0, IL15: 0,
    SLA: 0, SL1: 0,
    FPA: 0,
    });
  }
  const { availability, push, useFate } = init;
  for (let i = 0; i < iterations; i++) {
    let { status, influence } = init;
    let successful = false;
    let fpUsed = 0;
    // Roll requisitions
    for (let reqI = 0; reqI < stats.roll.length; reqI++) {
      if (!successful) {
        stats.rollsAvg += 1;
        let res = requisition(status, influence, availability, push, useFate);
        status = res.status;
        influence = res.influence;
        successful = res.successful;
        fpUsed += res.fpUsed;
      }
      if (successful) {
        stats.roll[reqI].chance += 1;
      }
      const infLoss = init.influence - influence;
      const statusLoss = init.status - status;
      stats.roll[reqI].ILA += infLoss;
      stats.roll[reqI].SLA += statusLoss;
      stats.roll[reqI].FPA += fpUsed;
      if (infLoss >= 1) {
        stats.roll[reqI].IL1 += 1;
      }
      if (infLoss >= 5) {
        stats.roll[reqI].IL5 += 1;
      }
      if (infLoss >= 15) {
        stats.roll[reqI].IL15 += 1;
      }
      if (statusLoss >= 1) {
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
    stats.roll[i].FPA /= iterations;
  }
  return stats;
}

function pct(number) {
  return (Math.round(number * 100) + '%').padStart(4);
}

function ct(number) {
  return (Math.round(number * 100) / 100 + '').padStart(5);
}

function pad(number) {
  return (number + '').padStart(2);
}

const initial = {
  status: 30,
  influence: 30,
  availability: AVAILABILITY[4],
  push: PUSH[0],
  useFate: false,
};

for (let i = 0; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '-s') {
    const param = process.argv[++i];
    initial.status = parseInt(param, 10);
    continue;
  }
  if (arg === '-i') {
    const param = process.argv[++i];
    initial.influence = parseInt(param, 10);
    continue;
  }
  if (arg === '-a') {
    const param = process.argv[++i];
    initial.availability = AVAILABILITY.filter((x) => x.name === param).pop();
    continue;
  }
  if (arg === '-f') {
    initial.useFate = true;
    continue;
  }
  // if (arg === '-p') {
  //   const param = process.argv[++i];
  //   initial.push = PUSH.filter((x) => x.name === param).pop();
  //   continue;
  // }
}

process.stdout.write('+----------------------------------------------+\n');
process.stdout.write(`|                                              |\r| `);
process.stdout.write(`Stat: ${initial.status}  `);
process.stdout.write(`Inf: ${initial.influence}  `);
process.stdout.write(`Avail: ${initial.availability.name}\n`);
process.stdout.write('+----------------------------------------------+\n\n');

for (let j = 0; j < 4; j++) {
  initial.push = PUSH[j];
  const stats = benchmark(initial, 1000000);
  const avg = stats.rollsAvg;
  const avgI = Math.round(stats.rollsAvg);
  console.log('Push:', initial.push.name, `/ Average rolls:${avg > 10 ? ' 10+' : ct(avg)}`);
  console.log('  #    CH   ILA  IL1  IL5 IL15   SLA  SL1   FPA');
  let lastChance = 0;
  for (let i = 0; i < stats.roll.length; i++) {
    let x = stats.roll[i];
    let marker = (i + 1) === avgI ? '>' : ' ';
    console.log(marker + pad(i + 1) + '.', pct(x.chance),
      ct(x.ILA), pct(x.IL1), pct(x.IL5), pct(x.IL15),
      ct(x.SLA), pct(x.SL1), ct(x.FPA));
    if (i >= 3 && x.chance - lastChance < 0.0125) {
      // console.log('...');
      break;
    }
    lastChance = x.chance;
  }
  console.log();
}
