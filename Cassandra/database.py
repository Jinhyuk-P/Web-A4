from __future__ import annotations

import os
from datetime import datetime, timezone
from functools import lru_cache
from typing import Any

from astrapy import DataAPIClient
from dotenv import load_dotenv

load_dotenv()

USERS_COLLECTION = "users"
STUDENTS_COLLECTION = "students"


class AstraConfigError(RuntimeError):
    """Raised when Astra DB credentials are missing."""


def _require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise AstraConfigError(
            f"Falta configurar la variable de entorno {name}. "
            "Copia .env.example a .env y agrega tus credenciales de Astra DB."
        )
    return value


@lru_cache(maxsize=1)
def get_database():
    api_endpoint = _require_env("ASTRA_DB_API_ENDPOINT")
    token = _require_env("ASTRA_DB_APPLICATION_TOKEN")
    keyspace = os.getenv("ASTRA_DB_KEYSPACE")

    client = DataAPIClient()
    options: dict[str, Any] = {"token": token}

    if keyspace:
        options["keyspace"] = keyspace

    return client.get_database(api_endpoint, **options)


@lru_cache(maxsize=8)
def get_or_create_collection(name: str):
    database = get_database()

    if name not in database.list_collection_names():
        database.create_collection(name)

    return database.get_collection(name)


def serialize_document(document: dict[str, Any] | None) -> dict[str, Any] | None:
    if document is None:
        return None

    serialized = dict(document)
    if "_id" in serialized:
        serialized["_id"] = str(serialized["_id"])
    return serialized


def list_users() -> list[dict[str, Any]]:
    collection = get_or_create_collection(USERS_COLLECTION)
    users = [serialize_document(document) for document in collection.find({})]
    clean_users = [user for user in users if user is not None]
    return sorted(clean_users, key=lambda user: user.get("created_at", ""), reverse=True)


def create_user(name: str, email: str) -> dict[str, Any]:
    collection = get_or_create_collection(USERS_COLLECTION)
    existing_user = serialize_document(collection.find_one({"email": email}))

    if existing_user:
        raise ValueError("Ya existe un usuario con ese email.")

    document = {
        "name": name,
        "email": email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    collection.insert_one(document)
    saved_user = serialize_document(collection.find_one({"email": email}))
    return saved_user or document


def delete_user(user_id: str):
    collection = get_or_create_collection(USERS_COLLECTION)
    collection.delete_one({"_id": user_id})