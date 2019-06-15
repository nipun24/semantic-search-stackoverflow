import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import nltk
import requests
from itertools import combinations

#Cleaning the input to get tags
def get_tags(query):
  #Downloading the required libraries for nltk
  nltk.download('punkt')
  nltk.download('stopwords')
  from nltk.tokenize import RegexpTokenizer
  from nltk.corpus import stopwords
  
  #extracting tags from the query
  tokenized_word=RegexpTokenizer(r'\w+').tokenize(query)
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

  if len(api_tags) > 5:
    return api_tags[:5]
  else:
    return api_tags

#Requesting the StackExchange API for questions using the tags obatained
def get_questions(tags):
  temp = []
  #Creating a list of all the possible combinations of tags
  for i in range(1, len(tags)+1):
      comb = []
      comb.append(list(combinations(tags, i)))
      for j in range(0, len(comb[0])):
          temp.append(list(comb[0][j]))
  #Making API calls to all the possible URLs
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
        
      #removing duplicate questions
      filtered_data = []
      questions = []
      for i in desc:
        if i not in filtered_data:
          filtered_data.append(i)
          questions.append(i['title'])
      
  return [questions,filtered_data]

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