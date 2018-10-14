import json

from gensim.summarization.summarizer import summarize

### Lambda handler

def endpoint(event, context):
    body = json.loads(event['body'])
    text = body['text']
    
    # Strip out questions
    #new_text = [x for x in text.split('\n') if x[-1] != '?']

    # Remove single words
    #new_text = '\n'.join([x for x in new_text if len(x.split()) > 1])


    # Summarize
    summary = summarize(text, .5)
    
     # Strip out questions
    summary = [x for x in summary.split('\n') if x[-1] != '?']

    # Remove single words
    summary = '\n'.join([x for x in summary if len(x.split()) > 1])


    response = {
        "statusCode": 200,
        "headers": {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
                },
        "body": json.dumps(summary)
    }

    return response