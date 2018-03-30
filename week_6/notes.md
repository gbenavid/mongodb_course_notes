# The Aggregation Framework

## Introduction to the Aggregation Framework
  [watch the video for this lecture](https://www.youtube.com/watch?time_continue=6&v=p5bFDy94cnA)
  The aggregation framework in MongoDB is a set of analytics tools in MongoDB
  that allow you to run various reports or analysis on one or more collections.

  The idea of the aggregation framework is that we take input from a collection,
  and we pass it through a series of stages, each of which preforms an opperation
  that flows with the other stages. Regardless which stage you preform, the output
  will always be a document.

  ### Stage
  Each stage is a data processing unit it takes a stream of input documents, and produces
  an out put of documents. This stage takes parameters, and with those parameters we have
  the ability to reshape, modify fields, or do some sort of accumulation task... etc.

  ### Pipeline
  Its not uncommon that you would like to include the same type of stage multiple times
  within a single pipeline.
## Familiar Aggregation Operations
  * **Match**: similar to find
  a basic example of match query
  ```
  db.companies.aggregate([
    { $match: {founded_year: 2004 }}
  ])
  ``` 
  
  * **Project**: define the things that you will project as output.
  ```
  db.companies.aggregate([
    {$match: { founded_year: 2004 }},
    {$project: {
      _id: 0,
      name: 1,
      founded_year: 1
    } }
  ])
  ```
  Above we are calling the `aggregate` method, and it's accepting a pipeline.
  A pipeline is an array with documents as elements. Our stages in this example
  are $match, and $project. Match filters the documents, and project reshapes
  the documents.
  
  * **Limit**: limit the number of documents you recieve back
  ```
  db.companies.aggregate([
    {$match: { founded_year: 2004 }},
    {$limit: 5},
    {$project: {
      _id: 0,
      name: 1,
      founded_year: 1
    } }
  ])
  ```
  **ALWAYS BE THINKING ABOUT THE EFFICIENCY OF YOUR PIPELINE**
  
  * **Sort**: How you would like to sort your documents.
  ```
  db.companies.aggregate([
    {$match: { founded_year: 2004 }},
    {$limit: 5},
    {$sort: {name: 1}},
    {$project: {
      _id: 0,
      name: 1 } }
  ])
  ```
  * **Skip**: include a skip stage to skip over a specified amount of documents.
  ```
  db.companies.aggregate([
    {$match: {founded_year: 2004}},
    {$sort: {name:1}},
    {$skip: 10},
    {$limit: 5},
    {$project: {_id: 0, name: 1}},
  ]);
  ```
## Expressions Overview
  
  view the video for this course [here](https://www.youtube.com/watch?time_continue=21&v=n1-buqH9sUU)
  You can view a complete list of expressions on the MongoDB site. There are quite a few matamatical expressions
  you can find, as well as string, text, array and case expressions... etc.

  [resources](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/)

## Reshapping Documents in $project Stages
  ```
  db.companies.aggregate([
    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock" }},
    { $project: {
      _id: 0,
      name: 1,
      ipo: "$ipo.pub_year",
      valuation: "$ipo.valuation_amount",
      funders: "$funding_rounds.investments.financial_org.permalink"
      }
    }
  ])
  ```
## Introduction to $group
## _id in $group Stages
## $group vs $project
