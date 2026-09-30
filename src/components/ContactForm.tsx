'use client';

import { memo, useCallback, useEffect, useReducer, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useDebouncedValue } from '@/lib/hooks';
import { TEAM_SIZES, validateEmail, validateLead, type LeadErrors } from '@/lib/validation';

type Option = { value: string; label: string };
type Values = {
  name: string;
  email: string;
  agency: string;
  website: string;
  teamSize: string;
  interest: string;
  message: string;
  company_url: string; // honeypot
};
type FieldName = keyof Values;

const initial: Values = { name: '', email: '', agency: '', website: '', teamSize: '', interest: '', message: '', company_url: '' };

function reducer(state: Values, action: { name: FieldName; value: string }): Values {
  return state[action.name] === action.value ? state : { ...state, [action.name]: action.value };
}

type FieldProps = {
  name: FieldName;
  label: string;
  value: string;
  error?: string;
  optional?: boolean;
  full?: boolean;
  type?: string;
  autoComplete?: string;
  options?: Option[];
  textarea?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: { target: { name: string } }) => void;
};

/**
 * memo + stable handlers: typing in one field re-renders only that field,
 * not the whole form.
 */
const Field = memo(function Field({ name, label, value, error, optional, full, type = 'text', autoComplete, options, textarea, onChange, onBlur }: FieldProps) {
  const id = `f-${name}`;
  const errId = `${id}-err`;
  const common = {
    id,
    name,
    value,
    onChange,
    onBlur,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errId : undefined,
  };
  return (
    <div className={full ? 'field full' : 'field'} data-invalid={error ? 'true' : undefined}>
      <label htmlFor={id}>
        {label} {optional ? <em>(optional)</em> : null}
      </label>
      {options ? (
        <select {...common}>
          <option value="">Choose…</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea {...common} maxLength={2000} />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} />
      )}
      <span className="err" id={errId} role={error ? 'alert' : undefined}>
        {error ?? ''}
      </span>
    </div>
  );
});

type Props = { interests: Option[]; bookingUrl?: string; email: string };

export default function ContactForm({ interests, bookingUrl, email }: Props) {
  const [values, dispatch] = useReducer(reducer, initial);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [alert, setAlert] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const allowed = interests.map((o) => o.value);

  // Prefill from ?system=… or ?plan=… without making the page dynamic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const system = params.get('system');
    const plan = params.get('plan');
    if (system && allowed.includes(system)) dispatch({ name: 'interest', value: system });
    if (plan && /^[a-z]{3,20}$/.test(plan)) {
      dispatch({ name: 'message', value: `I'm interested in the ${plan.charAt(0).toUpperCase()}${plan.slice(1)} plan.` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    dispatch({ name: e.target.name as FieldName, value: e.target.value });
  }, []);
  const onBlur = useCallback((e: { target: { name: string } }) => {
    const name = e.target.name as FieldName;
    setTouched((t) => (t[name] ? t : { ...t, [name]: true }));
  }, []);

  // Email is checked while typing, but only after the user pauses (debounced)
  const debouncedEmail = useDebouncedValue(values.email, 350);
  const liveEmailError = debouncedEmail ? validateEmail(debouncedEmail) : undefined;

  const check = validateLead(values, allowed);
  const clientErrors: LeadErrors = check.ok ? {} : check.errors;
  const errorFor = (name: keyof LeadErrors): string | undefined => {
    if (serverErrors[name]) return serverErrors[name];
    if (name === 'email' && values.email && liveEmailError) return liveEmailError;
    return touched[name] ? clientErrors[name] : undefined;
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    setServerErrors({});
    setAlert('');
    const result = validateLead(values, allowed);
    if (!result.ok) {
      setTouched({ name: true, email: true, agency: true, website: true, teamSize: true, interest: true, message: true });
      const first = Object.keys(result.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, source: `${window.location.pathname}${window.location.search}` }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: LeadErrors };
      if (res.ok) {
        setStatus('success');
        return;
      }
      if (res.status === 422 && data.errors) setServerErrors(data.errors);
      setAlert(data.error ?? `Something went wrong. Email us at ${email} instead.`);
      setStatus('error');
    } catch {
      setAlert(`Network error. Check your connection, or email us at ${email}.`);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status">
        <h2>Got it, {values.name.split(' ')[0]}.</h2>
        <p className="lead">
          We&apos;ll email <strong>{values.email}</strong> to set up your free 30-minute automation audit.
        </p>
        {bookingUrl ? (
          <p style={{ marginTop: 24 }}>
            <a className="btn btn-black" href={bookingUrl} target="_blank" rel="noopener noreferrer">
              Or pick a time now ↗
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit} aria-describedby="form-note">
      {alert ? (
        <p className="form-alert" role="alert">
          {alert}
        </p>
      ) : null}
      <Field name="name" label="Your name" value={values.name} error={errorFor('name')} autoComplete="name" onChange={onChange} onBlur={onBlur} />
      <Field name="email" label="Work email" type="email" value={values.email} error={errorFor('email')} autoComplete="email" onChange={onChange} onBlur={onBlur} />
      <Field name="agency" label="Agency" value={values.agency} error={errorFor('agency')} autoComplete="organization" onChange={onChange} onBlur={onBlur} />
      <Field name="website" label="Website" optional value={values.website} error={errorFor('website')} autoComplete="url" onChange={onChange} onBlur={onBlur} />
      <Field
        name="teamSize"
        label="Team size"
        value={values.teamSize}
        error={errorFor('teamSize')}
        options={TEAM_SIZES.map((t) => ({ value: t, label: `${t} people` }))}
        onChange={onChange}
        onBlur={onBlur}
      />
      <Field name="interest" label="Automate first" value={values.interest} error={errorFor('interest')} options={interests} onChange={onChange} onBlur={onBlur} />
      <Field
        name="message"
        label="What eats your team's time?"
        optional
        full
        textarea
        value={values.message}
        error={errorFor('message')}
        onChange={onChange}
        onBlur={onBlur}
      />
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-company_url">Leave this empty</label>
        <input id="f-company_url" name="company_url" tabIndex={-1} autoComplete="off" value={values.company_url} onChange={onChange} />
      </div>
      <div className="form-foot">
        <p id="form-note">No pitch. No pressure. We only use your details to reply to you.</p>
        <button className="btn btn-black btn-lg" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Book My Free Audit →'}
        </button>
      </div>
    </form>
  );
}
