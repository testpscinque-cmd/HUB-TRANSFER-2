"""Backend tests for TransferMemory API."""
import pytest


# ---------- Health ----------
class TestHealth:
    def test_root(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/")
        assert r.status_code == 200
        assert r.json().get('message')


# ---------- Stats ----------
class TestStats:
    def test_stats_has_seeded_counts(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/stats")
        assert r.status_code == 200
        data = r.json()
        for k in ['profiles', 'rumors', 'sources', 'hot', 'official']:
            assert k in data
        assert data['profiles'] >= 5
        assert data['sources'] >= 6
        assert data['rumors'] >= 12
        # From seed: Trattativa Avanzata rumors
        assert data['hot'] >= 1
        assert data['official'] >= 1


# ---------- Profiles ----------
class TestProfiles:
    def test_list_profiles(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles")
        assert r.status_code == 200
        profiles = r.json()
        assert isinstance(profiles, list)
        assert len(profiles) >= 5
        names = [p['full_name'] for p in profiles]
        assert 'Victor Osimhen' in names
        for p in profiles:
            assert '_id' not in p
            assert 'id' in p
            assert 'full_name' in p

    def test_get_profile_by_id(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles/p-osimhen")
        assert r.status_code == 200
        data = r.json()
        assert data['id'] == 'p-osimhen'
        assert data['full_name'] == 'Victor Osimhen'
        # v4 seed: Osimhen moved to Galatasaray
        assert data['current_club'] == 'Galatasaray'

    def test_get_profile_404(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles/nonexistent-id")
        assert r.status_code == 404

    def test_profile_search_query(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles", params={'q': 'osim'})
        assert r.status_code == 200
        profiles = r.json()
        assert len(profiles) >= 1
        assert any('Osimhen' in p['full_name'] for p in profiles)


# ---------- Sources ----------
class TestSources:
    def test_sources_sorted(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/sources")
        assert r.status_code == 200
        sources = r.json()
        assert len(sources) >= 6
        scores = [s['reliability_score'] for s in sources]
        assert scores == sorted(scores, reverse=True)
        # Fabrizio Romano should be top with 96
        assert sources[0]['source_name'] == 'Fabrizio Romano'
        assert sources[0]['reliability_score'] == 96


# ---------- Rumors ----------
class TestRumors:
    def test_get_profile_rumors_sorted(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles/p-osimhen/rumors")
        assert r.status_code == 200
        rumors = r.json()
        # v4 seed: 2 rumors for Osimhen
        assert len(rumors) >= 2
        dates = [x['date_logged'] for x in rumors]
        assert dates == sorted(dates)

    def test_get_rumors_for_unknown_profile_returns_empty(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles/does-not-exist/rumors")
        assert r.status_code == 200
        assert r.json() == []

    def test_create_rumor_persists_and_visible_in_timeline(self, api_client, base_url):
        payload = {
            'profile_id': 'p-yildiz',
            'date_logged': '2026-01-10',
            'stage': 'Fumata Bianca/Ufficiale',
            'source_name': 'Fabrizio Romano',
            'deal_formula': 'Definitive',
            'evolution_description': 'TEST_ Here we go, Yildiz renews with Juventus.',
        }
        r = api_client.post(f"{base_url}/api/rumors", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data['profile_id'] == payload['profile_id']
        assert data['evolution_description'] == payload['evolution_description']
        assert data['stage'] == payload['stage']
        assert 'id' in data

        # verify persistence via GET
        r2 = api_client.get(f"{base_url}/api/profiles/p-yildiz/rumors")
        assert r2.status_code == 200
        rumors = r2.json()
        found = [x for x in rumors if x.get('id') == data['id']]
        assert len(found) == 1
        assert found[0]['evolution_description'] == payload['evolution_description']


# ---------- Consistency Check ----------
class TestConsistencyCheck:
    def test_consistency_returns_valid_json(self, api_client, base_url):
        payload = {
            'profile_id': 'p-osimhen',
            'stage': 'Fumata Bianca/Ufficiale',
            'source_name': 'Fabrizio Romano',
            'deal_formula': 'Free Transfer',
            'evolution_description': 'Osimhen leaves Napoli on a free transfer this summer.',
        }
        r = api_client.post(f"{base_url}/api/consistency-check", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        # Regardless of budget/fallback, schema must be present
        assert 'has_contradiction' in data
        assert 'severity' in data
        assert 'message_en' in data
        assert 'message_it' in data
        assert isinstance(data['has_contradiction'], bool)

    def test_consistency_unknown_profile_404(self, api_client, base_url):
        payload = {
            'profile_id': 'nope',
            'stage': 'Contatti',
            'source_name': 'Fabrizio Romano',
            'deal_formula': '',
            'evolution_description': 'Test',
        }
        r = api_client.post(f"{base_url}/api/consistency-check", json=payload, timeout=30)
        assert r.status_code == 404
