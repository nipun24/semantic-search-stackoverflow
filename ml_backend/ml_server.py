from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import core

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/compute", methods=['POST'])
def compute():
    similarity = []
    query = request.json['query']
    tags = core.get_tags(query)
    x = core.get_questions(tags, query)
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