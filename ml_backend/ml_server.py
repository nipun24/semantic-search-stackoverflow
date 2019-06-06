from flask import Flask, request, jsonify
from flask_cors import CORS
import core

app = Flask(__name__)
CORS(app)

@app.route("/",methods=['POST'])
def hello():
    similarity = []
    query = request.json['query']
    tags = core.get_tags(query)
    x = core.get_questions(tags)
    questions = x[0]
    data = x[1]
    if len(questions) == 0:
        return jsonify(False)
    else:
        questions.append(query)
        similarity = core.get_similarity(questions)
        return jsonify(similarity, data)
    
if __name__ == '__main__':
    app.run(debug=True)