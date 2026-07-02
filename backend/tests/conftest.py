import os
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / '.env')

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/') if os.environ.get('REACT_APP_BACKEND_URL') else None

if not BASE_URL:
    # fall back to frontend .env
    fe_env = Path('/app/frontend/.env')
    if fe_env.exists():
        for line in fe_env.read_text().splitlines():
            if line.startswith('REACT_APP_BACKEND_URL='):
                BASE_URL = line.split('=', 1)[1].strip().rstrip('/')
                break


@pytest.fixture(scope='session')
def base_url():
    assert BASE_URL, 'REACT_APP_BACKEND_URL missing'
    return BASE_URL


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({'Content-Type': 'application/json'})
    return s
