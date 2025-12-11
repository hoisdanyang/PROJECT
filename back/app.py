from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import *
migrate = Migrate(app, db)

app = Flask(__name__)
CORS(app)

# 1) Flask 살아있는지 테스트용 GET
@app.route("/")
def index():
    return "index OK"

@app.route("/ping")
def ping():
    return "pong"

# 2) 실제 POST 테스트 라우트
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = data.get("message", "")
    print("React가 보낸 메시지:", message)
    return jsonify({"reply": f"너가 보낸: {message}"})


if __name__ == "__main__":
    print("등록된 라우트들:", app.url_map)   # 서버 실행 시 등록된 URL 출력
    app.run(port=5000, debug=True)
