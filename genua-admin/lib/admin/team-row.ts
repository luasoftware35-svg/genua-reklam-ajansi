export function stripTeamResumeField(payload: Record<string, unknown>) {
  const next = { ...payload };
  delete next.resume_content;
  return next;
}
