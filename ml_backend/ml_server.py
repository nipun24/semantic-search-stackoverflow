from flask import Flask, request, jsonify
from flask_cors import CORS
import core

app = Flask(__name__)
CORS(app)

@app.route("/",methods=['POST'])
def hello():
    similar = []
    input = request.json['query']
    tags = core.get_tags(input)
    x = core.get_questions(tags)
    messages = x[0]
    data = x[1]
    if len(messages) == 0:
        return jsonify(False)
    else:
        messages.append(input)
        similar = core.get_similarity(messages)
        return jsonify(similar, data['items'])
    
if __name__ == '__main__':
    app.run(debug=True)