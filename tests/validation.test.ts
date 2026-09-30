import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeWebsite, validateEmail, validateLead } from '../src/lib/validation';

const interests = ['client-reporting', 'not-sure'];
const good = { name: 'Priya Shah', email: 'Priya@Agency.com ', agency: 'Northwind', website: 'northwind.co', teamSize: '6-15', interest: 'client-reporting', message: '' };

test('accepts a valid lead and normalises fields', () => {
  const r = validateLead(good, interests);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.data.email, 'priya@agency.com');
    assert.equal(r.data.website, 'https://northwind.co/');
    assert.equal(r.data.message, null);
  }
});

test('rejects bad email, unknown interest, bad team size', () => {
  const r = validateLead({ ...good, email: 'nope', interest: 'hack', teamSize: '9000' }, interests);
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.ok(r.errors.email);
    assert.ok(r.errors.interest);
    assert.ok(r.errors.teamSize);
  }
});

test('rejects non-object bodies safely', () => {
  assert.equal(validateLead(null, interests).ok, false);
  assert.equal(validateLead('x', interests).ok, false);
});

test('email + website helpers', () => {
  assert.equal(validateEmail('a@b.co'), undefined);
  assert.ok(validateEmail(''));
  assert.equal(normalizeWebsite('localhost'), null);
  assert.equal(normalizeWebsite(''), null);
});
