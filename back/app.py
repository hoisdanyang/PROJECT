# app.py
import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from petShop.models import db

migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # ✅ 개발단계: /api/* 만 CORS 허용 (나중에 프론트 주소로 제한 가능)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ✅ DB 설정: 환경변수 우선, 없으면 로컬 sqlite
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///petshop.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    migrate.init_app(app, db)

    @app.get("/")
    def index():
        return "Petshop API OK"

    # ✅ 프론트(React) 연동 테스트용: 현재 프론트가 /api/chat 으로 POST 보내고 있음
    @app.post("/api/chat")
    def chat():
        data = request.get_json(silent=True) or {}
        message = data.get("message", "")
        return jsonify({"reply": f"너가 보낸: {message}"})

    # ✅ 네이버 블로그 검색 API (키는 env로!)
    @app.get("/api/search")
    def naver_search():
        query = request.args.get("query", "")
        if not query:
            return jsonify({"error": "검색어가 없습니다."}), 400

        client_id = os.getenv("NAVER_CLIENT_ID")
        client_secret = os.getenv("NAVER_CLIENT_SECRET")

        if not client_id or not client_secret:
            return jsonify({"error": "NAVER API 키(NAVER_CLIENT_ID/SECRET)가 설정되지 않았습니다."}), 500

        url = "https://openapi.naver.com/v1/search/blog.json"
        headers = {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret
        }
        params = {"query": query, "display": 10}

        resp = requests.get(url, headers=headers, params=params)
        return jsonify(resp.json()), resp.status_code

    return app


app = create_app()

if __name__ == "__main__":
    # ✅ 디버깅 시 라우트 확인
    with app.app_context():
        print("등록된 라우트들:", app.url_map)

    app.run(host="0.0.0.0", port=5000, debug=True)
