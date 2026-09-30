import assert from 'node:assert/strict';
import { test } from 'node:test';

delete process.env.DATABASE_URL; // static-content path (no Postgres needed)

test('systems come back ordered with tool names resolved', async () => {
  const { getSystems, getSystem } = await import('../src/lib/repo');
  const systems = await getSystems();
  assert.equal(systems.length, 5);
  assert.deepEqual(systems.map((s) => s.position), [1, 2, 3, 4, 5]);
  const reporting = await getSystem('client-reporting');
  assert.deepEqual(reporting?.tools.map((t) => t.name), ['Meta Ads API', 'Google Ads API', 'Claude AI', 'Gmail', 'Slack']);
  assert.equal(await getSystem('nope'), null);
});

test('integrations paginate, filter, and report which systems use them', async () => {
  const { getIntegrations, getIntegrationCategories } = await import('../src/lib/repo');
  const p1 = await getIntegrations({ page: 1, pageSize: 6 });
  assert.equal(p1.total, 18);
  assert.equal(p1.totalPages, 3);
  assert.equal(p1.items.length, 6);
  const p3 = await getIntegrations({ page: 3, pageSize: 6 });
  assert.equal(p3.items.length, 6);
  const slack = await getIntegrations({ q: 'SLA' });
  assert.equal(slack.items[0].name, 'Slack');
  assert.ok(slack.items[0].usedIn.length >= 3);
  const google = await getIntegrations({ category: 'Google Workspace' });
  assert.equal(google.total, 3);
  const none = await getIntegrations({ q: 'zzzz' });
  assert.equal(none.total, 0);
  const cats = await getIntegrationCategories();
  assert.equal(cats.reduce((n, c) => n + c.count, 0), 18);
});
