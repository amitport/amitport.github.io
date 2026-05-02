import { XMLParser } from 'fast-xml-parser';

/**
 * Build-time fetch of the author's publication list from DBLP.
 * DBLP is the canonical bibliography for CS and is what OpenReview imports from.
 *
 * Edit `DBLP_PID` if the author identifier changes.
 * Edit `SKIP_KEYS` for the rare case where a preprint and its published version
 *   have different titles and the auto-dedupe can't tell they're the same work.
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
}

const OVERRIDES: Record<string, PaperOverride> = {
  // Accelerating Federated Learning with Quick Distributed Mean Estimation, ICML '24
  'conf/icml/Ben-BasatVPEBM24': {
    equalContribution: ['Ran Ben-Basat', 'Shay Vargaftik', 'Amit Portnoy'],
  },
  // EDEN, ICML '22
  'conf/icml/VargaftikBPMBM22': {
    equalContribution: ['Shay Vargaftik', 'Ran Ben Basat', 'Amit Portnoy'],
  },
  // SDR, ACL '22
  'conf/acl/CohenPFI22': {
    equalContribution: ['Nachshon Cohen', 'Amit Portnoy'],
  },
  // DRIVE, NeurIPS '21
  'conf/nips/VargaftikBPMBM21': {
    equalContribution: ['Shay Vargaftik', 'Ran Ben-Basat', 'Amit Portnoy'],
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
}

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
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    isArray: (name) => ['author', 'ee', 'r'].includes(name),
  });
  const data = parser.parse(xml);
  const records: Array<Record<string, DblpEntry>> = data?.dblpperson?.r ?? [];

  const papers: Paper[] = [];
  for (const rec of records) {
    const entry: DblpEntry | undefined =
      rec.inproceedings ?? rec.article ?? rec.incollection ?? rec.book;
    if (!entry) continue;

    const key = entry['@_key'];
    if (SKIP_KEYS.has(key)) continue;

    const override = OVERRIDES[key];

    const isInproceedings = Boolean(rec.inproceedings);
    const isCorr = String(entry.journal ?? '') === 'CoRR';
    const dblpType: PaperType = isInproceedings
      ? 'conference'
      : isCorr
        ? 'preprint'
        : 'journal';
    const type: PaperType = override?.type ?? dblpType;

    const rawAuthors = entry.author.map((a) =>
      cleanAuthor(typeof a === 'string' ? a : a['#text']),
    );

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

    papers.push({
      key,
      title: override?.title ?? cleanTitle(String(entry.title)),
      authors,
      year: Number(entry.year),
      venue: override?.venue ?? venueFor(entry, type),
      url: override?.url ?? bestUrl(entry.ee),
      type,
      note: noteParts.length > 0 ? noteParts.join(' · ') : undefined,
    });
  }

  // Drop CoRR preprints that have a published twin with the same title.
  const publishedTitles = new Set(
    papers
      .filter((p) => p.type !== 'preprint')
      .map((p) => normalizeTitle(p.title)),
  );

  return papers
    .filter(
      (p) => !(p.type === 'preprint' && publishedTitles.has(normalizeTitle(p.title))),
    )
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

async function loadPapers(): Promise<Paper[]> {
  try {
    const res = await fetch(DBLP_URL, {
      headers: { Accept: 'application/xml' },
    });
    if (!res.ok) throw new Error(`DBLP responded ${res.status}`);
    const xml = await res.text();
    return parseDblp(xml);
  } catch (err) {
    // Don't fail the whole build if DBLP is unreachable (e.g. offline dev).
    console.warn(
      `[research] Failed to fetch DBLP feed (${DBLP_URL}); rendering empty list. Cause:`,
      err,
    );
    return [];
  }
}

export const papers: Paper[] = await loadPapers();
