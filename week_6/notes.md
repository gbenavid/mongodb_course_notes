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
## Expressions Overview
## Reshapping Documents in $project Stages
## Introduction to $group
## _id in $group Stages
## $group vs $project
