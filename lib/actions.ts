'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import {
  createMeeting as createMeetingRecord,
  deleteMeeting as deleteMeetingRecord,
  updateMeeting as updateMeetingRecord,
} from './meetings-db';

const meetingTypes = ['testimony', 'regular', 'stake', 'general'] as const;
const validDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const positiveInteger = (label: string) =>
  z.string()
    .regex(/^[1-9]\d*$/, `${label} must be a positive whole number.`)
    .transform(Number);

const lineList = (value: string) =>
  value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

const speakerLineSchema = z.string()
  .superRefine((value, context) => {
    if (!value.trim()) {
      return;
    }

    const [name, topic, type, ...extra] = value.split('|').map((part) => part.trim());
    const normalizedType = type?.toLowerCase().replace(/\s+/g, '-');
    if (
      !name
      || !topic
      || extra.length > 0
      || (normalizedType && normalizedType !== 'speaker' && normalizedType !== 'musical-number')
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Use “Name | Topic | Speaker or Musical Number”.',
      });
    }
  });

const speakersSchema = z.array(speakerLineSchema)
  .max(3, 'Enter no more than three speakers or musical numbers.')
  .transform((lines) =>
    lines.filter((line) => line.trim()).map((line) => {
      const [name, topic, type] = line.split('|').map((part) => part.trim());
      const normalizedType = type?.toLowerCase().replace(/\s+/g, '-');
      return {
        name,
        topic,
        type: normalizedType === 'musical-number'
          ? 'musical-number' as const
          : 'speaker' as const,
      };
    })
  )
  .refine((speakers) => speakers.length > 0, {
    message: 'Enter at least one speaker or musical number.',
  });

const MeetingFormSchema = z.object({
  date: z.string().refine(validDate, 'Enter a valid meeting date.'),
  meetingType: z.enum(meetingTypes),
  presiding: z.string().trim().min(1, 'Enter the name of the presiding leader.'),
  conducting: z.string().trim().min(1, 'Enter the name of the conducting leader.'),
  announcements: z.string().transform(lineList),
  openingHymnNumber: positiveInteger('Opening hymn number'),
  openingHymnTitle: z.string().trim().min(1, 'Enter the opening hymn title.'),
  openingPrayer: z.string().trim().min(1, 'Enter the opening prayer.'),
  wardBusiness: z.string().transform((value) =>
    lineList(value).map((description) => ({ description }))
  ),
  stakeBusiness: z.preprocess(
    (value) => value === 'on',
    z.boolean()
  ),
  sacramentHymnNumber: positiveInteger('Sacrament hymn number'),
  sacramentHymnTitle: z.string().trim().min(1, 'Enter the sacrament hymn title.'),
  speakers: speakersSchema,
  closingHymnNumber: positiveInteger('Closing hymn number'),
  closingHymnTitle: z.string().trim().min(1, 'Enter the closing hymn title.'),
  closingPrayer: z.string().trim().min(1, 'Enter the closing prayer.'),
});

export type State = {
  message: string | null;
  errors: Partial<Record<keyof z.input<typeof MeetingFormSchema>, string[]>>;
};

async function requireAuthenticatedUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be signed in to manage meetings.');
  }
}

async function validateMeetingForm(formData: FormData) {
  return MeetingFormSchema.safeParse({
    ...Object.fromEntries(formData),
    speakers: formData.getAll('speakers'),
  });
}

export async function createMeeting(
  prevState: State,
  formData: FormData
): Promise<State> {
  void prevState;
  await requireAuthenticatedUser();
  const result = await validateMeetingForm(formData);

  if (!result.success) {
    return {
      message: 'Please correct the highlighted fields.',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;
  try {
    await createMeetingRecord({
      date: data.date,
      meetingType: data.meetingType,
      presiding: data.presiding,
      conducting: data.conducting,
      announcements: data.announcements,
      openingHymn: {
        number: data.openingHymnNumber,
        title: data.openingHymnTitle,
      },
      openingPrayer: data.openingPrayer,
      wardBusiness: data.wardBusiness,
      stakeBusiness: data.stakeBusiness,
      sacramentHymn: {
        number: data.sacramentHymnNumber,
        title: data.sacramentHymnTitle,
      },
      speakers: data.speakers,
      closingHymn: {
        number: data.closingHymnNumber,
        title: data.closingHymnTitle,
      },
      closingPrayer: data.closingPrayer,
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return {
      message: 'We could not save this meeting. Please try again.',
      errors: {},
    };
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  void prevState;
  await requireAuthenticatedUser();
  if (!/^[1-9]\d*$/.test(id)) {
    return { message: 'The meeting ID is invalid.', errors: {} };
  }

  const meetingId = Number(id);
  if (!Number.isSafeInteger(meetingId) || meetingId <= 0) {
    return { message: 'The meeting ID is invalid.', errors: {} };
  }

  const result = await validateMeetingForm(formData);
  if (!result.success) {
    return {
      message: 'Please correct the highlighted fields.',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;
  try {
    const updated = await updateMeetingRecord(meetingId, {
      date: data.date,
      meetingType: data.meetingType,
      presiding: data.presiding,
      conducting: data.conducting,
      announcements: data.announcements,
      openingHymn: {
        number: data.openingHymnNumber,
        title: data.openingHymnTitle,
      },
      openingPrayer: data.openingPrayer,
      wardBusiness: data.wardBusiness,
      stakeBusiness: data.stakeBusiness,
      sacramentHymn: {
        number: data.sacramentHymnNumber,
        title: data.sacramentHymnTitle,
      },
      speakers: data.speakers,
      closingHymn: {
        number: data.closingHymnNumber,
        title: data.closingHymnTitle,
      },
      closingPrayer: data.closingPrayer,
    });

    if (!updated) {
      return {
        message: 'This meeting no longer exists and could not be updated.',
        errors: {},
      };
    }
  } catch (error) {
    console.error('Error updating meeting:', error);
    return {
      message: 'We could not update this meeting. Please try again.',
      errors: {},
    };
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function deleteMeeting(
  id: number,
  prevState: State
): Promise<State> {
  void prevState;
  await requireAuthenticatedUser();
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { message: 'The meeting ID is invalid.', errors: {} };
  }

  try {
    const deleted = await deleteMeetingRecord(id);
    if (!deleted) {
      return {
        message: 'This meeting no longer exists and could not be deleted.',
        errors: {},
      };
    }
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return {
      message: 'We could not delete this meeting. Please try again.',
      errors: {},
    };
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}
