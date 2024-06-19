from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId

app = Flask(__name__)

# Thay đổi thông tin kết nối MongoDB của bạn ở đây
app.config["MONGO_URI"] = "mongodb://admin:20194856@localhost:27017/thesis"

mongo = PyMongo(app)

@app.route('/recommendation/<id>', methods=['GET'])
def get_user(id):
    user = mongo.db.jobs.find_one({"_id": ObjectId(id)})
    return dumps(user)

if __name__ == '__main__':
    app.run(debug=True)
