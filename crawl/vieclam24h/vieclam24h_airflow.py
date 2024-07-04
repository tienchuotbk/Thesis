import findspark
findspark.init('/opt/spark') 
import requests
from lxml import html
import time
import re
import json
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf, to_date, when, date_format, regexp_extract, explode, col, regexp_replace, to_timestamp, concat, lit, array, trim
from pyspark.sql.types import StructType, StructField, IntegerType, FloatType, StringType, ArrayType
import json
import re
from rapidfuzz import fuzz 
import pymongo
user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'

def run_crawler():
    print("Crawl")

def run_spark_job():
    print("ETL Job")

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 7, 2),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}
dag = DAG(
    'vieclam24h',
    default_args=default_args,
    description='DAG for vieclam24hjob',
    schedule_interval=timedelta(days=1),
)


crawler_task = PythonOperator(
    task_id='run_crawler',
    python_callable=run_crawler,
    dag=dag,
)

spark_job_task = PythonOperator(
    task_id='run_spark_job',
    python_callable=run_spark_job,
    dag=dag
)
crawler_task >> spark_job_task