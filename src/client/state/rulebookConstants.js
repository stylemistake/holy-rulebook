// TODO: These constants should be eventually moved to the actual rulebook
// which is loaded dynamically from the server.

// Primary characteristics
export const CHARCS_PRIMARY = [
  {
    id: 'ws',
    name: 'Weapon skill',
    aptitudes: ['Weapon Skill', 'Offense'],
  },
  {
    id: 'bs',
    name: 'Ballistic skill',
    aptitudes: ['Ballistic Skill', 'Finesse'],
  },
  {
    id: 's',
    name: 'Strength',
    aptitudes: ['Strength', 'Offense'],
  },
  {
    id: 't',
    name: 'Toughness',
    aptitudes: ['Toughness', 'Defense'],
  },
  {
    id: 'ag',
    name: 'Agility',
    aptitudes: ['Agility', 'Finesse'],
  },
  {
    id: 'int',
    name: 'Intelligence',
    aptitudes: ['Intelligence', 'Knowledge'],
  },
  {
    id: 'per',
    name: 'Perception',
    aptitudes: ['Perception', 'Fieldcraft'],
  },
  {
    id: 'wp',
    name: 'Willpower',
    aptitudes: ['Willpower', 'Psyker'],
  },
  {
    id: 'fel',
    name: 'Fellowship',
    aptitudes: ['Fellowship', 'Social'],
  },
];

// Secondary characteristics (can't be upgraded by XP)
export const CHARCS_SECONDARY = [
  {
    id: 'status',
    name: 'Status',
  },
  {
    id: 'wounds',
    name: 'Wounds',
  },
  {
    id: 'fp',
    name: 'Fate points',
  },
];

// matching aptitudes -> tier -> xp cost
export const XP_COSTS_CHARC = [
  [500, 750, 1000, 1500, 2500],
  [250, 500, 750, 1000, 1500],
  [100, 250, 500, 750, 1250],
];
