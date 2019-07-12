import React from "react";
import { render } from "@testing-library/react";
import { PropTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as SomeComp } from "../../../comp";

type Thing = (firstArg: string) => number;

type Props = {
  /* Some description for this */
  a: boolean;
  b: any;
  c: "some string";
  d: "some string" | "something";
  e: Thing;
};

type PropsAlias = Props;

let MyComponentThatDoesStuff = (props: PropsAlias) => {
  return null;
};

test("it works", () => {
  let { container } = render(
    <PropTypes component={MyComponentThatDoesStuff} />
  );
  expect(container).toMatchInlineSnapshot(`
    <div>
      <pre>
        {
      "type": "Object",
      "name": "Props",
      "properties": [
        {
          "key": "a",
          "value": {
            "type": "Boolean"
          }
        },
        {
          "key": "b",
          "value": {
            "type": "Any"
          }
        },
        {
          "key": "c",
          "value": {
            "type": "StringLiteral",
            "value": "some string"
          }
        },
        {
          "key": "d",
          "value": {
            "type": "Union",
            "types": [
              {
                "type": "StringLiteral",
                "value": "some string"
              },
              {
                "type": "StringLiteral",
                "value": "something"
              }
            ]
          }
        },
        {
          "key": "e",
          "value": {
            "type": "Function",
            "signatures": [
              {
                "return": {
                  "type": "Number"
                },
                "parameters": [
                  {
                    "name": "firstArg",
                    "type": {
                      "type": "String"
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    }
      </pre>
    </div>
  `);
});

test("it works", () => {
  let { container } = render(<PropTypes component={SomeComp} />);
  expect(container).toMatchInlineSnapshot(`
      <div>
        <pre>
          {
        "type": "Object",
        "name": "Props",
        "properties": [
          {
            "key": "a",
            "value": {
              "type": "Boolean"
            }
          },
          {
            "key": "b",
            "value": {
              "type": "Any"
            }
          },
          {
            "key": "c",
            "value": {
              "type": "StringLiteral",
              "value": "some string"
            }
          },
          {
            "key": "d",
            "value": {
              "type": "Union",
              "types": [
                {
                  "type": "StringLiteral",
                  "value": "some string"
                },
                {
                  "type": "StringLiteral",
                  "value": "something"
                }
              ]
            }
          },
          {
            "key": "e",
            "value": {
              "type": "Function",
              "signatures": [
                {
                  "return": {
                    "type": "Number"
                  },
                  "parameters": [
                    {
                      "name": "firstArg",
                      "type": {
                        "type": "String"
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
        </pre>
      </div>
    `);
});
