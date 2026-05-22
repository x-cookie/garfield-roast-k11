import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get('repo');
  if (!repo) return NextResponse.json({ error: 'missing repo' }, { status: 400 });

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'garfield-roast/1.0',
  };
  const ghToken = process.env.GITHUB_TOKEN ?? '';
  if (ghToken && !ghToken.includes('...') && ghToken.length > 15) {
    headers['Authorization'] = `token ${ghToken}`;
  }

  let res = await fetch(`https://api.github.com/repos/${repo}`, { headers });

  // If token is invalid/revoked (401), retry without auth — public repos don't need it
  if (res.status === 401 && headers['Authorization']) {
    console.warn(`[repo-meta] Token rejected (401), retrying unauthenticated for "${repo}"`);
    delete headers['Authorization'];
    res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`[repo-meta] GitHub ${res.status} for "${repo}": ${body.slice(0, 200)}`);
    if (res.status === 403) {
      return NextResponse.json({ error: 'rate_limited', message: 'GitHub rate limit hit — set a valid GITHUB_TOKEN' }, { status: 503 });
    }
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const data = await res.json();
  return NextResponse.json(
    {
      name: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      language: data.language,
      defaultBranch: data.default_branch,
      isPrivate: data.private,
      size: data.size,
    },
    { headers: { 'Cache-Control': 's-maxage=300' } }
  );
}
