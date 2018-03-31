# Application Engineering

## Write Concern
  In mongodb by default waits for writes to be acknowledged by the database but it wont wait
  for the journal to sync. 
  - Pro: this is fast
  - Con: there is a small window of vunerability
  If you want to eliminate that window of vuneralbility, you can set `j = true`.
  - slower
  - vuneralbility is removed
  you can also set `w = 0`. This is not reccomended becuase you are permitting unacknowledged
  write.

## Network Errors
  watch this video [here](https://www.youtube.com/watch?time_continue=3&v=xWNzCkTCN-M)

  There could be a TCP reset, and the network can actually reset in a way to where you never
  see the response. This means that your writes from your application to MongoDB _might_ have
  happened if you recieve an error and don't get a possitive report back from MongoDB.

  This entire scenerio isn't too problematice with writes, but it is more difficult to deal
  with when your working with writes. It might be possible that you won't know whether that
  upadte occured or not, especially if you're incrementing and you didn't know too much about
  that data before it underwent that update.

  If you want to avoid this error, then you would want to turn all of your updates into
  inserts.

## Introduction to Replication

  1. Availability: if the node goes down, we still want to be able to use the system.
  2. Fault Tolerance: How do we make sure we dont lose our data between the backups?

  Replication is introduced to solve these problems listed above.
  There are three nodes in a set, and one of them is a primary and the other two are
  secondary. In the event that the primary node goes down, a secondary node will be elected
  to take the place as the new primary. There is a minimum of three nodes in a set for this
  system to work.

## Replica Set Elections

  There is the regular node, which has the data and can become primary
  Arbiter node: is only used for voting purposes.
  Delated/ Regular node: disaster recovery node. It can vote, but it cannot become primary.
  **If you would like to prevent any node from becoming primary, then you set `p = 0`**
  Hidden node: used for analytics, is never primary. Can vote. 

## Write Consistency

  By default in mongodb, your writes have to go to the primar node, but your reads can go to
  the secondary nodes.
  If you read from secondary nodes however, there is a possibility that you may read stale
  data. Because the replication is asyncronous. 
  
  When there is failover, and a new primary is being elected, you may not write.

## Creating a Replica Set

  
## Replica Set Internals
## Failover and Rollback
## Connecting to a Replica Set
## Failover in the Node.js Driver
## Write Concern Revisited
## Read Preferences
## Review of Implications of Replication
## Introduction to Sharding
## Building a Sharded Enviroment
## Implications of Sharding
## Sharding + Replication
## Choosing a Shared Key
