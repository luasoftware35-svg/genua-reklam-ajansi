type MetricItem = {
  _type?: string;
  title?: string;
  lead?: string;
  value?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  duration?: number;
};

function parseMetrics(raw: unknown): MetricItem[] {
  if (Array.isArray(raw)) return raw as MetricItem[];
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function normalizeProjectRow(row: Record<string, unknown>) {
  const metrics = parseMetrics(row.metrics);
  const hero = metrics.find((item) => item?._type === 'hero');
  if (!hero) return row;

  return {
    ...row,
    case_hero_title: row.case_hero_title || hero.title || null,
    case_hero_lead: row.case_hero_lead || hero.lead || null,
    metrics: metrics.filter((item) => item?._type !== 'hero'),
  };
}

export function stripProjectHeroFields(payload: Record<string, unknown>) {
  const { case_hero_title, case_hero_lead, metrics, ...rest } = payload;
  const nextMetrics = parseMetrics(metrics);
  if (case_hero_title || case_hero_lead) {
    nextMetrics.unshift({
      _type: 'hero',
      title: case_hero_title ? String(case_hero_title) : undefined,
      lead: case_hero_lead ? String(case_hero_lead) : undefined,
    });
  }
  return { ...rest, metrics: nextMetrics };
}
