export const WASTE_RECORD_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "typeOfWaste",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sizeOfWaste",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "photolink",
        type: "string",
      },
    ],
    name: "WasteRecord_AddRecord",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_location",
        type: "string",
      },
      {
        internalType: "string",
        name: "_typeOfWaste",
        type: "string",
      },
      {
        internalType: "string",
        name: "_sizeOfWaste",
        type: "string",
      },
      {
        internalType: "string",
        name: "_photolink",
        type: "string",
      },
    ],
    name: "addRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_recordId",
        type: "uint256",
      },
    ],
    name: "deleteRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "recordid",
        type: "uint256",
      },
    ],
    name: "getRecord",
    outputs: [
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "typeOfWaste",
        type: "string",
      },
      {
        internalType: "string",
        name: "sizeOfWaste",
        type: "string",
      },
      {
        internalType: "string",
        name: "photolink",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
