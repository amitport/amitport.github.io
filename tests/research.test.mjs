import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { XMLBuilder } = require('fast-xml-parser');
const compile = (source) => ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext },
}).outputText;
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const snapshotCode = compile(await readFile(new URL('../src/data/research-snapshot.ts', import.meta.url), 'utf8'));
const snapshotUrl = moduleUrl(snapshotCode);
const { publicationSnapshot } = await import(snapshotUrl);
const researchCode = compile(await readFile(new URL('../src/data/research.ts', import.meta.url), 'utf8'))
  .replace(
    "import { XMLParser, XMLValidator } from 'fast-xml-parser';",
    `import parser from ${JSON.stringify(pathToFileURL(require.resolve('fast-xml-parser')).href)}; const { XMLParser, XMLValidator } = parser;`,
  )
  .replace("'./research-snapshot'", JSON.stringify(snapshotUrl));
let importId = 0;

async function load(fetchMock) {
  const realFetch = globalThis.fetch;
  const realWarn = console.warn;
  const warnings = [];
  globalThis.fetch = (url, options) => {
    assert.equal(url, 'https://dblp.org/pid/159/8806.xml');
    assert.ok(options.signal instanceof AbortSignal);
    return fetchMock();
  };
  console.warn = (...args) => warnings.push(args);
  try {
    const { papers } = await import(moduleUrl(`${researchCode}\n// Import ${importId++}`));
    return { papers, warnings };
  } finally {
    globalThis.fetch = realFetch;
    console.warn = realWarn;
  }
}

function assertFallback({ papers, warnings }) {
  assert.equal(papers.length, 9);
  assert.equal(papers[0].key, 'journals/corr/abs-2605-06014');
  assert.equal(papers[1].key, 'journals/corr/abs-2604-18555');
  assert.equal(warnings.length, 1);
  assert.match(warnings[0][0], /using checked-in publication snapshot/);
  const accepted = papers.find((p) => p.key === 'journals/corr/abs-2605-06014');
  assert.equal(accepted.type, 'conference');
  assert.equal(accepted.venue, "NeurIPS '26");
  assert.equal(accepted.url, 'https://arxiv.org/abs/2605.06014');
  assert.equal(accepted.note, 'Proceedings forthcoming');
  assert.equal(accepted.authors.length, 5);
  const eden = papers.find((p) => p.key === 'conf/icml/VargaftikBPMBM22');
  assert.equal(eden.authors.filter((a) => a.equal).length, 3);
  assert.equal(eden.note, '* Equal contribution');
  assert.ok(eden.code);
  assert.equal(papers.find((p) => p.key === 'journals/corr/abs-2604-18555').type, 'preprint');
  assert.equal(papers.find((p) => p.key === 'journals/spe/FriedmanP15').note, 'Authors are listed alphabetically');
  assert.ok(papers.every((p, i) => i === 0 || papers[i - 1].year >= p.year));
}

for (const [name, fetchMock] of [
  ['HTTP 200 bot challenge', () => new Response('<!doctype html><html><body>Making sure you are not a bot!</body></html>')],
  ['network failure', () => Promise.reject(new Error('Offline'))],
  ['timeout', () => Promise.reject(new DOMException('Timed out', 'TimeoutError'))],
  ['HTTP error', () => new Response('Unavailable', { status: 503 })],
  ['empty bibliography', () => new Response('<dblpperson></dblpperson>')],
  ['malformed XML', () => new Response('<dblpperson><r></dblpperson>')],
]) {
  test(`uses snapshot with current overrides on ${name}`, async () => {
    assertFallback(await load(fetchMock));
  });
}

function feed(papers) {
  return new XMLBuilder({ ignoreAttributes: false }).build({
    dblpperson: {
      r: papers.map((paper) => ({
        [paper.type === 'conference' ? 'inproceedings' : 'article']: {
          '@_key': paper.key,
          title: paper.title,
          author: paper.authors,
          year: paper.year,
          ee: paper.url,
          ...(paper.type === 'preprint'
            ? { journal: 'CoRR', volume: `abs/${paper.venue.replace('arXiv ', '')}` }
            : paper.type === 'conference'
              ? { booktitle: paper.venue.replace(/ '\d\d$/, '') }
              : { journal: paper.venue.replace(/ '\d\d$/, '') }),
        },
      })),
    },
  });
}

test('prefers live records and preserves overrides, URL selection, and deduplication', async () => {
  const newer = {
    key: 'journals/corr/abs-2701-00001',
    title: 'A new live publication.',
    authors: ['Amit Portnoy 0001'],
    year: 2027,
    venue: 'arXiv 2701.00001',
    url: 'https://arxiv.org/abs/2701.00001',
    type: 'preprint',
  };
  const duplicate = { ...publicationSnapshot[2], key: 'journals/corr/duplicate', type: 'preprint', venue: 'arXiv 2401.00001' };
  const { papers, warnings } = await load(() => new Response(feed([...publicationSnapshot, newer, duplicate])));
  assert.equal(warnings.length, 0);
  assert.equal(papers.length, 10);
  assert.equal(papers[0].title, 'A new live publication');
  assert.equal(papers[0].authors[0].name, 'Amit Portnoy');
  assert.equal(papers[0].url, newer.url);
  assert.equal(papers[1].key, 'journals/corr/abs-2605-06014');
  assert.equal(papers[2].key, 'journals/corr/abs-2604-18555');
  assert.equal(papers.find((p) => p.key === 'journals/corr/abs-2605-06014').venue, "NeurIPS '26");
  assert.equal(papers.find((p) => p.key === 'conf/acl/CohenPFI22').authors.filter((a) => a.equal).length, 2);
  assert.equal(papers.find((p) => p.key === 'journals/corr/abs-2004-04986').url, 'https://doi.org/10.3390/app12178847');
});

test('uses the proceedings record instead of the acceptance override once DBLP has both', async () => {
  const preprint = publicationSnapshot[1];
  const proceedings = {
    ...preprint,
    key: 'conf/nips/future-proceedings',
    type: 'conference',
    venue: "NeurIPS '26",
    url: 'https://proceedings.neurips.cc/future-record',
  };
  const { papers, warnings } = await load(() => new Response(feed([preprint, proceedings])));
  assert.equal(warnings.length, 0);
  assert.equal(papers.length, 1);
  assert.equal(papers[0].url, proceedings.url);
  assert.equal(papers[0].venue, "NeurIPS '26");
  assert.equal(papers[0].note, undefined);
});
