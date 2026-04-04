# import pytest


async def test_register_user(client):
    res = await client.post("/users/register", json={
        "email": "test@example.com",
        "password": "Test@123",
        "cf_token": "test-token"
    })
    assert res.status_code == 200
    assert res.json()["email"] == "test@example.com"


async def test_register_duplicate(client):
    data = {"email": "dup@example.com", "password": "Test@123", "cf_token": "test-token"}
    await client.post("/users/register", json=data)
    res = await client.post("/users/register", json=data)
    assert res.status_code == 400
    assert "already registered" in res.json()["detail"]


async def test_login_wrong_password(client):
    await client.post("/users/register", json={
        "email": "login@example.com",
        "password": "Test@123",
        "cf_token": "test-token"
    })
    res = await client.post("/users/login", json={
        "email": "login@example.com",
        "password": "WrongPass@1"
    })
    assert res.status_code == 401


async def test_login_nonexistent_user(client):
    res = await client.post("/users/login", json={
        "email": "nobody@example.com",
        "password": "Test@1234"
    })
    assert res.status_code == 401