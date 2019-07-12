import typescript from "typescript";
import * as fs from "fs";
import { NodePath, types } from "@babel/core";
import * as BabelTypes from "@babel/types";
import { MagicalNode } from "./types";
import path from "path";

let configFileName = typescript.findConfigFile(
  __dirname,
  typescript.sys.fileExists
);

if (!configFileName) {
  throw new Error("No tsconfig.json file could be found");
}

let configFileContents = fs.readFileSync(configFileName, "utf8");

const result = typescript.parseConfigFileTextToJson(
  configFileName,
  configFileContents
);

let config = typescript.parseJsonConfigFileContent(
  result,
  typescript.sys,
  process.cwd(),
  undefined,
  configFileName
);

let filesMap = new Map();

const servicesHost = createServiceHost(config.options, filesMap);
const documentRegistry = typescript.createDocumentRegistry();
let languageService = typescript.createLanguageService(
  servicesHost,
  documentRegistry
);
config.fileNames.forEach(filepath => {
  const normalized = path.normalize(filepath);
  const found = filesMap.get(normalized);
  filesMap.set(normalized, {
    text: fs.readFileSync(normalized, "utf-8"),
    version: found ? found.version + 1 : 0
  });
});

// https://github.com/pedronauck/docz/blob/c0749d32d9b806b8a83fb91f0dbb34203585df4f/core/docz-core/src/utils/docgen/typescript.ts#L122-L157

interface TSFile {
  text?: string;
  version: number;
}
function createServiceHost(
  compilerOptions: typescript.CompilerOptions,
  files: Map<string, TSFile>
): typescript.LanguageServiceHost {
  return {
    getScriptFileNames: () => {
      return [...files.keys()];
    },
    getScriptVersion: fileName => {
      const file = files.get(fileName);
      return (file && file.version.toString()) || "";
    },
    getScriptSnapshot: fileName => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      let file = files.get(fileName);

      if (file === undefined) {
        const text = fs.readFileSync(fileName).toString();

        file = { version: 0, text };
        files.set(fileName, file);
      }

      return typescript.ScriptSnapshot.fromString(file!.text!);
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: options => typescript.getDefaultLibFilePath(options),
    fileExists: typescript.sys.fileExists,
    readFile: typescript.sys.readFile,
    readDirectory: typescript.sys.readDirectory
  };
}

export function getTypes(
  filename: string,
  things: Map<number, Map<number, NodePath<BabelTypes.JSXOpeningElement>>>,
  numOfThings: number
) {
  let program = languageService.getProgram()!;

  let typeChecker = program.getTypeChecker();

  function getFunctionComponentProps(type: typescript.Type) {
    const callSignatures = type.getCallSignatures();

    if (callSignatures.length) {
      for (const sig of callSignatures) {
        const params = sig.getParameters();
        if (params.length !== 0) {
          return params[0];
        }
      }
    }
  }

  function getClassComponentProps(type: typescript.Type) {
    const constructSignatures = type.getConstructSignatures();

    if (constructSignatures.length) {
      for (const sig of constructSignatures) {
        const instanceType = sig.getReturnType();
        const props = instanceType.getProperty("props");
        if (props) {
          return props;
        }
      }
    }
  }

  function convertType(type: typescript.Type): MagicalNode {
    if (type.flags & typescript.TypeFlags.Any) {
      return {
        type: "Any"
      };
    }
    if (type.flags & typescript.TypeFlags.Undefined) {
      return {
        type: "Undefined"
      };
    }
    if (type.flags & typescript.TypeFlags.Boolean) {
      return {
        type: "Boolean"
      };
    }
    if (type.flags & typescript.TypeFlags.BooleanLiteral) {
      return {
        type: "BooleanLiteral",
        value: (type as any).value
      };
    }
    if (type.flags & typescript.TypeFlags.Number) {
      return {
        type: "Number"
      };
    }
    if (type.flags & typescript.TypeFlags.String) {
      return {
        type: "String"
      };
    }
    if (type.flags & typescript.TypeFlags.Void) {
      return {
        type: "Void"
      };
    }
    if (type.flags & typescript.TypeFlags.VoidLike) {
      return {
        type: "VoidLike"
      };
    }
    if (type.isStringLiteral()) {
      return {
        type: "StringLiteral",
        value: type.value
      };
    }
    if (type.isNumberLiteral()) {
      return {
        type: "NumberLiteral",
        value: type.value
      };
    }
    if (type.isUnion()) {
      return {
        type: "Union",
        types: type.types.map(type => convertType(type))
      };
    }
    if (type.isIntersection()) {
      return {
        type: "Intersection",
        types: type.types.map(type => convertType(type))
      };
    }
    let callSignatures = type.getCallSignatures();
    if (callSignatures.length) {
      return {
        type: "Function",
        signatures: callSignatures.map(callSignature => {
          let returnType = callSignature.getReturnType();
          let parameters = callSignature.getParameters().map(parameter => {
            return {
              name: parameter.name,
              type: convertType(
                typeChecker.getTypeOfSymbolAtLocation(
                  parameter,
                  parameter.valueDeclaration || parameter.declarations[0]
                )
              )
            };
          });

          return {
            return: convertType(returnType),
            parameters
          };
        })
      };
    }
    if (type.flags & typescript.TypeFlags.Object) {
      return {
        type: "Object",
        name: type.aliasSymbol ? type.aliasSymbol.escapedName.toString() : null,
        properties: type.getProperties().map(symbol => ({
          key: symbol.getEscapedName().toString(),
          value: convertType(
            typeChecker.getTypeOfSymbolAtLocation(
              symbol,
              symbol.valueDeclaration || symbol.declarations![0]
            )
          )
        }))
      };
    }
    console.log("Type that could not be stringified:", type);
    throw new Error("Could not stringify type");
  }

  let sourceFile = program.getSourceFile(filename);

  if (sourceFile === undefined) {
    throw new Error("source file could not be found");
  }
  let num = 0;
  let visit = (node: typescript.Node) => {
    typescript.forEachChild(node, node => {
      let map = things.get(node.pos);

      if (map) {
        let nodePath = map.get(node.end);
        if (nodePath) {
          num++;
          if (!typescript.isJsxOpeningLikeElement(node.parent)) {
            throw new Error("is not a jsx opening element");
          }
          let jsxOpening = node.parent;
          let componentAttrib = jsxOpening.attributes.properties.find(
            x =>
              typescript.isJsxAttribute(x) && x.name.escapedText === "component"
          );
          if (
            !(
              componentAttrib &&
              typescript.isJsxAttribute(componentAttrib) &&
              componentAttrib.initializer &&
              typescript.isJsxExpression(componentAttrib.initializer) &&
              componentAttrib.initializer.expression
            )
          ) {
            throw new Error("could not find component attrib");
          }
          let symbol = typeChecker.getSymbolAtLocation(
            componentAttrib.initializer.expression
          );

          if (!symbol) {
            throw new Error("could not find symbol");
          }
          const type = typeChecker.getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration || symbol.declarations![0]
          );

          console.log(typeChecker.typeToString(type));

          let propsSymbol =
            getFunctionComponentProps(type) || getClassComponentProps(type);

          if (!propsSymbol) {
            throw new Error("could not find props symbol");
          }

          let propsType = typeChecker.getTypeOfSymbolAtLocation(
            propsSymbol,
            propsSymbol.valueDeclaration || propsSymbol.declarations![0]
          );

          nodePath.node.attributes.push(
            BabelTypes.jsxAttribute(
              BabelTypes.jsxIdentifier("__types"),
              BabelTypes.jsxExpressionContainer(
                BabelTypes.callExpression(
                  BabelTypes.memberExpression(
                    BabelTypes.identifier("JSON"),
                    BabelTypes.identifier("parse")
                  ),
                  [
                    BabelTypes.stringLiteral(
                      JSON.stringify(convertType(propsType))
                    )
                  ]
                )
              )
            )
          );
        }
      }

      visit(node);
    });
  };
  visit(sourceFile);
  if (num !== numOfThings) {
    throw new Error("num !== numOfThings");
  }
}
