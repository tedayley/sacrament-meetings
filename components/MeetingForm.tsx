'use client';

import { useActionState, useState } from 'react';
import type { SacramentMeeting } from '@/lib/types';
import type { State } from '@/lib/actions';

interface MeetingFormProps {
  action: (prevState: State, formData: FormData) => Promise<State>;
  meeting?: SacramentMeeting;
}

interface MeetingFormValues {
  date: string;
  meetingType: string;
  presiding: string;
  conducting: string;
  announcements: string;
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  wardBusiness: string;
  stakeBusiness: boolean;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  speakers: string[];
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-sm text-red-300">
          {error}
        </p>
      ))}
    </div>
  );
}

const inputClassName = 'mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground';
const labelClassName = 'block text-sm font-medium text-foreground';

export default function MeetingForm({ action, meeting }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    message: null,
    errors: {},
  });
  const [values, setValues] = useState<MeetingFormValues>(() => ({
    date: meeting?.date ?? '',
    meetingType: meeting?.meetingType ?? 'regular',
    presiding: meeting?.presiding ?? '',
    conducting: meeting?.conducting ?? '',
    announcements: meeting?.announcements?.join('\n') ?? '',
    openingHymnNumber: meeting ? String(meeting.openingHymn.number) : '',
    openingHymnTitle: meeting?.openingHymn.title ?? '',
    openingPrayer: meeting?.openingPrayer ?? '',
    wardBusiness: meeting?.wardBusiness.map((item) => item.description).join('\n') ?? '',
    stakeBusiness: meeting?.stakeBusiness ?? false,
    sacramentHymnNumber: meeting ? String(meeting.sacramentHymn.number) : '',
    sacramentHymnTitle: meeting?.sacramentHymn.title ?? '',
    speakers: Array.from(
      { length: 3 },
      (_, index) => {
        const speaker = meeting?.speakers[index];
        return speaker
          ? `${speaker.name} | ${speaker.topic} | ${speaker.type === 'speaker' ? 'Speaker' : 'Musical Number'}`
          : '';
      }
    ),
    closingHymnNumber: meeting ? String(meeting.closingHymn.number) : '',
    closingHymnTitle: meeting?.closingHymn.title ?? '',
    closingPrayer: meeting?.closingPrayer ?? '',
  }));

  return (
    <form
      action={formAction}
      noValidate
      className="neon-panel space-y-6 rounded-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClassName}>Meeting date</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            value={values.date}
            onChange={(event) => setValues((current) => ({ ...current, date: event.target.value }))}
            aria-describedby="date-error"
            aria-invalid={Boolean(state.errors.date?.length)}
            className={inputClassName}
          />
          <FieldError id="date-error" errors={state.errors.date} />
        </div>

        <div>
          <label htmlFor="meetingType" className={labelClassName}>Meeting type</label>
          <select
            id="meetingType"
            name="meetingType"
            required
            value={values.meetingType}
            onChange={(event) => setValues((current) => ({ ...current, meetingType: event.target.value }))}
            aria-describedby="meetingType-error"
            aria-invalid={Boolean(state.errors.meetingType?.length)}
            className={inputClassName}
          >
            <option value="testimony">Testimony</option>
            <option value="regular">Regular</option>
            <option value="stake">Stake</option>
            <option value="general">General</option>
          </select>
          <FieldError id="meetingType-error" errors={state.errors.meetingType} />
        </div>

        <div>
          <label htmlFor="presiding" className={labelClassName}>Presiding</label>
          <input
            id="presiding"
            name="presiding"
            required
            value={values.presiding}
            onChange={(event) => setValues((current) => ({ ...current, presiding: event.target.value }))}
            aria-describedby="presiding-error"
            aria-invalid={Boolean(state.errors.presiding?.length)}
            className={inputClassName}
          />
          <FieldError id="presiding-error" errors={state.errors.presiding} />
        </div>

        <div>
          <label htmlFor="conducting" className={labelClassName}>Conducting</label>
          <input
            id="conducting"
            name="conducting"
            required
            value={values.conducting}
            onChange={(event) => setValues((current) => ({ ...current, conducting: event.target.value }))}
            aria-describedby="conducting-error"
            aria-invalid={Boolean(state.errors.conducting?.length)}
            className={inputClassName}
          />
          <FieldError id="conducting-error" errors={state.errors.conducting} />
        </div>
      </div>

      <div>
        <label htmlFor="announcements" className={labelClassName}>Announcements</label>
        <textarea
          id="announcements"
          name="announcements"
          rows={3}
          value={values.announcements}
          onChange={(event) => setValues((current) => ({ ...current, announcements: event.target.value }))}
          aria-describedby="announcements-error"
          aria-invalid={Boolean(state.errors.announcements?.length)}
          className={inputClassName}
        />
        <FieldError id="announcements-error" errors={state.errors.announcements} />
      </div>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 text-lg font-semibold text-foreground">Opening</legend>
        <div>
          <label htmlFor="openingHymnNumber" className={labelClassName}>Opening hymn number</label>
          <input
            id="openingHymnNumber"
            name="openingHymnNumber"
            type="number"
            min="1"
            required
            value={values.openingHymnNumber}
            onChange={(event) => setValues((current) => ({ ...current, openingHymnNumber: event.target.value }))}
            aria-describedby="openingHymnNumber-error"
            aria-invalid={Boolean(state.errors.openingHymnNumber?.length)}
            className={inputClassName}
          />
          <FieldError id="openingHymnNumber-error" errors={state.errors.openingHymnNumber} />
        </div>
        <div>
          <label htmlFor="openingHymnTitle" className={labelClassName}>Opening hymn title</label>
          <input
            id="openingHymnTitle"
            name="openingHymnTitle"
            required
            value={values.openingHymnTitle}
            onChange={(event) => setValues((current) => ({ ...current, openingHymnTitle: event.target.value }))}
            aria-describedby="openingHymnTitle-error"
            aria-invalid={Boolean(state.errors.openingHymnTitle?.length)}
            className={inputClassName}
          />
          <FieldError id="openingHymnTitle-error" errors={state.errors.openingHymnTitle} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="openingPrayer" className={labelClassName}>Opening prayer</label>
          <input
            id="openingPrayer"
            name="openingPrayer"
            required
            value={values.openingPrayer}
            onChange={(event) => setValues((current) => ({ ...current, openingPrayer: event.target.value }))}
            aria-describedby="openingPrayer-error"
            aria-invalid={Boolean(state.errors.openingPrayer?.length)}
            className={inputClassName}
          />
          <FieldError id="openingPrayer-error" errors={state.errors.openingPrayer} />
        </div>
      </fieldset>

      <div>
        <label htmlFor="wardBusiness" className={labelClassName}>Ward business</label>
        <textarea
          id="wardBusiness"
          name="wardBusiness"
          rows={3}
          value={values.wardBusiness}
          onChange={(event) => setValues((current) => ({ ...current, wardBusiness: event.target.value }))}
          aria-describedby="wardBusiness-error"
          aria-invalid={Boolean(state.errors.wardBusiness?.length)}
          className={inputClassName}
        />
        <FieldError id="wardBusiness-error" errors={state.errors.wardBusiness} />
      </div>

      <div>
        <label htmlFor="stakeBusiness" className="flex items-center gap-3 text-sm font-medium text-foreground">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            checked={values.stakeBusiness}
            onChange={(event) => setValues((current) => ({ ...current, stakeBusiness: event.target.checked }))}
            aria-describedby="stakeBusiness-error"
            aria-invalid={Boolean(state.errors.stakeBusiness?.length)}
            className="h-4 w-4 accent-neon-blue"
          />
          Stake business is scheduled
        </label>
        <FieldError id="stakeBusiness-error" errors={state.errors.stakeBusiness} />
      </div>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 text-lg font-semibold text-foreground">Sacrament</legend>
        <div>
          <label htmlFor="sacramentHymnNumber" className={labelClassName}>Sacrament hymn number</label>
          <input
            id="sacramentHymnNumber"
            name="sacramentHymnNumber"
            type="number"
            min="1"
            required
            value={values.sacramentHymnNumber}
            onChange={(event) => setValues((current) => ({ ...current, sacramentHymnNumber: event.target.value }))}
            aria-describedby="sacramentHymnNumber-error"
            aria-invalid={Boolean(state.errors.sacramentHymnNumber?.length)}
            className={inputClassName}
          />
          <FieldError id="sacramentHymnNumber-error" errors={state.errors.sacramentHymnNumber} />
        </div>
        <div>
          <label htmlFor="sacramentHymnTitle" className={labelClassName}>Sacrament hymn title</label>
          <input
            id="sacramentHymnTitle"
            name="sacramentHymnTitle"
            required
            value={values.sacramentHymnTitle}
            onChange={(event) => setValues((current) => ({ ...current, sacramentHymnTitle: event.target.value }))}
            aria-describedby="sacramentHymnTitle-error"
            aria-invalid={Boolean(state.errors.sacramentHymnTitle?.length)}
            className={inputClassName}
          />
          <FieldError id="sacramentHymnTitle-error" errors={state.errors.sacramentHymnTitle} />
        </div>
      </fieldset>

      <div>
        <p className={labelClassName}>Speakers and musical numbers</p>
        <p id="speakers-help" className="mt-1 text-sm text-muted">
          Fill in at least one of the three fields. Leave unused fields blank. Use this exact format:
          {' '}
          <code className="text-foreground">Jane Smith | Faith in Jesus Christ | Speaker</code>
          . For a musical number, replace “Speaker” with “Musical Number”.
        </p>
        <div className="mt-3 space-y-3">
          {values.speakers.map((speaker, index) => {
            const id = `speaker-${index + 1}`;
            return (
              <div key={id} className="sm:grid sm:grid-cols-[8rem_1fr] sm:items-center sm:gap-4">
                <label htmlFor={id} className={labelClassName}>
                  Speaker or musical number {index + 1}
                </label>
                <input
                  id={id}
                  name="speakers"
                  value={speaker}
                  onChange={(event) => setValues((current) => ({
                    ...current,
                    speakers: current.speakers.map((line, lineIndex) =>
                      lineIndex === index ? event.target.value : line
                    ),
                  }))}
                  placeholder="Name | Topic | Speaker or Musical Number"
                  aria-describedby="speakers-help speakers-error"
                  aria-invalid={Boolean(state.errors.speakers?.length)}
                  className={inputClassName}
                />
              </div>
            );
          })}
        </div>
        <FieldError id="speakers-error" errors={state.errors.speakers} />
      </div>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 text-lg font-semibold text-foreground">Closing</legend>
        <div>
          <label htmlFor="closingHymnNumber" className={labelClassName}>Closing hymn number</label>
          <input
            id="closingHymnNumber"
            name="closingHymnNumber"
            type="number"
            min="1"
            required
            value={values.closingHymnNumber}
            onChange={(event) => setValues((current) => ({ ...current, closingHymnNumber: event.target.value }))}
            aria-describedby="closingHymnNumber-error"
            aria-invalid={Boolean(state.errors.closingHymnNumber?.length)}
            className={inputClassName}
          />
          <FieldError id="closingHymnNumber-error" errors={state.errors.closingHymnNumber} />
        </div>
        <div>
          <label htmlFor="closingHymnTitle" className={labelClassName}>Closing hymn title</label>
          <input
            id="closingHymnTitle"
            name="closingHymnTitle"
            required
            value={values.closingHymnTitle}
            onChange={(event) => setValues((current) => ({ ...current, closingHymnTitle: event.target.value }))}
            aria-describedby="closingHymnTitle-error"
            aria-invalid={Boolean(state.errors.closingHymnTitle?.length)}
            className={inputClassName}
          />
          <FieldError id="closingHymnTitle-error" errors={state.errors.closingHymnTitle} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="closingPrayer" className={labelClassName}>Closing prayer</label>
          <input
            id="closingPrayer"
            name="closingPrayer"
            required
            value={values.closingPrayer}
            onChange={(event) => setValues((current) => ({ ...current, closingPrayer: event.target.value }))}
            aria-describedby="closingPrayer-error"
            aria-invalid={Boolean(state.errors.closingPrayer?.length)}
            className={inputClassName}
          />
          <FieldError id="closingPrayer-error" errors={state.errors.closingPrayer} />
        </div>
      </fieldset>

      {state.message && (
        <p role="alert" className="text-sm text-red-300" aria-live="polite">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="neon-button rounded-md px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Saving meeting...' : meeting ? 'Save changes' : 'Create meeting'}
      </button>
    </form>
  );
}
