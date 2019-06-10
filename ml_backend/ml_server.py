from flask import Flask, request, jsonify
from flask_cors import CORS
import core

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def hello():
    return "working"

@app.route("/slow",methods=['POST'])
def process():
    similarity = []
    query = request.json['query']
    tags = core.get_tags_slow(query)
    x = core.get_questions(tags)
    questions = x[0]
    data = x[1]
    if len(questions) == 0:
        return jsonify(False)
    else:
        similarity = core.get_similarity(questions, query)
        for i in range(len(data)):
            data[i].update({'probability': similarity[i]['probability']})
        return jsonify(data)

@app.route("/fast", methods=['POST'])
def process_fast():
    similarity = []
    query = request.json['query']
    tags = core.get_tags(query)
    x = core.get_questions(tags)
    questions = x[0]
    data = x[1]
    if len(questions) == 0:
        return jsonify(False)
    else:
        similarity = core.get_similarity(questions, query)
        for i in range(len(data)):
            data[i].update({'probability': similarity[i]['probability']})
        return jsonify(data)
    
if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)