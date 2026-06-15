'use client';

export function ConfirmSubmit({ children }: { children: React.ReactNode }) {
  return (
    <button className="btn btn-danger" type="submit" onClick={(event) => { if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) event.preventDefault(); }}>
      {children}
    </button>
  );
}
