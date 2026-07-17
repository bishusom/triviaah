import { createHmac } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const REPORT_TYPES = new Set([
  'wrong_answer',
  'wrong_question',
  'ambiguous',
  'wrong_titbit',
  'outdated',
  'broken_image',
  'other',
]);

type CreateReportBody = {
  questionId?: unknown;
  reportType?: unknown;
  details?: unknown;
  suggestedCorrection?: unknown;
  sourceUrl?: unknown;
  visitorId?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function getClientAddress(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return (
    forwardedFor?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}

function hashIdentifier(value: string) {
  const secret =
    process.env.TRIVIA_REPORT_HASH_SECRET
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!secret) {
    throw new Error('Trivia report hashing secret is not configured.');
  }

  return createHmac('sha256', secret).update(value).digest('hex');
}

function isValidSourceUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch((): CreateReportBody => ({}));
    const questionId = cleanText(body.questionId, 100);
    const reportType = cleanText(body.reportType, 50);
    const details = cleanText(body.details, 1000);
    const suggestedCorrection = cleanText(body.suggestedCorrection, 1000);
    const sourceUrl = cleanText(body.sourceUrl, 2000);
    const visitorId = cleanText(body.visitorId, 100);

    if (!questionId || !REPORT_TYPES.has(reportType)) {
      return NextResponse.json(
        { error: 'Question ID and a valid issue type are required.' },
        { status: 400 }
      );
    }

    if (!isValidSourceUrl(sourceUrl)) {
      return NextResponse.json(
        { error: 'The supporting source must be a valid HTTP or HTTPS URL.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase is not configured.');
    }

    const authorization = request.headers.get('authorization');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: authorization
        ? { headers: { Authorization: authorization } }
        : undefined,
    });

    const address = getClientAddress(request);
    const reporterKeyHash = hashIdentifier(
      visitorId ? `visitor:${visitorId}` : `address:${address}`
    );
    const abuseKeyHash = hashIdentifier(`address:${address}`);

    const { data, error } = await supabase.rpc(
      'submit_trivia_question_report',
      {
        p_question_id: questionId,
        p_report_type: reportType,
        p_details: details || null,
        p_suggested_correction: suggestedCorrection || null,
        p_source_url: sourceUrl || null,
        p_reporter_key_hash: reporterKeyHash,
        p_abuse_key_hash: abuseKeyHash,
      }
    );

    if (error) {
      if (error.code === 'P0002') {
        return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
      }

      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Too many reports. Please try again later.' },
          { status: 429 }
        );
      }

      console.error('Failed to submit trivia question report:', error);
      return NextResponse.json(
        { error: 'Could not submit the report.' },
        { status: 500 }
      );
    }

    const result = Array.isArray(data) ? data[0] : data;

    return NextResponse.json({
      success: true,
      id: result?.report_id,
      duplicate: Boolean(result?.was_duplicate),
    });
  } catch (error) {
    console.error('Trivia report API error:', error);
    return NextResponse.json(
      { error: 'Could not submit the report.' },
      { status: 500 }
    );
  }
}
