"""Tests for v3 features: coaches, clubs, filters, recent rumors, radar, pipeline, tasks."""
import pytest


# ---------- Profile filters (role, club) & Coach profiles ----------
class TestProfileFilters:
    def test_seeded_has_players_and_coaches(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles")
        assert r.status_code == 200
        profiles = r.json()
        assert len(profiles) >= 12
        roles = {p['role'] for p in profiles}
        assert 'Player' in roles
        assert 'Coach' in roles
        # verify a known coach
        names = [p['full_name'] for p in profiles]
        assert 'Thiago Motta' in names
        assert 'Antonio Conte' in names

    def test_filter_by_role_player(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles", params={'role': 'Player'})
        assert r.status_code == 200
        profiles = r.json()
        assert len(profiles) >= 8
        for p in profiles:
            assert p['role'] == 'Player'

    def test_filter_by_role_coach(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles", params={'role': 'Coach'})
        assert r.status_code == 200
        profiles = r.json()
        assert len(profiles) >= 4
        for p in profiles:
            assert p['role'] == 'Coach'

    def test_filter_role_all(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles", params={'role': 'all'})
        assert r.status_code == 200
        assert len(r.json()) >= 12

    def test_filter_by_club(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles", params={'club': 'Napoli'})
        assert r.status_code == 200
        profiles = r.json()
        assert len(profiles) >= 1
        for p in profiles:
            assert p['current_club'] == 'Napoli'

    def test_career_history_present(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles/p-osimhen")
        data = r.json()
        assert 'career_history' in data
        assert isinstance(data['career_history'], list)
        assert len(data['career_history']) >= 2
        entry = data['career_history'][0]
        assert 'club' in entry


# ---------- Clubs ----------
class TestClubs:
    def test_get_clubs_returns_sorted_list(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/clubs")
        assert r.status_code == 200
        clubs = r.json()
        assert isinstance(clubs, list)
        assert 'Napoli' in clubs
        assert 'Juventus' in clubs
        assert clubs == sorted(clubs)


# ---------- Recent rumors ----------
class TestRecentRumors:
    def test_recent_rumors_enriched(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/rumors/recent", params={'limit': 10})
        assert r.status_code == 200
        rumors = r.json()
        assert isinstance(rumors, list)
        assert len(rumors) > 0
        assert len(rumors) <= 10
        for x in rumors:
            assert 'full_name' in x
            assert 'role' in x
            assert 'profile_id' in x
            assert 'stage' in x
        # sorted by date desc
        dates = [x['date_logged'] for x in rumors]
        assert dates == sorted(dates, reverse=True)


# ---------- Radar Alerts ----------
class TestRadar:
    def test_get_alerts(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/radar/alerts")
        assert r.status_code == 200
        alerts = r.json()
        assert isinstance(alerts, list)
        assert len(alerts) >= 5
        for a in alerts:
            for k in ['id', 'player_name', 'current_club', 'flagged_country', 'anomaly_score', 'status', 'automated_summary']:
                assert k in a
            assert '_id' not in a

    def test_filter_alerts_by_status(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/radar/alerts", params={'status': 'New'})
        assert r.status_code == 200
        for a in r.json():
            assert a['status'] == 'New'

    def test_radar_scan_creates_new_alert(self, api_client, base_url):
        # count before
        before = len(api_client.get(f"{base_url}/api/radar/alerts").json())
        r = api_client.post(f"{base_url}/api/radar/scan", timeout=90)
        assert r.status_code == 200, r.text
        data = r.json()
        for k in ['id', 'player_name', 'current_club', 'flagged_country', 'anomaly_score', 'automated_summary', 'status']:
            assert k in data
        assert data['status'] == 'New'
        assert isinstance(data['player_name'], str) and len(data['player_name']) > 0
        # verify persisted
        after = api_client.get(f"{base_url}/api/radar/alerts").json()
        assert len(after) == before + 1
        assert any(a['id'] == data['id'] for a in after)

    def test_dismiss_alert(self, api_client, base_url):
        # scan to get a fresh alert to dismiss
        r = api_client.post(f"{base_url}/api/radar/scan", timeout=90)
        alert_id = r.json()['id']
        r2 = api_client.post(f"{base_url}/api/radar/alerts/{alert_id}/dismiss")
        assert r2.status_code == 200
        # verify status
        alerts = api_client.get(f"{base_url}/api/radar/alerts").json()
        target = [a for a in alerts if a['id'] == alert_id][0]
        assert target['status'] == 'Dismissed'

    def test_dismiss_unknown_returns_404(self, api_client, base_url):
        r = api_client.post(f"{base_url}/api/radar/alerts/nonexistent/dismiss")
        assert r.status_code == 404

    def test_investigate_alert_creates_pipeline_and_tasks(self, api_client, base_url):
        # scan a fresh alert
        r = api_client.post(f"{base_url}/api/radar/scan", timeout=90)
        alert_id = r.json()['id']
        player_name = r.json()['player_name']
        r2 = api_client.post(f"{base_url}/api/radar/alerts/{alert_id}/investigate")
        assert r2.status_code == 200
        # verify alert status
        alerts = api_client.get(f"{base_url}/api/radar/alerts").json()
        target = [a for a in alerts if a['id'] == alert_id][0]
        assert target['status'] == 'Investigating'
        # verify pipeline entry created (only if not existed for same player)
        pipeline = api_client.get(f"{base_url}/api/pipeline").json()
        pl_match = [p for p in pipeline if p['player_name'] == player_name]
        assert len(pl_match) >= 1
        assert pl_match[0]['stage'] == 'Contatti Avviati' or any(p['stage'] == 'Contatti Avviati' for p in pl_match)
        # verify verification tasks created
        tasks = api_client.get(f"{base_url}/api/tasks").json()
        tsk_match = [t for t in tasks if t['player_name'] == player_name]
        assert len(tsk_match) >= 3

    def test_investigate_unknown_alert_404(self, api_client, base_url):
        r = api_client.post(f"{base_url}/api/radar/alerts/nonexistent/investigate")
        assert r.status_code == 404


# ---------- Pipeline ----------
class TestPipeline:
    def test_get_pipeline(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/pipeline")
        assert r.status_code == 200
        docs = r.json()
        assert isinstance(docs, list)
        assert len(docs) >= 4
        for p in docs:
            for k in ['id', 'player_name', 'stage']:
                assert k in p
            assert '_id' not in p

    def test_patch_pipeline_stage(self, api_client, base_url):
        pipeline = api_client.get(f"{base_url}/api/pipeline").json()
        item = pipeline[0]
        orig_stage = item['stage']
        new_stage = 'Trattativa' if orig_stage != 'Trattativa' else 'Fonti Verificate'
        r = api_client.patch(f"{base_url}/api/pipeline/{item['id']}", json={'stage': new_stage})
        assert r.status_code == 200
        data = r.json()
        assert data['stage'] == new_stage
        # verify persistence
        fresh = api_client.get(f"{base_url}/api/pipeline").json()
        updated = [p for p in fresh if p['id'] == item['id']][0]
        assert updated['stage'] == new_stage
        # restore
        api_client.patch(f"{base_url}/api/pipeline/{item['id']}", json={'stage': orig_stage})

    def test_patch_pipeline_unknown_404(self, api_client, base_url):
        r = api_client.patch(f"{base_url}/api/pipeline/nonexistent", json={'stage': 'Trattativa'})
        assert r.status_code == 404


# ---------- Verification Tasks ----------
class TestTasks:
    def test_get_tasks(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/tasks")
        assert r.status_code == 200
        tasks = r.json()
        assert isinstance(tasks, list)
        assert len(tasks) >= 5
        for t in tasks:
            for k in ['id', 'player_name', 'action_required', 'is_done']:
                assert k in t
            assert '_id' not in t

    def test_toggle_task_done(self, api_client, base_url):
        tasks = api_client.get(f"{base_url}/api/tasks").json()
        task = tasks[0]
        new_val = not task['is_done']
        r = api_client.patch(f"{base_url}/api/tasks/{task['id']}", json={'is_done': new_val})
        assert r.status_code == 200
        assert r.json()['is_done'] == new_val
        # verify persistence
        fresh = api_client.get(f"{base_url}/api/tasks").json()
        updated = [t for t in fresh if t['id'] == task['id']][0]
        assert updated['is_done'] == new_val
        # restore
        api_client.patch(f"{base_url}/api/tasks/{task['id']}", json={'is_done': task['is_done']})

    def test_patch_task_unknown_404(self, api_client, base_url):
        r = api_client.patch(f"{base_url}/api/tasks/nonexistent", json={'is_done': True})
        assert r.status_code == 404


# ---------- Stats includes alerts ----------
class TestStatsV3:
    def test_stats_alerts_key(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/stats")
        data = r.json()
        assert 'alerts' in data
        assert isinstance(data['alerts'], int)
