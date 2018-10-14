import json

import summarize

#text = "Rice Pudding - Poem by Alan Alexander Milne\nWhat is the matter with Mary Jane?\nShe's crying with all her might and main,\nAnd she won't eat her dinner - rice pudding again -\nWhat is the matter with Mary Jane?\nWhat is the matter with Mary Jane?\nI've promised her dolls and a daisy-chain,\nAnd a book about animals - all in vain -\nWhat is the matter with Mary Jane?\nWhat is the matter with Mary Jane?\nShe's perfectly well, and she hasn't a pain;\nBut, look at her, now she's beginning again! -\nWhat is the matter with Mary Jane?\nWhat is the matter with Mary Jane?\nI've promised her sweets and a ride in the train,\nAnd I've begged her to stop for a bit and explain -\nWhat is the matter with Mary Jane?\nWhat is the matter with Mary Jane?\nShe's perfectly well and she hasn't a pain,\nAnd it's lovely rice pudding for dinner again!\nWhat is the matter with Mary Jane?"

text= '\n'.join([
    "Hello",
    "Hi, what can I help you with?",
    "How long is it?",
    "What do you mean?",
    "How long does it usually take to do this?",
    "You should probably set aside 2 or 3 hours for this",
    "Why does it take that long?",
    "Because it takes a while to get there, then park, then wait in line, and the line can take a long time",
    "So it can take 2 or 3 hours?",
    "yes",
    "thanks",
    "You're welcome, anytime"
])

#print(summarize.summarize(text))
body = json.dumps({'text': text})
event = {'body': body}

print(summarize.endpoint(event, None))
