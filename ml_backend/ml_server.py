from flask import Flask, request, jsonify
from flask_cors import CORS
import core

app = Flask(__name__)
CORS(app)

@app.route("/",methods=['POST'])
def hello():
    input = request.json['query']
    tags = core.get_tags(input)
    messages = core.get_questions(tags)
    messages.append(input)
    similar = core.get_similarity(messages)
    return jsonify(similar)


if __name__ == '__main__':
    app.run(debug=True)