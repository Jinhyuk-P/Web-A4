from __future__ import annotations

from pprint import pprint

from database import STUDENTS_COLLECTION, get_or_create_collection, serialize_document

BASE_STUDENTS = [
    {"name": "Carlos", "age": 22, "career": "Ingenieria"},
    {"name": "Sofia", "age": 21, "career": "Diseno"},
    {"name": "Luis", "age": 23, "career": "Matematicas"},
]

EXTRA_STUDENT = {
    "name": "Ana",
    "skills": ["python", "sql"],
    "active": True,
}


def ensure_document(collection, filter_by: dict, payload: dict):
    existing = collection.find_one(filter_by)
    if existing:
        return serialize_document(existing), False

    collection.insert_one(payload)
    return serialize_document(collection.find_one(filter_by)), True


def main():
    collection = get_or_create_collection(STUDENTS_COLLECTION)
    print(f"Coleccion lista: {STUDENTS_COLLECTION}")

    print("\nInsertando al menos 3 estudiantes...")
    for student in BASE_STUDENTS:
        saved, created = ensure_document(collection, {"name": student["name"]}, student)
        action = "Insertado" if created else "Ya existia"
        print(f"- {action}: {saved['name']}")

    print("\nConsulta por nombre (Carlos):")
    result = serialize_document(collection.find_one({"name": "Carlos"}))
    pprint(result)

    print("\nInsertando estudiante con estructura diferente:")
    saved_ana, created = ensure_document(collection, {"name": "Ana"}, EXTRA_STUDENT)
    action = "Insertado" if created else "Ya existia"
    print(f"- {action}: {saved_ana['name']}")
    pprint(saved_ana)


if __name__ == "__main__":
    main()
