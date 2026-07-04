"""Tests for Streak Lab, Fonte Zero external_link_url, verified_status, contract_expiry in recent."""
import pytest


# ---------- Streak Lab: active challenge, me, leaderboard ----------
class TestStreakBasics:
    def test_active_challenge(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/challenges/active")
        assert r.status_code == 200
        ch = r.json()
        assert ch, "Expected an active challenge"
        assert ch.get("is_active") is True
        assert ch.get("id") == "ch-1"
        assert ch.get("correct_answer") in ("SI", "NO")
        assert isinstance(ch.get("question_text"), str) and len(ch["question_text"]) > 0

    def test_streak_me_returns_you(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/streak/me")
        assert r.status_code == 200
        me = r.json()
        assert me.get("id") == "u-you"
        assert "current_streak" in me
        assert "highest_streak" in me
        assert isinstance(me["current_streak"], int)
        assert isinstance(me["highest_streak"], int)

    def test_leaderboard_top5_sorted(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/streak/leaderboard")
        assert r.status_code == 200
        lb = r.json()
        assert isinstance(lb, list)
        assert len(lb) == 5
        highs = [u["highest_streak"] for u in lb]
        assert highs == sorted(highs, reverse=True)
        for u in lb:
            for k in ("id", "mock_username", "current_streak", "highest_streak"):
                assert k in u


# ---------- Streak Vote: correct + wrong ----------
class TestStreakVote:
    def _active(self, api_client, base_url):
        return api_client.get(f"{base_url}/api/challenges/active").json()

    def test_vote_correct_increments_and_wrong_resets(self, api_client, base_url):
        ch = self._active(api_client, base_url)
        assert ch and ch.get("id")
        # 1) Wrong first to reset to 0 baseline
        wrong = "NO" if ch["correct_answer"] == "SI" else "SI"
        r0 = api_client.post(
            f"{base_url}/api/streak/vote", json={"challenge_id": ch["id"], "answer": wrong}
        )
        assert r0.status_code == 200
        d0 = r0.json()
        assert d0["correct"] is False
        assert d0["current_streak"] == 0

        # 2) Correct increments to 1
        r1 = api_client.post(
            f"{base_url}/api/streak/vote", json={"challenge_id": ch["id"], "answer": ch["correct_answer"]}
        )
        assert r1.status_code == 200
        d1 = r1.json()
        assert d1["correct"] is True
        assert d1["current_streak"] == 1

        # 3) Another correct increments to 2
        r2 = api_client.post(
            f"{base_url}/api/streak/vote", json={"challenge_id": ch["id"], "answer": ch["correct_answer"]}
        )
        d2 = r2.json()
        assert d2["correct"] is True
        assert d2["current_streak"] == 2
        assert d2["highest_streak"] >= 2

        # 4) Wrong resets
        r3 = api_client.post(
            f"{base_url}/api/streak/vote", json={"challenge_id": ch["id"], "answer": wrong}
        )
        d3 = r3.json()
        assert d3["correct"] is False
        assert d3["current_streak"] == 0
        # highest preserved
        assert d3["highest_streak"] >= 2

        # 5) Verify persistence via /streak/me
        me = api_client.get(f"{base_url}/api/streak/me").json()
        assert me["current_streak"] == 0
        assert me["highest_streak"] >= 2

    def test_vote_unknown_challenge_404(self, api_client, base_url):
        r = api_client.post(
            f"{base_url}/api/streak/vote", json={"challenge_id": "does-not-exist", "answer": "SI"}
        )
        assert r.status_code == 404


# ---------- Fonte Zero: alerts external_link_url ----------
class TestRadarAlertsExternal:
    def test_alerts_have_external_link_url(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/radar/alerts")
        assert r.status_code == 200
        alerts = r.json()
        assert len(alerts) >= 7
        # every seeded alert should have external_link_url (non-empty string)
        seeded_prefixes = ("a-",)
        seeded = [a for a in alerts if a["id"].startswith(seeded_prefixes)]
        assert len(seeded) >= 5
        for a in seeded:
            url = a.get("external_link_url")
            assert isinstance(url, str) and url.startswith("http"), f"Missing external_link_url for {a['id']}"


# ---------- Profiles v4: 21 profiles, leagues, verified_status ----------
class TestProfilesV4:
    def test_profiles_count_and_leagues(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/profiles")
        assert r.status_code == 200
        profiles = r.json()
        assert len(profiles) == 21, f"Expected 21 profiles, got {len(profiles)}"
        leagues = {p.get("league") for p in profiles}
        for lg in ("Serie A", "Serie B", "Serie C", "Premier League"):
            assert lg in leagues, f"Missing league {lg}"

    def test_verified_status_true_for_stars(self, api_client, base_url):
        expected_verified = {
            "p-yildiz", "p-nicopaz", "p-kean", "p-lookman", "p-osimhen",
            "p-zirkzee", "p-calafiori", "c-conte", "c-fabregas",
        }
        profiles = api_client.get(f"{base_url}/api/profiles").json()
        by_id = {p["id"]: p for p in profiles}
        for pid in expected_verified:
            assert pid in by_id, f"missing profile {pid}"
            assert by_id[pid].get("verified_status") is True, f"{pid} should be verified"
        # a non-star should not be verified
        assert by_id["p-castro"].get("verified_status") is False


# ---------- Recent rumors include contract_expiry & verified_status & sorted desc ----------
class TestRecentRumorsV4:
    def test_recent_enriched_and_sorted(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/rumors/recent", params={"limit": 25})
        assert r.status_code == 200
        items = r.json()
        assert len(items) > 0
        # sorted by logged_at desc (newest first)
        logged = [x.get("logged_at", "") for x in items]
        assert logged == sorted(logged, reverse=True), "recent rumors not sorted desc by logged_at"
        for x in items:
            assert "contract_expiry" in x
            assert "verified_status" in x
            assert isinstance(x["verified_status"], bool)

    def test_lookman_free_transfer_contradiction_exists(self, api_client, base_url):
        items = api_client.get(f"{base_url}/api/rumors/recent", params={"limit": 50}).json()
        lookmans = [x for x in items if x.get("profile_id") == "p-lookman"]
        # Must include a free-transfer rumor for a player with contract > current year
        free = [x for x in lookmans if (x.get("deal_formula") or "").lower() == "free transfer"]
        assert len(free) >= 1
        # contract_expiry for p-lookman is 2027-06-30 (>2026)
        for x in free:
            assert x["contract_expiry"].startswith("2027")


# ---------- Sources trust: >85 count ----------
class TestSourcesVerified:
    def test_top_sources_present(self, api_client, base_url):
        sources = api_client.get(f"{base_url}/api/sources").json()
        by_name = {s["source_name"]: s for s in sources}
        assert by_name["Fabrizio Romano"]["reliability_score"] == 96
        assert by_name["Gianluca Di Marzio"]["reliability_score"] == 92
        assert by_name["Sky Sport Italia"]["reliability_score"] == 90
        above85 = [s for s in sources if s["reliability_score"] > 85]
        assert len(above85) >= 3
