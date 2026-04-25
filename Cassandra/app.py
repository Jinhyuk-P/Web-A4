from flask import Flask, jsonify, request

from database import AstraConfigError, create_user, list_users, delete_user

app = Flask(__name__, static_folder="static", static_url_path="/static")


@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    return response


@app.route("/users", methods=["OPTIONS"])
@app.route("/users/<user_id>", methods=["OPTIONS"])
def options_handler(user_id=None):
    return "", 204


@app.get("/")
def home():
    return app.send_static_file("index.html")


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "message": "Servidor funcionando"})


@app.get("/users")
def get_users():
    try:
        return jsonify(list_users())
    except AstraConfigError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        return jsonify({"error": f"No se pudieron consultar los usuarios: {exc}"}), 500


@app.post("/users")
def post_user():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()

    if not name or not email:
        return jsonify({"error": "Los campos name y email son obligatorios."}), 400

    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"error": "El email no tiene un formato valido."}), 400

    try:
        user = create_user(name=name, email=email)
        return jsonify(user), 201
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 409
    except AstraConfigError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        return jsonify({"error": f"No se pudo guardar el usuario: {exc}"}), 500


@app.delete("/users/<user_id>")
def remove_user(user_id):
    try:
        delete_user(user_id)
        return jsonify({"message": "Usuario eliminado"}), 200
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(debug=True)