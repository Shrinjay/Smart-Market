import gpt_2_simple as gpt2
from flask import *
import os
from dotenv import load_dotenv
import requests
import pymongo
import threading
import datetime
import facebook
import time
from flask_cors import CORS

load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_URI"))
db = client['smart_market']
posts = db['posts']

# print(posts.insert_one({
#     'content': "Automated posting test 4",
#     'post_time': datetime.datetime(2021, 2, 7, 0, 20, 0)
# }))

res = requests.get(
    f'https://graph.facebook.com/v3.0/{os.getenv("FB_USER")}/accounts?access_token={os.getenv("FB_KEY")}')
cfg = {
    'page_key': res.json()['data'][0]['access_token'],
    'page_id': res.json()['data'][0]['id']
}


def checkPosts():
    while True:
        print("run thread")
        post_list = posts.find()
        for post in post_list:
            if (datetime.datetime.now() - datetime.timedelta(minutes=1) <
                    post['post_time'] < datetime.datetime.now() + datetime.timedelta(minutes=1)):
               try:
                   graph = facebook.GraphAPI(cfg['page_key'])
                   p = graph.put_object(
                       parent_object=cfg['page_id'],
                       connection_name="feed",
                       message=post['content'],
                   )
                   print(p)
               except:
                   print("Facebook Exception Occurred")
        time.sleep(65)


post_thread = threading.Thread(target=checkPosts)
post_thread.start()

app = Flask(__name__)
CORS(app)


@app.route('/getPhrases')
def getPhrases():
    sess = gpt2.start_tf_sess()
    gpt2.load_gpt2(sess)
    response = gpt2.generate(sess, length=50, temperature=0.9, include_prefix=False, return_as_list=True,
                             prefix=request.args.get('prompt'))
    print(jsonify(response))
    return jsonify(response)

@app.route('/savePhrases', methods=['POST'])
def savePhrases():
    body = request.json
    print(body)
    db_res = posts.insert_one({
        'content': body['content'],
        'post_time': datetime.datetime(body['year'], body['month'], body['date'], body['hour'], body['minute'])
    })
    return jsonify({'success': True})


if __name__ == "__main__":
    app.run()
