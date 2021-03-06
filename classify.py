import nltk
import sys

# tests = [ "This is a test because science.",
#           "This is a test because of science.",
#           "This is a test because science is cool.",
#           "This is a test because twitter. Also ++ excited about things rn" ]
tests = []

def search_because_tokens(tagged):
  because_index = [x for x, y in enumerate(tagged) if y[0] == 'because']
  for index in because_index:
    because_noun = True
    loc = index + 1
    while loc < len(tagged):
      tag = tagged[loc]
      if tag[1] in ['IN', 'VBZ', 'VBD', 'VBP', ':', 'MD']:
        because_noun = False
        break
      elif tag[1] in ['.']:
        break
      loc += 1
    if because_noun:
      print tagged[index:loc+1],
    else:
      print '.',
  

if len(sys.argv) == 2:
  tokens = nltk.word_tokenize(sys.argv[1])
  tagged = nltk.pos_tag(tokens)
  search_because_tokens(tagged)
else: 
  for test in tests:
    tokens = nltk.word_tokenize(test)
    tagged = nltk.pos_tag(tokens)
    search_because_tokens(tagged)

