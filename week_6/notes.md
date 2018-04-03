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
  It's best to include the $match opperator as soon as possible in your aggregation query so that your
  other stages won't have to process an excesive amount of documents.
  
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
  **promoting nested fields**
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
  * the '$' in quotes represents a value, this query is asking the aggregation pipeline to 
    provide us with the value of ipo valuation amount, as well as the funders, and ipo year.

  * if you would like to reach deep down into nested documents, you can do that by chaining the
    field names with a '.' You can see examples of that done in this query multiple times.

  If you would like to, you can also create new nested documents through the project stage.
  Example:
  ```
  db.companies.aggregate([
    { $match: {"funding_rounds.investments.financial_org.permalink": "greylock"} },
    { $project: {
      _id: 0,
      name: 1,
      founded: {
        year: "$founded_year",
        month: "$founded_month",
        day: "$founded day"
      }
    } }
  ])
  ```
  In the above example we are aggregating the values of founded year, month and day to create a new
  document called founded.

## $unwind
  unwind allows you to take a collection that has an array valued field, and unwind that field so that
  each element within that array has an entire output document.

  Example:
  ```
  { color: 'red',
    food: 'pizza',
    names: ['Bill', 'Kim', 'Rachel']
  }

  // preforming an $unwind on names would produce something like this:

  { color: 'red',     { color: 'red',    { color: 'red', 
    food: 'pizza',      food: 'pizza',     food: 'pizza',
    names: 'Bill'       names: 'Kim'       names: 'Rachel'
  }                   }                  }
  ```
  The number of outputted documents is dependant on the length of the array that you unwind on. This
  example covered an array that had a length of three, therefore there were three outputted documents.

## Array Expressions
  Filter works on array field values and it is one Array Expression that's worth looking into. Here's an exaple:
  ```
  //filter syntax
  new_collection_name: { $filter: {
    input: <THE FIELD YOU WANT TO FILTER ON>,
    as: <ALLIAS NAME>,
    cond: <HOW YOU WOULD LIKE TO FILTER/ OPPERATION>
  }}

  db.companies.aggregate([
    {$match: {"funding_rounds.permalink": "greylock} },
    {$project: {
      _id: 0,
      name: 1,
      rounds: { $filter: {
        input: "$funding_rounds",
        as: "round",
        cond: { $gte: ["$$rounds.raised_amount", 10000000] } } }
      } },
    {$match: {"rounds.permakink": "greylock"}}
    }}
  ])
  ```  
  
  double $$ signs are refferencing variables and values at the same time. 'round' is our allias name, and we want the 
  value of round.raised amount.

## Using accumulators in $project
  In $project stages, you can use a certain subset of accumulators to calculate values based on arrays that you can
  express within an individual in projecting, froma a single doc that passes throught the project stage.

## Introduction to $group
  In a $group stage we can aggregate together values from multiple documents and preform some kind of aggregate opperation
  on them.
  ```
  db.companies.aggregate([
    { $group: {
        _id: { founded_year: "$founded_year" },
        average_number_of_employees: { $avg: "$number_of_employees" },
    }},
    { $sort: { average_number_of_employees: -1 } }
  ])
  ```
  Now, in the $group stage the _id is what we 'group' on. It's how MongoDB organizes the documents that it sees.
  In this example, the group stage will organize/ group on every document that has the same value for founded_year.
  And our average_number_of_employees field, will take each of those groups and preform an average calculation based
  on how many employees each of those companies had.

```
db.items.aggregate([
  { $group: {
      _id: "$category",
      items_in_category: { $sum: 1}
  } }
])

# next I want to grab a sum of the items in category and call that field 'All'

db.items.aggregate([
  { $group: {
    _id: "$category",
    num: { $sum: 1}
  } },
  { $sort: { _id: 1} }
]);


```

## _id in $group Stages
## $group vs $project
