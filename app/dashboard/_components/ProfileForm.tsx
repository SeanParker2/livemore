
'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/lib/actions/user-actions';

import { ActionResponse } from '@/lib/types';

const initialState: ActionResponse = {
  success: false,
  message: '',
};

export function ProfileForm({ fullName }: { fullName: string | null }) {
  const [state, formAction] = useFormState(updateProfile, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success('Success', { description: state.message });
      } else {
        toast.error('Error', { description: state.message });
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">昵称</Label>
        <Input id="fullName" name="fullName" defaultValue={fullName ?? ''} />
      </div>
      <Button type="submit">更新昵称</Button>
    </form>
  );
}
