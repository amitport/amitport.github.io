export interface ILink {
  url: string;
  kind: 'website' | 'source' | 'gitbook' | 'paper';
}

export interface IProject {
  title: string;
  description: string;
  links: ILink[];
}
export const PROJECTS: IProject[] = [{
  title: 'CardForest.com',
  description: 'Online environment for coding card games',
  links: [{url: 'http://www.cardforest.com', kind: 'website'}],
}, {
  title: 'amitport.github.io',
  description: 'the source for this page',
  links: [{url: 'https://github.com/amitport/amitport.github.io', kind: 'source'}],
}, {
  title: 'GraphPack',
  description: 'a decentralized graph database',
  links: [{url: 'https://code.google.com/archive/p/graphpack/', kind: 'source'}],
}, {
  title: 'TrustPack',
  description: 'a decentralized trust management framework',
  links: [{url: 'http://onlinelibrary.wiley.com/doi/10.1002/spe.2226/abstract', kind: 'paper'},
    {url: 'https://github.com/amitport/trustpack', kind: 'source'}],
}, {
  title: 'version-update-nagger',
  description: 'an electron app that pulls node and npm package updates',
  links: [{url: 'https://github.com/amitport/version-update-nagger', kind: 'source'}],
}, {
  title: 'turned-based',
  description: 'a collection of multi-player games— Four-in-a-line, Israeli Whist, and Tic-tac-toe',
  links: [
    {url: 'https://github.com/amitport/tbs', kind: 'source'},
    {url: 'https://turn-based.herokuapp.com/', kind: 'website'}
  ],
}, {
  title: 'gulp-group-aggregate',
  description: 'group and aggregate gulp\'s file streams (e.g., concat files by folder)',
  links: [{url: 'https://github.com/amitport/gulp-group-aggregate', kind: 'source'}],
}, {
  title: 'gulp-wrap-docco',
  description: 'gulp-wrap-docco',
  links: [{url: 'https://github.com/amitport/gulp-wrap-docco', kind: 'source'}],
}, {
  title: 'Space Invaders 3D',
  description: 'Space Invaders written in C++ using OpenGL',
  links: [{url: 'https://github.com/amitport/SpaceInvaders3D', kind: 'source'}],
}, {
  title: 'Klondike',
  description: 'a simple Klondike (Windows Solitaire) game, written in Java',
  links: [{url: 'https://github.com/amitport/Klondike', kind: 'source'}],
}, {
  title: 'CardForest Seeds',
  description: 'a structured source of playing cards',
  links: [
    {url: 'https://github.com/cardforest/seeds', kind: 'source'},
    {url: 'http://seeds.cardforest.com/', kind: 'website'},
  ],
}, {
  title: 'master-class',
  description: 'javascript classes with typing, change logging, optional immutability, reference preserving serialization, and state pattern support',
  links: [
    {url: 'https://amitport.gitbooks.io/master-class/content/', kind: 'gitbook'},
    {url: 'https://github.com/CardForest/master-class/', kind: 'source'}
  ],
}, {
  title: 'inherit-array',
  description: 'JavaScript (<6) array inheritance done right',
  links: [{url: 'https://github.com/amitport/inherit-array', kind: 'source'}],
}, {
  title: 'key-path',
  description: 'Deep property accessors for JavaScript objects',
  links: [{url: 'https://github.com/CardForest/key-path', kind: 'source'}],
}, {
  title: 'Senet AI',
  description: 'Smart Senet player (Egyptian board game)',
  links: [{url: 'https://github.com/amitport/senet-ai', kind: 'source'}],
}, {
  title: 'darbak',
  description: 'Compiles literate-iced-coffee-script and appends it with its source and formatted documentation',
  links: [{url: 'https://github.com/amitport/darbak', kind: 'source'}],
}, {
  title: 'IsraDoc.com',
  description: 'Israel doctor index—WIP',
  links: [{url: 'http://www.isradoc.com', kind: 'website'}],
}, {
  title: 'Snake-cube solver',
  description: 'Android app for solving snake cube puzzles',
  links: [{url: 'https://github.com/amitport/snake-cube-solver', kind: 'source'}],
}
];
