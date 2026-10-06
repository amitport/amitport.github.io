import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { publicationSnapshot } from './research-snapshot';

/**
 * Build-time fetch of the author's publication list from DBLP.
 * DBLP is the canonical bibliography for CS and is what OpenReview imports from.
 *
 * Edit `DBLP_PID` if the author identifier changes.
 * Edit `SKIP_KEYS` for the rare case where a preprint and its published version
 *   have different titles and the auto-dedupe can't tell they're the same work.
 * If DBLP is unavailable or returns a bot challenge, use `research-snapshot.ts`.
 * Keep that snapshot current when adding publications; overrides apply to both sources.
 */
const DBLP_PID = '159/8806';
const DBLP_URL = `https://dblp.org/pid/${DBLP_PID}.xml`;

const SKIP_KEYS = new Set<string>([
  // arXiv preprint of EDEN (the conference version was renamed, so title-based dedupe misses it).
  'journals/corr/abs-2108-08842',
  // QUIC-FL preprint, superseded by 'Accelerating Federated Learning with Quick Distributed Mean Estimation' (ICML '24).
  'journals/corr/abs-2205-13341',
]);

/**
 * Per-paper overrides for things DBLP doesn't track (equal-contribution markers,
 * alphabetical-author notes, etc.) and patches for missing/wrong fields
 * (e.g. when DBLP only has the preprint of a paper that was later published in a
 * journal it doesn't index). Keyed by DBLP record key.
 *   - `equalContribution`: full names (must match DBLP exactly) that get a `*`
 *     superscript and trigger an automatic "* Equal contribution" note.
 *   - `note`: free-form footnote rendered below the venue.
 *   - `title` / `type` / `venue` / `url`: overwrite the DBLP-derived value.
 */
interface PaperOverride {
  equalContribution?: string[];
  note?: string;
  title?: string;
  type?: PaperType;
  venue?: string;
  url?: string;
  code?: string;
}

const OVERRIDES: Record<string, PaperOverride> = {
  // Accepted to NeurIPS '26; keep the preprint link until proceedings are available.
  'journals/corr/abs-2605-06014': {
    type: 'conference',
    venue: "NeurIPS '26",
    url: 'https://arxiv.org/abs/2605.06014',
    note: 'Authors are listed alphabetically · Proceedings forthcoming',
  },
  'journals/corr/abs-2604-18555': {
    note: 'Authors are listed alphabetically',
  },
  // Accelerating Federated Learning with Quick Distributed Mean Estimation, ICML '24
  'conf/icml/Ben-BasatVPEBM24': {
    equalContribution: ['Ran Ben-Basat', 'Shay Vargaftik', 'Amit Portnoy'],
    code: 'https://github.com/amitport/QUIC-FL-Quick-Unbiased-Compression-for-Federated-Learning',
  },
  // EDEN, ICML '22
  'conf/icml/VargaftikBPMBM22': {
    equalContribution: ['Shay Vargaftik', 'Ran Ben Basat', 'Amit Portnoy'],
    code: 'https://github.com/amitport/EDEN-Distributed-Mean-Estimation',
  },
  // SDR, ACL '22
  'conf/acl/CohenPFI22': {
    equalContribution: ['Nachshon Cohen', 'Amit Portnoy'],
  },
  // DRIVE, NeurIPS '21
  'conf/nips/VargaftikBPMBM21': {
    equalContribution: ['Shay Vargaftik', 'Ran Ben-Basat', 'Amit Portnoy'],
    code: 'https://github.com/amitport/DRIVE-One-bit-Distributed-Mean-Estimation',
  },
  // A generic decentralized trust management framework, Softw. Pract. Exp.
  'journals/spe/FriedmanP15': {
    note: 'Authors are listed alphabetically',
  },
  // arXiv preprint that was published in MDPI Applied Sciences (2022); not on DBLP.
  // Patch the CoRR record to point at the journal version.
  'journals/corr/abs-2004-04986': {
    title: 'Towards Federated Learning With Byzantine-Robust Client Weighting',
    type: 'journal',
    venue: "Applied Sciences '22",
    url: 'https://doi.org/10.3390/app12178847',
    code: 'https://github.com/amitport/Towards-Federated-Learning-with-Byzantine-Robust-Client-Weighting',
  },
};

export type PaperType = 'conference' | 'journal' | 'preprint';

export interface PaperAuthor {
  name: string;
  /** True when this author is marked as equal-contribution for this paper. */
  equal: boolean;
}

export interface Paper {
  key: string;
  title: string;
  authors: PaperAuthor[];
  year: number;
  venue: string;
  url: string;
  type: PaperType;
  note?: string;
  code?: string;
}

export type PaperSnapshot = Omit<Paper, 'authors' | 'note' | 'code'> & {
  authors: string[];
};

interface DblpAuthor {
  '#text': string;
  '@_pid'?: string;
  '@_orcid'?: string;
}

interface DblpEe {
  '#text': string;
  '@_type'?: string;
}

interface DblpEntry {
  '@_key': string;
  title: string;
  year: number | string;
  author: DblpAuthor[];
  ee?: (DblpEe | string)[];
  booktitle?: string;
  journal?: string;
  volume?: string;
}

const URL_PREFERENCE: RegExp[] = [
  /openreview\.net/,
  /proceedings\.mlr\.press/,
  /aclanthology\.org/,
  /proceedings\.neurips\.cc/,
  /papers\.nips\.cc/,
  /onlinelibrary\.wiley\.com/,
  /doi\.org/,
  /arxiv\.org/,
];

function bestUrl(ees: DblpEntry['ee']): string {
  if (!ees) return '';
  const list = ees
    .map((e) => (typeof e === 'string' ? e : e['#text']))
    .filter((u): u is string => Boolean(u));
  for (const re of URL_PREFERENCE) {
    const found = list.find((u) => re.test(u));
    if (found) return found;
  }
  return list[0] ?? '';
}

function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^\w]+/g, ' ')
    .trim();
}

function cleanTitle(t: string): string {
  return t.replace(/\.$/, '').trim();
}

function cleanAuthor(name: string): string {
  // DBLP disambiguates name collisions with a suffix like " 0001"; drop it for display.
  return name.replace(/\s+\d{4}$/, '');
}

function venueFor(entry: DblpEntry, type: PaperType): string {
  const yearShort = `'${String(entry.year).slice(-2)}`;
  if (type === 'conference' && entry.booktitle) {
    return `${String(entry.booktitle).replace(/\s*\(\d+\)$/, '')} ${yearShort}`;
  }
  if (type === 'preprint' && entry.volume) {
    return `arXiv ${String(entry.volume).replace(/^abs\//, '')}`;
  }
  if (entry.journal) {
    return `${entry.journal} ${yearShort}`;
  }
  return '';
}

function parseDblp(xml: string): Paper[] {
  if (XMLValidator.validate(xml) !== true) {
    throw new Error('DBLP returned invalid XML');
  }
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    isArray: (name) => ['author', 'ee', 'r'].includes(name),
  });
  const data = parser.parse(xml);
  const records: Array<Record<string, DblpEntry>> | undefined = data?.dblpperson?.r;
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('DBLP response contains no bibliography records (possibly a bot challenge)');
  }

  const papers: PaperSnapshot[] = [];
  for (const rec of records) {
    const entry: DblpEntry | undefined =
      rec.inproceedings ?? rec.article ?? rec.incollection ?? rec.book;
    if (!entry) continue;

    const key = entry['@_key'];
    if (SKIP_KEYS.has(key)) continue;

    const isInproceedings = Boolean(rec.inproceedings);
    const isCorr = String(entry.journal ?? '') === 'CoRR';
    const dblpType: PaperType = isInproceedings
      ? 'conference'
      : isCorr
        ? 'preprint'
        : 'journal';
    const rawAuthors = entry.author.map((a) =>
      cleanAuthor(typeof a === 'string' ? a : a['#text']),
    );

    papers.push({
      key,
      title: cleanTitle(String(entry.title)),
      authors: rawAuthors,
      year: Number(entry.year),
      venue: venueFor(entry, dblpType),
      url: bestUrl(entry.ee),
      type: dblpType,
    });
  }
  if (papers.length === 0) {
    throw new Error('DBLP response contains no usable publications');
  }
  return preparePapers(papers);
}

function preparePapers(entries: PaperSnapshot[]): Paper[] {
  const publishedTitles = new Set(
    entries.filter((p) => p.type !== 'preprint').map((p) => normalizeTitle(p.title)),
  );
  const papers = entries
    .filter((p) => !SKIP_KEYS.has(p.key))
    .filter((p) => !(p.type === 'preprint' && publishedTitles.has(normalizeTitle(p.title))))
    .map((paper): Paper => {
      const { key, authors: rawAuthors } = paper;
      const override = OVERRIDES[key];
      const equalSet = new Set(override?.equalContribution ?? []);
      const authors: PaperAuthor[] = rawAuthors.map((name) => ({
        name,
        equal: equalSet.has(name),
      }));

      // Warn loudly during build if an override references a name that's not on the paper:
      // catches typos and DBLP author renames so the markers don't silently disappear.
      for (const expected of equalSet) {
        if (!rawAuthors.includes(expected)) {
          console.warn(
            `[research] Override for ${key}: equalContribution name "${expected}" not found in DBLP authors [${rawAuthors.join(', ')}]`,
          );
        }
      }

      const hasEqual = authors.some((a) => a.equal);
      const noteParts: string[] = [];
      if (hasEqual) noteParts.push('* Equal contribution');
      if (override?.note) noteParts.push(override.note);

      return {
        ...paper,
        title: override?.title ?? paper.title,
        authors,
        venue: override?.venue ?? paper.venue,
        url: override?.url ?? paper.url,
        type: override?.type ?? paper.type,
        note: noteParts.length > 0 ? noteParts.join(' · ') : undefined,
        code: override?.code,
      };
    });

  // Drop CoRR preprints that have a published twin with the same title.
  const overriddenPublishedTitles = new Set(
    papers
      .filter((p) => p.type !== 'preprint')
      .map((p) => normalizeTitle(p.title)),
  );

  return papers
    .filter(
      (p) => !(p.type === 'preprint' && overriddenPublishedTitles.has(normalizeTitle(p.title))),
    )
    // Within each year, list conference/journal papers before standalone preprints.
    .sort(
      (a, b) =>
        b.year - a.year ||
        Number(a.type === 'preprint') - Number(b.type === 'preprint') ||
        a.title.localeCompare(b.title),
    );
}

async function loadPapers(): Promise<Paper[]> {
  try {
    const res = await fetch(DBLP_URL, {
      headers: { Accept: 'application/xml' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`DBLP responded ${res.status}`);
    const xml = await res.text();
    return parseDblp(xml);
  } catch (err) {
    console.warn(
      `[research] Failed to load DBLP feed (${DBLP_URL}); using checked-in publication snapshot. Cause:`,
      err,
    );
    return preparePapers(publicationSnapshot);
  }
}

export const papers: Paper[] = await loadPapers();
