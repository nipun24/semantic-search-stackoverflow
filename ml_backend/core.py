import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import nltk
import requests
from itertools import combinations

#Cleaning the input to get tags
def get_tags(input):
    #Downloading the required libraries for nltk
    nltk.download('punkt')
    nltk.download('stopwords')
    from nltk.tokenize import RegexpTokenizer
    from nltk.corpus import stopwords
    
    #extracting tags from the query
    tokenized_word=RegexpTokenizer(r'\w+').tokenize(input)
    stop_words=set(stopwords.words("english"))
    filtered_sent=[]
    for w in tokenized_word:
        if w not in stop_words:
            filtered_sent.append(w)
    tags = list(set(filtered_sent))
    
    #searching the API for tags using the obtained tags
    api_tags = []
    for tag in tags:
      URL = f'https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&inname={tag}&site=stackoverflow'
      r = requests.get(url = URL)
      data = r.json()
      if len(data['items']) > 0:
        api_tags.append(data['items'][0]['name'])

    #finding similarity between the query tag and the API tag
    final_tags = []
    for i in range(0,len(tags)):
      arr = []
      arr.append(tags[i])
      arr.append(api_tags[i])
      sim = get_similarity(arr) 
      if sim[0]['probability'] > .7:
        final_tags.append(api_tags[i])
       
    if len(final_tags) > 5:
      return final_tags[:5]
    else:
      return final_tags

#Requesting the StackExchange API for questions using the tags obatained
def get_questions(tags):
    temp = []
    messages = []
    data = []
    #Creating a list of all the possible combinations of tags
    for i in range(1, len(tags)+1):
        comb = []
        comb.append(list(combinations(tags, i)))
        for j in range(0, len(comb[0])):
            temp.append(list(comb[0][j]))
    #Making API calls to all the possible URLs
    messages = []
    desc = []
    for i in range(len(temp)-1, -1, -1):
        url = ''
        for j in temp[i]:
            url += j + '%3B'
        URL = f'https://api.stackexchange.com/2.2/questions?order=asc&sort=activity&tagged={url}&site=stackoverflow'
        r = requests.get(url = URL)
        data = r.json()
        for item in data['items']:
          desc.append(item)
          messages.append(item['title'])
    return [messages,desc]

#Converting sentences to embeddings and computing the inner product to calculate similarity
def get_similarity(questions):
    # Downloading the pre-trained "Universal Sentence Encoder" from tensorflow hub
    url = "https://tfhub.dev/google/universal-sentence-encoder-large/3" 
    embed = hub.Module(url)
    placeholder = tf.placeholder(tf.string, shape=(None))
    question_encodings = embed(placeholder)
    with tf.Session() as session:
        session.run(tf.global_variables_initializer())
        session.run(tf.tables_initializer())
        embeddings = session.run(question_encodings, feed_dict={placeholder: questions})
        similarity = np.inner(embeddings, embeddings[-1:])

    # Adding probability values to the questions
    dictItems = []
    i = 0
    for i in range(0, len(similarity)-1 ):
        temp = { "probability" : similarity.item(i), "title" : questions[i] }
        dictItems.append(temp)
    return dictItems