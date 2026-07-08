//=======================================
// NOTE! JSOG not used in tests anymore!
//=======================================

// import { decodeJSOG } from "./decode-jsog.js";
// import { getMats1 } from "./get-mats1.js";
// import { toJsogBreathFirst } from "./to-jsog-breath-first.js";


// toJsogBreathFirst(getMats1()); //?


// const mats1Jsog: any = [
//   {
//     "@id": "1",
//     "cpNode": {
//       "@id": "2",
//       "cp": {
//         "@id": "3",
//         "pointOnShape": {
//           "@id": "4",
//           "curve": {
//             "@id": "5",
//             "loop": {
//               "@id": "6",
//               "beziers": [
//                 [[82,-101],[24,8]],
//                 [[24,8],[46,8]],
//                 [[46,8],[46,54]],
//                 [[46,54],[117,54]],
//                 [[117,54],[117,8]],
//                 [[117,8],[139,8]],
//                 [[139,8],[82,-101]]
//               ],
//               "curves": [
//                 {
//                   "@ref": "5"
//                 },
//                 {
//                   "@id": "7",
//                   "loop": {
//                     "@ref": "6"
//                   },
//                   "ps": [
//                     [24,8],
//                     [46,8]
//                   ],
//                   "prev": {
//                     "@ref": "5"
//                   },
//                   "next": {
//                     "@id": "8",
//                     "loop": {
//                       "@ref": "6"
//                     },
//                     "ps": [
//                       [46,8],
//                       [46,54]
//                     ],
//                     "prev": {
//                       "@ref": "7"
//                     },
//                     "next": {
//                       "@id": "9",
//                       "loop": {
//                         "@ref": "6"
//                       },
//                       "ps": [
//                         [46,54],
//                         [117,54]
//                       ],
//                       "prev": {
//                         "@ref": "8"
//                       },
//                       "next": {
//                         "@id": "10",
//                         "loop": {
//                           "@ref": "6"
//                         },
//                         "ps": [
//                           [117,54],
//                           [117,8]
//                         ],
//                         "prev": {
//                           "@ref": "9"
//                         },
//                         "next": {
//                           "@id": "11",
//                           "loop": {
//                             "@ref": "6"
//                           },
//                           "ps": [
//                             [117,8],
//                             [139,8]
//                           ],
//                           "prev": {
//                             "@ref": "10"
//                           },
//                           "next": {
//                             "@id": "12",
//                             "loop": {
//                               "@ref": "6"
//                             },
//                             "ps": [
//                               [139,8],
//                               [82,-101]
//                             ],
//                             "prev": {
//                               "@ref": "11"
//                             },
//                             "next": {
//                               "@ref": "5"
//                             },
//                             "idx": 6
//                           },
//                           "idx": 5
//                         },
//                         "idx": 4
//                       },
//                       "idx": 3
//                     },
//                     "idx": 2
//                   },
//                   "idx": 1
//                 },
//                 {
//                   "@ref": "8"
//                 },
//                 {
//                   "@ref": "9"
//                 },
//                 {
//                   "@ref": "10"
//                 },
//                 {
//                   "@ref": "11"
//                 },
//                 {
//                   "@ref": "12"
//                 }
//               ],
//               "idx": 0
//             },
//             "ps": [
//               [82,-101],
//               [24,8]
//             ],
//             "prev": {
//               "@ref": "12"
//             },
//             "next": {
//               "@ref": "7"
//             },
//             "idx": 0
//           },
//           "t": 1,
//           "p": [
//             24,
//             8
//           ],
//           "isSource": true
//         },
//         "circle": {
//           "@id": "13",
//           "center": [
//             24,
//             8
//           ],
//           "radius": 0
//         },
//         "order": -1,
//         "order2": 0
//       },
//       "isHoleClosing": false,
//       "isIntersection": false,
//       "prev": {
//         "@id": "14",
//         "cp": {
//           "@id": "15",
//           "pointOnShape": {
//             "@id": "16",
//             "curve": {
//               "@ref": "5"
//             },
//             "t": 0.8218199951291328,
//             "p": [
//               34.33444028251029,
//               -11.421620530924521
//             ],
//             "isSource": false
//           },
//           "circle": {
//             "@id": "17",
//             "center": [
//               46,
//               -5.21425847941623
//             ],
//             "radius": 13.21425847941623
//           },
//           "order": 0,
//           "order2": 0
//         },
//         "isHoleClosing": false,
//         "isIntersection": false,
//         "prev": {
//           "@id": "18",
//           "cp": {
//             "@id": "19",
//             "pointOnShape": {
//               "@id": "20",
//               "curve": {
//                 "@ref": "5"
//               },
//               "t": 0.6336559854064299,
//               "p": [
//                 45.24795284642707,
//                 -31.931497590699145
//               ],
//               "isSource": false
//             },
//             "circle": {
//               "@id": "21",
//               "center": [
//                 81.5,
//                 -12.641417453935567
//               ],
//               "radius": 41.064803841095305
//             },
//             "order": 0,
//             "order2": 0
//           },
//           "isHoleClosing": false,
//           "isIntersection": false,
//           "prev": {
//             "@id": "22",
//             "cp": {
//               "@id": "23",
//               "pointOnShape": {
//                 "@id": "24",
//                 "curve": {
//                   "@ref": "5"
//                 },
//                 "t": 0.6306030461949899,
//                 "p": [
//                   45.425023320690585,
//                   -32.264267964746104
//                 ],
//                 "isSource": false
//               },
//               "circle": {
//                 "@id": "25",
//                 "center": [
//                   81.68410160768288,
//                   -12.970446490933696
//                 ],
//                 "radius": 41.07276841516263
//               },
//               "order": 0,
//               "order2": 0
//             },
//             "isHoleClosing": false,
//             "isIntersection": false,
//             "prev": {
//               "@id": "26",
//               "cp": {
//                 "@id": "27",
//                 "pointOnShape": {
//                   "@id": "28",
//                   "curve": {
//                     "@ref": "12"
//                   },
//                   "t": 1,
//                   "p": [
//                     82,
//                     -101
//                   ],
//                   "isSource": true
//                 },
//                 "circle": {
//                   "@id": "29",
//                   "center": [
//                     82,
//                     -101
//                   ],
//                   "radius": 0
//                 },
//                 "order": 1,
//                 "order2": 0
//               },
//               "isHoleClosing": false,
//               "isIntersection": false,
//               "prev": {
//                 "@id": "30",
//                 "cp": {
//                   "@id": "31",
//                   "pointOnShape": {
//                     "@ref": "28"
//                   },
//                   "circle": {
//                     "@ref": "29"
//                   },
//                   "order": -1,
//                   "order2": 0
//                 },
//                 "isHoleClosing": false,
//                 "isIntersection": false,
//                 "prev": {
//                   "@id": "32",
//                   "cp": {
//                     "@id": "33",
//                     "pointOnShape": {
//                       "@id": "34",
//                       "curve": {
//                         "@ref": "12"
//                       },
//                       "t": 0.36700494883501966,
//                       "p": [
//                         118.08071791640388,
//                         -32.003539423017145
//                       ],
//                       "isSource": false
//                     },
//                     "circle": {
//                       "@ref": "25"
//                     },
//                     "order": 0,
//                     "order2": 0
//                   },
//                   "isHoleClosing": false,
//                   "isIntersection": false,
//                   "prev": {
//                     "@id": "35",
//                     "cp": {
//                       "@id": "36",
//                       "pointOnShape": {
//                         "@id": "37",
//                         "curve": {
//                           "@ref": "12"
//                         },
//                         "t": 0.1875,
//                         "p": [
//                           128.3125,
//                           -12.4375
//                         ],
//                         "isSource": true
//                       },
//                       "circle": {
//                         "@id": "38",
//                         "center": [
//                           115.9110440340909,
//                           -5.952334953607174
//                         ],
//                         "radius": 13.994766012811272
//                       },
//                       "order": 0,
//                       "order2": 0
//                     },
//                     "isHoleClosing": false,
//                     "isIntersection": false,
//                     "prev": {
//                       "@id": "39",
//                       "cp": {
//                         "@id": "40",
//                         "pointOnShape": {
//                           "@id": "41",
//                           "curve": {
//                             "@ref": "11"
//                           },
//                           "t": 1,
//                           "p": [
//                             139,
//                             8
//                           ],
//                           "isSource": true
//                         },
//                         "circle": {
//                           "@id": "42",
//                           "center": [
//                             139,
//                             8
//                           ],
//                           "radius": 0
//                         },
//                         "order": 1,
//                         "order2": 0
//                       },
//                       "isHoleClosing": false,
//                       "isIntersection": false,
//                       "prev": {
//                         "@id": "43",
//                         "cp": {
//                           "@id": "44",
//                           "pointOnShape": {
//                             "@ref": "41"
//                           },
//                           "circle": {
//                             "@ref": "42"
//                           },
//                           "order": -1,
//                           "order2": 0
//                         },
//                         "isHoleClosing": false,
//                         "isIntersection": false,
//                         "prev": {
//                           "@id": "45",
//                           "cp": {
//                             "@id": "46",
//                             "pointOnShape": {
//                               "@id": "47",
//                               "curve": {
//                                 "@ref": "10"
//                               },
//                               "t": 1,
//                               "p": [
//                                 117,
//                                 8
//                               ],
//                               "isSource": false
//                             },
//                             "circle": {
//                               "@ref": "38"
//                             },
//                             "order": -0.07781165936695383,
//                             "order2": 0
//                           },
//                           "isHoleClosing": false,
//                           "isIntersection": false,
//                           "prev": {
//                             "@id": "48",
//                             "cp": {
//                               "@id": "49",
//                               "pointOnShape": {
//                                 "@id": "50",
//                                 "curve": {
//                                   "@ref": "10"
//                                 },
//                                 "t": 1,
//                                 "p": [
//                                   117,
//                                   8
//                                 ],
//                                 "isSource": false
//                               },
//                               "circle": {
//                                 "@ref": "25"
//                               },
//                               "order": -0.8598373023056252,
//                               "order2": 0
//                             },
//                             "isHoleClosing": false,
//                             "isIntersection": false,
//                             "prev": {
//                               "@id": "51",
//                               "cp": {
//                                 "@id": "52",
//                                 "pointOnShape": {
//                                   "@id": "53",
//                                   "curve": {
//                                     "@ref": "10"
//                                   },
//                                   "t": 1,
//                                   "p": [
//                                     117,
//                                     8
//                                   ],
//                                   "isSource": false
//                                 },
//                                 "circle": {
//                                   "@ref": "21"
//                                 },
//                                 "order": -0.8644872659655476,
//                                 "order2": 0
//                               },
//                               "isHoleClosing": false,
//                               "isIntersection": false,
//                               "prev": {
//                                 "@id": "54",
//                                 "cp": {
//                                   "@id": "55",
//                                   "pointOnShape": {
//                                     "@id": "56",
//                                     "curve": {
//                                       "@ref": "10"
//                                     },
//                                     "t": 0.7717391304347827,
//                                     "p": [
//                                       117,
//                                       18.499999999999996
//                                     ],
//                                     "isSource": false
//                                   },
//                                   "circle": {
//                                     "@id": "57",
//                                     "center": [
//                                       81.5,
//                                       18.5
//                                     ],
//                                     "radius": 35.5
//                                   },
//                                   "order": 0,
//                                   "order2": 0
//                                 },
//                                 "isHoleClosing": false,
//                                 "isIntersection": false,
//                                 "prev": {
//                                   "@id": "58",
//                                   "cp": {
//                                     "@id": "59",
//                                     "pointOnShape": {
//                                       "@id": "60",
//                                       "curve": {
//                                         "@ref": "9"
//                                       },
//                                       "t": 1,
//                                       "p": [
//                                         117,
//                                         54
//                                       ],
//                                       "isSource": true
//                                     },
//                                     "circle": {
//                                       "@id": "61",
//                                       "center": [
//                                         117,
//                                         54
//                                       ],
//                                       "radius": 0
//                                     },
//                                     "order": 1,
//                                     "order2": 0
//                                   },
//                                   "isHoleClosing": false,
//                                   "isIntersection": false,
//                                   "prev": {
//                                     "@id": "62",
//                                     "cp": {
//                                       "@id": "63",
//                                       "pointOnShape": {
//                                         "@ref": "60"
//                                       },
//                                       "circle": {
//                                         "@ref": "61"
//                                       },
//                                       "order": -1,
//                                       "order2": 0
//                                     },
//                                     "isHoleClosing": false,
//                                     "isIntersection": false,
//                                     "prev": {
//                                       "@id": "64",
//                                       "cp": {
//                                         "@id": "65",
//                                         "pointOnShape": {
//                                           "@id": "66",
//                                           "curve": {
//                                             "@ref": "9"
//                                           },
//                                           "t": 0.5,
//                                           "p": [
//                                             81.5,
//                                             54
//                                           ],
//                                           "isSource": false
//                                         },
//                                         "circle": {
//                                           "@ref": "57"
//                                         },
//                                         "order": 0,
//                                         "order2": 0
//                                       },
//                                       "isHoleClosing": false,
//                                       "isIntersection": false,
//                                       "prev": {
//                                         "@id": "67",
//                                         "cp": {
//                                           "@id": "68",
//                                           "pointOnShape": {
//                                             "@id": "69",
//                                             "curve": {
//                                               "@ref": "8"
//                                             },
//                                             "t": 1,
//                                             "p": [
//                                               46,
//                                               54
//                                             ],
//                                             "isSource": true
//                                           },
//                                           "circle": {
//                                             "@id": "70",
//                                             "center": [
//                                               46,
//                                               54
//                                             ],
//                                             "radius": 0
//                                           },
//                                           "order": 1,
//                                           "order2": 0
//                                         },
//                                         "isHoleClosing": false,
//                                         "isIntersection": false,
//                                         "prev": {
//                                           "@id": "71",
//                                           "cp": {
//                                             "@id": "72",
//                                             "pointOnShape": {
//                                               "@ref": "69"
//                                             },
//                                             "circle": {
//                                               "@ref": "70"
//                                             },
//                                             "order": -1,
//                                             "order2": 0
//                                           },
//                                           "isHoleClosing": false,
//                                           "isIntersection": false,
//                                           "prev": {
//                                             "@id": "73",
//                                             "cp": {
//                                               "@id": "74",
//                                               "pointOnShape": {
//                                                 "@id": "75",
//                                                 "curve": {
//                                                   "@ref": "8"
//                                                 },
//                                                 "t": 0.2282608695652173,
//                                                 "p": [
//                                                   46,
//                                                   18.499999999999996
//                                                 ],
//                                                 "isSource": false
//                                               },
//                                               "circle": {
//                                                 "@ref": "57"
//                                               },
//                                               "order": 0,
//                                               "order2": 0
//                                             },
//                                             "isHoleClosing": false,
//                                             "isIntersection": false,
//                                             "prev": {
//                                               "@id": "76",
//                                               "cp": {
//                                                 "@id": "77",
//                                                 "pointOnShape": {
//                                                   "@id": "78",
//                                                   "curve": {
//                                                     "@ref": "7"
//                                                   },
//                                                   "t": 1,
//                                                   "p": [
//                                                     46,
//                                                     8
//                                                   ],
//                                                   "isSource": false
//                                                 },
//                                                 "circle": {
//                                                   "@ref": "21"
//                                                 },
//                                                 "order": -0.5026547194480646,
//                                                 "order2": 0
//                                               },
//                                               "isHoleClosing": false,
//                                               "isIntersection": false,
//                                               "prev": {
//                                                 "@id": "79",
//                                                 "cp": {
//                                                   "@id": "80",
//                                                   "pointOnShape": {
//                                                     "@id": "81",
//                                                     "curve": {
//                                                       "@ref": "7"
//                                                     },
//                                                     "t": 1,
//                                                     "p": [
//                                                       46,
//                                                       8
//                                                     ],
//                                                     "isSource": true
//                                                   },
//                                                   "circle": {
//                                                     "@ref": "17"
//                                                   },
//                                                   "order": -1,
//                                                   "order2": 0
//                                                 },
//                                                 "isHoleClosing": false,
//                                                 "isIntersection": false,
//                                                 "prev": {
//                                                   "@id": "82",
//                                                   "cp": {
//                                                     "@id": "83",
//                                                     "pointOnShape": {
//                                                       "@ref": "4"
//                                                     },
//                                                     "circle": {
//                                                       "@ref": "13"
//                                                     },
//                                                     "order": 1,
//                                                     "order2": 0
//                                                   },
//                                                   "isHoleClosing": false,
//                                                   "isIntersection": false,
//                                                   "prev": {
//                                                     "@ref": "2"
//                                                   },
//                                                   "next": {
//                                                     "@ref": "79"
//                                                   },
//                                                   "prevOnCircle": {
//                                                     "@ref": "2"
//                                                   },
//                                                   "nextOnCircle": {
//                                                     "@ref": "2"
//                                                   }
//                                                 },
//                                                 "next": {
//                                                   "@ref": "76"
//                                                 },
//                                                 "nextOnCircle": {
//                                                   "@ref": "14"
//                                                 },
//                                                 "prevOnCircle": {
//                                                   "@ref": "14"
//                                                 }
//                                               },
//                                               "next": {
//                                                 "@ref": "73"
//                                               },
//                                               "nextOnCircle": {
//                                                 "@ref": "51"
//                                               },
//                                               "prevOnCircle": {
//                                                 "@ref": "18"
//                                               }
//                                             },
//                                             "next": {
//                                               "@ref": "71"
//                                             },
//                                             "nextOnCircle": {
//                                               "@ref": "64"
//                                             },
//                                             "prevOnCircle": {
//                                               "@ref": "54"
//                                             }
//                                           },
//                                           "next": {
//                                             "@ref": "67"
//                                           },
//                                           "prevOnCircle": {
//                                             "@ref": "67"
//                                           },
//                                           "nextOnCircle": {
//                                             "@ref": "67"
//                                           }
//                                         },
//                                         "next": {
//                                           "@ref": "64"
//                                         },
//                                         "prevOnCircle": {
//                                           "@ref": "71"
//                                         },
//                                         "nextOnCircle": {
//                                           "@ref": "71"
//                                         }
//                                       },
//                                       "next": {
//                                         "@ref": "62"
//                                       },
//                                       "nextOnCircle": {
//                                         "@ref": "54"
//                                       },
//                                       "prevOnCircle": {
//                                         "@ref": "73"
//                                       }
//                                     },
//                                     "next": {
//                                       "@ref": "58"
//                                     },
//                                     "prevOnCircle": {
//                                       "@ref": "58"
//                                     },
//                                     "nextOnCircle": {
//                                       "@ref": "58"
//                                     }
//                                   },
//                                   "next": {
//                                     "@ref": "54"
//                                   },
//                                   "prevOnCircle": {
//                                     "@ref": "62"
//                                   },
//                                   "nextOnCircle": {
//                                     "@ref": "62"
//                                   }
//                                 },
//                                 "next": {
//                                   "@ref": "51"
//                                 },
//                                 "nextOnCircle": {
//                                   "@ref": "73"
//                                 },
//                                 "prevOnCircle": {
//                                   "@ref": "64"
//                                 }
//                               },
//                               "next": {
//                                 "@ref": "48"
//                               },
//                               "nextOnCircle": {
//                                 "@ref": "18"
//                               },
//                               "prevOnCircle": {
//                                 "@ref": "76"
//                               }
//                             },
//                             "next": {
//                               "@ref": "45"
//                             },
//                             "nextOnCircle": {
//                               "@ref": "32"
//                             },
//                             "prevOnCircle": {
//                               "@ref": "22"
//                             }
//                           },
//                           "next": {
//                             "@ref": "43"
//                           },
//                           "nextOnCircle": {
//                             "@ref": "35"
//                           },
//                           "prevOnCircle": {
//                             "@ref": "35"
//                           }
//                         },
//                         "next": {
//                           "@ref": "39"
//                         },
//                         "prevOnCircle": {
//                           "@ref": "39"
//                         },
//                         "nextOnCircle": {
//                           "@ref": "39"
//                         }
//                       },
//                       "next": {
//                         "@ref": "35"
//                       },
//                       "prevOnCircle": {
//                         "@ref": "43"
//                       },
//                       "nextOnCircle": {
//                         "@ref": "43"
//                       }
//                     },
//                     "next": {
//                       "@ref": "32"
//                     },
//                     "nextOnCircle": {
//                       "@ref": "45"
//                     },
//                     "prevOnCircle": {
//                       "@ref": "45"
//                     }
//                   },
//                   "next": {
//                     "@ref": "30"
//                   },
//                   "nextOnCircle": {
//                     "@ref": "22"
//                   },
//                   "prevOnCircle": {
//                     "@ref": "48"
//                   }
//                 },
//                 "next": {
//                   "@ref": "26"
//                 },
//                 "prevOnCircle": {
//                   "@ref": "26"
//                 },
//                 "nextOnCircle": {
//                   "@ref": "26"
//                 }
//               },
//               "next": {
//                 "@ref": "22"
//               },
//               "prevOnCircle": {
//                 "@ref": "30"
//               },
//               "nextOnCircle": {
//                 "@ref": "30"
//               }
//             },
//             "next": {
//               "@ref": "18"
//             },
//             "nextOnCircle": {
//               "@ref": "48"
//             },
//             "prevOnCircle": {
//               "@ref": "32"
//             }
//           },
//           "next": {
//             "@ref": "14"
//           },
//           "nextOnCircle": {
//             "@ref": "76"
//           },
//           "prevOnCircle": {
//             "@ref": "51"
//           }
//         },
//         "next": {
//           "@ref": "2"
//         },
//         "nextOnCircle": {
//           "@ref": "79"
//         },
//         "prevOnCircle": {
//           "@ref": "79"
//         }
//       },
//       "next": {
//         "@ref": "82"
//       },
//       "prevOnCircle": {
//         "@ref": "82"
//       },
//       "nextOnCircle": {
//         "@ref": "82"
//       }
//     },
//     "meta": {
//       "@id": "84",
//       "maxCoordinate": 139,
//       "squaredDiagonalLength": 37250,
//       "looseBoundingBoxes": [
//         [[24,-101],[82,8]],
//         [[24,8],[46,8]],
//         [[46,8],[46,54]],
//         [[46,54],[117,54]],
//         [[117,8],[117,54]],
//         [[117,8],[139,8]],
//         [[82,-101],[139,8]]
//       ],
//       "tightBoundingBoxes": [
//         [[82,-101],[24.000000000000007,7.999999999999986],[24.000000000000007,7.999999999999986],[82,-101]],
//         [[24,8],[46,8],[46,8],[24,8]],
//         [[46,8],[46,54],[46,54],[46,8]],
//         [[46,54],[117,54],[117,54],[46,54]],
//         [[117,54],[117,8],[117,8],[117,54]],
//         [[117,8],[139,8],[139,8],[117,8]],
//         [[139,8],[82,-100.99999999999999],[82,-100.99999999999999],[139,8]]
//       ],
//       "boundingHulls": [
//         [[82,-101],[24,8]],
//         [[24,8],[46,8]],
//         [[46,8],[46,54]],
//         [[46,54],[117,54]],
//         [[117,8],[117,54]],
//         [[117,8],[139,8]],
//         [[82,-101],[139,8]]
//       ],
//       "sharpCorners": [
//         {
//           "@ref": "5"
//         },
//         {
//           "@ref": "8"
//         },
//         {
//           "@ref": "9"
//         },
//         {
//           "@ref": "11"
//         },
//         {
//           "@ref": "12"
//         }
//       ],
//       "dullCorners": [
//         {
//           "@ref": "7"
//         },
//         {
//           "@ref": "10"
//         }
//       ],
//       "loops": [
//         {
//           "@ref": "6"
//         }
//       ],
//       "cpTrees": {
//         "@id": "85",
//         "@type": "Map",
//         "entries": [
//           [
//             {
//               "@ref": "6"
//             },
//             {
//               "@id": "86",
//               "duplicatesAllowed": false,
//               "root": {
//                 "1": {
//                   "1": {
//                     "1": {
//                       "@id": "90",
//                       "datum": {
//                         "@ref": "26"
//                       },
//                       "color": 1,
//                       "parent": {
//                         "@ref": "89"
//                       },
//                       "-1": {
//                         "@id": "91",
//                         "datum": {
//                           "@ref": "30"
//                         },
//                         "color": 0,
//                         "parent": {
//                           "@ref": "90"
//                         }
//                       }
//                     },
//                     "@id": "89",
//                     "datum": {
//                       "@ref": "32"
//                     },
//                     "color": 1,
//                     "parent": {
//                       "@ref": "88"
//                     },
//                     "-1": {
//                       "@id": "92",
//                       "datum": {
//                         "@ref": "35"
//                       },
//                       "color": 1,
//                       "parent": {
//                         "@ref": "89"
//                       }
//                     }
//                   },
//                   "@id": "88",
//                   "datum": {
//                     "@ref": "39"
//                   },
//                   "color": 1,
//                   "parent": {
//                     "@ref": "87"
//                   },
//                   "-1": {
//                     "1": {
//                       "1": {
//                         "@id": "95",
//                         "datum": {
//                           "@ref": "43"
//                         },
//                         "color": 1,
//                         "parent": {
//                           "@ref": "94"
//                         }
//                       },
//                       "@id": "94",
//                       "datum": {
//                         "@ref": "45"
//                       },
//                       "color": 1,
//                       "parent": {
//                         "@ref": "93"
//                       },
//                       "-1": {
//                         "@id": "96",
//                         "datum": {
//                           "@ref": "48"
//                         },
//                         "color": 1,
//                         "parent": {
//                           "@ref": "94"
//                         }
//                       }
//                     },
//                     "@id": "93",
//                     "datum": {
//                       "@ref": "51"
//                     },
//                     "color": 0,
//                     "parent": {
//                       "@ref": "88"
//                     },
//                     "-1": {
//                       "1": {
//                         "@id": "98",
//                         "datum": {
//                           "@ref": "54"
//                         },
//                         "color": 1,
//                         "parent": {
//                           "@ref": "97"
//                         }
//                       },
//                       "@id": "97",
//                       "datum": {
//                         "@ref": "58"
//                       },
//                       "color": 1,
//                       "parent": {
//                         "@ref": "93"
//                       },
//                       "-1": {
//                         "@id": "99",
//                         "datum": {
//                           "@ref": "62"
//                         },
//                         "color": 1,
//                         "parent": {
//                           "@ref": "97"
//                         }
//                       }
//                     }
//                   }
//                 },
//                 "@id": "87",
//                 "datum": {
//                   "@ref": "64"
//                 },
//                 "color": 1,
//                 "-1": {
//                   "1": {
//                     "1": {
//                       "@id": "102",
//                       "datum": {
//                         "@ref": "67"
//                       },
//                       "color": 1,
//                       "parent": {
//                         "@ref": "101"
//                       }
//                     },
//                     "@id": "101",
//                     "datum": {
//                       "@ref": "71"
//                     },
//                     "color": 1,
//                     "parent": {
//                       "@ref": "100"
//                     },
//                     "-1": {
//                       "@id": "103",
//                       "datum": {
//                         "@ref": "73"
//                       },
//                       "color": 1,
//                       "parent": {
//                         "@ref": "101"
//                       }
//                     }
//                   },
//                   "@id": "100",
//                   "datum": {
//                     "@ref": "76"
//                   },
//                   "color": 1,
//                   "parent": {
//                     "@ref": "87"
//                   },
//                   "-1": {
//                     "1": {
//                       "@id": "105",
//                       "datum": {
//                         "@ref": "79"
//                       },
//                       "color": 1,
//                       "parent": {
//                         "@ref": "104"
//                       }
//                     },
//                     "@id": "104",
//                     "datum": {
//                       "@ref": "82"
//                     },
//                     "color": 1,
//                     "parent": {
//                       "@ref": "100"
//                     },
//                     "-1": {
//                       "1": {
//                         "@id": "107",
//                         "datum": {
//                           "@ref": "2"
//                         },
//                         "color": 1,
//                         "parent": {
//                           "@ref": "106"
//                         },
//                         "-1": {
//                           "@id": "108",
//                           "datum": {
//                             "@ref": "14"
//                           },
//                           "color": 0,
//                           "parent": {
//                             "@ref": "107"
//                           }
//                         }
//                       },
//                       "@id": "106",
//                       "datum": {
//                         "@ref": "18"
//                       },
//                       "color": 0,
//                       "parent": {
//                         "@ref": "104"
//                       },
//                       "-1": {
//                         "@id": "109",
//                         "datum": {
//                           "@ref": "22"
//                         },
//                         "color": 1,
//                         "parent": {
//                           "@ref": "106"
//                         }
//                       }
//                     }
//                   }
//                 }
//               },
//               "nodeCount": 23,
//               "valueCount": 23
//             }
//           ]
//         ]
//       },
//       "pointToCpNode": {
//         "@id": "110",
//         "@type": "Map",
//         "entries": [
//           [
//             {
//               "@ref": "6"
//             },
//             {
//               "@id": "111",
//               "@type": "Map",
//               "entries": [
//                 [
//                   24,
//                   {
//                     "@id": "112",
//                     "@type": "Map",
//                     "entries": [
//                       [
//                         8,
//                         {
//                           "@id": "113",
//                           "cp": {
//                             "@ref": "83"
//                           },
//                           "isHoleClosing": false,
//                           "isIntersection": false,
//                           "prev": {
//                             "@id": "114",
//                             "cp": {
//                               "@ref": "3"
//                             },
//                             "isHoleClosing": false,
//                             "isIntersection": false,
//                             "prev": {
//                               "@id": "115",
//                               "cp": {
//                                 "@id": "116",
//                                 "pointOnShape": {
//                                   "@id": "117",
//                                   "curve": {
//                                     "@ref": "5"
//                                   },
//                                   "t": 0.9554549987822831,
//                                   "p": [
//                                     26.58361007062758,
//                                     3.144594867268861
//                                   ],
//                                   "isSource": false
//                                 },
//                                 "circle": {
//                                   "@id": "118",
//                                   "center": [
//                                     29.5,
//                                     4.696435380145942
//                                   ],
//                                   "radius": 3.303564619854057
//                                 },
//                                 "order": 0,
//                                 "order2": 0
//                               },
//                               "isHoleClosing": false,
//                               "isIntersection": false,
//                               "prev": {
//                                 "@id": "119",
//                                 "cp": {
//                                   "@id": "120",
//                                   "pointOnShape": {
//                                     "@id": "121",
//                                     "curve": {
//                                       "@ref": "5"
//                                     },
//                                     "t": 0.9375,
//                                     "p": [
//                                       27.625,
//                                       1.1875
//                                     ],
//                                     "isSource": true
//                                   },
//                                   "circle": {
//                                     "@id": "122",
//                                     "center": [
//                                       31.716915267773775,
//                                       3.3648494085401732
//                                     ],
//                                     "radius": 4.635150591459826
//                                   },
//                                   "order": 0,
//                                   "order2": 0
//                                 },
//                                 "isHoleClosing": false,
//                                 "isIntersection": false,
//                                 "prev": {
//                                   "@id": "123",
//                                   "cp": {
//                                     "@id": "124",
//                                     "pointOnShape": {
//                                       "@id": "125",
//                                       "curve": {
//                                         "@ref": "5"
//                                       },
//                                       "t": 0.9109099975645664,
//                                       "p": [
//                                         29.16722014125515,
//                                         -1.7108102654622663
//                                       ],
//                                       "isSource": false
//                                     },
//                                     "circle": {
//                                       "@id": "126",
//                                       "center": [
//                                         35,
//                                         1.392870760291885
//                                       ],
//                                       "radius": 6.607129239708115
//                                     },
//                                     "order": 0,
//                                     "order2": 0
//                                   },
//                                   "isHoleClosing": false,
//                                   "isIntersection": false,
//                                   "prev": {
//                                     "@id": "127",
//                                     "cp": {
//                                       "@id": "128",
//                                       "pointOnShape": {
//                                         "@id": "129",
//                                         "curve": {
//                                           "@ref": "5"
//                                         },
//                                         "t": 0.875,
//                                         "p": [
//                                           31.25,
//                                           -5.625
//                                         ],
//                                         "isSource": true
//                                       },
//                                       "circle": {
//                                         "@id": "130",
//                                         "center": [
//                                           39.43383053554755,
//                                           -1.2703011829196509
//                                         ],
//                                         "radius": 9.27030118291965
//                                       },
//                                       "order": 0,
//                                       "order2": 0
//                                     },
//                                     "isHoleClosing": false,
//                                     "isIntersection": false,
//                                     "prev": {
//                                       "@id": "131",
//                                       "cp": {
//                                         "@id": "132",
//                                         "pointOnShape": {
//                                           "@id": "133",
//                                           "curve": {
//                                             "@ref": "5"
//                                           },
//                                           "t": 0.8663649963468496,
//                                           "p": [
//                                             31.75083021188272,
//                                             -6.5662153981933935
//                                           ],
//                                           "isSource": false
//                                         },
//                                         "circle": {
//                                           "@id": "134",
//                                           "center": [
//                                             40.5,
//                                             -1.9106938595621725
//                                           ],
//                                           "radius": 9.910693859562173
//                                         },
//                                         "order": 0,
//                                         "order2": 0
//                                       },
//                                       "isHoleClosing": false,
//                                       "isIntersection": false,
//                                       "prev": {
//                                         "@id": "135",
//                                         "cp": {
//                                           "@ref": "15"
//                                         },
//                                         "isHoleClosing": false,
//                                         "isIntersection": false,
//                                         "prev": {
//                                           "@id": "136",
//                                           "cp": {
//                                             "@id": "137",
//                                             "pointOnShape": {
//                                               "@id": "138",
//                                               "curve": {
//                                                 "@ref": "5"
//                                               },
//                                               "t": 0.8125,
//                                               "p": [
//                                                 34.875,
//                                                 -12.4375
//                                               ],
//                                               "isSource": true
//                                             },
//                                             "circle": {
//                                               "@id": "139",
//                                               "center": [
//                                                 47.18084161931818,
//                                                 -5.889437486968307
//                                               ],
//                                               "radius": 13.939543056869349
//                                             },
//                                             "order": 0,
//                                             "order2": 0
//                                           },
//                                           "isHoleClosing": false,
//                                           "isIntersection": false,
//                                           "prev": {
//                                             "@id": "140",
//                                             "cp": {
//                                               "@id": "141",
//                                               "pointOnShape": {
//                                                 "@id": "142",
//                                                 "curve": {
//                                                   "@ref": "5"
//                                                 },
//                                                 "t": 0.7912204635004997,
//                                                 "p": [
//                                                   36.10921311697102,
//                                                   -14.756969478445535
//                                                 ],
//                                                 "isSource": false
//                                               },
//                                               "circle": {
//                                                 "@id": "143",
//                                                 "center": [
//                                                   50.102561412616474,
//                                                   -7.310967633056213
//                                                 ],
//                                                 "radius": 15.851080089532848
//                                               },
//                                               "order": 0,
//                                               "order2": 0
//                                             },
//                                             "isHoleClosing": false,
//                                             "isIntersection": false,
//                                             "prev": {
//                                               "@id": "144",
//                                               "cp": {
//                                                 "@id": "145",
//                                                 "pointOnShape": {
//                                                   "@id": "146",
//                                                   "curve": {
//                                                     "@ref": "5"
//                                                   },
//                                                   "t": 0.7534650155398924,
//                                                   "p": [
//                                                     38.29902909868624,
//                                                     -18.872313306151725
//                                                   ],
//                                                   "isSource": false
//                                                 },
//                                                 "circle": {
//                                                   "@id": "147",
//                                                   "center": [
//                                                     56.05871489975042,
//                                                     -9.422205265217814
//                                                   ],
//                                                   "radius": 20.11742979950084
//                                                 },
//                                                 "order": 0,
//                                                 "order2": 0
//                                               },
//                                               "isHoleClosing": false,
//                                               "isIntersection": false,
//                                               "prev": {
//                                                 "@id": "148",
//                                                 "cp": {
//                                                   "@id": "149",
//                                                   "pointOnShape": {
//                                                     "@id": "150",
//                                                     "curve": {
//                                                       "@ref": "5"
//                                                     },
//                                                     "t": 0.75,
//                                                     "p": [
//                                                       38.5,
//                                                       -19.25
//                                                     ],
//                                                     "isSource": true
//                                                   },
//                                                   "circle": {
//                                                     "@id": "151",
//                                                     "center": [
//                                                       56.65482954545455,
//                                                       -9.58963198498749
//                                                     ],
//                                                     "radius": 20.565032117893377
//                                                   },
//                                                   "order": 0,
//                                                   "order2": 0
//                                                 },
//                                                 "isHoleClosing": false,
//                                                 "isIntersection": false,
//                                                 "prev": {
//                                                   "@id": "152",
//                                                   "cp": {
//                                                     "@id": "153",
//                                                     "pointOnShape": {
//                                                       "@id": "154",
//                                                       "curve": {
//                                                         "@ref": "5"
//                                                       },
//                                                       "t": 0.7037944960592983,
//                                                       "p": [
//                                                         41.1799192285607,
//                                                         -24.286399929536483
//                                                       ],
//                                                       "isSource": false
//                                                     },
//                                                     "circle": {
//                                                       "@id": "155",
//                                                       "center": [
//                                                         65.3991192070419,
//                                                         -11.399119207041906
//                                                       ],
//                                                       "radius": 27.434497480691068
//                                                     },
//                                                     "order": 0,
//                                                     "order2": 0
//                                                   },
//                                                   "isHoleClosing": false,
//                                                   "isIntersection": false,
//                                                   "prev": {
//                                                     "@id": "156",
//                                                     "cp": {
//                                                       "@id": "157",
//                                                       "pointOnShape": {
//                                                         "@id": "158",
//                                                         "curve": {
//                                                           "@ref": "5"
//                                                         },
//                                                         "t": 0.6875,
//                                                         "p": [
//                                                           42.125,
//                                                           -26.0625
//                                                         ],
//                                                         "isSource": true
//                                                       },
//                                                       "circle": {
//                                                         "@id": "159",
//                                                         "center": [
//                                                           68.83567116477272,
//                                                           -11.849482315992493
//                                                         ],
//                                                         "radius": 30.256731908098253
//                                                       },
//                                                       "order": 0,
//                                                       "order2": 0
//                                                     },
//                                                     "isHoleClosing": false,
//                                                     "isIntersection": false,
//                                                     "prev": {
//                                                       "@id": "160",
//                                                       "cp": {
//                                                         "@ref": "19"
//                                                       },
//                                                       "isHoleClosing": false,
//                                                       "isIntersection": false,
//                                                       "prev": {
//                                                         "@id": "161",
//                                                         "cp": {
//                                                           "@ref": "23"
//                                                         },
//                                                         "isHoleClosing": false,
//                                                         "isIntersection": false,
//                                                         "prev": {
//                                                           "@id": "162",
//                                                           "cp": {
//                                                             "@id": "163",
//                                                             "pointOnShape": {
//                                                               "@id": "164",
//                                                               "curve": {
//                                                                 "@ref": "5"
//                                                               },
//                                                               "t": 0.625,
//                                                               "p": [
//                                                                 45.75,
//                                                                 -32.875
//                                                               ],
//                                                               "isSource": true
//                                                             },
//                                                             "circle": {
//                                                               "@id": "165",
//                                                               "center": [
//                                                                 81.68690843409412,
//                                                                 -13.752608356170093
//                                                               ],
//                                                               "radius": 40.70782787106777
//                                                             },
//                                                             "order": 0,
//                                                             "order2": 0
//                                                           },
//                                                           "isHoleClosing": false,
//                                                           "isIntersection": false,
//                                                           "prev": {
//                                                             "@id": "166",
//                                                             "cp": {
//                                                               "@id": "167",
//                                                               "pointOnShape": {
//                                                                 "@id": "168",
//                                                                 "curve": {
//                                                                   "@ref": "5"
//                                                                 },
//                                                                 "t": 0.6226382072758824,
//                                                                 "p": [
//                                                                   45.886983977998824,
//                                                                   -33.13243540692882
//                                                                 ],
//                                                                 "isSource": false
//                                                               },
//                                                               "circle": {
//                                                                 "@id": "169",
//                                                                 "center": [
//                                                                   81.68809156590588,
//                                                                   -14.082304763822332
//                                                                 ],
//                                                                 "radius": 40.553998348378926
//                                                               },
//                                                               "order": 0,
//                                                               "order2": 0
//                                                             },
//                                                             "isHoleClosing": false,
//                                                             "isIntersection": false,
//                                                             "prev": {
//                                                               "@id": "170",
//                                                               "cp": {
//                                                                 "@id": "171",
//                                                                 "pointOnShape": {
//                                                                   "@id": "172",
//                                                                   "curve": {
//                                                                     "@ref": "5"
//                                                                   },
//                                                                   "t": 0.5625,
//                                                                   "p": [
//                                                                     49.375,
//                                                                     -39.6875
//                                                                   ],
//                                                                   "isSource": true
//                                                                 },
//                                                                 "circle": {
//                                                                   "@id": "173",
//                                                                   "center": [
//                                                                     81.71821759068472,
//                                                                     -22.47734752055308
//                                                                   ],
//                                                                   "radius": 36.63704508396099
//                                                                 },
//                                                                 "order": 0,
//                                                                 "order2": 0
//                                                               },
//                                                               "isHoleClosing": false,
//                                                               "isIntersection": false,
//                                                               "prev": {
//                                                                 "@id": "174",
//                                                                 "cp": {
//                                                                   "@id": "175",
//                                                                   "pointOnShape": {
//                                                                     "@id": "176",
//                                                                     "curve": {
//                                                                       "@ref": "5"
//                                                                     },
//                                                                     "t": 0.5603743865482941,
//                                                                     "p": [
//                                                                       49.498285580198946,
//                                                                       -39.91919186623595
//                                                                     ],
//                                                                     "isSource": false
//                                                                   },
//                                                                   "circle": {
//                                                                     "@id": "177",
//                                                                     "center": [
//                                                                       81.71928240931528,
//                                                                       -22.774074287440097
//                                                                     ],
//                                                                     "radius": 36.49859851354103
//                                                                   },
//                                                                   "order": 0,
//                                                                   "order2": 0
//                                                                 },
//                                                                 "isHoleClosing": false,
//                                                                 "isIntersection": false,
//                                                                 "prev": {
//                                                                   "@id": "178",
//                                                                   "cp": {
//                                                                     "@id": "179",
//                                                                     "pointOnShape": {
//                                                                       "@id": "180",
//                                                                       "curve": {
//                                                                         "@ref": "5"
//                                                                       },
//                                                                       "t": 0.5,
//                                                                       "p": [
//                                                                         53,
//                                                                         -46.5
//                                                                       ],
//                                                                       "isSource": true
//                                                                     },
//                                                                     "circle": {
//                                                                       "@id": "181",
//                                                                       "center": [
//                                                                         81.7495267472753,
//                                                                         -31.20208668493607
//                                                                       ],
//                                                                       "radius": 32.56626229685422
//                                                                     },
//                                                                     "order": 0,
//                                                                     "order2": 0
//                                                                   },
//                                                                   "isHoleClosing": false,
//                                                                   "isIntersection": false,
//                                                                   "prev": {
//                                                                     "@id": "182",
//                                                                     "cp": {
//                                                                       "@id": "183",
//                                                                       "pointOnShape": {
//                                                                         "@id": "184",
//                                                                         "curve": {
//                                                                           "@ref": "5"
//                                                                         },
//                                                                         "t": 0.4981105658207059,
//                                                                         "p": [
//                                                                           53.10958718239906,
//                                                                           -46.705948325543055
//                                                                         ],
//                                                                         "isSource": false
//                                                                       },
//                                                                       "circle": {
//                                                                         "@id": "185",
//                                                                         "center": [
//                                                                           81.7504732527247,
//                                                                           -31.465843811057866
//                                                                         ],
//                                                                         "radius": 32.44319867870314
//                                                                       },
//                                                                       "order": 0,
//                                                                       "order2": 0
//                                                                     },
//                                                                     "isHoleClosing": false,
//                                                                     "isIntersection": false,
//                                                                     "prev": {
//                                                                       "@id": "186",
//                                                                       "cp": {
//                                                                         "@id": "187",
//                                                                         "pointOnShape": {
//                                                                           "@id": "188",
//                                                                           "curve": {
//                                                                             "@ref": "5"
//                                                                           },
//                                                                           "t": 0.4375,
//                                                                           "p": [
//                                                                             56.625,
//                                                                             -53.3125
//                                                                           ],
//                                                                           "isSource": true
//                                                                         },
//                                                                         "circle": {
//                                                                           "@id": "189",
//                                                                           "center": [
//                                                                             81.78083590386589,
//                                                                             -39.926825849319066
//                                                                           ],
//                                                                           "radius": 28.49547950974744
//                                                                         },
//                                                                         "order": 0,
//                                                                         "order2": 0
//                                                                       },
//                                                                       "isHoleClosing": false,
//                                                                       "isIntersection": false,
//                                                                       "prev": {
//                                                                         "@id": "190",
//                                                                         "cp": {
//                                                                           "@id": "191",
//                                                                           "pointOnShape": {
//                                                                             "@id": "192",
//                                                                             "curve": {
//                                                                               "@ref": "5"
//                                                                             },
//                                                                             "t": 0.4358467450931178,
//                                                                             "p": [
//                                                                               56.72088878459917,
//                                                                               -53.492704784850154
//                                                                             ],
//                                                                             "isSource": false
//                                                                           },
//                                                                           "circle": {
//                                                                             "@id": "193",
//                                                                             "center": [
//                                                                               81.78166409613411,
//                                                                               -40.15761333467563
//                                                                             ],
//                                                                             "radius": 28.387798843865244
//                                                                           },
//                                                                           "order": 0,
//                                                                           "order2": 0
//                                                                         },
//                                                                         "isHoleClosing": false,
//                                                                         "isIntersection": false,
//                                                                         "prev": {
//                                                                           "@id": "194",
//                                                                           "cp": {
//                                                                             "@id": "195",
//                                                                             "pointOnShape": {
//                                                                               "@id": "196",
//                                                                               "curve": {
//                                                                                 "@ref": "5"
//                                                                               },
//                                                                               "t": 0.375,
//                                                                               "p": [
//                                                                                 60.25,
//                                                                                 -60.125
//                                                                               ],
//                                                                               "isSource": true
//                                                                             },
//                                                                             "circle": {
//                                                                               "@id": "197",
//                                                                               "center": [
//                                                                                 81.81214506045647,
//                                                                                 -48.65156501370207
//                                                                               ],
//                                                                               "radius": 24.42469672264066
//                                                                             },
//                                                                             "order": 0,
//                                                                             "order2": 0
//                                                                           },
//                                                                           "isHoleClosing": false,
//                                                                           "isIntersection": false,
//                                                                           "prev": {
//                                                                             "@id": "198",
//                                                                             "cp": {
//                                                                               "@id": "199",
//                                                                               "pointOnShape": {
//                                                                                 "@id": "200",
//                                                                                 "curve": {
//                                                                                   "@ref": "5"
//                                                                                 },
//                                                                                 "t": 0.37358292436552937,
//                                                                                 "p": [
//                                                                                   60.3321903867993,
//                                                                                   -60.2794612441573
//                                                                                 ],
//                                                                                 "isSource": false
//                                                                               },
//                                                                               "circle": {
//                                                                                 "@id": "201",
//                                                                                 "center": [
//                                                                                   81.81285493954353,
//                                                                                   -48.849382858293396
//                                                                                 ],
//                                                                                 "radius": 24.33239900902736
//                                                                               },
//                                                                               "order": 0,
//                                                                               "order2": 0
//                                                                             },
//                                                                             "isHoleClosing": false,
//                                                                             "isIntersection": false,
//                                                                             "prev": {
//                                                                               "@id": "202",
//                                                                               "cp": {
//                                                                                 "@id": "203",
//                                                                                 "pointOnShape": {
//                                                                                   "@id": "204",
//                                                                                   "curve": {
//                                                                                     "@ref": "5"
//                                                                                   },
//                                                                                   "t": 0.3125,
//                                                                                   "p": [
//                                                                                     63.875,
//                                                                                     -66.9375
//                                                                                   ],
//                                                                                   "isSource": true
//                                                                                 },
//                                                                                 "circle": {
//                                                                                   "@id": "205",
//                                                                                   "center": [
//                                                                                     81.84345421704705,
//                                                                                     -57.37630417808505
//                                                                                   ],
//                                                                                   "radius": 20.353913935533885
//                                                                                 },
//                                                                                 "order": 0,
//                                                                                 "order2": 0
//                                                                               },
//                                                                               "isHoleClosing": false,
//                                                                               "isIntersection": false,
//                                                                               "prev": {
//                                                                                 "@id": "206",
//                                                                                 "cp": {
//                                                                                   "@id": "207",
//                                                                                   "pointOnShape": {
//                                                                                     "@id": "208",
//                                                                                     "curve": {
//                                                                                       "@ref": "5"
//                                                                                     },
//                                                                                     "t": 0.31131910363794135,
//                                                                                     "p": [
//                                                                                       63.943491988999405,
//                                                                                       -67.06621770346439
//                                                                                     ],
//                                                                                     "isSource": false
//                                                                                   },
//                                                                                   "circle": {
//                                                                                     "@id": "209",
//                                                                                     "center": [
//                                                                                       81.84404578295293,
//                                                                                       -57.54115238191117
//                                                                                     ],
//                                                                                     "radius": 20.276999174189452
//                                                                                   },
//                                                                                   "order": 0,
//                                                                                   "order2": 0
//                                                                                 },
//                                                                                 "isHoleClosing": false,
//                                                                                 "isIntersection": false,
//                                                                                 "prev": {
//                                                                                   "@id": "210",
//                                                                                   "cp": {
//                                                                                     "@id": "211",
//                                                                                     "pointOnShape": {
//                                                                                       "@id": "212",
//                                                                                       "curve": {
//                                                                                         "@ref": "5"
//                                                                                       },
//                                                                                       "t": 0.25,
//                                                                                       "p": [
//                                                                                         67.5,
//                                                                                         -73.75
//                                                                                       ],
//                                                                                       "isSource": true
//                                                                                     },
//                                                                                     "circle": {
//                                                                                       "@id": "213",
//                                                                                       "center": [
//                                                                                         81.87476337363765,
//                                                                                         -66.10104334246805
//                                                                                       ],
//                                                                                       "radius": 16.283131148427103
//                                                                                     },
//                                                                                     "order": 0,
//                                                                                     "order2": 0
//                                                                                   },
//                                                                                   "isHoleClosing": false,
//                                                                                   "isIntersection": false,
//                                                                                   "prev": {
//                                                                                     "@id": "214",
//                                                                                     "cp": {
//                                                                                       "@id": "215",
//                                                                                       "pointOnShape": {
//                                                                                         "@id": "216",
//                                                                                         "curve": {
//                                                                                           "@ref": "5"
//                                                                                         },
//                                                                                         "t": 0.2490552829103529,
//                                                                                         "p": [
//                                                                                           67.55479359119953,
//                                                                                           -73.85297416277153
//                                                                                         ],
//                                                                                         "isSource": false
//                                                                                       },
//                                                                                       "circle": {
//                                                                                         "@id": "217",
//                                                                                         "center": [
//                                                                                           81.87523662636235,
//                                                                                           -66.23292190552893
//                                                                                         ],
//                                                                                         "radius": 16.221599339351577
//                                                                                       },
//                                                                                       "order": 0,
//                                                                                       "order2": 0
//                                                                                     },
//                                                                                     "isHoleClosing": false,
//                                                                                     "isIntersection": false,
//                                                                                     "prev": {
//                                                                                       "@id": "218",
//                                                                                       "cp": {
//                                                                                         "@id": "219",
//                                                                                         "pointOnShape": {
//                                                                                           "@id": "220",
//                                                                                           "curve": {
//                                                                                             "@ref": "5"
//                                                                                           },
//                                                                                           "t": 0.1875,
//                                                                                           "p": [
//                                                                                             71.125,
//                                                                                             -80.5625
//                                                                                           ],
//                                                                                           "isSource": true
//                                                                                         },
//                                                                                         "circle": {
//                                                                                           "@id": "221",
//                                                                                           "center": [
//                                                                                             81.90607253022824,
//                                                                                             -74.82578250685101
//                                                                                           ],
//                                                                                           "radius": 12.212348361320334
//                                                                                         },
//                                                                                         "order": 0,
//                                                                                         "order2": 0
//                                                                                       },
//                                                                                       "isHoleClosing": false,
//                                                                                       "isIntersection": false,
//                                                                                       "prev": {
//                                                                                         "@id": "222",
//                                                                                         "cp": {
//                                                                                           "@id": "223",
//                                                                                           "pointOnShape": {
//                                                                                             "@id": "224",
//                                                                                             "curve": {
//                                                                                               "@ref": "5"
//                                                                                             },
//                                                                                             "t": 0.18679146218276457,
//                                                                                             "p": [
//                                                                                               71.16609519339966,
//                                                                                               -80.63973062207866
//                                                                                             ],
//                                                                                             "isSource": false
//                                                                                           },
//                                                                                           "circle": {
//                                                                                             "@id": "225",
//                                                                                             "center": [
//                                                                                               81.90642746977176,
//                                                                                               -74.9246914291467
//                                                                                             ],
//                                                                                             "radius": 12.166199504513669
//                                                                                           },
//                                                                                           "order": 0,
//                                                                                           "order2": 0
//                                                                                         },
//                                                                                         "isHoleClosing": false,
//                                                                                         "isIntersection": false,
//                                                                                         "prev": {
//                                                                                           "@id": "226",
//                                                                                           "cp": {
//                                                                                             "@id": "227",
//                                                                                             "pointOnShape": {
//                                                                                               "@id": "228",
//                                                                                               "curve": {
//                                                                                                 "@ref": "5"
//                                                                                               },
//                                                                                               "t": 0.125,
//                                                                                               "p": [
//                                                                                                 74.75,
//                                                                                                 -87.375
//                                                                                               ],
//                                                                                               "isSource": true
//                                                                                             },
//                                                                                             "circle": {
//                                                                                               "@id": "229",
//                                                                                               "center": [
//                                                                                                 81.93738168681882,
//                                                                                                 -83.55052167123401
//                                                                                               ],
//                                                                                               "radius": 8.141565574213558
//                                                                                             },
//                                                                                             "order": 0,
//                                                                                             "order2": 0
//                                                                                           },
//                                                                                           "isHoleClosing": false,
//                                                                                           "isIntersection": false,
//                                                                                           "prev": {
//                                                                                             "@id": "230",
//                                                                                             "cp": {
//                                                                                               "@id": "231",
//                                                                                               "pointOnShape": {
//                                                                                                 "@id": "232",
//                                                                                                 "curve": {
//                                                                                                   "@ref": "5"
//                                                                                                 },
//                                                                                                 "t": 0.12452764145517668,
//                                                                                                 "p": [
//                                                                                                   74.77739679559976,
//                                                                                                   -87.42648708138574
//                                                                                                 ],
//                                                                                                 "isSource": false
//                                                                                               },
//                                                                                               "circle": {
//                                                                                                 "@id": "233",
//                                                                                                 "center": [
//                                                                                                   81.93761831318118,
//                                                                                                   -83.61646095276447
//                                                                                                 ],
//                                                                                                 "radius": 8.110799669675783
//                                                                                               },
//                                                                                               "order": 0,
//                                                                                               "order2": 0
//                                                                                             },
//                                                                                             "isHoleClosing": false,
//                                                                                             "isIntersection": false,
//                                                                                             "prev": {
//                                                                                               "@id": "234",
//                                                                                               "cp": {
//                                                                                                 "@id": "235",
//                                                                                                 "pointOnShape": {
//                                                                                                   "@id": "236",
//                                                                                                   "curve": {
//                                                                                                     "@ref": "5"
//                                                                                                   },
//                                                                                                   "t": 0.0625,
//                                                                                                   "p": [
//                                                                                                     78.375,
//                                                                                                     -94.1875
//                                                                                                   ],
//                                                                                                   "isSource": true
//                                                                                                 },
//                                                                                                 "circle": {
//                                                                                                   "@id": "237",
//                                                                                                   "center": [
//                                                                                                     81.9686908434094,
//                                                                                                     -92.27526083561702
//                                                                                                   ],
//                                                                                                   "radius": 4.070782787106776
//                                                                                                 },
//                                                                                                 "order": 0,
//                                                                                                 "order2": 0
//                                                                                               },
//                                                                                               "isHoleClosing": false,
//                                                                                               "isIntersection": false,
//                                                                                               "prev": {
//                                                                                                 "@id": "238",
//                                                                                                 "cp": {
//                                                                                                   "@id": "239",
//                                                                                                   "pointOnShape": {
//                                                                                                     "@id": "240",
//                                                                                                     "curve": {
//                                                                                                       "@ref": "5"
//                                                                                                     },
//                                                                                                     "t": 0.06226382072758823,
//                                                                                                     "p": [
//                                                                                                       78.38869839779989,
//                                                                                                       -94.21324354069289
//                                                                                                     ],
//                                                                                                     "isSource": false
//                                                                                                   },
//                                                                                                   "circle": {
//                                                                                                     "@id": "241",
//                                                                                                     "center": [
//                                                                                                       81.96880915659058,
//                                                                                                       -92.30823047638222
//                                                                                                     ],
//                                                                                                     "radius": 4.055399834837893
//                                                                                                   },
//                                                                                                   "order": 0,
//                                                                                                   "order2": 0
//                                                                                                 },
//                                                                                                 "isHoleClosing": false,
//                                                                                                 "isIntersection": false,
//                                                                                                 "prev": {
//                                                                                                   "@id": "242",
//                                                                                                   "cp": {
//                                                                                                     "@ref": "27"
//                                                                                                   },
//                                                                                                   "isHoleClosing": false,
//                                                                                                   "isIntersection": false,
//                                                                                                   "prev": {
//                                                                                                     "@id": "243",
//                                                                                                     "cp": {
//                                                                                                       "@ref": "31"
//                                                                                                     },
//                                                                                                     "isHoleClosing": false,
//                                                                                                     "isIntersection": false,
//                                                                                                     "prev": {
//                                                                                                       "@id": "244",
//                                                                                                       "cp": {
//                                                                                                         "@id": "245",
//                                                                                                         "pointOnShape": {
//                                                                                                           "@id": "246",
//                                                                                                           "curve": {
//                                                                                                             "@ref": "12"
//                                                                                                           },
//                                                                                                           "t": 0.9375,
//                                                                                                           "p": [
//                                                                                                             85.5625,
//                                                                                                             -94.1875
//                                                                                                           ],
//                                                                                                           "isSource": true
//                                                                                                         },
//                                                                                                         "circle": {
//                                                                                                           "@ref": "241"
//                                                                                                         },
//                                                                                                         "order": 0,
//                                                                                                         "order2": 0
//                                                                                                       },
//                                                                                                       "isHoleClosing": false,
//                                                                                                       "isIntersection": false,
//                                                                                                       "prev": {
//                                                                                                         "@id": "247",
//                                                                                                         "cp": {
//                                                                                                           "@id": "248",
//                                                                                                           "pointOnShape": {
//                                                                                                             "@id": "249",
//                                                                                                             "curve": {
//                                                                                                               "@ref": "12"
//                                                                                                             },
//                                                                                                             "t": 0.9372629248518123,
//                                                                                                             "p": [
//                                                                                                               85.5760132834467,
//                                                                                                               -94.16165880884753
//                                                                                                             ],
//                                                                                                             "isSource": false
//                                                                                                           },
//                                                                                                           "circle": {
//                                                                                                             "@ref": "237"
//                                                                                                           },
//                                                                                                           "order": 0,
//                                                                                                           "order2": 0
//                                                                                                         },
//                                                                                                         "isHoleClosing": false,
//                                                                                                         "isIntersection": false,
//                                                                                                         "prev": {
//                                                                                                           "@id": "250",
//                                                                                                           "cp": {
//                                                                                                             "@id": "251",
//                                                                                                             "pointOnShape": {
//                                                                                                               "@id": "252",
//                                                                                                               "curve": {
//                                                                                                                 "@ref": "12"
//                                                                                                               },
//                                                                                                               "t": 0.875,
//                                                                                                               "p": [
//                                                                                                                 89.125,
//                                                                                                                 -87.375
//                                                                                                               ],
//                                                                                                               "isSource": true
//                                                                                                             },
//                                                                                                             "circle": {
//                                                                                                               "@ref": "233"
//                                                                                                             },
//                                                                                                             "order": 0,
//                                                                                                             "order2": 0
//                                                                                                           },
//                                                                                                           "isHoleClosing": false,
//                                                                                                           "isIntersection": false,
//                                                                                                           "prev": {
//                                                                                                             "@id": "253",
//                                                                                                             "cp": {
//                                                                                                               "@id": "254",
//                                                                                                               "pointOnShape": {
//                                                                                                                 "@id": "255",
//                                                                                                                 "curve": {
//                                                                                                                   "@ref": "12"
//                                                                                                                 },
//                                                                                                                 "t": 0.8745258497036241,
//                                                                                                                 "p": [
//                                                                                                                   89.15202656689343,
//                                                                                                                   -87.32331761769503
//                                                                                                                 ],
//                                                                                                                 "isSource": false
//                                                                                                               },
//                                                                                                               "circle": {
//                                                                                                                 "@ref": "229"
//                                                                                                               },
//                                                                                                               "order": 0,
//                                                                                                               "order2": 0
//                                                                                                             },
//                                                                                                             "isHoleClosing": false,
//                                                                                                             "isIntersection": false,
//                                                                                                             "prev": {
//                                                                                                               "@id": "256",
//                                                                                                               "cp": {
//                                                                                                                 "@id": "257",
//                                                                                                                 "pointOnShape": {
//                                                                                                                   "@id": "258",
//                                                                                                                   "curve": {
//                                                                                                                     "@ref": "12"
//                                                                                                                   },
//                                                                                                                   "t": 0.8125,
//                                                                                                                   "p": [
//                                                                                                                     92.6875,
//                                                                                                                     -80.5625
//                                                                                                                   ],
//                                                                                                                   "isSource": true
//                                                                                                                 },
//                                                                                                                 "circle": {
//                                                                                                                   "@ref": "225"
//                                                                                                                 },
//                                                                                                                 "order": 0,
//                                                                                                                 "order2": 0
//                                                                                                               },
//                                                                                                               "isHoleClosing": false,
//                                                                                                               "isIntersection": false,
//                                                                                                               "prev": {
//                                                                                                                 "@id": "259",
//                                                                                                                 "cp": {
//                                                                                                                   "@id": "260",
//                                                                                                                   "pointOnShape": {
//                                                                                                                     "@id": "261",
//                                                                                                                     "curve": {
//                                                                                                                       "@ref": "12"
//                                                                                                                     },
//                                                                                                                     "t": 0.8117887745554362,
//                                                                                                                     "p": [
//                                                                                                                       92.72803985034014,
//                                                                                                                       -80.48497642654254
//                                                                                                                     ],
//                                                                                                                     "isSource": false
//                                                                                                                   },
//                                                                                                                   "circle": {
//                                                                                                                     "@ref": "221"
//                                                                                                                   },
//                                                                                                                   "order": 0,
//                                                                                                                   "order2": 0
//                                                                                                                 },
//                                                                                                                 "isHoleClosing": false,
//                                                                                                                 "isIntersection": false,
//                                                                                                                 "prev": {
//                                                                                                                   "@id": "262",
//                                                                                                                   "cp": {
//                                                                                                                     "@id": "263",
//                                                                                                                     "pointOnShape": {
//                                                                                                                       "@id": "264",
//                                                                                                                       "curve": {
//                                                                                                                         "@ref": "12"
//                                                                                                                       },
//                                                                                                                       "t": 0.75,
//                                                                                                                       "p": [
//                                                                                                                         96.25,
//                                                                                                                         -73.75
//                                                                                                                       ],
//                                                                                                                       "isSource": true
//                                                                                                                     },
//                                                                                                                     "circle": {
//                                                                                                                       "@ref": "217"
//                                                                                                                     },
//                                                                                                                     "order": 0,
//                                                                                                                     "order2": 0
//                                                                                                                   },
//                                                                                                                   "isHoleClosing": false,
//                                                                                                                   "isIntersection": false,
//                                                                                                                   "prev": {
//                                                                                                                     "@id": "265",
//                                                                                                                     "cp": {
//                                                                                                                       "@id": "266",
//                                                                                                                       "pointOnShape": {
//                                                                                                                         "@id": "267",
//                                                                                                                         "curve": {
//                                                                                                                           "@ref": "12"
//                                                                                                                         },
//                                                                                                                         "t": 0.7490516994072485,
//                                                                                                                         "p": [
//                                                                                                                           96.30405313378684,
//                                                                                                                           -73.64663523539008
//                                                                                                                         ],
//                                                                                                                         "isSource": false
//                                                                                                                       },
//                                                                                                                       "circle": {
//                                                                                                                         "@ref": "213"
//                                                                                                                       },
//                                                                                                                       "order": 0,
//                                                                                                                       "order2": 0
//                                                                                                                     },
//                                                                                                                     "isHoleClosing": false,
//                                                                                                                     "isIntersection": false,
//                                                                                                                     "prev": {
//                                                                                                                       "@id": "268",
//                                                                                                                       "cp": {
//                                                                                                                         "@id": "269",
//                                                                                                                         "pointOnShape": {
//                                                                                                                           "@id": "270",
//                                                                                                                           "curve": {
//                                                                                                                             "@ref": "12"
//                                                                                                                           },
//                                                                                                                           "t": 0.6875,
//                                                                                                                           "p": [
//                                                                                                                             99.8125,
//                                                                                                                             -66.9375
//                                                                                                                           ],
//                                                                                                                           "isSource": true
//                                                                                                                         },
//                                                                                                                         "circle": {
//                                                                                                                           "@ref": "209"
//                                                                                                                         },
//                                                                                                                         "order": 0,
//                                                                                                                         "order2": 0
//                                                                                                                       },
//                                                                                                                       "isHoleClosing": false,
//                                                                                                                       "isIntersection": false,
//                                                                                                                       "prev": {
//                                                                                                                         "@id": "271",
//                                                                                                                         "cp": {
//                                                                                                                           "@id": "272",
//                                                                                                                           "pointOnShape": {
//                                                                                                                             "@id": "273",
//                                                                                                                             "curve": {
//                                                                                                                               "@ref": "12"
//                                                                                                                             },
//                                                                                                                             "t": 0.6863146242590602,
//                                                                                                                             "p": [
//                                                                                                                               99.88006641723356,
//                                                                                                                               -66.80829404423756
//                                                                                                                             ],
//                                                                                                                             "isSource": false
//                                                                                                                           },
//                                                                                                                           "circle": {
//                                                                                                                             "@ref": "205"
//                                                                                                                           },
//                                                                                                                           "order": 0,
//                                                                                                                           "order2": 0
//                                                                                                                         },
//                                                                                                                         "isHoleClosing": false,
//                                                                                                                         "isIntersection": false,
//                                                                                                                         "prev": {
//                                                                                                                           "@id": "274",
//                                                                                                                           "cp": {
//                                                                                                                             "@id": "275",
//                                                                                                                             "pointOnShape": {
//                                                                                                                               "@id": "276",
//                                                                                                                               "curve": {
//                                                                                                                                 "@ref": "12"
//                                                                                                                               },
//                                                                                                                               "t": 0.625,
//                                                                                                                               "p": [
//                                                                                                                                 103.375,
//                                                                                                                                 -60.125
//                                                                                                                               ],
//                                                                                                                               "isSource": true
//                                                                                                                             },
//                                                                                                                             "circle": {
//                                                                                                                               "@ref": "201"
//                                                                                                                             },
//                                                                                                                             "order": 0,
//                                                                                                                             "order2": 0
//                                                                                                                           },
//                                                                                                                           "isHoleClosing": false,
//                                                                                                                           "isIntersection": false,
//                                                                                                                           "prev": {
//                                                                                                                             "@id": "277",
//                                                                                                                             "cp": {
//                                                                                                                               "@id": "278",
//                                                                                                                               "pointOnShape": {
//                                                                                                                                 "@id": "279",
//                                                                                                                                 "curve": {
//                                                                                                                                   "@ref": "12"
//                                                                                                                                 },
//                                                                                                                                 "t": 0.6235775491108729,
//                                                                                                                                 "p": [
//                                                                                                                                   103.45607970068025,
//                                                                                                                                   -59.96995285308515
//                                                                                                                                 ],
//                                                                                                                                 "isSource": false
//                                                                                                                               },
//                                                                                                                               "circle": {
//                                                                                                                                 "@ref": "197"
//                                                                                                                               },
//                                                                                                                               "order": 0,
//                                                                                                                               "order2": 0
//                                                                                                                             },
//                                                                                                                             "isHoleClosing": false,
//                                                                                                                             "isIntersection": false,
//                                                                                                                             "prev": {
//                                                                                                                               "@id": "280",
//                                                                                                                               "cp": {
//                                                                                                                                 "@id": "281",
//                                                                                                                                 "pointOnShape": {
//                                                                                                                                   "@id": "282",
//                                                                                                                                   "curve": {
//                                                                                                                                     "@ref": "12"
//                                                                                                                                   },
//                                                                                                                                   "t": 0.5625,
//                                                                                                                                   "p": [
//                                                                                                                                     106.9375,
//                                                                                                                                     -53.3125
//                                                                                                                                   ],
//                                                                                                                                   "isSource": true
//                                                                                                                                 },
//                                                                                                                                 "circle": {
//                                                                                                                                   "@ref": "193"
//                                                                                                                                 },
//                                                                                                                                 "order": 0,
//                                                                                                                                 "order2": 0
//                                                                                                                               },
//                                                                                                                               "isHoleClosing": false,
//                                                                                                                               "isIntersection": false,
//                                                                                                                               "prev": {
//                                                                                                                                 "@id": "283",
//                                                                                                                                 "cp": {
//                                                                                                                                   "@id": "284",
//                                                                                                                                   "pointOnShape": {
//                                                                                                                                     "@id": "285",
//                                                                                                                                     "curve": {
//                                                                                                                                       "@ref": "12"
//                                                                                                                                     },
//                                                                                                                                     "t": 0.560840473962685,
//                                                                                                                                     "p": [
//                                                                                                                                       107.03209298412696,
//                                                                                                                                       -53.131611661932666
//                                                                                                                                     ],
//                                                                                                                                     "isSource": false
//                                                                                                                                   },
//                                                                                                                                   "circle": {
//                                                                                                                                     "@ref": "189"
//                                                                                                                                   },
//                                                                                                                                   "order": 0,
//                                                                                                                                   "order2": 0
//                                                                                                                                 },
//                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                 "isIntersection": false,
//                                                                                                                                 "prev": {
//                                                                                                                                   "@id": "286",
//                                                                                                                                   "cp": {
//                                                                                                                                     "@id": "287",
//                                                                                                                                     "pointOnShape": {
//                                                                                                                                       "@id": "288",
//                                                                                                                                       "curve": {
//                                                                                                                                         "@ref": "12"
//                                                                                                                                       },
//                                                                                                                                       "t": 0.5,
//                                                                                                                                       "p": [
//                                                                                                                                         110.5,
//                                                                                                                                         -46.5
//                                                                                                                                       ],
//                                                                                                                                       "isSource": true
//                                                                                                                                     },
//                                                                                                                                     "circle": {
//                                                                                                                                       "@ref": "185"
//                                                                                                                                     },
//                                                                                                                                     "order": 0,
//                                                                                                                                     "order2": 0
//                                                                                                                                   },
//                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                   "isIntersection": false,
//                                                                                                                                   "prev": {
//                                                                                                                                     "@id": "289",
//                                                                                                                                     "cp": {
//                                                                                                                                       "@id": "290",
//                                                                                                                                       "pointOnShape": {
//                                                                                                                                         "@id": "291",
//                                                                                                                                         "curve": {
//                                                                                                                                           "@ref": "12"
//                                                                                                                                         },
//                                                                                                                                         "t": 0.49810339881449717,
//                                                                                                                                         "p": [
//                                                                                                                                           110.60810626757366,
//                                                                                                                                           -46.29327047078019
//                                                                                                                                         ],
//                                                                                                                                         "isSource": false
//                                                                                                                                       },
//                                                                                                                                       "circle": {
//                                                                                                                                         "@ref": "181"
//                                                                                                                                       },
//                                                                                                                                       "order": 0,
//                                                                                                                                       "order2": 0
//                                                                                                                                     },
//                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                     "isIntersection": false,
//                                                                                                                                     "prev": {
//                                                                                                                                       "@id": "292",
//                                                                                                                                       "cp": {
//                                                                                                                                         "@id": "293",
//                                                                                                                                         "pointOnShape": {
//                                                                                                                                           "@id": "294",
//                                                                                                                                           "curve": {
//                                                                                                                                             "@ref": "12"
//                                                                                                                                           },
//                                                                                                                                           "t": 0.4375,
//                                                                                                                                           "p": [
//                                                                                                                                             114.0625,
//                                                                                                                                             -39.6875
//                                                                                                                                           ],
//                                                                                                                                           "isSource": true
//                                                                                                                                         },
//                                                                                                                                         "circle": {
//                                                                                                                                           "@ref": "177"
//                                                                                                                                         },
//                                                                                                                                         "order": 0,
//                                                                                                                                         "order2": 0
//                                                                                                                                       },
//                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                       "isIntersection": false,
//                                                                                                                                       "prev": {
//                                                                                                                                         "@id": "295",
//                                                                                                                                         "cp": {
//                                                                                                                                           "@id": "296",
//                                                                                                                                           "pointOnShape": {
//                                                                                                                                             "@id": "297",
//                                                                                                                                             "curve": {
//                                                                                                                                               "@ref": "12"
//                                                                                                                                             },
//                                                                                                                                             "t": 0.43536632366630906,
//                                                                                                                                             "p": [
//                                                                                                                                               114.18411955102039,
//                                                                                                                                               -39.454929279627684
//                                                                                                                                             ],
//                                                                                                                                             "isSource": false
//                                                                                                                                           },
//                                                                                                                                           "circle": {
//                                                                                                                                             "@ref": "173"
//                                                                                                                                           },
//                                                                                                                                           "order": 0,
//                                                                                                                                           "order2": 0
//                                                                                                                                         },
//                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                         "isIntersection": false,
//                                                                                                                                         "prev": {
//                                                                                                                                           "@id": "298",
//                                                                                                                                           "cp": {
//                                                                                                                                             "@id": "299",
//                                                                                                                                             "pointOnShape": {
//                                                                                                                                               "@id": "300",
//                                                                                                                                               "curve": {
//                                                                                                                                                 "@ref": "12"
//                                                                                                                                               },
//                                                                                                                                               "t": 0.375,
//                                                                                                                                               "p": [
//                                                                                                                                                 117.625,
//                                                                                                                                                 -32.875
//                                                                                                                                               ],
//                                                                                                                                               "isSource": true
//                                                                                                                                             },
//                                                                                                                                             "circle": {
//                                                                                                                                               "@ref": "169"
//                                                                                                                                             },
//                                                                                                                                             "order": 0,
//                                                                                                                                             "order2": 0
//                                                                                                                                           },
//                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                           "isIntersection": false,
//                                                                                                                                           "prev": {
//                                                                                                                                             "@id": "301",
//                                                                                                                                             "cp": {
//                                                                                                                                               "@id": "302",
//                                                                                                                                               "pointOnShape": {
//                                                                                                                                                 "@id": "303",
//                                                                                                                                                 "curve": {
//                                                                                                                                                   "@ref": "12"
//                                                                                                                                                 },
//                                                                                                                                                 "t": 0.3726292485181213,
//                                                                                                                                                 "p": [
//                                                                                                                                                   117.76013283446709,
//                                                                                                                                                   -32.61658808847522
//                                                                                                                                                 ],
//                                                                                                                                                 "isSource": false
//                                                                                                                                               },
//                                                                                                                                               "circle": {
//                                                                                                                                                 "@ref": "165"
//                                                                                                                                               },
//                                                                                                                                               "order": 0,
//                                                                                                                                               "order2": 0
//                                                                                                                                             },
//                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                             "isIntersection": false,
//                                                                                                                                             "prev": {
//                                                                                                                                               "@id": "304",
//                                                                                                                                               "cp": {
//                                                                                                                                                 "@ref": "33"
//                                                                                                                                               },
//                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                               "isIntersection": false,
//                                                                                                                                               "prev": {
//                                                                                                                                                 "@id": "305",
//                                                                                                                                                 "cp": {
//                                                                                                                                                   "@id": "306",
//                                                                                                                                                   "pointOnShape": {
//                                                                                                                                                     "@id": "307",
//                                                                                                                                                     "curve": {
//                                                                                                                                                       "@ref": "12"
//                                                                                                                                                     },
//                                                                                                                                                     "t": 0.3125,
//                                                                                                                                                     "p": [
//                                                                                                                                                       121.1875,
//                                                                                                                                                       -26.0625
//                                                                                                                                                     ],
//                                                                                                                                                     "isSource": true
//                                                                                                                                                   },
//                                                                                                                                                   "circle": {
//                                                                                                                                                     "@id": "308",
//                                                                                                                                                     "center": [
//                                                                                                                                                       94.41956676136364,
//                                                                                                                                                       -12.064589957777313
//                                                                                                                                                     ],
//                                                                                                                                                     "radius": 30.207014672394422
//                                                                                                                                                   },
//                                                                                                                                                   "order": 0,
//                                                                                                                                                   "order2": 0
//                                                                                                                                                 },
//                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                 "prev": {
//                                                                                                                                                   "@id": "309",
//                                                                                                                                                   "cp": {
//                                                                                                                                                     "@id": "310",
//                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                       "@id": "311",
//                                                                                                                                                       "curve": {
//                                                                                                                                                         "@ref": "12"
//                                                                                                                                                       },
//                                                                                                                                                       "t": 0.29861749677741256,
//                                                                                                                                                       "p": [
//                                                                                                                                                         121.97880268368749,
//                                                                                                                                                         -24.54930714873797
//                                                                                                                                                       ],
//                                                                                                                                                       "isSource": false
//                                                                                                                                                     },
//                                                                                                                                                     "circle": {
//                                                                                                                                                       "@id": "312",
//                                                                                                                                                       "center": [
//                                                                                                                                                         97.33685104673343,
//                                                                                                                                                         -11.663148953266589
//                                                                                                                                                       ],
//                                                                                                                                                       "radius": 27.807891928671925
//                                                                                                                                                     },
//                                                                                                                                                     "order": 0,
//                                                                                                                                                     "order2": 0
//                                                                                                                                                   },
//                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                   "prev": {
//                                                                                                                                                     "@id": "313",
//                                                                                                                                                     "cp": {
//                                                                                                                                                       "@id": "314",
//                                                                                                                                                       "pointOnShape": {
//                                                                                                                                                         "@id": "315",
//                                                                                                                                                         "curve": {
//                                                                                                                                                           "@ref": "12"
//                                                                                                                                                         },
//                                                                                                                                                         "t": 0.24813744830727985,
//                                                                                                                                                         "p": [
//                                                                                                                                                           124.85616544648505,
//                                                                                                                                                           -19.046981865493503
//                                                                                                                                                         ],
//                                                                                                                                                         "isSource": false
//                                                                                                                                                       },
//                                                                                                                                                       "circle": {
//                                                                                                                                                         "@id": "316",
//                                                                                                                                                         "center": [
//                                                                                                                                                           106.82756172932962,
//                                                                                                                                                           -9.619179921659171
//                                                                                                                                                         ],
//                                                                                                                                                         "radius": 20.34487654134075
//                                                                                                                                                       },
//                                                                                                                                                       "order": 0,
//                                                                                                                                                       "order2": 0
//                                                                                                                                                     },
//                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                     "prev": {
//                                                                                                                                                       "@id": "317",
//                                                                                                                                                       "cp": {
//                                                                                                                                                         "@id": "318",
//                                                                                                                                                         "pointOnShape": {
//                                                                                                                                                           "@id": "319",
//                                                                                                                                                           "curve": {
//                                                                                                                                                             "@ref": "12"
//                                                                                                                                                           },
//                                                                                                                                                           "t": 0.20984341309122528,
//                                                                                                                                                           "p": [
//                                                                                                                                                             127.03892545380016,
//                                                                                                                                                             -14.872932026943555
//                                                                                                                                                           ],
//                                                                                                                                                           "isSource": false
//                                                                                                                                                         },
//                                                                                                                                                         "circle": {
//                                                                                                                                                           "@id": "320",
//                                                                                                                                                           "center": [
//                                                                                                                                                             112.85821991343343,
//                                                                                                                                                             -7.457333716843504
//                                                                                                                                                           ],
//                                                                                                                                                           "radius": 16.002609409697733
//                                                                                                                                                         },
//                                                                                                                                                         "order": 0,
//                                                                                                                                                         "order2": 0
//                                                                                                                                                       },
//                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                       "prev": {
//                                                                                                                                                         "@id": "321",
//                                                                                                                                                         "cp": {
//                                                                                                                                                           "@ref": "36"
//                                                                                                                                                         },
//                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                         "prev": {
//                                                                                                                                                           "@id": "322",
//                                                                                                                                                           "cp": {
//                                                                                                                                                             "@id": "323",
//                                                                                                                                                             "pointOnShape": {
//                                                                                                                                                               "@id": "324",
//                                                                                                                                                               "curve": {
//                                                                                                                                                                 "@ref": "12"
//                                                                                                                                                               },
//                                                                                                                                                               "t": 0.17885587768780922,
//                                                                                                                                                               "p": [
//                                                                                                                                                                 128.80521497179487,
//                                                                                                                                                                 -11.495290667971206
//                                                                                                                                                               ],
//                                                                                                                                                               "isSource": false
//                                                                                                                                                             },
//                                                                                                                                                             "circle": {
//                                                                                                                                                               "@id": "325",
//                                                                                                                                                               "center": [
//                                                                                                                                                                 117,
//                                                                                                                                                                 -5.321921370794051
//                                                                                                                                                               ],
//                                                                                                                                                               "radius": 13.321921370794053
//                                                                                                                                                             },
//                                                                                                                                                             "order": 0,
//                                                                                                                                                             "order2": 0
//                                                                                                                                                           },
//                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                           "prev": {
//                                                                                                                                                             "@id": "326",
//                                                                                                                                                             "cp": {
//                                                                                                                                                               "@id": "327",
//                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                 "@id": "328",
//                                                                                                                                                                 "curve": {
//                                                                                                                                                                   "@ref": "12"
//                                                                                                                                                                 },
//                                                                                                                                                                 "t": 0.13414190826586525,
//                                                                                                                                                                 "p": [
//                                                                                                                                                                   131.35391122884567,
//                                                                                                                                                                   -6.621468000979313
//                                                                                                                                                                 ],
//                                                                                                                                                                 "isSource": false
//                                                                                                                                                               },
//                                                                                                                                                               "circle": {
//                                                                                                                                                                 "@id": "329",
//                                                                                                                                                                 "center": [
//                                                                                                                                                                   122.5,
//                                                                                                                                                                   -1.991441028095538
//                                                                                                                                                                 ],
//                                                                                                                                                                 "radius": 9.991441028095538
//                                                                                                                                                               },
//                                                                                                                                                               "order": 0,
//                                                                                                                                                               "order2": 0
//                                                                                                                                                             },
//                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                             "prev": {
//                                                                                                                                                               "@id": "330",
//                                                                                                                                                               "cp": {
//                                                                                                                                                                 "@id": "331",
//                                                                                                                                                                 "pointOnShape": {
//                                                                                                                                                                   "@id": "332",
//                                                                                                                                                                   "curve": {
//                                                                                                                                                                     "@ref": "12"
//                                                                                                                                                                   },
//                                                                                                                                                                   "t": 0.125,
//                                                                                                                                                                   "p": [
//                                                                                                                                                                     131.875,
//                                                                                                                                                                     -5.625
//                                                                                                                                                                   ],
//                                                                                                                                                                   "isSource": true
//                                                                                                                                                                 },
//                                                                                                                                                                 "circle": {
//                                                                                                                                                                   "@id": "333",
//                                                                                                                                                                   "center": [
//                                                                                                                                                                     123.62449187831504,
//                                                                                                                                                                     -1.3105141015042012
//                                                                                                                                                                   ],
//                                                                                                                                                                   "radius": 9.310514101504202
//                                                                                                                                                                 },
//                                                                                                                                                                 "order": 0,
//                                                                                                                                                                 "order2": 0
//                                                                                                                                                               },
//                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                               "prev": {
//                                                                                                                                                                 "@id": "334",
//                                                                                                                                                                 "cp": {
//                                                                                                                                                                   "@id": "335",
//                                                                                                                                                                   "pointOnShape": {
//                                                                                                                                                                     "@id": "336",
//                                                                                                                                                                     "curve": {
//                                                                                                                                                                       "@ref": "12"
//                                                                                                                                                                     },
//                                                                                                                                                                     "t": 0.08942793884390449,
//                                                                                                                                                                     "p": [
//                                                                                                                                                                       133.90260748589745,
//                                                                                                                                                                       -1.747645333985589
//                                                                                                                                                                     ],
//                                                                                                                                                                     "isSource": false
//                                                                                                                                                                   },
//                                                                                                                                                                   "circle": {
//                                                                                                                                                                     "@id": "337",
//                                                                                                                                                                     "center": [
//                                                                                                                                                                       128,
//                                                                                                                                                                       1.33903931460297
//                                                                                                                                                                     ],
//                                                                                                                                                                     "radius": 6.66096068539703
//                                                                                                                                                                   },
//                                                                                                                                                                   "order": 0,
//                                                                                                                                                                   "order2": 0
//                                                                                                                                                                 },
//                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                 "prev": {
//                                                                                                                                                                   "@id": "338",
//                                                                                                                                                                   "cp": {
//                                                                                                                                                                     "@id": "339",
//                                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                                       "@id": "340",
//                                                                                                                                                                       "curve": {
//                                                                                                                                                                         "@ref": "12"
//                                                                                                                                                                       },
//                                                                                                                                                                       "t": 0.0625,
//                                                                                                                                                                       "p": [
//                                                                                                                                                                         135.4375,
//                                                                                                                                                                         1.1875
//                                                                                                                                                                       ],
//                                                                                                                                                                       "isSource": true
//                                                                                                                                                                     },
//                                                                                                                                                                     "circle": {
//                                                                                                                                                                       "@id": "341",
//                                                                                                                                                                       "center": [
//                                                                                                                                                                         131.31224593915752,
//                                                                                                                                                                         3.3447429492479004
//                                                                                                                                                                       ],
//                                                                                                                                                                       "radius": 4.6552570507521
//                                                                                                                                                                     },
//                                                                                                                                                                     "order": 0,
//                                                                                                                                                                     "order2": 0
//                                                                                                                                                                   },
//                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                   "prev": {
//                                                                                                                                                                     "@id": "342",
//                                                                                                                                                                     "cp": {
//                                                                                                                                                                       "@id": "343",
//                                                                                                                                                                       "pointOnShape": {
//                                                                                                                                                                         "@id": "344",
//                                                                                                                                                                         "curve": {
//                                                                                                                                                                           "@ref": "12"
//                                                                                                                                                                         },
//                                                                                                                                                                         "t": 0.04471396942195247,
//                                                                                                                                                                         "p": [
//                                                                                                                                                                           136.4513037429487,
//                                                                                                                                                                           3.1261773330071807
//                                                                                                                                                                         ],
//                                                                                                                                                                         "isSource": false
//                                                                                                                                                                       },
//                                                                                                                                                                       "circle": {
//                                                                                                                                                                         "@id": "345",
//                                                                                                                                                                         "center": [
//                                                                                                                                                                           133.5,
//                                                                                                                                                                           4.669519657301485
//                                                                                                                                                                         ],
//                                                                                                                                                                         "radius": 3.330480342698514
//                                                                                                                                                                       },
//                                                                                                                                                                       "order": 0,
//                                                                                                                                                                       "order2": 0
//                                                                                                                                                                     },
//                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                     "prev": {
//                                                                                                                                                                       "@id": "346",
//                                                                                                                                                                       "cp": {
//                                                                                                                                                                         "@ref": "40"
//                                                                                                                                                                       },
//                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                       "prev": {
//                                                                                                                                                                         "@id": "347",
//                                                                                                                                                                         "cp": {
//                                                                                                                                                                           "@ref": "44"
//                                                                                                                                                                         },
//                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                         "prev": {
//                                                                                                                                                                           "@id": "348",
//                                                                                                                                                                           "cp": {
//                                                                                                                                                                             "@id": "349",
//                                                                                                                                                                             "pointOnShape": {
//                                                                                                                                                                               "@id": "350",
//                                                                                                                                                                               "curve": {
//                                                                                                                                                                                 "@ref": "11"
//                                                                                                                                                                               },
//                                                                                                                                                                               "t": 0.75,
//                                                                                                                                                                               "p": [
//                                                                                                                                                                                 133.5,
//                                                                                                                                                                                 8
//                                                                                                                                                                               ],
//                                                                                                                                                                               "isSource": true
//                                                                                                                                                                             },
//                                                                                                                                                                             "circle": {
//                                                                                                                                                                               "@ref": "345"
//                                                                                                                                                                             },
//                                                                                                                                                                             "order": 0,
//                                                                                                                                                                             "order2": 0
//                                                                                                                                                                           },
//                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                           "prev": {
//                                                                                                                                                                             "@id": "351",
//                                                                                                                                                                             "cp": {
//                                                                                                                                                                               "@id": "352",
//                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                 "@id": "353",
//                                                                                                                                                                                 "curve": {
//                                                                                                                                                                                   "@ref": "11"
//                                                                                                                                                                                 },
//                                                                                                                                                                                 "t": 0.650556633598069,
//                                                                                                                                                                                 "p": [
//                                                                                                                                                                                   131.31224593915752,
//                                                                                                                                                                                   8
//                                                                                                                                                                                 ],
//                                                                                                                                                                                 "isSource": false
//                                                                                                                                                                               },
//                                                                                                                                                                               "circle": {
//                                                                                                                                                                                 "@ref": "341"
//                                                                                                                                                                               },
//                                                                                                                                                                               "order": 0,
//                                                                                                                                                                               "order2": 0
//                                                                                                                                                                             },
//                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                             "prev": {
//                                                                                                                                                                               "@id": "354",
//                                                                                                                                                                               "cp": {
//                                                                                                                                                                                 "@id": "355",
//                                                                                                                                                                                 "pointOnShape": {
//                                                                                                                                                                                   "@id": "356",
//                                                                                                                                                                                   "curve": {
//                                                                                                                                                                                     "@ref": "11"
//                                                                                                                                                                                   },
//                                                                                                                                                                                   "t": 0.5,
//                                                                                                                                                                                   "p": [
//                                                                                                                                                                                     128,
//                                                                                                                                                                                     8
//                                                                                                                                                                                   ],
//                                                                                                                                                                                   "isSource": true
//                                                                                                                                                                                 },
//                                                                                                                                                                                 "circle": {
//                                                                                                                                                                                   "@ref": "337"
//                                                                                                                                                                                 },
//                                                                                                                                                                                 "order": 0,
//                                                                                                                                                                                 "order2": 0
//                                                                                                                                                                               },
//                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                               "prev": {
//                                                                                                                                                                                 "@id": "357",
//                                                                                                                                                                                 "cp": {
//                                                                                                                                                                                   "@id": "358",
//                                                                                                                                                                                   "pointOnShape": {
//                                                                                                                                                                                     "@id": "359",
//                                                                                                                                                                                     "curve": {
//                                                                                                                                                                                       "@ref": "11"
//                                                                                                                                                                                     },
//                                                                                                                                                                                     "t": 0.3011132671961381,
//                                                                                                                                                                                     "p": [
//                                                                                                                                                                                       123.62449187831504,
//                                                                                                                                                                                       8
//                                                                                                                                                                                     ],
//                                                                                                                                                                                     "isSource": false
//                                                                                                                                                                                   },
//                                                                                                                                                                                   "circle": {
//                                                                                                                                                                                     "@ref": "333"
//                                                                                                                                                                                   },
//                                                                                                                                                                                   "order": 0,
//                                                                                                                                                                                   "order2": 0
//                                                                                                                                                                                 },
//                                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                                 "prev": {
//                                                                                                                                                                                   "@id": "360",
//                                                                                                                                                                                   "cp": {
//                                                                                                                                                                                     "@id": "361",
//                                                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                                                       "@id": "362",
//                                                                                                                                                                                       "curve": {
//                                                                                                                                                                                         "@ref": "11"
//                                                                                                                                                                                       },
//                                                                                                                                                                                       "t": 0.25,
//                                                                                                                                                                                       "p": [
//                                                                                                                                                                                         122.5,
//                                                                                                                                                                                         8
//                                                                                                                                                                                       ],
//                                                                                                                                                                                       "isSource": true
//                                                                                                                                                                                     },
//                                                                                                                                                                                     "circle": {
//                                                                                                                                                                                       "@ref": "329"
//                                                                                                                                                                                     },
//                                                                                                                                                                                     "order": 0,
//                                                                                                                                                                                     "order2": 0
//                                                                                                                                                                                   },
//                                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                                   "prev": {
//                                                                                                                                                                                     "@id": "363",
//                                                                                                                                                                                     "cp": {
//                                                                                                                                                                                       "@id": "364",
//                                                                                                                                                                                       "pointOnShape": {
//                                                                                                                                                                                         "@id": "365",
//                                                                                                                                                                                         "curve": {
//                                                                                                                                                                                           "@ref": "10"
//                                                                                                                                                                                         },
//                                                                                                                                                                                         "t": 1,
//                                                                                                                                                                                         "p": [
//                                                                                                                                                                                           117,
//                                                                                                                                                                                           8
//                                                                                                                                                                                         ],
//                                                                                                                                                                                         "isSource": true
//                                                                                                                                                                                       },
//                                                                                                                                                                                       "circle": {
//                                                                                                                                                                                         "@ref": "325"
//                                                                                                                                                                                       },
//                                                                                                                                                                                       "order": 0,
//                                                                                                                                                                                       "order2": 0
//                                                                                                                                                                                     },
//                                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                                     "prev": {
//                                                                                                                                                                                       "@id": "366",
//                                                                                                                                                                                       "cp": {
//                                                                                                                                                                                         "@ref": "46"
//                                                                                                                                                                                       },
//                                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                                       "prev": {
//                                                                                                                                                                                         "@id": "367",
//                                                                                                                                                                                         "cp": {
//                                                                                                                                                                                           "@id": "368",
//                                                                                                                                                                                           "pointOnShape": {
//                                                                                                                                                                                             "@id": "369",
//                                                                                                                                                                                             "curve": {
//                                                                                                                                                                                               "@ref": "10"
//                                                                                                                                                                                             },
//                                                                                                                                                                                             "t": 1,
//                                                                                                                                                                                             "p": [
//                                                                                                                                                                                               117,
//                                                                                                                                                                                               8
//                                                                                                                                                                                             ],
//                                                                                                                                                                                             "isSource": true
//                                                                                                                                                                                           },
//                                                                                                                                                                                           "circle": {
//                                                                                                                                                                                             "@ref": "320"
//                                                                                                                                                                                           },
//                                                                                                                                                                                           "order": -0.2588190451025201,
//                                                                                                                                                                                           "order2": 0
//                                                                                                                                                                                         },
//                                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                                         "prev": {
//                                                                                                                                                                                           "@id": "370",
//                                                                                                                                                                                           "cp": {
//                                                                                                                                                                                             "@id": "371",
//                                                                                                                                                                                             "pointOnShape": {
//                                                                                                                                                                                               "@ref": "369"
//                                                                                                                                                                                             },
//                                                                                                                                                                                             "circle": {
//                                                                                                                                                                                               "@ref": "316"
//                                                                                                                                                                                             },
//                                                                                                                                                                                             "order": -0.5000000000000004,
//                                                                                                                                                                                             "order2": 0
//                                                                                                                                                                                           },
//                                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                                           "prev": {
//                                                                                                                                                                                             "@id": "372",
//                                                                                                                                                                                             "cp": {
//                                                                                                                                                                                               "@id": "373",
//                                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                                 "@ref": "369"
//                                                                                                                                                                                               },
//                                                                                                                                                                                               "circle": {
//                                                                                                                                                                                                 "@ref": "312"
//                                                                                                                                                                                               },
//                                                                                                                                                                                               "order": -0.7071067811865472,
//                                                                                                                                                                                               "order2": 0
//                                                                                                                                                                                             },
//                                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                                             "prev": {
//                                                                                                                                                                                               "@id": "374",
//                                                                                                                                                                                               "cp": {
//                                                                                                                                                                                                 "@id": "375",
//                                                                                                                                                                                                 "pointOnShape": {
//                                                                                                                                                                                                   "@id": "376",
//                                                                                                                                                                                                   "curve": {
//                                                                                                                                                                                                     "@ref": "10"
//                                                                                                                                                                                                   },
//                                                                                                                                                                                                   "t": 1,
//                                                                                                                                                                                                   "p": [
//                                                                                                                                                                                                     117,
//                                                                                                                                                                                                     8
//                                                                                                                                                                                                   ],
//                                                                                                                                                                                                   "isSource": false
//                                                                                                                                                                                                 },
//                                                                                                                                                                                                 "circle": {
//                                                                                                                                                                                                   "@ref": "308"
//                                                                                                                                                                                                 },
//                                                                                                                                                                                                 "order": -0.747522834796123,
//                                                                                                                                                                                                 "order2": 0
//                                                                                                                                                                                               },
//                                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                                               "prev": {
//                                                                                                                                                                                                 "@id": "377",
//                                                                                                                                                                                                 "cp": {
//                                                                                                                                                                                                   "@ref": "49"
//                                                                                                                                                                                                 },
//                                                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                                                 "prev": {
//                                                                                                                                                                                                   "@id": "378",
//                                                                                                                                                                                                   "cp": {
//                                                                                                                                                                                                     "@ref": "52"
//                                                                                                                                                                                                   },
//                                                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                                                   "prev": {
//                                                                                                                                                                                                     "@id": "379",
//                                                                                                                                                                                                     "cp": {
//                                                                                                                                                                                                       "@id": "380",
//                                                                                                                                                                                                       "pointOnShape": {
//                                                                                                                                                                                                         "@id": "381",
//                                                                                                                                                                                                         "curve": {
//                                                                                                                                                                                                           "@ref": "10"
//                                                                                                                                                                                                         },
//                                                                                                                                                                                                         "t": 1,
//                                                                                                                                                                                                         "p": [
//                                                                                                                                                                                                           117,
//                                                                                                                                                                                                           8
//                                                                                                                                                                                                         ],
//                                                                                                                                                                                                         "isSource": false
//                                                                                                                                                                                                       },
//                                                                                                                                                                                                       "circle": {
//                                                                                                                                                                                                         "@id": "382",
//                                                                                                                                                                                                         "center": [
//                                                                                                                                                                                                           81.5,
//                                                                                                                                                                                                           -1.512196331304863
//                                                                                                                                                                                                         ],
//                                                                                                                                                                                                         "radius": 36.752304404557954
//                                                                                                                                                                                                       },
//                                                                                                                                                                                                       "order": -0.9659258262890682,
//                                                                                                                                                                                                       "order2": 0
//                                                                                                                                                                                                     },
//                                                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                                                     "prev": {
//                                                                                                                                                                                                       "@id": "383",
//                                                                                                                                                                                                       "cp": {
//                                                                                                                                                                                                         "@id": "384",
//                                                                                                                                                                                                         "pointOnShape": {
//                                                                                                                                                                                                           "@id": "385",
//                                                                                                                                                                                                           "curve": {
//                                                                                                                                                                                                             "@ref": "10"
//                                                                                                                                                                                                           },
//                                                                                                                                                                                                           "t": 1,
//                                                                                                                                                                                                           "p": [
//                                                                                                                                                                                                             117,
//                                                                                                                                                                                                             8
//                                                                                                                                                                                                           ],
//                                                                                                                                                                                                           "isSource": false
//                                                                                                                                                                                                         },
//                                                                                                                                                                                                         "circle": {
//                                                                                                                                                                                                           "@id": "386",
//                                                                                                                                                                                                           "center": [
//                                                                                                                                                                                                             81.5,
//                                                                                                                                                                                                             8
//                                                                                                                                                                                                           ],
//                                                                                                                                                                                                           "radius": 35.5
//                                                                                                                                                                                                         },
//                                                                                                                                                                                                         "order": -1,
//                                                                                                                                                                                                         "order2": 0
//                                                                                                                                                                                                       },
//                                                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                                                       "prev": {
//                                                                                                                                                                                                         "@id": "387",
//                                                                                                                                                                                                         "cp": {
//                                                                                                                                                                                                           "@id": "388",
//                                                                                                                                                                                                           "pointOnShape": {
//                                                                                                                                                                                                             "@id": "389",
//                                                                                                                                                                                                             "curve": {
//                                                                                                                                                                                                               "@ref": "10"
//                                                                                                                                                                                                             },
//                                                                                                                                                                                                             "t": 0.875,
//                                                                                                                                                                                                             "p": [
//                                                                                                                                                                                                               117,
//                                                                                                                                                                                                               13.75
//                                                                                                                                                                                                             ],
//                                                                                                                                                                                                             "isSource": false
//                                                                                                                                                                                                           },
//                                                                                                                                                                                                           "circle": {
//                                                                                                                                                                                                             "@id": "390",
//                                                                                                                                                                                                             "center": [
//                                                                                                                                                                                                               81.5,
//                                                                                                                                                                                                               13.75
//                                                                                                                                                                                                             ],
//                                                                                                                                                                                                             "radius": 35.5
//                                                                                                                                                                                                           },
//                                                                                                                                                                                                           "order": 0,
//                                                                                                                                                                                                           "order2": 0
//                                                                                                                                                                                                         },
//                                                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                                                         "prev": {
//                                                                                                                                                                                                           "@id": "391",
//                                                                                                                                                                                                           "cp": {
//                                                                                                                                                                                                             "@ref": "55"
//                                                                                                                                                                                                           },
//                                                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                                                           "prev": {
//                                                                                                                                                                                                             "@id": "392",
//                                                                                                                                                                                                             "cp": {
//                                                                                                                                                                                                               "@id": "393",
//                                                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                                                 "@id": "394",
//                                                                                                                                                                                                                 "curve": {
//                                                                                                                                                                                                                   "@ref": "10"
//                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                 "t": 0.75,
//                                                                                                                                                                                                                 "p": [
//                                                                                                                                                                                                                   117,
//                                                                                                                                                                                                                   19.5
//                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                 "isSource": true
//                                                                                                                                                                                                               },
//                                                                                                                                                                                                               "circle": {
//                                                                                                                                                                                                                 "@id": "395",
//                                                                                                                                                                                                                 "center": [
//                                                                                                                                                                                                                   82.5,
//                                                                                                                                                                                                                   19.5
//                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                 "radius": 34.5
//                                                                                                                                                                                                               },
//                                                                                                                                                                                                               "order": 0,
//                                                                                                                                                                                                               "order2": 0
//                                                                                                                                                                                                             },
//                                                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                                                             "prev": {
//                                                                                                                                                                                                               "@id": "396",
//                                                                                                                                                                                                               "cp": {
//                                                                                                                                                                                                                 "@id": "397",
//                                                                                                                                                                                                                 "pointOnShape": {
//                                                                                                                                                                                                                   "@id": "398",
//                                                                                                                                                                                                                   "curve": {
//                                                                                                                                                                                                                     "@ref": "10"
//                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                   "t": 0.625,
//                                                                                                                                                                                                                   "p": [
//                                                                                                                                                                                                                     117,
//                                                                                                                                                                                                                     25.25
//                                                                                                                                                                                                                   ],
//                                                                                                                                                                                                                   "isSource": true
//                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                 "circle": {
//                                                                                                                                                                                                                   "@id": "399",
//                                                                                                                                                                                                                   "center": [
//                                                                                                                                                                                                                     88.25,
//                                                                                                                                                                                                                     25.25
//                                                                                                                                                                                                                   ],
//                                                                                                                                                                                                                   "radius": 28.75
//                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                 "order": 0,
//                                                                                                                                                                                                                 "order2": 0
//                                                                                                                                                                                                               },
//                                                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                                                               "prev": {
//                                                                                                                                                                                                                 "@id": "400",
//                                                                                                                                                                                                                 "cp": {
//                                                                                                                                                                                                                   "@id": "401",
//                                                                                                                                                                                                                   "pointOnShape": {
//                                                                                                                                                                                                                     "@id": "402",
//                                                                                                                                                                                                                     "curve": {
//                                                                                                                                                                                                                       "@ref": "10"
//                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                     "t": 0.5788043478261253,
//                                                                                                                                                                                                                     "p": [
//                                                                                                                                                                                                                       117,
//                                                                                                                                                                                                                       27.374999999998234
//                                                                                                                                                                                                                     ],
//                                                                                                                                                                                                                     "isSource": false
//                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                   "circle": {
//                                                                                                                                                                                                                     "@id": "403",
//                                                                                                                                                                                                                     "center": [
//                                                                                                                                                                                                                       90.375,
//                                                                                                                                                                                                                       27.375
//                                                                                                                                                                                                                     ],
//                                                                                                                                                                                                                     "radius": 26.625
//                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                   "order": 0,
//                                                                                                                                                                                                                   "order2": 0
//                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                                                                 "prev": {
//                                                                                                                                                                                                                   "@id": "404",
//                                                                                                                                                                                                                   "cp": {
//                                                                                                                                                                                                                     "@id": "405",
//                                                                                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                                                                                       "@id": "406",
//                                                                                                                                                                                                                       "curve": {
//                                                                                                                                                                                                                         "@ref": "10"
//                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                       "t": 0.5,
//                                                                                                                                                                                                                       "p": [
//                                                                                                                                                                                                                         117,
//                                                                                                                                                                                                                         31
//                                                                                                                                                                                                                       ],
//                                                                                                                                                                                                                       "isSource": true
//                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                     "circle": {
//                                                                                                                                                                                                                       "@id": "407",
//                                                                                                                                                                                                                       "center": [
//                                                                                                                                                                                                                         94,
//                                                                                                                                                                                                                         31
//                                                                                                                                                                                                                       ],
//                                                                                                                                                                                                                       "radius": 23
//                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                     "order": 0,
//                                                                                                                                                                                                                     "order2": 0
//                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                                                                   "prev": {
//                                                                                                                                                                                                                     "@id": "408",
//                                                                                                                                                                                                                     "cp": {
//                                                                                                                                                                                                                       "@id": "409",
//                                                                                                                                                                                                                       "pointOnShape": {
//                                                                                                                                                                                                                         "@id": "410",
//                                                                                                                                                                                                                         "curve": {
//                                                                                                                                                                                                                           "@ref": "10"
//                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                         "t": 0.38586956521739124,
//                                                                                                                                                                                                                         "p": [
//                                                                                                                                                                                                                           117,
//                                                                                                                                                                                                                           36.25
//                                                                                                                                                                                                                         ],
//                                                                                                                                                                                                                         "isSource": false
//                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                       "circle": {
//                                                                                                                                                                                                                         "@id": "411",
//                                                                                                                                                                                                                         "center": [
//                                                                                                                                                                                                                           99.25,
//                                                                                                                                                                                                                           36.25
//                                                                                                                                                                                                                         ],
//                                                                                                                                                                                                                         "radius": 17.75
//                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                       "order": 0,
//                                                                                                                                                                                                                       "order2": 0
//                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                                                                     "prev": {
//                                                                                                                                                                                                                       "@id": "412",
//                                                                                                                                                                                                                       "cp": {
//                                                                                                                                                                                                                         "@id": "413",
//                                                                                                                                                                                                                         "pointOnShape": {
//                                                                                                                                                                                                                           "@id": "414",
//                                                                                                                                                                                                                           "curve": {
//                                                                                                                                                                                                                             "@ref": "10"
//                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                           "t": 0.375,
//                                                                                                                                                                                                                           "p": [
//                                                                                                                                                                                                                             117,
//                                                                                                                                                                                                                             36.75
//                                                                                                                                                                                                                           ],
//                                                                                                                                                                                                                           "isSource": true
//                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                         "circle": {
//                                                                                                                                                                                                                           "@id": "415",
//                                                                                                                                                                                                                           "center": [
//                                                                                                                                                                                                                             99.75,
//                                                                                                                                                                                                                             36.75
//                                                                                                                                                                                                                           ],
//                                                                                                                                                                                                                           "radius": 17.25
//                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                         "order": 0,
//                                                                                                                                                                                                                         "order2": 0
//                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                                                                       "prev": {
//                                                                                                                                                                                                                         "@id": "416",
//                                                                                                                                                                                                                         "cp": {
//                                                                                                                                                                                                                           "@id": "417",
//                                                                                                                                                                                                                           "pointOnShape": {
//                                                                                                                                                                                                                             "@id": "418",
//                                                                                                                                                                                                                             "curve": {
//                                                                                                                                                                                                                               "@ref": "10"
//                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                             "t": 0.25,
//                                                                                                                                                                                                                             "p": [
//                                                                                                                                                                                                                               117,
//                                                                                                                                                                                                                               42.5
//                                                                                                                                                                                                                             ],
//                                                                                                                                                                                                                             "isSource": true
//                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                           "circle": {
//                                                                                                                                                                                                                             "@id": "419",
//                                                                                                                                                                                                                             "center": [
//                                                                                                                                                                                                                               105.5,
//                                                                                                                                                                                                                               42.5
//                                                                                                                                                                                                                             ],
//                                                                                                                                                                                                                             "radius": 11.5
//                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                           "order": 0,
//                                                                                                                                                                                                                           "order2": 0
//                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                                                                         "prev": {
//                                                                                                                                                                                                                           "@id": "420",
//                                                                                                                                                                                                                           "cp": {
//                                                                                                                                                                                                                             "@id": "421",
//                                                                                                                                                                                                                             "pointOnShape": {
//                                                                                                                                                                                                                               "@id": "422",
//                                                                                                                                                                                                                               "curve": {
//                                                                                                                                                                                                                                 "@ref": "10"
//                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                               "t": 0.1929347826086957,
//                                                                                                                                                                                                                               "p": [
//                                                                                                                                                                                                                                 117,
//                                                                                                                                                                                                                                 45.125
//                                                                                                                                                                                                                               ],
//                                                                                                                                                                                                                               "isSource": false
//                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                             "circle": {
//                                                                                                                                                                                                                               "@id": "423",
//                                                                                                                                                                                                                               "center": [
//                                                                                                                                                                                                                                 108.125,
//                                                                                                                                                                                                                                 45.125
//                                                                                                                                                                                                                               ],
//                                                                                                                                                                                                                               "radius": 8.875
//                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                             "order": 0,
//                                                                                                                                                                                                                             "order2": 0
//                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                                                                           "prev": {
//                                                                                                                                                                                                                             "@id": "424",
//                                                                                                                                                                                                                             "cp": {
//                                                                                                                                                                                                                               "@id": "425",
//                                                                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                                                                 "@id": "426",
//                                                                                                                                                                                                                                 "curve": {
//                                                                                                                                                                                                                                   "@ref": "10"
//                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                 "t": 0.125,
//                                                                                                                                                                                                                                 "p": [
//                                                                                                                                                                                                                                   117,
//                                                                                                                                                                                                                                   48.25
//                                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                                 "isSource": true
//                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                               "circle": {
//                                                                                                                                                                                                                                 "@id": "427",
//                                                                                                                                                                                                                                 "center": [
//                                                                                                                                                                                                                                   111.25,
//                                                                                                                                                                                                                                   48.25
//                                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                                 "radius": 5.75
//                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                               "order": 0,
//                                                                                                                                                                                                                               "order2": 0
//                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                                                                             "prev": {
//                                                                                                                                                                                                                               "@id": "428",
//                                                                                                                                                                                                                               "cp": {
//                                                                                                                                                                                                                                 "@ref": "59"
//                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                                                                               "prev": {
//                                                                                                                                                                                                                                 "@id": "429",
//                                                                                                                                                                                                                                 "cp": {
//                                                                                                                                                                                                                                   "@ref": "63"
//                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                                                                                 "prev": {
//                                                                                                                                                                                                                                   "@id": "430",
//                                                                                                                                                                                                                                   "cp": {
//                                                                                                                                                                                                                                     "@id": "431",
//                                                                                                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                                                                                                       "@id": "432",
//                                                                                                                                                                                                                                       "curve": {
//                                                                                                                                                                                                                                         "@ref": "9"
//                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                       "t": 0.9190140845070424,
//                                                                                                                                                                                                                                       "p": [
//                                                                                                                                                                                                                                         111.25000000000001,
//                                                                                                                                                                                                                                         54
//                                                                                                                                                                                                                                       ],
//                                                                                                                                                                                                                                       "isSource": false
//                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                     "circle": {
//                                                                                                                                                                                                                                       "@ref": "427"
//                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                     "order": 0,
//                                                                                                                                                                                                                                     "order2": 0
//                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                                                                                   "prev": {
//                                                                                                                                                                                                                                     "@id": "433",
//                                                                                                                                                                                                                                     "cp": {
//                                                                                                                                                                                                                                       "@id": "434",
//                                                                                                                                                                                                                                       "pointOnShape": {
//                                                                                                                                                                                                                                         "@id": "435",
//                                                                                                                                                                                                                                         "curve": {
//                                                                                                                                                                                                                                           "@ref": "9"
//                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                         "t": 0.875,
//                                                                                                                                                                                                                                         "p": [
//                                                                                                                                                                                                                                           108.125,
//                                                                                                                                                                                                                                           54
//                                                                                                                                                                                                                                         ],
//                                                                                                                                                                                                                                         "isSource": true
//                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                       "circle": {
//                                                                                                                                                                                                                                         "@ref": "423"
//                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                       "order": 0,
//                                                                                                                                                                                                                                       "order2": 0
//                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                                                                                     "prev": {
//                                                                                                                                                                                                                                       "@id": "436",
//                                                                                                                                                                                                                                       "cp": {
//                                                                                                                                                                                                                                         "@id": "437",
//                                                                                                                                                                                                                                         "pointOnShape": {
//                                                                                                                                                                                                                                           "@id": "438",
//                                                                                                                                                                                                                                           "curve": {
//                                                                                                                                                                                                                                             "@ref": "9"
//                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                           "t": 0.8380281690140826,
//                                                                                                                                                                                                                                           "p": [
//                                                                                                                                                                                                                                             105.49999999999987,
//                                                                                                                                                                                                                                             54
//                                                                                                                                                                                                                                           ],
//                                                                                                                                                                                                                                           "isSource": false
//                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                         "circle": {
//                                                                                                                                                                                                                                           "@ref": "419"
//                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                         "order": 0,
//                                                                                                                                                                                                                                         "order2": 0
//                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                                                                                       "prev": {
//                                                                                                                                                                                                                                         "@id": "439",
//                                                                                                                                                                                                                                         "cp": {
//                                                                                                                                                                                                                                           "@id": "440",
//                                                                                                                                                                                                                                           "pointOnShape": {
//                                                                                                                                                                                                                                             "@id": "441",
//                                                                                                                                                                                                                                             "curve": {
//                                                                                                                                                                                                                                               "@ref": "9"
//                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                             "t": 0.7570422535211071,
//                                                                                                                                                                                                                                             "p": [
//                                                                                                                                                                                                                                               99.74999999999861,
//                                                                                                                                                                                                                                               54
//                                                                                                                                                                                                                                             ],
//                                                                                                                                                                                                                                             "isSource": false
//                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                           "circle": {
//                                                                                                                                                                                                                                             "@ref": "415"
//                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                           "order": 0,
//                                                                                                                                                                                                                                           "order2": 0
//                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                                                                                         "prev": {
//                                                                                                                                                                                                                                           "@id": "442",
//                                                                                                                                                                                                                                           "cp": {
//                                                                                                                                                                                                                                             "@id": "443",
//                                                                                                                                                                                                                                             "pointOnShape": {
//                                                                                                                                                                                                                                               "@id": "444",
//                                                                                                                                                                                                                                               "curve": {
//                                                                                                                                                                                                                                                 "@ref": "9"
//                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                               "t": 0.75,
//                                                                                                                                                                                                                                               "p": [
//                                                                                                                                                                                                                                                 99.25,
//                                                                                                                                                                                                                                                 54
//                                                                                                                                                                                                                                               ],
//                                                                                                                                                                                                                                               "isSource": true
//                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                             "circle": {
//                                                                                                                                                                                                                                               "@ref": "411"
//                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                             "order": 0,
//                                                                                                                                                                                                                                             "order2": 0
//                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                                                                                           "prev": {
//                                                                                                                                                                                                                                             "@id": "445",
//                                                                                                                                                                                                                                             "cp": {
//                                                                                                                                                                                                                                               "@id": "446",
//                                                                                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                                                                                 "@id": "447",
//                                                                                                                                                                                                                                                 "curve": {
//                                                                                                                                                                                                                                                   "@ref": "9"
//                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                 "t": 0.6760563380281691,
//                                                                                                                                                                                                                                                 "p": [
//                                                                                                                                                                                                                                                   94,
//                                                                                                                                                                                                                                                   54
//                                                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                                                 "isSource": false
//                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                               "circle": {
//                                                                                                                                                                                                                                                 "@ref": "407"
//                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                               "order": 0,
//                                                                                                                                                                                                                                               "order2": 0
//                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                                                                                             "prev": {
//                                                                                                                                                                                                                                               "@id": "448",
//                                                                                                                                                                                                                                               "cp": {
//                                                                                                                                                                                                                                                 "@id": "449",
//                                                                                                                                                                                                                                                 "pointOnShape": {
//                                                                                                                                                                                                                                                   "@id": "450",
//                                                                                                                                                                                                                                                   "curve": {
//                                                                                                                                                                                                                                                     "@ref": "9"
//                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                   "t": 0.625,
//                                                                                                                                                                                                                                                   "p": [
//                                                                                                                                                                                                                                                     90.375,
//                                                                                                                                                                                                                                                     54
//                                                                                                                                                                                                                                                   ],
//                                                                                                                                                                                                                                                   "isSource": true
//                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                 "circle": {
//                                                                                                                                                                                                                                                   "@ref": "403"
//                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                 "order": 0,
//                                                                                                                                                                                                                                                 "order2": 0
//                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                                                                                               "prev": {
//                                                                                                                                                                                                                                                 "@id": "451",
//                                                                                                                                                                                                                                                 "cp": {
//                                                                                                                                                                                                                                                   "@id": "452",
//                                                                                                                                                                                                                                                   "pointOnShape": {
//                                                                                                                                                                                                                                                     "@id": "453",
//                                                                                                                                                                                                                                                     "curve": {
//                                                                                                                                                                                                                                                       "@ref": "9"
//                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                     "t": 0.5950704225352114,
//                                                                                                                                                                                                                                                     "p": [
//                                                                                                                                                                                                                                                       88.25,
//                                                                                                                                                                                                                                                       54
//                                                                                                                                                                                                                                                     ],
//                                                                                                                                                                                                                                                     "isSource": false
//                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                   "circle": {
//                                                                                                                                                                                                                                                     "@ref": "399"
//                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                   "order": 0,
//                                                                                                                                                                                                                                                   "order2": 0
//                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                                                                                                 "prev": {
//                                                                                                                                                                                                                                                   "@id": "454",
//                                                                                                                                                                                                                                                   "cp": {
//                                                                                                                                                                                                                                                     "@id": "455",
//                                                                                                                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                                                                                                                       "@id": "456",
//                                                                                                                                                                                                                                                       "curve": {
//                                                                                                                                                                                                                                                         "@ref": "9"
//                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                       "t": 0.5140845070422536,
//                                                                                                                                                                                                                                                       "p": [
//                                                                                                                                                                                                                                                         82.5,
//                                                                                                                                                                                                                                                         54
//                                                                                                                                                                                                                                                       ],
//                                                                                                                                                                                                                                                       "isSource": false
//                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                     "circle": {
//                                                                                                                                                                                                                                                       "@ref": "395"
//                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                     "order": 0,
//                                                                                                                                                                                                                                                     "order2": 0
//                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                                                                                                   "prev": {
//                                                                                                                                                                                                                                                     "@id": "457",
//                                                                                                                                                                                                                                                     "cp": {
//                                                                                                                                                                                                                                                       "@ref": "65"
//                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                                                                                                     "prev": {
//                                                                                                                                                                                                                                                       "@id": "458",
//                                                                                                                                                                                                                                                       "cp": {
//                                                                                                                                                                                                                                                         "@id": "459",
//                                                                                                                                                                                                                                                         "pointOnShape": {
//                                                                                                                                                                                                                                                           "@id": "460",
//                                                                                                                                                                                                                                                           "curve": {
//                                                                                                                                                                                                                                                             "@ref": "9"
//                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                           "t": 0.4859154929577562,
//                                                                                                                                                                                                                                                           "p": [
//                                                                                                                                                                                                                                                             80.5000000000007,
//                                                                                                                                                                                                                                                             54
//                                                                                                                                                                                                                                                           ],
//                                                                                                                                                                                                                                                           "isSource": false
//                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                         "circle": {
//                                                                                                                                                                                                                                                           "@id": "461",
//                                                                                                                                                                                                                                                           "center": [
//                                                                                                                                                                                                                                                             80.5,
//                                                                                                                                                                                                                                                             19.5
//                                                                                                                                                                                                                                                           ],
//                                                                                                                                                                                                                                                           "radius": 34.5
//                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                         "order": 0,
//                                                                                                                                                                                                                                                         "order2": 0
//                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                                                                                                       "prev": {
//                                                                                                                                                                                                                                                         "@id": "462",
//                                                                                                                                                                                                                                                         "cp": {
//                                                                                                                                                                                                                                                           "@id": "463",
//                                                                                                                                                                                                                                                           "pointOnShape": {
//                                                                                                                                                                                                                                                             "@id": "464",
//                                                                                                                                                                                                                                                             "curve": {
//                                                                                                                                                                                                                                                               "@ref": "9"
//                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                             "t": 0.40492957746478864,
//                                                                                                                                                                                                                                                             "p": [
//                                                                                                                                                                                                                                                               74.75,
//                                                                                                                                                                                                                                                               54
//                                                                                                                                                                                                                                                             ],
//                                                                                                                                                                                                                                                             "isSource": false
//                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                           "circle": {
//                                                                                                                                                                                                                                                             "@id": "465",
//                                                                                                                                                                                                                                                             "center": [
//                                                                                                                                                                                                                                                               74.75,
//                                                                                                                                                                                                                                                               25.25
//                                                                                                                                                                                                                                                             ],
//                                                                                                                                                                                                                                                             "radius": 28.75
//                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                           "order": 0,
//                                                                                                                                                                                                                                                           "order2": 0
//                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                                                                                                         "prev": {
//                                                                                                                                                                                                                                                           "@id": "466",
//                                                                                                                                                                                                                                                           "cp": {
//                                                                                                                                                                                                                                                             "@id": "467",
//                                                                                                                                                                                                                                                             "pointOnShape": {
//                                                                                                                                                                                                                                                               "@id": "468",
//                                                                                                                                                                                                                                                               "curve": {
//                                                                                                                                                                                                                                                                 "@ref": "9"
//                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                               "t": 0.375,
//                                                                                                                                                                                                                                                               "p": [
//                                                                                                                                                                                                                                                                 72.625,
//                                                                                                                                                                                                                                                                 54
//                                                                                                                                                                                                                                                               ],
//                                                                                                                                                                                                                                                               "isSource": true
//                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                             "circle": {
//                                                                                                                                                                                                                                                               "@id": "469",
//                                                                                                                                                                                                                                                               "center": [
//                                                                                                                                                                                                                                                                 72.625,
//                                                                                                                                                                                                                                                                 27.375
//                                                                                                                                                                                                                                                               ],
//                                                                                                                                                                                                                                                               "radius": 26.625
//                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                             "order": 0,
//                                                                                                                                                                                                                                                             "order2": 0
//                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                                                                                                           "prev": {
//                                                                                                                                                                                                                                                             "@id": "470",
//                                                                                                                                                                                                                                                             "cp": {
//                                                                                                                                                                                                                                                               "@id": "471",
//                                                                                                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                                                                                                 "@id": "472",
//                                                                                                                                                                                                                                                                 "curve": {
//                                                                                                                                                                                                                                                                   "@ref": "9"
//                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                 "t": 0.3239436619718313,
//                                                                                                                                                                                                                                                                 "p": [
//                                                                                                                                                                                                                                                                   69.00000000000001,
//                                                                                                                                                                                                                                                                   54
//                                                                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                                                                 "isSource": false
//                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                               "circle": {
//                                                                                                                                                                                                                                                                 "@id": "473",
//                                                                                                                                                                                                                                                                 "center": [
//                                                                                                                                                                                                                                                                   69,
//                                                                                                                                                                                                                                                                   31
//                                                                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                                                                 "radius": 23
//                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                               "order": 0,
//                                                                                                                                                                                                                                                               "order2": 0
//                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                                                                                                             "prev": {
//                                                                                                                                                                                                                                                               "@id": "474",
//                                                                                                                                                                                                                                                               "cp": {
//                                                                                                                                                                                                                                                                 "@id": "475",
//                                                                                                                                                                                                                                                                 "pointOnShape": {
//                                                                                                                                                                                                                                                                   "@id": "476",
//                                                                                                                                                                                                                                                                   "curve": {
//                                                                                                                                                                                                                                                                     "@ref": "9"
//                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                   "t": 0.25,
//                                                                                                                                                                                                                                                                   "p": [
//                                                                                                                                                                                                                                                                     63.75,
//                                                                                                                                                                                                                                                                     54
//                                                                                                                                                                                                                                                                   ],
//                                                                                                                                                                                                                                                                   "isSource": true
//                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                 "circle": {
//                                                                                                                                                                                                                                                                   "@id": "477",
//                                                                                                                                                                                                                                                                   "center": [
//                                                                                                                                                                                                                                                                     63.75,
//                                                                                                                                                                                                                                                                     36.25
//                                                                                                                                                                                                                                                                   ],
//                                                                                                                                                                                                                                                                   "radius": 17.75
//                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                 "order": 0,
//                                                                                                                                                                                                                                                                 "order2": 0
//                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                                                                                                               "prev": {
//                                                                                                                                                                                                                                                                 "@id": "478",
//                                                                                                                                                                                                                                                                 "cp": {
//                                                                                                                                                                                                                                                                   "@id": "479",
//                                                                                                                                                                                                                                                                   "pointOnShape": {
//                                                                                                                                                                                                                                                                     "@id": "480",
//                                                                                                                                                                                                                                                                     "curve": {
//                                                                                                                                                                                                                                                                       "@ref": "9"
//                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                     "t": 0.24295774647888946,
//                                                                                                                                                                                                                                                                     "p": [
//                                                                                                                                                                                                                                                                       63.25000000000115,
//                                                                                                                                                                                                                                                                       54
//                                                                                                                                                                                                                                                                     ],
//                                                                                                                                                                                                                                                                     "isSource": false
//                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                   "circle": {
//                                                                                                                                                                                                                                                                     "@id": "481",
//                                                                                                                                                                                                                                                                     "center": [
//                                                                                                                                                                                                                                                                       63.25,
//                                                                                                                                                                                                                                                                       36.75
//                                                                                                                                                                                                                                                                     ],
//                                                                                                                                                                                                                                                                     "radius": 17.25
//                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                   "order": 0,
//                                                                                                                                                                                                                                                                   "order2": 0
//                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                                                                                                                 "prev": {
//                                                                                                                                                                                                                                                                   "@id": "482",
//                                                                                                                                                                                                                                                                   "cp": {
//                                                                                                                                                                                                                                                                     "@id": "483",
//                                                                                                                                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                                                                                                                                       "@id": "484",
//                                                                                                                                                                                                                                                                       "curve": {
//                                                                                                                                                                                                                                                                         "@ref": "9"
//                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                       "t": 0.1619718309859154,
//                                                                                                                                                                                                                                                                       "p": [
//                                                                                                                                                                                                                                                                         57.49999999999999,
//                                                                                                                                                                                                                                                                         54
//                                                                                                                                                                                                                                                                       ],
//                                                                                                                                                                                                                                                                       "isSource": false
//                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                     "circle": {
//                                                                                                                                                                                                                                                                       "@id": "485",
//                                                                                                                                                                                                                                                                       "center": [
//                                                                                                                                                                                                                                                                         57.5,
//                                                                                                                                                                                                                                                                         42.5
//                                                                                                                                                                                                                                                                       ],
//                                                                                                                                                                                                                                                                       "radius": 11.5
//                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                     "order": 0,
//                                                                                                                                                                                                                                                                     "order2": 0
//                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                                                                                                                   "prev": {
//                                                                                                                                                                                                                                                                     "@id": "486",
//                                                                                                                                                                                                                                                                     "cp": {
//                                                                                                                                                                                                                                                                       "@id": "487",
//                                                                                                                                                                                                                                                                       "pointOnShape": {
//                                                                                                                                                                                                                                                                         "@id": "488",
//                                                                                                                                                                                                                                                                         "curve": {
//                                                                                                                                                                                                                                                                           "@ref": "9"
//                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                         "t": 0.125,
//                                                                                                                                                                                                                                                                         "p": [
//                                                                                                                                                                                                                                                                           54.875,
//                                                                                                                                                                                                                                                                           54
//                                                                                                                                                                                                                                                                         ],
//                                                                                                                                                                                                                                                                         "isSource": true
//                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                       "circle": {
//                                                                                                                                                                                                                                                                         "@id": "489",
//                                                                                                                                                                                                                                                                         "center": [
//                                                                                                                                                                                                                                                                           54.875,
//                                                                                                                                                                                                                                                                           45.125
//                                                                                                                                                                                                                                                                         ],
//                                                                                                                                                                                                                                                                         "radius": 8.875
//                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                       "order": 0,
//                                                                                                                                                                                                                                                                       "order2": 0
//                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                                                                                                                     "prev": {
//                                                                                                                                                                                                                                                                       "@id": "490",
//                                                                                                                                                                                                                                                                       "cp": {
//                                                                                                                                                                                                                                                                         "@id": "491",
//                                                                                                                                                                                                                                                                         "pointOnShape": {
//                                                                                                                                                                                                                                                                           "@id": "492",
//                                                                                                                                                                                                                                                                           "curve": {
//                                                                                                                                                                                                                                                                             "@ref": "9"
//                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                           "t": 0.08098591549295774,
//                                                                                                                                                                                                                                                                           "p": [
//                                                                                                                                                                                                                                                                             51.75,
//                                                                                                                                                                                                                                                                             54
//                                                                                                                                                                                                                                                                           ],
//                                                                                                                                                                                                                                                                           "isSource": false
//                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                         "circle": {
//                                                                                                                                                                                                                                                                           "@id": "493",
//                                                                                                                                                                                                                                                                           "center": [
//                                                                                                                                                                                                                                                                             51.75,
//                                                                                                                                                                                                                                                                             48.25
//                                                                                                                                                                                                                                                                           ],
//                                                                                                                                                                                                                                                                           "radius": 5.75
//                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                         "order": 0,
//                                                                                                                                                                                                                                                                         "order2": 0
//                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                                                                                                                       "prev": {
//                                                                                                                                                                                                                                                                         "@id": "494",
//                                                                                                                                                                                                                                                                         "cp": {
//                                                                                                                                                                                                                                                                           "@ref": "68"
//                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                                                                                                                         "prev": {
//                                                                                                                                                                                                                                                                           "@id": "495",
//                                                                                                                                                                                                                                                                           "cp": {
//                                                                                                                                                                                                                                                                             "@ref": "72"
//                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                                                                                                                           "prev": {
//                                                                                                                                                                                                                                                                             "@id": "496",
//                                                                                                                                                                                                                                                                             "cp": {
//                                                                                                                                                                                                                                                                               "@id": "497",
//                                                                                                                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                                                                                                                 "@id": "498",
//                                                                                                                                                                                                                                                                                 "curve": {
//                                                                                                                                                                                                                                                                                   "@ref": "8"
//                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                 "t": 0.875,
//                                                                                                                                                                                                                                                                                 "p": [
//                                                                                                                                                                                                                                                                                   46,
//                                                                                                                                                                                                                                                                                   48.25
//                                                                                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                                                                                 "isSource": true
//                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                               "circle": {
//                                                                                                                                                                                                                                                                                 "@ref": "493"
//                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                               "order": 0,
//                                                                                                                                                                                                                                                                               "order2": 0
//                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                                                                                                                             "prev": {
//                                                                                                                                                                                                                                                                               "@id": "499",
//                                                                                                                                                                                                                                                                               "cp": {
//                                                                                                                                                                                                                                                                                 "@id": "500",
//                                                                                                                                                                                                                                                                                 "pointOnShape": {
//                                                                                                                                                                                                                                                                                   "@id": "501",
//                                                                                                                                                                                                                                                                                   "curve": {
//                                                                                                                                                                                                                                                                                     "@ref": "8"
//                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                   "t": 0.8070652173913018,
//                                                                                                                                                                                                                                                                                   "p": [
//                                                                                                                                                                                                                                                                                     46,
//                                                                                                                                                                                                                                                                                     45.12499999999988
//                                                                                                                                                                                                                                                                                   ],
//                                                                                                                                                                                                                                                                                   "isSource": false
//                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                 "circle": {
//                                                                                                                                                                                                                                                                                   "@ref": "489"
//                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                 "order": 0,
//                                                                                                                                                                                                                                                                                 "order2": 0
//                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                                                                                                                               "prev": {
//                                                                                                                                                                                                                                                                                 "@id": "502",
//                                                                                                                                                                                                                                                                                 "cp": {
//                                                                                                                                                                                                                                                                                   "@id": "503",
//                                                                                                                                                                                                                                                                                   "pointOnShape": {
//                                                                                                                                                                                                                                                                                     "@id": "504",
//                                                                                                                                                                                                                                                                                     "curve": {
//                                                                                                                                                                                                                                                                                       "@ref": "8"
//                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                     "t": 0.75,
//                                                                                                                                                                                                                                                                                     "p": [
//                                                                                                                                                                                                                                                                                       46,
//                                                                                                                                                                                                                                                                                       42.5
//                                                                                                                                                                                                                                                                                     ],
//                                                                                                                                                                                                                                                                                     "isSource": true
//                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                   "circle": {
//                                                                                                                                                                                                                                                                                     "@ref": "485"
//                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                   "order": 0,
//                                                                                                                                                                                                                                                                                   "order2": 0
//                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                                                                                                                                 "prev": {
//                                                                                                                                                                                                                                                                                   "@id": "505",
//                                                                                                                                                                                                                                                                                   "cp": {
//                                                                                                                                                                                                                                                                                     "@id": "506",
//                                                                                                                                                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                                                                                                                                                       "@id": "507",
//                                                                                                                                                                                                                                                                                       "curve": {
//                                                                                                                                                                                                                                                                                         "@ref": "8"
//                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                       "t": 0.625,
//                                                                                                                                                                                                                                                                                       "p": [
//                                                                                                                                                                                                                                                                                         46,
//                                                                                                                                                                                                                                                                                         36.75
//                                                                                                                                                                                                                                                                                       ],
//                                                                                                                                                                                                                                                                                       "isSource": true
//                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                     "circle": {
//                                                                                                                                                                                                                                                                                       "@ref": "481"
//                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                     "order": 0,
//                                                                                                                                                                                                                                                                                     "order2": 0
//                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                                                                                                                                   "prev": {
//                                                                                                                                                                                                                                                                                     "@id": "508",
//                                                                                                                                                                                                                                                                                     "cp": {
//                                                                                                                                                                                                                                                                                       "@id": "509",
//                                                                                                                                                                                                                                                                                       "pointOnShape": {
//                                                                                                                                                                                                                                                                                         "@id": "510",
//                                                                                                                                                                                                                                                                                         "curve": {
//                                                                                                                                                                                                                                                                                           "@ref": "8"
//                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                         "t": 0.6141304347825776,
//                                                                                                                                                                                                                                                                                         "p": [
//                                                                                                                                                                                                                                                                                           46,
//                                                                                                                                                                                                                                                                                           36.249999999998565
//                                                                                                                                                                                                                                                                                         ],
//                                                                                                                                                                                                                                                                                         "isSource": false
//                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                       "circle": {
//                                                                                                                                                                                                                                                                                         "@ref": "477"
//                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                       "order": 0,
//                                                                                                                                                                                                                                                                                       "order2": 0
//                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                                                                                                                                     "prev": {
//                                                                                                                                                                                                                                                                                       "@id": "511",
//                                                                                                                                                                                                                                                                                       "cp": {
//                                                                                                                                                                                                                                                                                         "@id": "512",
//                                                                                                                                                                                                                                                                                         "pointOnShape": {
//                                                                                                                                                                                                                                                                                           "@id": "513",
//                                                                                                                                                                                                                                                                                           "curve": {
//                                                                                                                                                                                                                                                                                             "@ref": "8"
//                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                           "t": 0.5,
//                                                                                                                                                                                                                                                                                           "p": [
//                                                                                                                                                                                                                                                                                             46,
//                                                                                                                                                                                                                                                                                             31
//                                                                                                                                                                                                                                                                                           ],
//                                                                                                                                                                                                                                                                                           "isSource": true
//                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                         "circle": {
//                                                                                                                                                                                                                                                                                           "@ref": "473"
//                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                         "order": 0,
//                                                                                                                                                                                                                                                                                         "order2": 0
//                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                                                                                                                                       "prev": {
//                                                                                                                                                                                                                                                                                         "@id": "514",
//                                                                                                                                                                                                                                                                                         "cp": {
//                                                                                                                                                                                                                                                                                           "@id": "515",
//                                                                                                                                                                                                                                                                                           "pointOnShape": {
//                                                                                                                                                                                                                                                                                             "@id": "516",
//                                                                                                                                                                                                                                                                                             "curve": {
//                                                                                                                                                                                                                                                                                               "@ref": "8"
//                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                             "t": 0.42119565217391314,
//                                                                                                                                                                                                                                                                                             "p": [
//                                                                                                                                                                                                                                                                                               46,
//                                                                                                                                                                                                                                                                                               27.375000000000004
//                                                                                                                                                                                                                                                                                             ],
//                                                                                                                                                                                                                                                                                             "isSource": false
//                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                           "circle": {
//                                                                                                                                                                                                                                                                                             "@ref": "469"
//                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                           "order": 0,
//                                                                                                                                                                                                                                                                                           "order2": 0
//                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                                                                                                                                         "prev": {
//                                                                                                                                                                                                                                                                                           "@id": "517",
//                                                                                                                                                                                                                                                                                           "cp": {
//                                                                                                                                                                                                                                                                                             "@id": "518",
//                                                                                                                                                                                                                                                                                             "pointOnShape": {
//                                                                                                                                                                                                                                                                                               "@id": "519",
//                                                                                                                                                                                                                                                                                               "curve": {
//                                                                                                                                                                                                                                                                                                 "@ref": "8"
//                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                               "t": 0.375,
//                                                                                                                                                                                                                                                                                               "p": [
//                                                                                                                                                                                                                                                                                                 46,
//                                                                                                                                                                                                                                                                                                 25.25
//                                                                                                                                                                                                                                                                                               ],
//                                                                                                                                                                                                                                                                                               "isSource": true
//                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                             "circle": {
//                                                                                                                                                                                                                                                                                               "@ref": "465"
//                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                             "order": 0,
//                                                                                                                                                                                                                                                                                             "order2": 0
//                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                                                                                                                                           "prev": {
//                                                                                                                                                                                                                                                                                             "@id": "520",
//                                                                                                                                                                                                                                                                                             "cp": {
//                                                                                                                                                                                                                                                                                               "@id": "521",
//                                                                                                                                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                                                                                                                                 "@id": "522",
//                                                                                                                                                                                                                                                                                                 "curve": {
//                                                                                                                                                                                                                                                                                                   "@ref": "8"
//                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                 "t": 0.25,
//                                                                                                                                                                                                                                                                                                 "p": [
//                                                                                                                                                                                                                                                                                                   46,
//                                                                                                                                                                                                                                                                                                   19.5
//                                                                                                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                                                                                                 "isSource": true
//                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                               "circle": {
//                                                                                                                                                                                                                                                                                                 "@ref": "461"
//                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                               "order": 0,
//                                                                                                                                                                                                                                                                                               "order2": 0
//                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                                                                                                                                             "prev": {
//                                                                                                                                                                                                                                                                                               "@id": "523",
//                                                                                                                                                                                                                                                                                               "cp": {
//                                                                                                                                                                                                                                                                                                 "@ref": "74"
//                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                                                                                                                                               "prev": {
//                                                                                                                                                                                                                                                                                                 "@id": "524",
//                                                                                                                                                                                                                                                                                                 "cp": {
//                                                                                                                                                                                                                                                                                                   "@id": "525",
//                                                                                                                                                                                                                                                                                                   "pointOnShape": {
//                                                                                                                                                                                                                                                                                                     "@id": "526",
//                                                                                                                                                                                                                                                                                                     "curve": {
//                                                                                                                                                                                                                                                                                                       "@ref": "8"
//                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                     "t": 0.125,
//                                                                                                                                                                                                                                                                                                     "p": [
//                                                                                                                                                                                                                                                                                                       46,
//                                                                                                                                                                                                                                                                                                       13.75
//                                                                                                                                                                                                                                                                                                     ],
//                                                                                                                                                                                                                                                                                                     "isSource": true
//                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                   "circle": {
//                                                                                                                                                                                                                                                                                                     "@ref": "390"
//                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                   "order": 0,
//                                                                                                                                                                                                                                                                                                   "order2": 0
//                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                                                                                                                                                 "prev": {
//                                                                                                                                                                                                                                                                                                   "@id": "527",
//                                                                                                                                                                                                                                                                                                   "cp": {
//                                                                                                                                                                                                                                                                                                     "@id": "528",
//                                                                                                                                                                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                                                                                                                                                                       "@id": "529",
//                                                                                                                                                                                                                                                                                                       "curve": {
//                                                                                                                                                                                                                                                                                                         "@ref": "7"
//                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                       "t": 1,
//                                                                                                                                                                                                                                                                                                       "p": [
//                                                                                                                                                                                                                                                                                                         46,
//                                                                                                                                                                                                                                                                                                         8
//                                                                                                                                                                                                                                                                                                       ],
//                                                                                                                                                                                                                                                                                                       "isSource": true
//                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                     "circle": {
//                                                                                                                                                                                                                                                                                                       "@ref": "386"
//                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                     "order": 0,
//                                                                                                                                                                                                                                                                                                     "order2": 0
//                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                                                                                                                                                   "prev": {
//                                                                                                                                                                                                                                                                                                     "@id": "530",
//                                                                                                                                                                                                                                                                                                     "cp": {
//                                                                                                                                                                                                                                                                                                       "@id": "531",
//                                                                                                                                                                                                                                                                                                       "pointOnShape": {
//                                                                                                                                                                                                                                                                                                         "@ref": "81"
//                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                       "circle": {
//                                                                                                                                                                                                                                                                                                         "@ref": "382"
//                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                       "order": -0.25881904510252096,
//                                                                                                                                                                                                                                                                                                       "order2": 0
//                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                                                                                                                                                     "prev": {
//                                                                                                                                                                                                                                                                                                       "@id": "532",
//                                                                                                                                                                                                                                                                                                       "cp": {
//                                                                                                                                                                                                                                                                                                         "@ref": "77"
//                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                                                                                                                                                       "prev": {
//                                                                                                                                                                                                                                                                                                         "@id": "533",
//                                                                                                                                                                                                                                                                                                         "cp": {
//                                                                                                                                                                                                                                                                                                           "@id": "534",
//                                                                                                                                                                                                                                                                                                           "pointOnShape": {
//                                                                                                                                                                                                                                                                                                             "@id": "535",
//                                                                                                                                                                                                                                                                                                             "curve": {
//                                                                                                                                                                                                                                                                                                               "@ref": "7"
//                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                             "t": 1,
//                                                                                                                                                                                                                                                                                                             "p": [
//                                                                                                                                                                                                                                                                                                               46,
//                                                                                                                                                                                                                                                                                                               8
//                                                                                                                                                                                                                                                                                                             ],
//                                                                                                                                                                                                                                                                                                             "isSource": false
//                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                           "circle": {
//                                                                                                                                                                                                                                                                                                             "@ref": "159"
//                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                           "order": -0.6560352379193919,
//                                                                                                                                                                                                                                                                                                           "order2": 0
//                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                                                                                                                                                         "prev": {
//                                                                                                                                                                                                                                                                                                           "@id": "536",
//                                                                                                                                                                                                                                                                                                           "cp": {
//                                                                                                                                                                                                                                                                                                             "@id": "537",
//                                                                                                                                                                                                                                                                                                             "pointOnShape": {
//                                                                                                                                                                                                                                                                                                               "@ref": "81"
//                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                             "circle": {
//                                                                                                                                                                                                                                                                                                               "@ref": "155"
//                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                             "order": -0.7071067811865475,
//                                                                                                                                                                                                                                                                                                             "order2": 0
//                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                                                                                                                                                           "prev": {
//                                                                                                                                                                                                                                                                                                             "@id": "538",
//                                                                                                                                                                                                                                                                                                             "cp": {
//                                                                                                                                                                                                                                                                                                               "@id": "539",
//                                                                                                                                                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                                                                                                                                                 "@id": "540",
//                                                                                                                                                                                                                                                                                                                 "curve": {
//                                                                                                                                                                                                                                                                                                                   "@ref": "7"
//                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                 "t": 1,
//                                                                                                                                                                                                                                                                                                                 "p": [
//                                                                                                                                                                                                                                                                                                                   46,
//                                                                                                                                                                                                                                                                                                                   8
//                                                                                                                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                                                                                                                 "isSource": false
//                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                               "circle": {
//                                                                                                                                                                                                                                                                                                                 "@ref": "151"
//                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                               "order": -0.8553175061507914,
//                                                                                                                                                                                                                                                                                                               "order2": 0
//                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                                                                                                                                                             "prev": {
//                                                                                                                                                                                                                                                                                                               "@id": "541",
//                                                                                                                                                                                                                                                                                                               "cp": {
//                                                                                                                                                                                                                                                                                                                 "@id": "542",
//                                                                                                                                                                                                                                                                                                                 "pointOnShape": {
//                                                                                                                                                                                                                                                                                                                   "@ref": "81"
//                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                 "circle": {
//                                                                                                                                                                                                                                                                                                                   "@ref": "147"
//                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                 "order": -0.8660254037844386,
//                                                                                                                                                                                                                                                                                                                 "order2": 0
//                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                                                                                                                                                               "prev": {
//                                                                                                                                                                                                                                                                                                                 "@id": "543",
//                                                                                                                                                                                                                                                                                                                 "cp": {
//                                                                                                                                                                                                                                                                                                                   "@id": "544",
//                                                                                                                                                                                                                                                                                                                   "pointOnShape": {
//                                                                                                                                                                                                                                                                                                                     "@ref": "81"
//                                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                                   "circle": {
//                                                                                                                                                                                                                                                                                                                     "@ref": "143"
//                                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                                   "order": -0.9659258262890684,
//                                                                                                                                                                                                                                                                                                                   "order2": 0
//                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                 "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                                 "isIntersection": false,
//                                                                                                                                                                                                                                                                                                                 "prev": {
//                                                                                                                                                                                                                                                                                                                   "@id": "545",
//                                                                                                                                                                                                                                                                                                                   "cp": {
//                                                                                                                                                                                                                                                                                                                     "@id": "546",
//                                                                                                                                                                                                                                                                                                                     "pointOnShape": {
//                                                                                                                                                                                                                                                                                                                       "@id": "547",
//                                                                                                                                                                                                                                                                                                                       "curve": {
//                                                                                                                                                                                                                                                                                                                         "@ref": "7"
//                                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                                       "t": 1,
//                                                                                                                                                                                                                                                                                                                       "p": [
//                                                                                                                                                                                                                                                                                                                         46,
//                                                                                                                                                                                                                                                                                                                         8
//                                                                                                                                                                                                                                                                                                                       ],
//                                                                                                                                                                                                                                                                                                                       "isSource": false
//                                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                                     "circle": {
//                                                                                                                                                                                                                                                                                                                       "@ref": "139"
//                                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                                     "order": -0.9964055084376421,
//                                                                                                                                                                                                                                                                                                                     "order2": 0
//                                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                                   "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                                   "isIntersection": false,
//                                                                                                                                                                                                                                                                                                                   "prev": {
//                                                                                                                                                                                                                                                                                                                     "@id": "548",
//                                                                                                                                                                                                                                                                                                                     "cp": {
//                                                                                                                                                                                                                                                                                                                       "@ref": "80"
//                                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                                     "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                                     "isIntersection": false,
//                                                                                                                                                                                                                                                                                                                     "prev": {
//                                                                                                                                                                                                                                                                                                                       "@id": "549",
//                                                                                                                                                                                                                                                                                                                       "cp": {
//                                                                                                                                                                                                                                                                                                                         "@id": "550",
//                                                                                                                                                                                                                                                                                                                         "pointOnShape": {
//                                                                                                                                                                                                                                                                                                                           "@id": "551",
//                                                                                                                                                                                                                                                                                                                           "curve": {
//                                                                                                                                                                                                                                                                                                                             "@ref": "7"
//                                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                                           "t": 0.75,
//                                                                                                                                                                                                                                                                                                                           "p": [
//                                                                                                                                                                                                                                                                                                                             40.5,
//                                                                                                                                                                                                                                                                                                                             8
//                                                                                                                                                                                                                                                                                                                           ],
//                                                                                                                                                                                                                                                                                                                           "isSource": true
//                                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                                         "circle": {
//                                                                                                                                                                                                                                                                                                                           "@ref": "134"
//                                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                                         "order": 0,
//                                                                                                                                                                                                                                                                                                                         "order2": 0
//                                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                                       "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                                       "isIntersection": false,
//                                                                                                                                                                                                                                                                                                                       "prev": {
//                                                                                                                                                                                                                                                                                                                         "@id": "552",
//                                                                                                                                                                                                                                                                                                                         "cp": {
//                                                                                                                                                                                                                                                                                                                           "@id": "553",
//                                                                                                                                                                                                                                                                                                                           "pointOnShape": {
//                                                                                                                                                                                                                                                                                                                             "@id": "554",
//                                                                                                                                                                                                                                                                                                                             "curve": {
//                                                                                                                                                                                                                                                                                                                               "@ref": "7"
//                                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                                             "t": 0.7015377516157978,
//                                                                                                                                                                                                                                                                                                                             "p": [
//                                                                                                                                                                                                                                                                                                                               39.43383053554755,
//                                                                                                                                                                                                                                                                                                                               8
//                                                                                                                                                                                                                                                                                                                             ],
//                                                                                                                                                                                                                                                                                                                             "isSource": false
//                                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                                           "circle": {
//                                                                                                                                                                                                                                                                                                                             "@ref": "130"
//                                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                                           "order": 0,
//                                                                                                                                                                                                                                                                                                                           "order2": 0
//                                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                                         "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                                         "isIntersection": false,
//                                                                                                                                                                                                                                                                                                                         "prev": {
//                                                                                                                                                                                                                                                                                                                           "@id": "555",
//                                                                                                                                                                                                                                                                                                                           "cp": {
//                                                                                                                                                                                                                                                                                                                             "@id": "556",
//                                                                                                                                                                                                                                                                                                                             "pointOnShape": {
//                                                                                                                                                                                                                                                                                                                               "@id": "557",
//                                                                                                                                                                                                                                                                                                                               "curve": {
//                                                                                                                                                                                                                                                                                                                                 "@ref": "7"
//                                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                                               "t": 0.5,
//                                                                                                                                                                                                                                                                                                                               "p": [
//                                                                                                                                                                                                                                                                                                                                 35,
//                                                                                                                                                                                                                                                                                                                                 8
//                                                                                                                                                                                                                                                                                                                               ],
//                                                                                                                                                                                                                                                                                                                               "isSource": true
//                                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                                             "circle": {
//                                                                                                                                                                                                                                                                                                                               "@ref": "126"
//                                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                                             "order": 0,
//                                                                                                                                                                                                                                                                                                                             "order2": 0
//                                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                                           "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                                           "isIntersection": false,
//                                                                                                                                                                                                                                                                                                                           "prev": {
//                                                                                                                                                                                                                                                                                                                             "@id": "558",
//                                                                                                                                                                                                                                                                                                                             "cp": {
//                                                                                                                                                                                                                                                                                                                               "@id": "559",
//                                                                                                                                                                                                                                                                                                                               "pointOnShape": {
//                                                                                                                                                                                                                                                                                                                                 "@id": "560",
//                                                                                                                                                                                                                                                                                                                                 "curve": {
//                                                                                                                                                                                                                                                                                                                                   "@ref": "7"
//                                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                                 "t": 0.3507688758078993,
//                                                                                                                                                                                                                                                                                                                                 "p": [
//                                                                                                                                                                                                                                                                                                                                   31.716915267773786,
//                                                                                                                                                                                                                                                                                                                                   8
//                                                                                                                                                                                                                                                                                                                                 ],
//                                                                                                                                                                                                                                                                                                                                 "isSource": false
//                                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                                               "circle": {
//                                                                                                                                                                                                                                                                                                                                 "@ref": "122"
//                                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                                               "order": 0,
//                                                                                                                                                                                                                                                                                                                               "order2": 0
//                                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                                             "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                                             "isIntersection": false,
//                                                                                                                                                                                                                                                                                                                             "prev": {
//                                                                                                                                                                                                                                                                                                                               "@id": "561",
//                                                                                                                                                                                                                                                                                                                               "cp": {
//                                                                                                                                                                                                                                                                                                                                 "@id": "562",
//                                                                                                                                                                                                                                                                                                                                 "pointOnShape": {
//                                                                                                                                                                                                                                                                                                                                   "@id": "563",
//                                                                                                                                                                                                                                                                                                                                   "curve": {
//                                                                                                                                                                                                                                                                                                                                     "@ref": "7"
//                                                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                                                   "t": 0.25,
//                                                                                                                                                                                                                                                                                                                                   "p": [
//                                                                                                                                                                                                                                                                                                                                     29.5,
//                                                                                                                                                                                                                                                                                                                                     8
//                                                                                                                                                                                                                                                                                                                                   ],
//                                                                                                                                                                                                                                                                                                                                   "isSource": true
//                                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                                 "circle": {
//                                                                                                                                                                                                                                                                                                                                   "@ref": "118"
//                                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                                 "order": 0,
//                                                                                                                                                                                                                                                                                                                                 "order2": 0
//                                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                                               "isHoleClosing": false,
//                                                                                                                                                                                                                                                                                                                               "isIntersection": false,
//                                                                                                                                                                                                                                                                                                                               "prev": {
//                                                                                                                                                                                                                                                                                                                                 "@ref": "113"
//                                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                                               "next": {
//                                                                                                                                                                                                                                                                                                                                 "@ref": "558"
//                                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                                                 "@ref": "115"
//                                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                                                 "@ref": "115"
//                                                                                                                                                                                                                                                                                                                               }
//                                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                                             "next": {
//                                                                                                                                                                                                                                                                                                                               "@ref": "555"
//                                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                                               "@ref": "119"
//                                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                                               "@ref": "119"
//                                                                                                                                                                                                                                                                                                                             }
//                                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                                           "next": {
//                                                                                                                                                                                                                                                                                                                             "@ref": "552"
//                                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                                             "@ref": "123"
//                                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                                             "@ref": "123"
//                                                                                                                                                                                                                                                                                                                           }
//                                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                                         "next": {
//                                                                                                                                                                                                                                                                                                                           "@ref": "549"
//                                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                                           "@ref": "127"
//                                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                                           "@ref": "127"
//                                                                                                                                                                                                                                                                                                                         }
//                                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                                       "next": {
//                                                                                                                                                                                                                                                                                                                         "@ref": "548"
//                                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                                         "@ref": "131"
//                                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                                         "@ref": "131"
//                                                                                                                                                                                                                                                                                                                       }
//                                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                                     "next": {
//                                                                                                                                                                                                                                                                                                                       "@ref": "545"
//                                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                                       "@ref": "135"
//                                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                                       "@ref": "135"
//                                                                                                                                                                                                                                                                                                                     }
//                                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                                   "next": {
//                                                                                                                                                                                                                                                                                                                     "@ref": "543"
//                                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                                     "@ref": "136"
//                                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                                     "@ref": "136"
//                                                                                                                                                                                                                                                                                                                   }
//                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                 "next": {
//                                                                                                                                                                                                                                                                                                                   "@ref": "541"
//                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                                   "@ref": "140"
//                                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                                   "@ref": "140"
//                                                                                                                                                                                                                                                                                                                 }
//                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                               "next": {
//                                                                                                                                                                                                                                                                                                                 "@ref": "538"
//                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                                 "@ref": "144"
//                                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                                 "@ref": "144"
//                                                                                                                                                                                                                                                                                                               }
//                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                             "next": {
//                                                                                                                                                                                                                                                                                                               "@ref": "536"
//                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                               "@ref": "148"
//                                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                               "@ref": "148"
//                                                                                                                                                                                                                                                                                                             }
//                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                           "next": {
//                                                                                                                                                                                                                                                                                                             "@ref": "533"
//                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                             "@ref": "152"
//                                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                             "@ref": "152"
//                                                                                                                                                                                                                                                                                                           }
//                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                         "next": {
//                                                                                                                                                                                                                                                                                                           "@ref": "532"
//                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                           "@ref": "156"
//                                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                           "@ref": "156"
//                                                                                                                                                                                                                                                                                                         }
//                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                       "next": {
//                                                                                                                                                                                                                                                                                                         "@ref": "530"
//                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                         "@ref": "378"
//                                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                         "@ref": "160"
//                                                                                                                                                                                                                                                                                                       }
//                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                     "next": {
//                                                                                                                                                                                                                                                                                                       "@ref": "527"
//                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                       "@ref": "379"
//                                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                       "@ref": "379"
//                                                                                                                                                                                                                                                                                                     }
//                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                   "next": {
//                                                                                                                                                                                                                                                                                                     "@ref": "524"
//                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                     "@ref": "383"
//                                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                     "@ref": "383"
//                                                                                                                                                                                                                                                                                                   }
//                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                 "next": {
//                                                                                                                                                                                                                                                                                                   "@ref": "523"
//                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                   "@ref": "387"
//                                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                   "@ref": "387"
//                                                                                                                                                                                                                                                                                                 }
//                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                               "next": {
//                                                                                                                                                                                                                                                                                                 "@ref": "520"
//                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                                                                                                                                 "@ref": "457"
//                                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                                                                                                                                 "@ref": "391"
//                                                                                                                                                                                                                                                                                               }
//                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                             "next": {
//                                                                                                                                                                                                                                                                                               "@ref": "517"
//                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                                                                                                                                               "@ref": "458"
//                                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                                                                                                                                               "@ref": "458"
//                                                                                                                                                                                                                                                                                             }
//                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                           "next": {
//                                                                                                                                                                                                                                                                                             "@ref": "514"
//                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                                                                                                                                             "@ref": "462"
//                                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                                                                                                                                             "@ref": "462"
//                                                                                                                                                                                                                                                                                           }
//                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                         "next": {
//                                                                                                                                                                                                                                                                                           "@ref": "511"
//                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                                                                                                                                           "@ref": "466"
//                                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                                                                                                                                           "@ref": "466"
//                                                                                                                                                                                                                                                                                         }
//                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                       "next": {
//                                                                                                                                                                                                                                                                                         "@ref": "508"
//                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                                                                                                                                         "@ref": "470"
//                                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                                                                                                                                         "@ref": "470"
//                                                                                                                                                                                                                                                                                       }
//                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                     "next": {
//                                                                                                                                                                                                                                                                                       "@ref": "505"
//                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                                                                                                                                       "@ref": "474"
//                                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                                                                                                                                       "@ref": "474"
//                                                                                                                                                                                                                                                                                     }
//                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                   "next": {
//                                                                                                                                                                                                                                                                                     "@ref": "502"
//                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                                                                                                                                     "@ref": "478"
//                                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                                                                                                                                     "@ref": "478"
//                                                                                                                                                                                                                                                                                   }
//                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                 "next": {
//                                                                                                                                                                                                                                                                                   "@ref": "499"
//                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                                                                                                                                   "@ref": "482"
//                                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                                                                                                                                   "@ref": "482"
//                                                                                                                                                                                                                                                                                 }
//                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                               "next": {
//                                                                                                                                                                                                                                                                                 "@ref": "496"
//                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                                                                                                                 "@ref": "486"
//                                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                                                                                                                 "@ref": "486"
//                                                                                                                                                                                                                                                                               }
//                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                             "next": {
//                                                                                                                                                                                                                                                                               "@ref": "495"
//                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                                                                                                                               "@ref": "490"
//                                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                                                                                                                               "@ref": "490"
//                                                                                                                                                                                                                                                                             }
//                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                           "next": {
//                                                                                                                                                                                                                                                                             "@ref": "494"
//                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                                                                                                                             "@ref": "494"
//                                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                                                                                                                             "@ref": "494"
//                                                                                                                                                                                                                                                                           }
//                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                         "next": {
//                                                                                                                                                                                                                                                                           "@ref": "490"
//                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                                                                                                                           "@ref": "495"
//                                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                                                                                                                           "@ref": "495"
//                                                                                                                                                                                                                                                                         }
//                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                       "next": {
//                                                                                                                                                                                                                                                                         "@ref": "486"
//                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                                                                                                                         "@ref": "496"
//                                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                                                                                                                         "@ref": "496"
//                                                                                                                                                                                                                                                                       }
//                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                     "next": {
//                                                                                                                                                                                                                                                                       "@ref": "482"
//                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                                                                                                                       "@ref": "499"
//                                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                                                                                                                       "@ref": "499"
//                                                                                                                                                                                                                                                                     }
//                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                   "next": {
//                                                                                                                                                                                                                                                                     "@ref": "478"
//                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                                                                                                                     "@ref": "502"
//                                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                                                                                                                     "@ref": "502"
//                                                                                                                                                                                                                                                                   }
//                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                 "next": {
//                                                                                                                                                                                                                                                                   "@ref": "474"
//                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                                                                                                                   "@ref": "505"
//                                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                                                                                                                   "@ref": "505"
//                                                                                                                                                                                                                                                                 }
//                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                               "next": {
//                                                                                                                                                                                                                                                                 "@ref": "470"
//                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                                                                                                 "@ref": "508"
//                                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                                                                                                 "@ref": "508"
//                                                                                                                                                                                                                                                               }
//                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                             "next": {
//                                                                                                                                                                                                                                                               "@ref": "466"
//                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                                                                                                               "@ref": "511"
//                                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                                                                                                               "@ref": "511"
//                                                                                                                                                                                                                                                             }
//                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                           "next": {
//                                                                                                                                                                                                                                                             "@ref": "462"
//                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                                                                                                             "@ref": "514"
//                                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                                                                                                             "@ref": "514"
//                                                                                                                                                                                                                                                           }
//                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                         "next": {
//                                                                                                                                                                                                                                                           "@ref": "458"
//                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                                                                                                           "@ref": "517"
//                                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                                                                                                           "@ref": "517"
//                                                                                                                                                                                                                                                         }
//                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                       "next": {
//                                                                                                                                                                                                                                                         "@ref": "457"
//                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                                                                                                         "@ref": "520"
//                                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                                                                                                         "@ref": "520"
//                                                                                                                                                                                                                                                       }
//                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                     "next": {
//                                                                                                                                                                                                                                                       "@ref": "454"
//                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                                                                                                       "@ref": "391"
//                                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                                                                                                       "@ref": "523"
//                                                                                                                                                                                                                                                     }
//                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                   "next": {
//                                                                                                                                                                                                                                                     "@ref": "451"
//                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                                                                                                     "@ref": "392"
//                                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                                                                                                     "@ref": "392"
//                                                                                                                                                                                                                                                   }
//                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                 "next": {
//                                                                                                                                                                                                                                                   "@ref": "448"
//                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                                                                                                   "@ref": "396"
//                                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                                                                                                   "@ref": "396"
//                                                                                                                                                                                                                                                 }
//                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                               "next": {
//                                                                                                                                                                                                                                                 "@ref": "445"
//                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                                                                                 "@ref": "400"
//                                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                                                                                 "@ref": "400"
//                                                                                                                                                                                                                                               }
//                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                             "next": {
//                                                                                                                                                                                                                                               "@ref": "442"
//                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                                                                                               "@ref": "404"
//                                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                                                                                               "@ref": "404"
//                                                                                                                                                                                                                                             }
//                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                           "next": {
//                                                                                                                                                                                                                                             "@ref": "439"
//                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                                                                                             "@ref": "408"
//                                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                                                                                             "@ref": "408"
//                                                                                                                                                                                                                                           }
//                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                         "next": {
//                                                                                                                                                                                                                                           "@ref": "436"
//                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                                                                                           "@ref": "412"
//                                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                                                                                           "@ref": "412"
//                                                                                                                                                                                                                                         }
//                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                       "next": {
//                                                                                                                                                                                                                                         "@ref": "433"
//                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                                                                                         "@ref": "416"
//                                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                                                                                         "@ref": "416"
//                                                                                                                                                                                                                                       }
//                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                     "next": {
//                                                                                                                                                                                                                                       "@ref": "430"
//                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                                                                                       "@ref": "420"
//                                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                                                                                       "@ref": "420"
//                                                                                                                                                                                                                                     }
//                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                   "next": {
//                                                                                                                                                                                                                                     "@ref": "429"
//                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                                                                                     "@ref": "424"
//                                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                                                                                     "@ref": "424"
//                                                                                                                                                                                                                                   }
//                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                 "next": {
//                                                                                                                                                                                                                                   "@ref": "428"
//                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                                                                                   "@ref": "428"
//                                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                                                                                   "@ref": "428"
//                                                                                                                                                                                                                                 }
//                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                               "next": {
//                                                                                                                                                                                                                                 "@ref": "424"
//                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                                                                 "@ref": "429"
//                                                                                                                                                                                                                               },
//                                                                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                                                                 "@ref": "429"
//                                                                                                                                                                                                                               }
//                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                             "next": {
//                                                                                                                                                                                                                               "@ref": "420"
//                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                                                                               "@ref": "430"
//                                                                                                                                                                                                                             },
//                                                                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                                                                               "@ref": "430"
//                                                                                                                                                                                                                             }
//                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                           "next": {
//                                                                                                                                                                                                                             "@ref": "416"
//                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                                                                             "@ref": "433"
//                                                                                                                                                                                                                           },
//                                                                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                                                                             "@ref": "433"
//                                                                                                                                                                                                                           }
//                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                         "next": {
//                                                                                                                                                                                                                           "@ref": "412"
//                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                                                                           "@ref": "436"
//                                                                                                                                                                                                                         },
//                                                                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                                                                           "@ref": "436"
//                                                                                                                                                                                                                         }
//                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                       "next": {
//                                                                                                                                                                                                                         "@ref": "408"
//                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                                                                         "@ref": "439"
//                                                                                                                                                                                                                       },
//                                                                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                                                                         "@ref": "439"
//                                                                                                                                                                                                                       }
//                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                     "next": {
//                                                                                                                                                                                                                       "@ref": "404"
//                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                                                                       "@ref": "442"
//                                                                                                                                                                                                                     },
//                                                                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                                                                       "@ref": "442"
//                                                                                                                                                                                                                     }
//                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                   "next": {
//                                                                                                                                                                                                                     "@ref": "400"
//                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                                                                     "@ref": "445"
//                                                                                                                                                                                                                   },
//                                                                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                                                                     "@ref": "445"
//                                                                                                                                                                                                                   }
//                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                 "next": {
//                                                                                                                                                                                                                   "@ref": "396"
//                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                                                                   "@ref": "448"
//                                                                                                                                                                                                                 },
//                                                                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                                                                   "@ref": "448"
//                                                                                                                                                                                                                 }
//                                                                                                                                                                                                               },
//                                                                                                                                                                                                               "next": {
//                                                                                                                                                                                                                 "@ref": "392"
//                                                                                                                                                                                                               },
//                                                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                                                 "@ref": "451"
//                                                                                                                                                                                                               },
//                                                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                                                 "@ref": "451"
//                                                                                                                                                                                                               }
//                                                                                                                                                                                                             },
//                                                                                                                                                                                                             "next": {
//                                                                                                                                                                                                               "@ref": "391"
//                                                                                                                                                                                                             },
//                                                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                                                               "@ref": "454"
//                                                                                                                                                                                                             },
//                                                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                                                               "@ref": "454"
//                                                                                                                                                                                                             }
//                                                                                                                                                                                                           },
//                                                                                                                                                                                                           "next": {
//                                                                                                                                                                                                             "@ref": "387"
//                                                                                                                                                                                                           },
//                                                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                                                             "@ref": "523"
//                                                                                                                                                                                                           },
//                                                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                                                             "@ref": "457"
//                                                                                                                                                                                                           }
//                                                                                                                                                                                                         },
//                                                                                                                                                                                                         "next": {
//                                                                                                                                                                                                           "@ref": "383"
//                                                                                                                                                                                                         },
//                                                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                                                           "@ref": "524"
//                                                                                                                                                                                                         },
//                                                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                                                           "@ref": "524"
//                                                                                                                                                                                                         }
//                                                                                                                                                                                                       },
//                                                                                                                                                                                                       "next": {
//                                                                                                                                                                                                         "@ref": "379"
//                                                                                                                                                                                                       },
//                                                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                                                         "@ref": "527"
//                                                                                                                                                                                                       },
//                                                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                                                         "@ref": "527"
//                                                                                                                                                                                                       }
//                                                                                                                                                                                                     },
//                                                                                                                                                                                                     "next": {
//                                                                                                                                                                                                       "@ref": "378"
//                                                                                                                                                                                                     },
//                                                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                                                       "@ref": "530"
//                                                                                                                                                                                                     },
//                                                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                                                       "@ref": "530"
//                                                                                                                                                                                                     }
//                                                                                                                                                                                                   },
//                                                                                                                                                                                                   "next": {
//                                                                                                                                                                                                     "@ref": "377"
//                                                                                                                                                                                                   },
//                                                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                                                     "@ref": "160"
//                                                                                                                                                                                                   },
//                                                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                                                     "@ref": "532"
//                                                                                                                                                                                                   }
//                                                                                                                                                                                                 },
//                                                                                                                                                                                                 "next": {
//                                                                                                                                                                                                   "@ref": "374"
//                                                                                                                                                                                                 },
//                                                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                                                   "@ref": "304"
//                                                                                                                                                                                                 },
//                                                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                                                   "@ref": "161"
//                                                                                                                                                                                                 }
//                                                                                                                                                                                               },
//                                                                                                                                                                                               "next": {
//                                                                                                                                                                                                 "@ref": "372"
//                                                                                                                                                                                               },
//                                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                                 "@ref": "305"
//                                                                                                                                                                                               },
//                                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                                 "@ref": "305"
//                                                                                                                                                                                               }
//                                                                                                                                                                                             },
//                                                                                                                                                                                             "next": {
//                                                                                                                                                                                               "@ref": "370"
//                                                                                                                                                                                             },
//                                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                                               "@ref": "309"
//                                                                                                                                                                                             },
//                                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                                               "@ref": "309"
//                                                                                                                                                                                             }
//                                                                                                                                                                                           },
//                                                                                                                                                                                           "next": {
//                                                                                                                                                                                             "@ref": "367"
//                                                                                                                                                                                           },
//                                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                                             "@ref": "313"
//                                                                                                                                                                                           },
//                                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                                             "@ref": "313"
//                                                                                                                                                                                           }
//                                                                                                                                                                                         },
//                                                                                                                                                                                         "next": {
//                                                                                                                                                                                           "@ref": "366"
//                                                                                                                                                                                         },
//                                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                                           "@ref": "317"
//                                                                                                                                                                                         },
//                                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                                           "@ref": "317"
//                                                                                                                                                                                         }
//                                                                                                                                                                                       },
//                                                                                                                                                                                       "next": {
//                                                                                                                                                                                         "@ref": "363"
//                                                                                                                                                                                       },
//                                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                                         "@ref": "321"
//                                                                                                                                                                                       },
//                                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                                         "@ref": "321"
//                                                                                                                                                                                       }
//                                                                                                                                                                                     },
//                                                                                                                                                                                     "next": {
//                                                                                                                                                                                       "@ref": "360"
//                                                                                                                                                                                     },
//                                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                                       "@ref": "322"
//                                                                                                                                                                                     },
//                                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                                       "@ref": "322"
//                                                                                                                                                                                     }
//                                                                                                                                                                                   },
//                                                                                                                                                                                   "next": {
//                                                                                                                                                                                     "@ref": "357"
//                                                                                                                                                                                   },
//                                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                                     "@ref": "326"
//                                                                                                                                                                                   },
//                                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                                     "@ref": "326"
//                                                                                                                                                                                   }
//                                                                                                                                                                                 },
//                                                                                                                                                                                 "next": {
//                                                                                                                                                                                   "@ref": "354"
//                                                                                                                                                                                 },
//                                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                                   "@ref": "330"
//                                                                                                                                                                                 },
//                                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                                   "@ref": "330"
//                                                                                                                                                                                 }
//                                                                                                                                                                               },
//                                                                                                                                                                               "next": {
//                                                                                                                                                                                 "@ref": "351"
//                                                                                                                                                                               },
//                                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                                 "@ref": "334"
//                                                                                                                                                                               },
//                                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                                 "@ref": "334"
//                                                                                                                                                                               }
//                                                                                                                                                                             },
//                                                                                                                                                                             "next": {
//                                                                                                                                                                               "@ref": "348"
//                                                                                                                                                                             },
//                                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                                               "@ref": "338"
//                                                                                                                                                                             },
//                                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                                               "@ref": "338"
//                                                                                                                                                                             }
//                                                                                                                                                                           },
//                                                                                                                                                                           "next": {
//                                                                                                                                                                             "@ref": "347"
//                                                                                                                                                                           },
//                                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                                             "@ref": "342"
//                                                                                                                                                                           },
//                                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                                             "@ref": "342"
//                                                                                                                                                                           }
//                                                                                                                                                                         },
//                                                                                                                                                                         "next": {
//                                                                                                                                                                           "@ref": "346"
//                                                                                                                                                                         },
//                                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                                           "@ref": "346"
//                                                                                                                                                                         },
//                                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                                           "@ref": "346"
//                                                                                                                                                                         }
//                                                                                                                                                                       },
//                                                                                                                                                                       "next": {
//                                                                                                                                                                         "@ref": "342"
//                                                                                                                                                                       },
//                                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                                         "@ref": "347"
//                                                                                                                                                                       },
//                                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                                         "@ref": "347"
//                                                                                                                                                                       }
//                                                                                                                                                                     },
//                                                                                                                                                                     "next": {
//                                                                                                                                                                       "@ref": "338"
//                                                                                                                                                                     },
//                                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                                       "@ref": "348"
//                                                                                                                                                                     },
//                                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                                       "@ref": "348"
//                                                                                                                                                                     }
//                                                                                                                                                                   },
//                                                                                                                                                                   "next": {
//                                                                                                                                                                     "@ref": "334"
//                                                                                                                                                                   },
//                                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                                     "@ref": "351"
//                                                                                                                                                                   },
//                                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                                     "@ref": "351"
//                                                                                                                                                                   }
//                                                                                                                                                                 },
//                                                                                                                                                                 "next": {
//                                                                                                                                                                   "@ref": "330"
//                                                                                                                                                                 },
//                                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                                   "@ref": "354"
//                                                                                                                                                                 },
//                                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                                   "@ref": "354"
//                                                                                                                                                                 }
//                                                                                                                                                               },
//                                                                                                                                                               "next": {
//                                                                                                                                                                 "@ref": "326"
//                                                                                                                                                               },
//                                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                                 "@ref": "357"
//                                                                                                                                                               },
//                                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                                 "@ref": "357"
//                                                                                                                                                               }
//                                                                                                                                                             },
//                                                                                                                                                             "next": {
//                                                                                                                                                               "@ref": "322"
//                                                                                                                                                             },
//                                                                                                                                                             "nextOnCircle": {
//                                                                                                                                                               "@ref": "360"
//                                                                                                                                                             },
//                                                                                                                                                             "prevOnCircle": {
//                                                                                                                                                               "@ref": "360"
//                                                                                                                                                             }
//                                                                                                                                                           },
//                                                                                                                                                           "next": {
//                                                                                                                                                             "@ref": "321"
//                                                                                                                                                           },
//                                                                                                                                                           "nextOnCircle": {
//                                                                                                                                                             "@ref": "363"
//                                                                                                                                                           },
//                                                                                                                                                           "prevOnCircle": {
//                                                                                                                                                             "@ref": "363"
//                                                                                                                                                           }
//                                                                                                                                                         },
//                                                                                                                                                         "next": {
//                                                                                                                                                           "@ref": "317"
//                                                                                                                                                         },
//                                                                                                                                                         "nextOnCircle": {
//                                                                                                                                                           "@ref": "366"
//                                                                                                                                                         },
//                                                                                                                                                         "prevOnCircle": {
//                                                                                                                                                           "@ref": "366"
//                                                                                                                                                         }
//                                                                                                                                                       },
//                                                                                                                                                       "next": {
//                                                                                                                                                         "@ref": "313"
//                                                                                                                                                       },
//                                                                                                                                                       "nextOnCircle": {
//                                                                                                                                                         "@ref": "367"
//                                                                                                                                                       },
//                                                                                                                                                       "prevOnCircle": {
//                                                                                                                                                         "@ref": "367"
//                                                                                                                                                       }
//                                                                                                                                                     },
//                                                                                                                                                     "next": {
//                                                                                                                                                       "@ref": "309"
//                                                                                                                                                     },
//                                                                                                                                                     "nextOnCircle": {
//                                                                                                                                                       "@ref": "370"
//                                                                                                                                                     },
//                                                                                                                                                     "prevOnCircle": {
//                                                                                                                                                       "@ref": "370"
//                                                                                                                                                     }
//                                                                                                                                                   },
//                                                                                                                                                   "next": {
//                                                                                                                                                     "@ref": "305"
//                                                                                                                                                   },
//                                                                                                                                                   "nextOnCircle": {
//                                                                                                                                                     "@ref": "372"
//                                                                                                                                                   },
//                                                                                                                                                   "prevOnCircle": {
//                                                                                                                                                     "@ref": "372"
//                                                                                                                                                   }
//                                                                                                                                                 },
//                                                                                                                                                 "next": {
//                                                                                                                                                   "@ref": "304"
//                                                                                                                                                 },
//                                                                                                                                                 "nextOnCircle": {
//                                                                                                                                                   "@ref": "374"
//                                                                                                                                                 },
//                                                                                                                                                 "prevOnCircle": {
//                                                                                                                                                   "@ref": "374"
//                                                                                                                                                 }
//                                                                                                                                               },
//                                                                                                                                               "next": {
//                                                                                                                                                 "@ref": "301"
//                                                                                                                                               },
//                                                                                                                                               "nextOnCircle": {
//                                                                                                                                                 "@ref": "161"
//                                                                                                                                               },
//                                                                                                                                               "prevOnCircle": {
//                                                                                                                                                 "@ref": "377"
//                                                                                                                                               }
//                                                                                                                                             },
//                                                                                                                                             "next": {
//                                                                                                                                               "@ref": "298"
//                                                                                                                                             },
//                                                                                                                                             "nextOnCircle": {
//                                                                                                                                               "@ref": "162"
//                                                                                                                                             },
//                                                                                                                                             "prevOnCircle": {
//                                                                                                                                               "@ref": "162"
//                                                                                                                                             }
//                                                                                                                                           },
//                                                                                                                                           "next": {
//                                                                                                                                             "@ref": "295"
//                                                                                                                                           },
//                                                                                                                                           "nextOnCircle": {
//                                                                                                                                             "@ref": "166"
//                                                                                                                                           },
//                                                                                                                                           "prevOnCircle": {
//                                                                                                                                             "@ref": "166"
//                                                                                                                                           }
//                                                                                                                                         },
//                                                                                                                                         "next": {
//                                                                                                                                           "@ref": "292"
//                                                                                                                                         },
//                                                                                                                                         "nextOnCircle": {
//                                                                                                                                           "@ref": "170"
//                                                                                                                                         },
//                                                                                                                                         "prevOnCircle": {
//                                                                                                                                           "@ref": "170"
//                                                                                                                                         }
//                                                                                                                                       },
//                                                                                                                                       "next": {
//                                                                                                                                         "@ref": "289"
//                                                                                                                                       },
//                                                                                                                                       "nextOnCircle": {
//                                                                                                                                         "@ref": "174"
//                                                                                                                                       },
//                                                                                                                                       "prevOnCircle": {
//                                                                                                                                         "@ref": "174"
//                                                                                                                                       }
//                                                                                                                                     },
//                                                                                                                                     "next": {
//                                                                                                                                       "@ref": "286"
//                                                                                                                                     },
//                                                                                                                                     "nextOnCircle": {
//                                                                                                                                       "@ref": "178"
//                                                                                                                                     },
//                                                                                                                                     "prevOnCircle": {
//                                                                                                                                       "@ref": "178"
//                                                                                                                                     }
//                                                                                                                                   },
//                                                                                                                                   "next": {
//                                                                                                                                     "@ref": "283"
//                                                                                                                                   },
//                                                                                                                                   "nextOnCircle": {
//                                                                                                                                     "@ref": "182"
//                                                                                                                                   },
//                                                                                                                                   "prevOnCircle": {
//                                                                                                                                     "@ref": "182"
//                                                                                                                                   }
//                                                                                                                                 },
//                                                                                                                                 "next": {
//                                                                                                                                   "@ref": "280"
//                                                                                                                                 },
//                                                                                                                                 "nextOnCircle": {
//                                                                                                                                   "@ref": "186"
//                                                                                                                                 },
//                                                                                                                                 "prevOnCircle": {
//                                                                                                                                   "@ref": "186"
//                                                                                                                                 }
//                                                                                                                               },
//                                                                                                                               "next": {
//                                                                                                                                 "@ref": "277"
//                                                                                                                               },
//                                                                                                                               "nextOnCircle": {
//                                                                                                                                 "@ref": "190"
//                                                                                                                               },
//                                                                                                                               "prevOnCircle": {
//                                                                                                                                 "@ref": "190"
//                                                                                                                               }
//                                                                                                                             },
//                                                                                                                             "next": {
//                                                                                                                               "@ref": "274"
//                                                                                                                             },
//                                                                                                                             "nextOnCircle": {
//                                                                                                                               "@ref": "194"
//                                                                                                                             },
//                                                                                                                             "prevOnCircle": {
//                                                                                                                               "@ref": "194"
//                                                                                                                             }
//                                                                                                                           },
//                                                                                                                           "next": {
//                                                                                                                             "@ref": "271"
//                                                                                                                           },
//                                                                                                                           "nextOnCircle": {
//                                                                                                                             "@ref": "198"
//                                                                                                                           },
//                                                                                                                           "prevOnCircle": {
//                                                                                                                             "@ref": "198"
//                                                                                                                           }
//                                                                                                                         },
//                                                                                                                         "next": {
//                                                                                                                           "@ref": "268"
//                                                                                                                         },
//                                                                                                                         "nextOnCircle": {
//                                                                                                                           "@ref": "202"
//                                                                                                                         },
//                                                                                                                         "prevOnCircle": {
//                                                                                                                           "@ref": "202"
//                                                                                                                         }
//                                                                                                                       },
//                                                                                                                       "next": {
//                                                                                                                         "@ref": "265"
//                                                                                                                       },
//                                                                                                                       "nextOnCircle": {
//                                                                                                                         "@ref": "206"
//                                                                                                                       },
//                                                                                                                       "prevOnCircle": {
//                                                                                                                         "@ref": "206"
//                                                                                                                       }
//                                                                                                                     },
//                                                                                                                     "next": {
//                                                                                                                       "@ref": "262"
//                                                                                                                     },
//                                                                                                                     "nextOnCircle": {
//                                                                                                                       "@ref": "210"
//                                                                                                                     },
//                                                                                                                     "prevOnCircle": {
//                                                                                                                       "@ref": "210"
//                                                                                                                     }
//                                                                                                                   },
//                                                                                                                   "next": {
//                                                                                                                     "@ref": "259"
//                                                                                                                   },
//                                                                                                                   "nextOnCircle": {
//                                                                                                                     "@ref": "214"
//                                                                                                                   },
//                                                                                                                   "prevOnCircle": {
//                                                                                                                     "@ref": "214"
//                                                                                                                   }
//                                                                                                                 },
//                                                                                                                 "next": {
//                                                                                                                   "@ref": "256"
//                                                                                                                 },
//                                                                                                                 "nextOnCircle": {
//                                                                                                                   "@ref": "218"
//                                                                                                                 },
//                                                                                                                 "prevOnCircle": {
//                                                                                                                   "@ref": "218"
//                                                                                                                 }
//                                                                                                               },
//                                                                                                               "next": {
//                                                                                                                 "@ref": "253"
//                                                                                                               },
//                                                                                                               "nextOnCircle": {
//                                                                                                                 "@ref": "222"
//                                                                                                               },
//                                                                                                               "prevOnCircle": {
//                                                                                                                 "@ref": "222"
//                                                                                                               }
//                                                                                                             },
//                                                                                                             "next": {
//                                                                                                               "@ref": "250"
//                                                                                                             },
//                                                                                                             "nextOnCircle": {
//                                                                                                               "@ref": "226"
//                                                                                                             },
//                                                                                                             "prevOnCircle": {
//                                                                                                               "@ref": "226"
//                                                                                                             }
//                                                                                                           },
//                                                                                                           "next": {
//                                                                                                             "@ref": "247"
//                                                                                                           },
//                                                                                                           "nextOnCircle": {
//                                                                                                             "@ref": "230"
//                                                                                                           },
//                                                                                                           "prevOnCircle": {
//                                                                                                             "@ref": "230"
//                                                                                                           }
//                                                                                                         },
//                                                                                                         "next": {
//                                                                                                           "@ref": "244"
//                                                                                                         },
//                                                                                                         "nextOnCircle": {
//                                                                                                           "@ref": "234"
//                                                                                                         },
//                                                                                                         "prevOnCircle": {
//                                                                                                           "@ref": "234"
//                                                                                                         }
//                                                                                                       },
//                                                                                                       "next": {
//                                                                                                         "@ref": "243"
//                                                                                                       },
//                                                                                                       "nextOnCircle": {
//                                                                                                         "@ref": "238"
//                                                                                                       },
//                                                                                                       "prevOnCircle": {
//                                                                                                         "@ref": "238"
//                                                                                                       }
//                                                                                                     },
//                                                                                                     "next": {
//                                                                                                       "@ref": "242"
//                                                                                                     },
//                                                                                                     "prevOnCircle": {
//                                                                                                       "@ref": "242"
//                                                                                                     },
//                                                                                                     "nextOnCircle": {
//                                                                                                       "@ref": "242"
//                                                                                                     }
//                                                                                                   },
//                                                                                                   "next": {
//                                                                                                     "@ref": "238"
//                                                                                                   },
//                                                                                                   "prevOnCircle": {
//                                                                                                     "@ref": "243"
//                                                                                                   },
//                                                                                                   "nextOnCircle": {
//                                                                                                     "@ref": "243"
//                                                                                                   }
//                                                                                                 },
//                                                                                                 "next": {
//                                                                                                   "@ref": "234"
//                                                                                                 },
//                                                                                                 "nextOnCircle": {
//                                                                                                   "@ref": "244"
//                                                                                                 },
//                                                                                                 "prevOnCircle": {
//                                                                                                   "@ref": "244"
//                                                                                                 }
//                                                                                               },
//                                                                                               "next": {
//                                                                                                 "@ref": "230"
//                                                                                               },
//                                                                                               "nextOnCircle": {
//                                                                                                 "@ref": "247"
//                                                                                               },
//                                                                                               "prevOnCircle": {
//                                                                                                 "@ref": "247"
//                                                                                               }
//                                                                                             },
//                                                                                             "next": {
//                                                                                               "@ref": "226"
//                                                                                             },
//                                                                                             "nextOnCircle": {
//                                                                                               "@ref": "250"
//                                                                                             },
//                                                                                             "prevOnCircle": {
//                                                                                               "@ref": "250"
//                                                                                             }
//                                                                                           },
//                                                                                           "next": {
//                                                                                             "@ref": "222"
//                                                                                           },
//                                                                                           "nextOnCircle": {
//                                                                                             "@ref": "253"
//                                                                                           },
//                                                                                           "prevOnCircle": {
//                                                                                             "@ref": "253"
//                                                                                           }
//                                                                                         },
//                                                                                         "next": {
//                                                                                           "@ref": "218"
//                                                                                         },
//                                                                                         "nextOnCircle": {
//                                                                                           "@ref": "256"
//                                                                                         },
//                                                                                         "prevOnCircle": {
//                                                                                           "@ref": "256"
//                                                                                         }
//                                                                                       },
//                                                                                       "next": {
//                                                                                         "@ref": "214"
//                                                                                       },
//                                                                                       "nextOnCircle": {
//                                                                                         "@ref": "259"
//                                                                                       },
//                                                                                       "prevOnCircle": {
//                                                                                         "@ref": "259"
//                                                                                       }
//                                                                                     },
//                                                                                     "next": {
//                                                                                       "@ref": "210"
//                                                                                     },
//                                                                                     "nextOnCircle": {
//                                                                                       "@ref": "262"
//                                                                                     },
//                                                                                     "prevOnCircle": {
//                                                                                       "@ref": "262"
//                                                                                     }
//                                                                                   },
//                                                                                   "next": {
//                                                                                     "@ref": "206"
//                                                                                   },
//                                                                                   "nextOnCircle": {
//                                                                                     "@ref": "265"
//                                                                                   },
//                                                                                   "prevOnCircle": {
//                                                                                     "@ref": "265"
//                                                                                   }
//                                                                                 },
//                                                                                 "next": {
//                                                                                   "@ref": "202"
//                                                                                 },
//                                                                                 "nextOnCircle": {
//                                                                                   "@ref": "268"
//                                                                                 },
//                                                                                 "prevOnCircle": {
//                                                                                   "@ref": "268"
//                                                                                 }
//                                                                               },
//                                                                               "next": {
//                                                                                 "@ref": "198"
//                                                                               },
//                                                                               "nextOnCircle": {
//                                                                                 "@ref": "271"
//                                                                               },
//                                                                               "prevOnCircle": {
//                                                                                 "@ref": "271"
//                                                                               }
//                                                                             },
//                                                                             "next": {
//                                                                               "@ref": "194"
//                                                                             },
//                                                                             "nextOnCircle": {
//                                                                               "@ref": "274"
//                                                                             },
//                                                                             "prevOnCircle": {
//                                                                               "@ref": "274"
//                                                                             }
//                                                                           },
//                                                                           "next": {
//                                                                             "@ref": "190"
//                                                                           },
//                                                                           "nextOnCircle": {
//                                                                             "@ref": "277"
//                                                                           },
//                                                                           "prevOnCircle": {
//                                                                             "@ref": "277"
//                                                                           }
//                                                                         },
//                                                                         "next": {
//                                                                           "@ref": "186"
//                                                                         },
//                                                                         "nextOnCircle": {
//                                                                           "@ref": "280"
//                                                                         },
//                                                                         "prevOnCircle": {
//                                                                           "@ref": "280"
//                                                                         }
//                                                                       },
//                                                                       "next": {
//                                                                         "@ref": "182"
//                                                                       },
//                                                                       "nextOnCircle": {
//                                                                         "@ref": "283"
//                                                                       },
//                                                                       "prevOnCircle": {
//                                                                         "@ref": "283"
//                                                                       }
//                                                                     },
//                                                                     "next": {
//                                                                       "@ref": "178"
//                                                                     },
//                                                                     "nextOnCircle": {
//                                                                       "@ref": "286"
//                                                                     },
//                                                                     "prevOnCircle": {
//                                                                       "@ref": "286"
//                                                                     }
//                                                                   },
//                                                                   "next": {
//                                                                     "@ref": "174"
//                                                                   },
//                                                                   "nextOnCircle": {
//                                                                     "@ref": "289"
//                                                                   },
//                                                                   "prevOnCircle": {
//                                                                     "@ref": "289"
//                                                                   }
//                                                                 },
//                                                                 "next": {
//                                                                   "@ref": "170"
//                                                                 },
//                                                                 "nextOnCircle": {
//                                                                   "@ref": "292"
//                                                                 },
//                                                                 "prevOnCircle": {
//                                                                   "@ref": "292"
//                                                                 }
//                                                               },
//                                                               "next": {
//                                                                 "@ref": "166"
//                                                               },
//                                                               "nextOnCircle": {
//                                                                 "@ref": "295"
//                                                               },
//                                                               "prevOnCircle": {
//                                                                 "@ref": "295"
//                                                               }
//                                                             },
//                                                             "next": {
//                                                               "@ref": "162"
//                                                             },
//                                                             "nextOnCircle": {
//                                                               "@ref": "298"
//                                                             },
//                                                             "prevOnCircle": {
//                                                               "@ref": "298"
//                                                             }
//                                                           },
//                                                           "next": {
//                                                             "@ref": "161"
//                                                           },
//                                                           "nextOnCircle": {
//                                                             "@ref": "301"
//                                                           },
//                                                           "prevOnCircle": {
//                                                             "@ref": "301"
//                                                           }
//                                                         },
//                                                         "next": {
//                                                           "@ref": "160"
//                                                         },
//                                                         "nextOnCircle": {
//                                                           "@ref": "377"
//                                                         },
//                                                         "prevOnCircle": {
//                                                           "@ref": "304"
//                                                         }
//                                                       },
//                                                       "next": {
//                                                         "@ref": "156"
//                                                       },
//                                                       "nextOnCircle": {
//                                                         "@ref": "532"
//                                                       },
//                                                       "prevOnCircle": {
//                                                         "@ref": "378"
//                                                       }
//                                                     },
//                                                     "next": {
//                                                       "@ref": "152"
//                                                     },
//                                                     "nextOnCircle": {
//                                                       "@ref": "533"
//                                                     },
//                                                     "prevOnCircle": {
//                                                       "@ref": "533"
//                                                     }
//                                                   },
//                                                   "next": {
//                                                     "@ref": "148"
//                                                   },
//                                                   "nextOnCircle": {
//                                                     "@ref": "536"
//                                                   },
//                                                   "prevOnCircle": {
//                                                     "@ref": "536"
//                                                   }
//                                                 },
//                                                 "next": {
//                                                   "@ref": "144"
//                                                 },
//                                                 "nextOnCircle": {
//                                                   "@ref": "538"
//                                                 },
//                                                 "prevOnCircle": {
//                                                   "@ref": "538"
//                                                 }
//                                               },
//                                               "next": {
//                                                 "@ref": "140"
//                                               },
//                                               "nextOnCircle": {
//                                                 "@ref": "541"
//                                               },
//                                               "prevOnCircle": {
//                                                 "@ref": "541"
//                                               }
//                                             },
//                                             "next": {
//                                               "@ref": "136"
//                                             },
//                                             "nextOnCircle": {
//                                               "@ref": "543"
//                                             },
//                                             "prevOnCircle": {
//                                               "@ref": "543"
//                                             }
//                                           },
//                                           "next": {
//                                             "@ref": "135"
//                                           },
//                                           "nextOnCircle": {
//                                             "@ref": "545"
//                                           },
//                                           "prevOnCircle": {
//                                             "@ref": "545"
//                                           }
//                                         },
//                                         "next": {
//                                           "@ref": "131"
//                                         },
//                                         "nextOnCircle": {
//                                           "@ref": "548"
//                                         },
//                                         "prevOnCircle": {
//                                           "@ref": "548"
//                                         }
//                                       },
//                                       "next": {
//                                         "@ref": "127"
//                                       },
//                                       "nextOnCircle": {
//                                         "@ref": "549"
//                                       },
//                                       "prevOnCircle": {
//                                         "@ref": "549"
//                                       }
//                                     },
//                                     "next": {
//                                       "@ref": "123"
//                                     },
//                                     "nextOnCircle": {
//                                       "@ref": "552"
//                                     },
//                                     "prevOnCircle": {
//                                       "@ref": "552"
//                                     }
//                                   },
//                                   "next": {
//                                     "@ref": "119"
//                                   },
//                                   "nextOnCircle": {
//                                     "@ref": "555"
//                                   },
//                                   "prevOnCircle": {
//                                     "@ref": "555"
//                                   }
//                                 },
//                                 "next": {
//                                   "@ref": "115"
//                                 },
//                                 "nextOnCircle": {
//                                   "@ref": "558"
//                                 },
//                                 "prevOnCircle": {
//                                   "@ref": "558"
//                                 }
//                               },
//                               "next": {
//                                 "@ref": "114"
//                               },
//                               "nextOnCircle": {
//                                 "@ref": "561"
//                               },
//                               "prevOnCircle": {
//                                 "@ref": "561"
//                               }
//                             },
//                             "next": {
//                               "@ref": "113"
//                             },
//                             "prevOnCircle": {
//                               "@ref": "113"
//                             },
//                             "nextOnCircle": {
//                               "@ref": "113"
//                             }
//                           },
//                           "next": {
//                             "@ref": "561"
//                           },
//                           "prevOnCircle": {
//                             "@ref": "114"
//                           },
//                           "nextOnCircle": {
//                             "@ref": "114"
//                           }
//                         }
//                       ]
//                     ]
//                   }
//                 ],
//                 [
//                   46,
//                   {
//                     "@id": "564",
//                     "@type": "Map",
//                     "entries": [
//                       [
//                         54,
//                         {
//                           "@ref": "494"
//                         }
//                       ]
//                     ]
//                   }
//                 ],
//                 [
//                   117,
//                   {
//                     "@id": "565",
//                     "@type": "Map",
//                     "entries": [
//                       [
//                         54,
//                         {
//                           "@ref": "428"
//                         }
//                       ]
//                     ]
//                   }
//                 ],
//                 [
//                   139,
//                   {
//                     "@id": "566",
//                     "@type": "Map",
//                     "entries": [
//                       [
//                         8,
//                         {
//                           "@ref": "346"
//                         }
//                       ]
//                     ]
//                   }
//                 ],
//                 [
//                   82,
//                   {
//                     "@id": "567",
//                     "@type": "Map",
//                     "entries": [
//                       [
//                         -101,
//                         {
//                           "@ref": "242"
//                         }
//                       ]
//                     ]
//                   }
//                 ]
//               ]
//             }
//           ]
//         ]
//       }
//     }
//   }
// ];


// const mats1_ = decodeJSOG(mats1Jsog);


// export { mats1_ };