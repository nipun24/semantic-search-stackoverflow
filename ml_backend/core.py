import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import nltk
import requests
import html
from urllib.parse import quote
from urllib.parse import unquote
from itertools import combinations

#Cleaning the input to get tags
def get_tags(query):
  #Downloading the required libraries for nltk
  nltk.download('stopwords')
  from nltk.corpus import stopwords
  
  tokenized_sentence = query.split(' ')
  stop_words = set(stopwords.words("english"))
  crude_tags = []
  for w in tokenized_sentence:
      if w not in stop_words:
          crude_tags.append(w)
  tags = list(set(crude_tags))
  
  #searching the API for tags using the obtained tags
  api_tags = []
  for tag in tags:
    URL = f'https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&inname={quote(tag)}&site=stackoverflow'
    r = requests.get(url = URL)
    data = r.json()
    if len(data['items']) > 0:
      api_tags.append(data['items'][0]['name'])

  if len(api_tags) > 5:
    return api_tags[:5]
  else:
    return api_tags

#Requesting the StackExchange API for questions using the tags obatained
def get_questions(tags, query):
  desc = []
  questions = []
  for tag in tags:
    URL_search = f'https://api.stackexchange.com/2.2/search?order=desc&sort=activity&tagged={quote(tag)}&intitle={quote(query)}&site=stackoverflow'
    r = requests.get(url = URL_search)
    data = r.json()
    if len(data['items']) != 0:
      for item in data['items']:
        desc.append(item)
        questions.append(html.unescape(item['title']))
      break

  if len(questions) <= 5:
    temp = []
    #Creating a list of all the possible combinations of tags
    for i in range(1, len(tags)+1):
        comb = []
        comb.append(list(combinations(tags, i)))
        for j in range(0, len(comb[0])):
            temp.append(list(comb[0][j]))
    #Making API calls to all the possible URLs
    for i in range(len(temp)-1, -1, -1):
      url = ''
      for j in temp[i]:
          url += j + ';'
      URL_tags = f'https://api.stackexchange.com/2.2/questions?order=asc&sort=activity&tagged={quote(url)}&site=stackoverflow'
      r = requests.get(url = URL_tags)
      data = r.json()
      if len(data['items']) > 2 :
        for item in data['items']:
          desc.append(item)
          questions.append(html.unescape(item['title']))
        break
    
  return [questions,desc]

#Converting sentences to embeddings and computing the inner product to calculate similarity
def get_similarity(questions, query):
  questions.append(query)
  with tf.Graph().as_default():
    # Downloading the pre-trained "Universal Sentence Encoder" from tensorflow hub
    url = "https://tfhub.dev/google/universal-sentence-encoder-large/3" 
    embed = hub.Module(url)
    question_encodings = embed(questions)
    with tf.Session() as session:
        session.run(tf.global_variables_initializer())
        session.run(tf.tables_initializer())
        embeddings = session.run(question_encodings)
        similarity = np.inner(embeddings, embeddings[-1:])

  # Adding probability values to the questions
  dictItems = []
  i = 0
  for i in range(0, len(similarity)-1 ):
      temp = { "probability" : similarity.item(i), "title" : questions[i] }
      dictItems.append(temp)
  return dictItems