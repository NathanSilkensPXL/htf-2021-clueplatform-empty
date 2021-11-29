# htf-2021-clueplatform
![Overview](./overview.png)

## Local development

```bash

# install existing depedencies
cd src/adapters/fn-sourceAdapterReddit/
npm install

# Execute function locally, optional add  --skip-pull-image 
sam local invoke FnClueProcessor --event ./events/clueProcessingInput.json -t templates/core/clue-processing-service.yaml

sam local invoke FnSourceAdapterReddit --event ./events/testEvent.json -t templates/adapters/event-sources-adapters.yaml

# Adding new npm dependencies to function
npm install --save snoowrap

# creating new function
cd src/../
mkdir fn-xxxx
cd fn-xxxx
npm init #All defaults are ok

```

## Deploy function to cloud

```bash
# see inside script for more info
bash deployAdapters.sh

bash deployChannels.sh

bash deployCore.sh

```
