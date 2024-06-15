import findspark
findspark.init('/opt/spark')
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as _sum, when
import json

mongo_uri = "mongodb://admin:20194856@localhost:27017/thesis.jobs"

def run_spark_job():
    # Create Spark Session with MongoDB configuration
    spark = SparkSession.builder \
        .appName("MongoDBSparkExample") \
        .config("spark.mongodb.input.uri", mongo_uri) \
        .config("spark.mongodb.output.uri", mongo_uri) \
        .config('spark.jars.packages', 'org.mongodb.spark:mongo-spark-connector_2.12:3.0.1') \
        .getOrCreate()

    # Read data from MongoDB
    df = spark.read.format("mongo").load()

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

    json_data = json.dumps(result_list)

    # Print the JSON array to stdout
    print("data="+json_data)
    # spark.stop()

run_spark_job()


