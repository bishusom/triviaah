'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Flag, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const REPORT_OPTIONS = [
  { value: 'wrong_answer', label: 'The marked answer is incorrect' },
  { value: 'wrong_question', label: 'The question is incorrect or unclear' },
  { value: 'ambiguous', label: 'More than one answer could be correct' },
  { value: 'wrong_titbit', label: 'The fun fact is incorrect' },
  { value: 'outdated', label: 'This information is outdated' },
  { value: 'broken_image', label: 'The image is wrong or broken' },
  { value: 'other', label: 'Something else' },
] as const;

type ReportType = (typeof REPORT_OPTIONS)[number]['value'];

function getVisitorId() {
  const storageKey = 'triviaah_reporter_id';
  const existingId = window.localStorage.getItem(storageKey);
  if (existingId) return existingId;

  const newId = crypto.randomUUID();
  window.localStorage.setItem(storageKey, newId);
  return newId;
}

export default function QuestionReport({
  questionId,
  onOpenChange,
}: {
  questionId: string;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('wrong_answer');
  const [details, setDetails] = useState('');
  const [suggestedCorrection, setSuggestedCorrection] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const changeOpen = useCallback((nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen);
    onOpenChange?.(nextIsOpen);
  }, [onOpenChange]);

  useEffect(() => {
    setIsOpen(false);
    setReportType('wrong_answer');
    setDetails('');
    setSuggestedCorrection('');
    setSourceUrl('');
    setIsSubmitting(false);
    setIsSubmitted(false);
    setError('');
  }, [questionId]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) changeOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeOpen, isOpen, isSubmitting]);

  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch('/api/trivia-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          questionId,
          reportType,
          details,
          suggestedCorrection,
          sourceUrl,
          visitorId: getVisitorId(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Could not submit the report.');
      }

      setIsSubmitted(true);
      changeOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not submit the report.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300">
        <CheckCircle2 size={14} />
        Thanks—report received
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => changeOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-amber-200"
      >
        <Flag size={14} />
        Flag an issue
      </button>

      {isOpen && createPortal(
        (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !isSubmitting) {
                changeOpen(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="question-report-title"
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900 p-5 text-left shadow-2xl sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="question-report-title"
                    className="text-lg font-bold text-white"
                  >
                    Flag an issue
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Help us correct inaccurate or unclear trivia.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close report dialog"
                  disabled={isSubmitting}
                  onClick={() => changeOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitReport} className="space-y-4">
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-gray-200">
                    What seems wrong?
                  </legend>
                  <div className="space-y-2">
                    {REPORT_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-sm text-gray-200 hover:border-gray-600"
                      >
                        <input
                          type="radio"
                          name="reportType"
                          value={option.value}
                          checked={reportType === option.value}
                          onChange={() => setReportType(option.value)}
                          className="mt-0.5 accent-cyan-500"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-200">
                    Details <span className="font-normal text-gray-500">(optional)</span>
                  </span>
                  <textarea
                    value={details}
                    onChange={(event) => setDetails(event.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Tell us what appears to be wrong."
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-200">
                    Suggested correction{' '}
                    <span className="font-normal text-gray-500">(optional)</span>
                  </span>
                  <textarea
                    value={suggestedCorrection}
                    onChange={(event) => setSuggestedCorrection(event.target.value)}
                    maxLength={1000}
                    rows={2}
                    placeholder="What should it say instead?"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-200">
                    Supporting source{' '}
                    <span className="font-normal text-gray-500">(optional)</span>
                  </span>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(event) => setSourceUrl(event.target.value)}
                    maxLength={2000}
                    placeholder="https://example.com/source"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-500"
                  />
                </label>

                {error && (
                  <p role="alert" className="text-sm text-red-300">
                    {error}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => changeOpen(false)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-w-32 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    {isSubmitting ? 'Submitting…' : 'Submit report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ),
        document.body
      )}
    </>
  );
}
