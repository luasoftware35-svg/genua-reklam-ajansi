import Link from 'next/link';
import { createResource, saveSettings, updateResource } from '@/app/admin/(dashboard)/actions';
import { type ResourceConfig, type ResourceField } from '@/lib/admin/resources';
import { ImageUpload } from './ImageUpload';
import { RichTextEditor } from './RichTextEditor';

function valueFor(row: Record<string, unknown> | null | undefined, field: ResourceField) {
  const value = row?.[field.name];
  if (field.name === 'initials' && typeof row?.logo_url === 'string' && row.logo_url.startsWith('initials:')) {
    return row.logo_url.slice(9);
  }
  if (field.name === 'logo_url' && typeof value === 'string' && value.startsWith('initials:')) return '';
  if (value == null) return '';
  if (field.type === 'tags' && Array.isArray(value)) return value.join(', ');
  if (field.type === 'json') return JSON.stringify(value, null, 2);
  if (field.type === 'datetime' && typeof value === 'string') return value.slice(0, 16);
  return String(value);
}

function Field({ field, row }: { field: ResourceField; row?: Record<string, unknown> | null }) {
  const current = valueFor(row, field);
  const wrapperClass = `field ${field.full || ['textarea', 'richtext', 'json'].includes(field.type) ? 'full' : ''}`;

  if (field.type === 'checkbox') {
    return <label className={wrapperClass} style={{ alignContent: 'start' }}><span>{field.label}</span><input type="checkbox" name={field.name} defaultChecked={Boolean(row?.[field.name])} /></label>;
  }

  if (field.type === 'select') {
    return <div className={wrapperClass}><label>{field.label}</label><select className="select" name={field.name} defaultValue={current}>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>;
  }

  if (field.type === 'richtext') {
    return <div className={wrapperClass}><label>{field.label}</label><RichTextEditor name={field.name} defaultValue={current} /></div>;
  }

  if (field.type === 'textarea' || field.type === 'json') {
    return <div className={wrapperClass}><label>{field.label}</label><textarea className="textarea" name={field.name} defaultValue={current} required={field.required} placeholder={field.placeholder} /></div>;
  }

  if (field.type === 'image') {
    return <div className={wrapperClass}><label>{field.label}</label><ImageUpload name={field.name} defaultValue={current} /></div>;
  }

  const type = field.type === 'tags' ? 'text' : field.type;
  return <div className={wrapperClass}><label>{field.label}</label><input className="input" name={field.name} type={type} defaultValue={current} required={field.required} placeholder={field.placeholder} readOnly={field.readOnly} /></div>;
}

export function ResourceForm({ config, row }: { config: ResourceConfig; row?: Record<string, unknown> | null }) {
  const id = row?.id ? String(row.id) : null;
  const action = config.single ? saveSettings.bind(null, id) : id ? updateResource.bind(null, config.key, id) : createResource.bind(null, config.key);

  return (
    <form action={action} className="card card-pad">
      <div className="form-grid">
        {config.fields.map((field) => <Field key={field.name} field={field} row={row} />)}
      </div>
      <div className="actions" style={{ marginTop: 22 }}>
        <button className="btn btn-primary" type="submit">Kaydet</button>
        <Link className="btn" href={`/admin/${config.key}`}>Vazgeç</Link>
      </div>
    </form>
  );
}
