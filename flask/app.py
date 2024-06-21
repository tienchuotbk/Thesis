from flask import Flask, jsonify, request
from bson import ObjectId

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
from flask_pymongo import PyMongo

import findspark
findspark.init('/opt/spark')  # Adjust the path if Spark is installed elsewhere

from pyspark.sql.functions import col, sum as _sum, when

from pyspark.sql import SparkSession
mongo_uri = "mongodb://admin:20194856@localhost:27017/thesis.jobs"

spark = SparkSession.builder \
        .appName("Microvervice") \
        .config("spark.mongodb.input.uri", mongo_uri) \
        .config("spark.mongodb.output.uri", mongo_uri) \
        .config('spark.jars.packages', 'org.mongodb.spark:mongo-spark-connector_2.12:3.0.1') \
        .getOrCreate()

app.config["MONGO_URI"] = "mongodb://admin:20194856@localhost:27017/thesis"

mongo = PyMongo(app)
users_collection = mongo.db["users"]
jobs_collection = mongo.db["jobs"]

numeric_features = ['role', 'sex', 'level']
text_features = ['career', 'province']
scaler = StandardScaler()
tfidf_vectorizer = TfidfVectorizer()

def preprocess_job(job):
    province_info = ' '.join([f"{item.get('province', '')}" for item in job.get('location', [])])
    job_data = {
        'role': job.get('role', 0),
        'sex': job.get('sex', 0),
        # 'exp_min': job.get('experience', {}).get('min', 0),
        # 'exp_max': job.get('experience', {}).get('max', 0),
        # "exp_type": job.get('experience', {}).get('type', 0),
        # "exp_fixed": job.get('experience', {}).get('fixed', 0),
        # 'age': job.get('age', {}).get('type', 0),
        # 'salary_min': job.get('salary', {}).get('min', 0),
        # 'salary_max': job.get('salary', {}).get('max', 0),
        # "salary_type": job.get('salary', {}).get('type', 0),
        # "salary_fixed": job.get('salary', {}).get('fixed', 0),
        'level': job.get('certificate', 0),
        'career': ' '.join(job.get('field', [])),
        # 'text': ' '.join(job.get('description', []) + job.get('requirement', [])),
        'province': province_info,
        # 'type': ' '.join(map(str, job.get('type', [])))
    }
    return job_data

def get_job_features():
    jobs = list(jobs_collection.find({}))
    # job_df = pd.DataFrame(jobs)
    job_data_list = [preprocess_job(job) for job in jobs]
    job_df = pd.DataFrame(job_data_list)
    
    # Chuẩn hóa các thuộc tính số
    job_df[numeric_features] = scaler.fit_transform(job_df[numeric_features])
    
    # Kết hợp các thuộc tính văn bản
    job_descriptions = job_df[text_features].apply(lambda x: ' '.join(x), axis=1)
    tfidf_matrix = tfidf_vectorizer.fit_transform(job_descriptions)
    
    # Kết hợp vector TF-IDF với các thuộc tính số
    job_features = np.hstack((tfidf_matrix.toarray(), job_df[numeric_features].values))
    
    return jobs, job_features

@app.route('/recommendation/<id>', methods=['GET'])
def getJobId(id):
    try:
        
        user = users_collection.find_one({"uId": id})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        
        jobs, job_features = get_job_features()
        
        user_filters = user.get('filters', [])
        if not user_filters:
            return jsonify({"error": "No filters found for the user"}), 404
        print(user_filters)

        combined_text = ' '.join([f"{f.get('career', '')} {f.get('text', '')} {f.get('province', '')}" for f in user_filters])
        user_vector_text = tfidf_vectorizer.transform([combined_text]).toarray()
        
        numeric_values = np.zeros((len(user_filters), len(numeric_features)))
        
        for i, f in enumerate(user_filters):
            numeric_values[i] = [
                f.get('role', 0),
                f.get('sex', 0),
                f.get('level', 0)
            ]
        print("64")
        # user_numeric_features = scaler.transform(user_numeric_features)
        user_numeric_features = scaler.transform([numeric_values.mean(axis=0)])
        
        user_vector = np.hstack((user_vector_text, user_numeric_features))
        
        cosine_similarities = cosine_similarity(user_vector, job_features).flatten()
        
        # print(cosine_similarities)
        
        similar_jobs_indices = cosine_similarities.argsort()[-2:][::-1]
        recommended_jobs = [
            {
                "_id": str(jobs[i]["_id"]),
                "title": jobs[i]["title"],
                "url": jobs[i]["url"],
                "logo": jobs[i]["logo"],
                "update_time": jobs[i]["update_time"],
            }
            for i in similar_jobs_indices
        ]
        
        # print(recommended_jobs)
        return jsonify(recommended_jobs)
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/analytic', methods=['POST'])
def getAnalyticData():
    content = request.json
    # print(content)
    df = spark.read.format("mongo").load()
    # df.printSchema()
    
    age_range = list(range(16, 61))

    result = df.select(
    *[_sum(when(\
    (col('age.type') == 1) & (col('age.min') <= age) & (col('age.max') >= age), 1\
    # )
    # .when(\
    # (col('age.type') == 2) & (col('age.fixed') == age), 1\
    ).when(\
    (col('age.type') == 3) & (col('age.max') > age), 1\
    ).when(\
    (col('age.type') == 4) & (col('age.min') < age), 1\
    ).otherwise(0)\
    ).alias(f'{age}')
    for age in age_range
    ]
    ).collect()

    result_list = [row[f'{age}'] for row in result for age in age_range]

    # json_data = json.dumps(result_list)
    
    return jsonify({"data":str(result_list)})

if __name__ == "__main__":
    app.run(debug=True)