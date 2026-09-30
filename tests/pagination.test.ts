import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeCursor, encodeCursor, escapeLike, pageList, toInt, totalPages } from '../src/lib/pagination';

test('toInt clamps and falls back', () => {
  assert.equal(toInt('3', 1, 1, 10), 3);
  assert.equal(toInt('999', 1, 1, 10), 10);
  assert.equal(toInt('-4', 1, 1, 10), 1);
  assert.equal(toInt('abc', 2, 1, 10), 2);
  assert.equal(toInt(undefined, 1, 1, 10), 1);
  assert.equal(toInt(['4', '5'], 1, 1, 10), 4);
});

test('cursor round-trips and rejects tampering', () => {
  const c = { t: '2026-09-30T10:00:00.123Z', id: '42' };
  assert.deepEqual(decodeCursor(encodeCursor(c)), c);
  assert.equal(decodeCursor('garbage'), null);
  assert.equal(decodeCursor(Buffer.from(JSON.stringify({ t: 'x', id: '1' })).toString('base64url')), null);
  assert.equal(decodeCursor(Buffer.from(JSON.stringify({ t: c.t, id: '1; DROP' })).toString('base64url')), null);
});

test('LIKE escaping and page math', () => {
  assert.equal(escapeLike('50%_off\\'), '50\\%\\_off\\\\');
  assert.equal(totalPages(0, 6), 1);
  assert.equal(totalPages(18, 6), 3);
  assert.deepEqual(pageList(1, 3), [1, 2, 3]);
  assert.deepEqual(pageList(6, 12), [1, '…', 5, 6, 7, '…', 12]);
});
