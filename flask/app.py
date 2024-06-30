from flask import Flask, jsonify

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
from flask_pymongo import PyMongo

mongo_uri = "mongodb://admin:20194856@localhost:27017/thesis.jobs"

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

def get_job_features(recent_job_ids):
    jobs = list(jobs_collection.find({"_id": {"$nin": recent_job_ids}}))
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
        
        
        user_filters = user.get('filters', [])
        user_recents_jobs = user.get('recentJobs', [])
        recent_job_ids = [job['jobId'] for job in user_recents_jobs]
        
        jobs, job_features = get_job_features(recent_job_ids)
        # if not user_filters:
        #     return jsonify({"error": "No filters found for the user"}), 404
        # print(user_filters)
        

        combined_text = ' '.join([f"{f.get('career', '')} {f.get('text', '')} {f.get('province', '')}" for f in user_filters])
        user_vector_text = tfidf_vectorizer.transform([combined_text]).toarray()
        
        numeric_values = np.zeros((len(user_filters), len(numeric_features)))
        
        for i, f in enumerate(user_filters):
            numeric_values[i] = [
                f.get('role', 0),
                f.get('sex', 0),
                f.get('level', 0)
            ]
        # user_numeric_features = scaler.transform(user_numeric_features)
        user_numeric_features = scaler.transform([numeric_values.mean(axis=0)])
        
        user_vector = np.hstack((user_vector_text, user_numeric_features))
        
        cosine_similarities = cosine_similarity(user_vector, job_features).flatten()
        
        # print(cosine_similarities)
        
        similar_jobs_indices = cosine_similarities.argsort()[-5:][::-1]
        recommended_jobs = [
            {
                "_id": str(jobs[i]["_id"]),
                "title": jobs[i]["title"],
                "url": jobs[i]["url"],
                "logo": jobs[i]["logo"],
                "update_time": jobs[i]["update_time"],
                "category": jobs[i]["category"],
                "company": jobs[i]["company"],
                "location": jobs[i]["location"]
            }
            for i in similar_jobs_indices
        ]
        
        # print(recommended_jobs)
        return jsonify(recommended_jobs)
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)