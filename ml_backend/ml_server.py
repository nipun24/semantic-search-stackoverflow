from flask import Flask, request, jsonify
import core

app = Flask(__name__)

@app.route("/",methods=['POST'])
def hello():
    input = request.json['query']
    # input = "how to define function in python"
    tags = core.get_tags(input)
    messages = core.get_questions(tags)
    messages.append(input)
    similar = "waiting"
    similar = core.get_similarity(messages)
    print(similar)
    return jsonify(similar)


if __name__ == '__main__':
    app.run(debug=True)