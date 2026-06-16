import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteResource } from '@/app/admin/(dashboard)/actions';
import { ConfirmSubmit } from './ConfirmDialog';

function show(value: unknown, column?: string) {
  if (column === 'logo_url' && typeof value === 'string' && value) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={value} alt="" style={{ width: 56, height: 36, objectFit: 'contain', background: '#f8f8f0', borderRadius: 8, padding: 4 }} />
    );
  }
  if (value === true) return <span className="badge">Aktif</span>;
  if (value === false) return <span className="badge">Pasif</span>;
  if (Array.isArray(value)) return value.join(', ');
  if (value && typeof value === 'object') return JSON.stringify(value).slice(0, 80);
  if (typeof value === 'string' && value.length > 80) return `${value.slice(0, 80)}...`;
  return value ? String(value) : '-';
}

export function DataTable({ resourceKey, columns, rows }: { resourceKey: string; columns: string[]; rows: Array<Record<string, unknown>> }) {
  if (rows.length === 0) return <div className="card card-pad">Henüz kayıt yok.</div>;
  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}<th>İşlem</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row.id)}>
              {columns.map((column) => <td key={column}>{show(row[column], column)}</td>)}
              <td>
                <div className="actions">
                  <Link className="btn" href={`/admin/${resourceKey}/${row.id}`}><Pencil size={15} /> Düzenle</Link>
                  <form action={deleteResource.bind(null, resourceKey, String(row.id))}>
                    <ConfirmSubmit><Trash2 size={15} /> Sil</ConfirmSubmit>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
