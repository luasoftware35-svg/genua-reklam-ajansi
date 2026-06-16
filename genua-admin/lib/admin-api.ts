export function adminUploadUrl() {
  const origin = process.env.NEXT_PUBLIC_ADMIN_ORIGIN?.replace(/\/$/, '');
  return origin ? `${origin}/api/admin/upload` : '/api/admin/upload';
}

export async function parseUploadResponse(response: Response) {
  const raw = await response.text();
  if (!raw) return { data: {} as { url?: string; error?: string }, raw: '' };

  try {
    return { data: JSON.parse(raw) as { url?: string; error?: string }, raw };
  } catch {
    return { data: {}, raw };
  }
}
