Purpose of the app: manage your machine learning models, workflows, training, inference, deployment, monitoring, logging, metrics, dashboards, reporting, visualization locally and in the cloud. add databasem, llm, azure, aws, gcp integrations

manage workflows, make integration with external services easy


1. create a flow that takes in data from the storage repository and processes it
2. train a model through the nodes (also monitor, deploy, visualization) 
3. llm integration
4. yaml translation

- data input
    - file upload
    - database
    - api
- process
    - functions
    - train model: labelling, evaluation, inference
    - deploy model
    - monitor model
    - update model
    - delete model
    - model versioning
    - model history
    - model comparison
    - model performance
- data output
    - file download
    - database
    - api
    - email
    - slack
    - webhook
    - notification
    - alert
    - log
    - metric
    - dashboard
    - report
    - visualization
    - dashboard

- integration with azure, aws, gcp
- llm nodes: openai, anthropic, gemini
- download trained model
- docker container support for engines

1st version:
    - data input: input an array of numbers in the browser app
    - process: apply function to the data -> sum of the numbers
    - data output: display the result in the canvas log

    - should we have some king of engine in process?

    - in the end, we have flow that we can run


Roadmap:
- add nodes to the canvas
    - input node
    - process nodes
    - output nodes
    - library for nodes
- context for nodes
- be able to run flows
- overview of flows

Examples:
 - sum of numbers (input numbers node, sum function node, output result node)
 - simple llm flow (input prompt node, llm function node, output result node)
 - batch processing

## TODO

- [ ] add dashboard integration
- [ ] add file processing for the backend

## PLAN
- ability to parse various data from the user into a dedicated user storage repository
    - the user has a storage folder
    - maybe in the left side we can have a file browser that accesses the user's storage repository
- simple models that parse in data
    - it should be a node 