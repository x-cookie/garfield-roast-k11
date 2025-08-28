import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const repo = req.nextUrl.searchParams.get('repo');
  if (!repo) return NextResponse.json({ error: 'missing repo' }, { status: 400 });

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'garfield-roast/1.0',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (!res.ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });

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
