import findspark
findspark.init('/opt/spark') 
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum as _sum, when, explode

mongo_uri = "mongodb://admin:20194856@localhost:27017/thesis.jobs"

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

# result = df.select(
# *[_sum(when(\
# (col('age.type') == 1) & (col('age.min') <= age) & (col('age.max') >= age), 1\
# # )
# # .when(\
# # (col('age.type') == 2) & (col('age.fixed') == age), 1\
# ).when(\
# (col('age.type') == 3) & (col('age.max') > age), 1\
# ).when(\
# (col('age.type') == 4) & (col('age.min') < age), 1\
# ).otherwise(0)\
# ).alias(f'{age}')
# for age in age_range
# ]
# ).collect()

# result_list = [row[f'{age}'] for row in result for age in age_range]
# print(result_list)

df_exploded = df.withColumn("location", explode("location"))

# Select the "province" field from these rows
df_provinces = df_exploded.select("location.province")

# Get distinct values of the "province" field
df_unique_provinces = df_provinces.distinct()
df_unique_provinces.show(100)

spark.stop()
