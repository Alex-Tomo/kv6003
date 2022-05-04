# The project structure

**Note the Rasa framework must be installed** 

**Must be using Python version 3.8** 

The project is split into 3 parts:\
    Frontend\
    Backend\
    Chatbot

## The front end can be run by navigating to the frontend using

<code>cd ./frontend</code><br />
<code>npm i</code> <br />
<code>npm start</code> 


## The chatbot must be run using two terminals and can be run using

<code>cd ./rasa</code> 

in one terminal run:

<code>rasa run actions</code>

in another terminal run

<code>rasa run --enable-api --cors="*" --credentials credentials.yml</code>

## The backend does not need to be run

The backend is currently being hosted at: http://unn-w19007452.newnumyspace.co.uk/kv6003/api


## React files explained:

inside ./frontend/src/ the assets folder contains icons gathered from 
https://material.io/design/iconography/system-icons.html#design-principles \
The css folder and App.css contain all the css for the frontend.
The components folder is split into 5 subfolders. \
Forms are the forms displayed on the modals. \
Modals are the popup windows such as login and settings. \
Pages include the main homepage and an error page. \
Sections includes the split up sections to be displayed on the homepage. \
ui_elements are the interface elements displayed on the homepage.


## Rasa files explained:

inside ./rasa the config.yml file contains the pipeline for the rasa model
including tokenizers, featurizers etc. Credentials includes additional endpoints
to be called by the frontend (endpoints are found in the actions folder). The
domain.yml file contains a reference to all intents and responses.

Inside the ./rasa/data/ folder the nlu.yml file contains all the intent training data.
The rules contains rules which must be followed when an intent is recognised.
The stories file contains training data indicating which action should be taken
when an intent is recognised.

Inside the ./rasa/actions/ folder the actions.py file contains all the customised
responses, each response must be a class and have a run method. The remaining files
communicate with the API and contain methods related to their respective names.
Inside the constants folder is a constants.py file containing all the constants for the
actions.py file. The custom actions folder contains customer actions to be called
by the front end, these include writing to files, retraining models and changing the
current models.