/* eslint-disable quotes */
const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const adminRouter = express.Router();

const info = [
  {
    username: 'asdfg',
    password: 'qwerty',
  },
  {
    username: 'mno',
    password: 'xyz'
  }];

const dsaQuestions = [
  {
    questionNo: 1,
    expectedDate: "4 May 2020",
    topic: "Operating an array",
    timeLimit: 2,
    description: "Given an array A of size N, your task is to do some operations, i.e., search an element, insert an element, and delete an element by completing the functions. Also, all functions should return a boolean value.",
    inputFormat: "The first line of input consists of T, the number of test cases. T testcases follow. Each testcase contains 3 lines of input. The first line of every test case consists of an integer N, denotes the number of elements in an array. The second line of every test cases consists of N spaced integers Ai. The third line of every test case consists of four integers X, Y, Yi and Z, denoting the elements for the search operation, insert operation, insert operation element index and delete operation respectively.",
    outputFormat: "For each testcase, return 1 for each operation if done successfully else 0.",
    constrain: ["1 <= T <= 100", "1 <= N <= 100", "1 <= Ai <= 100"],
    example: [
      {
        SampleInput: ["1", "5", "2 4 1 0 6", "1 2 2 0"],
        SampleOutput: ["1 1 1"]
      }
    ],
    exampleExplain: "",
    testCases:
      [
        {
          input: "1 5 2 4 1 0 6 1 2 2 0",
          output: "1 1 1"
        }
      ]
  },
  {
    questionNo: 2,
    expectedDate: "11 May 2020",
    topic: "Find duplicates in an array",
    timeLimit: 2,
    description: "Given an array a[] of size N which contains elements from 0 to N-1, you need to find all the elements occurring more than once in the given array.",
    inputFormat: "The first line of input contains an integer T denoting the number of test cases. Then T test cases follow. Each test case contains an integer N which denotes the number of elements in the array. The second line of each test case contains n space separated integers denoting elements of the array a[]",
    outputFormat: "Print the duplicate elements from the given array. The order of the output should be in sorted order. Print -1 if no duplicate exists.",
    constrain: ["1 <= T <= 100", "1 <= N <= 10^5", "0 <= A[i] <= N-1, for each valid i"],
    example: [
      {
        SampleInput: ["2", "4", "0 3 1 2", "5", "2 3 1 2 3 "],
        SampleOutput: ["-1", "23"]
      }
    ],
    exampleExplain: "",
    testCases:
      [
        {
          input: "2 4 0 3 1 2 5 2 3 1 2 3",
          output: "-1 23"
        }
      ]
  },
  {
    questionNo: 3,
    expectedDate: "18 May 2020",
    topic: "Operating an array",
    timeLimit: 2,
    description: "Given an array A of size N, your task is to do some operations, i.e., search an element, insert an element, and delete an element by completing the functions. Also, all functions should return a boolean value.",
    inputFormat: "The first line of input consists of T, the number of test cases. T testcases follow. Each testcase contains 3 lines of input. The first line of every test case consists of an integer N, denotes the number of elements in an array. The second line of every test cases consists of N spaced integers Ai. The third line of every test case consists of four integers X, Y, Yi and Z, denoting the elements for the search operation, insert operation, insert operation element index and delete operation respectively.",
    outputFormat: "For each testcase, return 1 for each operation if done successfully else 0.",
    constrain: ["1 <= T <= 100", "1 <= N <= 100", "1 <= Ai <= 100"],
    example: [
      {
        SampleInput: ["1", "5", "2 4 1 0 6", "1 2 2 0"],
        SampleOutput: ["1 1 1"]
      }
    ],
    exampleExplain: "",
    testCases: [
      {
        input: "1 5 2 4 1 0 6 1 2 2 0",
        output: "1 1 1"
      }
    ]
  }];

const daaQuestions = [
  {
    questionNo: 1,
    expectedDate: "10 July 2020",
    topic: "Bubble sort",
    timeLimit: 2,
    description: "The task is to complete bubble function which is used to implement Bubble Sort!",
    inputFormat: "First line of the input denotes the number of test cases 'T'. First line of the test case is the size of array and second line consists of array elements.",
    outputFormat: "For each testcase, in a new line, print the sorted array.",
    constrain: ["1 <= T <= 100", "1 <= N <= 1000", "1 <= Ai <= 1000"],
    example: [
      {
        SampleInput: ["2", "5", "4 1 3 9 7", "10", "10 9 8 7 6 5 4 3 2 1"],
        SampleOutput: ["1 3 4 7 9", "1 2 3 4 5 6 7 8 9 10"]
      }
    ],
    exampleExplain: "",
    testCases:
      [
        {
          input: "2\n5\n4\n1\n3\n9\n7\n10\n10\n9\n8\n7\n6\n5\n4\n3\n2\n1",
          output: "1 3 4 7 9 \n1 2 3 4 5 6 7 8 9 10 \n"
        },
        {
          input: "1\n0",
          output: "\n"
        },
        {
          input: "1\n6\n1\n2\n3\n4\n5\n6 ",
          output: "1 2 3 4 5 6 \n"
        },
        {
          input: "2\n1\n4\n9\n7\n7\n7\n7\n7\n7\n7\n7\n7",
          output: "4 \n7 7 7 7 7 7 7 7 7 \n"
        },
        {
          input: "1\n6\n10\n30\n20\n400\n500\n0 ",
          output: "0 10 20 30 400 500 \n"
        },
        {
          input: "1\n4\n3\n4\n2\n1",
          output: "1 2 3 4 \n"
        },
        {
          input: "1\n4\n1\n4\n2\n3",
          output: "1 2 3 4 \n"
        },
        {
          input: "1\n4\n3\n1\n2\n4 ",
          output: "1 2 3 4 \n"
        },
        {
          input: "1\n4\n3\n4\n1\n2 ",
          output: "1 2 3 4 \n"
        },
        {
          input: "1\n4\n1\n2\n4\n3 ",
          output: "1 2 3 4 \n"
        },
        {
          input: "1\n4\n3\n4\n2\n0 ",
          output: "0 2 3 4 \n"
        }
      ]
  },
  {
    questionNo: 2,
    expectedDate: "18 July 2020",
    topic: "Minimum swaps",
    timeLimit: 2,
    description: "Given an array of integers. Find the minimum number of swaps required to sort the array in non-decreasing order.",
    inputFormat: "The first line of input contains an integer T denoting the no of test cases. Then T test cases follow. Each test case contains an integer N denoting the no of element of the array A[ ]. In the next line are N space separated values of the array A[ ] .",
    outputFormat: "For each test case in a new line output will be an integer denoting minimum umber of swaps that are required to sort the array.",
    constrain: ["1 <= T <= 100", "1 <= N <= 10^5", "1 <= A[] <= 10^6"],
    example: [
      {
        SampleInput: ["2", "4", "4 3 2 1", "5", "1 5 4 3 2"],
        SampleOutput: ["2", "2"]
      }
    ],
    exampleExplain: "",
    testCases:
      [
        {
          input: "2 4 4 3 2 1 5 1 5 4 3 2",
          output: "2 2"
        }
      ]
  },
  {
    questionNo: 3,
    expectedDate: "25 July 2020",
    topic: "Minimum swaps",
    timeLimit: 2,
    description: "Given an array of integers. Find the minimum number of swaps required to sort the array in non-decreasing order.",
    inputFormat: "The first line of input contains an integer T denoting the no of test cases. Then T test cases follow. Each test case contains an integer N denoting the no of element of the array A[ ]. In the next line are N space separated values of the array A[ ] .",
    outputFormat: "For each test case in a new line output will be an integer denoting minimum umber of swaps that are required to sort the array.",
    constrain: ["1 <= T <= 100", "1 <= N <= 10^5", "1 <= A[] <= 10^6"],
    example: [
      {
        SampleInput: ["2", "4", "4 3 2 1", "5", "1 5 4 3 2"],
        SampleOutput: ["2", "2"]
      }
    ],
    exampleExplain: "",
    testCases:
      [
        {
          input: "2 4 4 3 2 1 5 1 5 4 3 2",
          output: "2 2"
        }
      ]
  }];

function router() {
  adminRouter.route('/addStudent')
    .get((req, res) => {
      const dbName = 'SmartLabApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url, { useNewUrlParser: true });
          debug('Connected correctly  to server');

          const db = client.db(dbName);
          const response = await db.collection('students').insertMany(info);
          res.json(response);
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });
  adminRouter.route('/addDsaQuestion')
    .get((req, res) => {
      const dbName = 'SmartLabApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url, { useNewUrlParser: true });
          debug('Connected correctly  to server');

          const db = client.db(dbName);
          const response = await db.collection('dsaQuestions').insertMany(dsaQuestions);
          res.json(response);
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });
  adminRouter.route('/addDaaQuestion')
    .get((req, res) => {
      const dbName = 'SmartLabApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly  to server');

          const db = client.db(dbName);
          const response = await db.collection('daaQuestions').insertMany(daaQuestions);
          res.json(response);
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });
  return adminRouter;
}

module.exports = router;
