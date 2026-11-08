'use client';
import { useRef, useState } from 'react';
import { Icon } from './Icons';
export const EMAIL = 'krayyemjawad@gmail.com';
export default function ContactActions() {
  const [message, setMessage] = useState('');
  const address = useRef<HTMLInputElement>(null);
  async function copy() {
    try { await navigator.clipboard.writeText(EMAIL); setMessage('Email copied to clipboard.'); }
    catch { setMessage('Select and copy the email address below.'); requestAnimationFrame(() => { address.current?.focus(); address.current?.select(); }); }
  }
  return <div className="contact-actions"><div className="button-row"><a className="button-primary" href={`mailto:${EMAIL}`}>Send an email <Icon name="arrow"/></a><button className="button-secondary" type="button" onClick={copy}><Icon name="copy"/>Copy email</button></div><label className="sr-only" htmlFor="contact-email">Email address</label><input ref={address} id="contact-email" className="email-address" readOnly value={EMAIL} onFocus={event => event.currentTarget.select()}/><p className="copy-status" role="status">{message}</p></div>;
}
