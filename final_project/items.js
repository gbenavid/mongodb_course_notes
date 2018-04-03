/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var MongoClient = require('mongodb').MongoClient,
assert = require('assert');

function ItemDAO(database) {
    "use strict";
    /*
      * TODO-lab1A
      *
      * LAB #1A: Implement the getCategories() method.
      *
      * Write an aggregation query on the "item" collection to return the
      * total number of items in each category. The documents in the array
      * output by your aggregation should contain fields for "_id" and "num".
      *
      * HINT: Test your mongodb query in the shell first before implementing
      * it in JavaScript.
      *
      * In addition to the categories created by your aggregation query,
      * include a document for category "All" in the array of categories
      * passed to the callback. The "All" category should contain the total
      * number of items across all categories as its value for "num". The
      * most efficient way to calculate this value is to iterate through
      * the array of categories produced by your aggregation query, summing
      * counts of items in each category.
      *
      * Ensure categories are organized in alphabetical order before passing
      * to the callback.
      *
      */
    this.db = database;
    this.getCategories = function(callback) {
        "use strict";
        let query = [
          { $group: { _id: "$category", num: { $sum: 1} } },
          { $sort: { _id: 1} }
        ];

        this.db.collection("items").aggregate(query).toArray(function(err, categories) {
          assert.equal(null, err);
          var totalItemCount = 0;
          let i = 0;
          while (i < categories.length) {
            totalItemCount += categories[i].num;
            i += 1;
          }
        categories.unshift({_id: "All", num: totalItemCount});

        callback(categories);
    });
    }


    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";

      /*
        * TODO-lab1B
        *
        * LAB #1B: Implement the getItems() method.
        *
        * Create a query on the "items" collection to select only the items
        * that should be displayed for a particular page of a given category.
        * The category is passed as a parameter to getItems().
        *
        * Use sort(), skip(), and limit() and the method parameters: page and
        * itemsPerPage to identify the appropriate products to display on each
        * page. Pass these items to the callback function.
        *
        * Sort items in ascending order based on the _id field. You must use
        * this sort to answer the final project questions correctly.
        *
        * Note: Since "All" is not listed as the category for any items,
        * you will need to query the "item" collection differently for "All"
        * than you do for other categories.
        *
       */
     let query = category === "All" ? {} : { category : category };
     let itemsInCategory = this.db.collection("items").find(query);
     
     itemsInCategory.skip(page*itemsPerPage);
     itemsInCategory.limit(itemsPerPage);
     itemsInCategory.sort({ _id: 1 })
     
     itemsInCategory.toArray(function(err, pageItems) {
        assert.equal(null, err);
        callback(pageItems);
      });

      let pageItem = this.createDummyItem();
      let pageItems = [];
      for (var i=0; i<5; i++) {
        pageItems.push(pageItem);
      }

        // TODO-lab1B Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the items for the selected page
        // to the callback.
        // callback(pageItems);
    }


    this.getNumItems = function(category, callback) {
        "use strict";
        /*
          * TODO-lab1C:
          *
          * LAB #1C: Implement the getNumItems method()
          *
          * Write a query that determines the number of items in a category
          * and pass the count to the callback function. The count is used in
          * the mongomart application for pagination. The category is passed
          * as a parameter to this method.
          *
          * See the route handler for the root path (i.e. "/") for an example
          * of a call to the getNumItems() method.
          *
        */

         // TODO Include the following line in the appropriate
         // place within your code to pass the count to the callback.

          let query;
          if (category === "All")
           query = {}
          else
            query = {category: category}
          
          this.db.collection("items").find(query).count(function(error, count) {
            assert.equal(null, error);
            callback(count);
          });
    }


    this.searchItems = function(query, page, itemsPerPage, callback) {
      "use strict";
      /*
       * TODO-lab2A
       *
       * LAB #2A: Implement searchItems()
       *
       * Using the value of the query parameter passed to searchItems(),
       * perform a text search against the "item" collection.
       *
       * Sort the results in ascending order based on the _id field.
       *
       * Select only the items that should be displayed for a particular
       * page. For example, on the first page, only the first itemsPerPage
       * matching the query should be displayed.
       *
       * Use limit() and skip() and the method parameters: page and
       * itemsPerPage to select the appropriate matching products. Pass these
       * items to the callback function.
       *
       * searchItems() depends on a text index. Before implementing
       * this method, create a SINGLE text index on title, slogan, and
       * description. You should simply do this in the mongo shell.
       *
       */
      // I added an index to two fields:
      // this.db.collection("items").ensureIndex({ "description": "text", "title": "text" });

      let searchParam = query ? { $text: { $search: query } } : {};
      let foundItems = this.db.collection("items").find(searchParam);

      foundItems.skip(page*itemsPerPage);
      foundItems.limit(itemsPerPage);

      foundItems.toArray(function(error, item) {
        assert.equal(null, error);
        callback(item);
      });
      
      // var item = this.createDummyItem();
      // var items = [];
      // for (var i=0; i<5; i++) {
          // items.push(item);
      // }
      // TODO-lab2A Replace all code above (in this method).
      // TODO Include the following line in the appropriate
      // place within your code to pass the items for the selected page
      // of search results to the callback.
    }


    this.getNumSearchItems = function(query, callback) {
      "use strict";

      // var numItems = 0;

        /*
          * TODO-lab2B
          *
          * LAB #2B: Using the value of the query parameter passed to this
          * method, count the number of items in the "item" collection matching
          * a text search. Pass the count to the callback function.
          *
          * getNumSearchItems() depends on the same text index as searchItems().
          * Before implementing this method, ensure that you've already created
          * a SINGLE text index on title, slogan, and description. You should
          * simply do this in the mongo shell.
        */
      let searchQuery = query ? {$text: {$search: query}} : {};
      this.db.collection("items").find(searchQuery).count(function(error, count) {
        assert.equal(null, error);
        callback(count);
      });
    }


    this.getItem = function(itemId, callback) {
        "use strict";

        /*
         * TODO-lab3
         *
         * LAB #3: Implement the getItem() method.
         *
         * Using the itemId parameter, query the "items" collection by
         * _id and pass the matching item to the callback function.
         *
         */
        let item = this.db.collection("items").find({ _id: itemId}).toArray(function(error, info) {
          assert.equal(null, error);
          let itemDoc;
          if (info)
            itemDoc = info[0];
          callback(itemDoc)
        });
        // var item = this.createDummyItem();

        // TODO-lab3 Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the matching item
        // to the callback.
        // callback(item);
    }


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        /*
         * TODO-lab4
         *
         * LAB #4: Implement addReview().
         *
         * Using the itemId parameter, update the appropriate document in the
         * "item" collection with a new review. Reviews are stored as an
         * array value for the key "reviews". Each review has the fields:
         * "name", "comment", "stars", and "date".
         *
         */
        var reviewDoc = {
          name: name,
          comment: comment,
          stars: stars,
          date: Date.now()
        }
        this.db.collection("items").updateOne(
          {_id: itemId},
          {"$push": {reviews: reviewDoc}},
          function(error, doc) {
            assert.equal(null, error);
            callback(doc);
          }
        );

        // TODO replace the following two lines with your code that will
        // update the document with a new review.
        // var doc = this.createDummyItem();
        // doc.reviews = [reviewDoc];

        // TODO Include the following line in the appropriate
        // place within your code to pass the updated doc to the
        // callback.
        // callback(doc);
    }


    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;
