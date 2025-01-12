import {
  MagicalNode,
  MagicalNodeWithIndexes,
  MagicalNodeIndex,
  PositionedMagicalNode
} from "@magical-types/types";
import { InternalError } from "@magical-types/errors";
import { getChildPositionedMagicalNodes } from "@magical-types/utils";

export function serializeNodes(rootNodes: MagicalNode[]) {
  let i = 0;
  // because of circular references, we don't want to visit a node more than once
  let visitedNodes = new Map<
    MagicalNode,
    { path: (string | number)[]; index: MagicalNodeIndex; depth: number }
  >();

  let queue: PositionedMagicalNode[] = [...rootNodes].map(node => ({
    node,
    path: [],
    depth: 0
  }));

  while (queue.length) {
    let currentNode = queue.shift()!;
    if (
      currentNode.node.type === "TypeParameter" &&
      currentNode.node.value === "VarDate"
    ) {
      debugger;
    }
    if (!visitedNodes.has(currentNode.node)) {
      visitedNodes.set(currentNode.node, {
        path: currentNode.path,
        depth: currentNode.depth,
        index: i++ as MagicalNodeIndex
      });

      let childPositionedNodes = getChildPositionedMagicalNodes(currentNode);

      queue.push(...childPositionedNodes);
    }
  }

  let newNodes: MagicalNodeWithIndexes[] = [];
  for (let [node] of visitedNodes) {
    newNodes.push(getMagicalNodeWithIndexes(node, visitedNodes));
  }
  return { nodes: newNodes, nodesToIndex: visitedNodes };
}

function getMagicalNodeWithIndexes(
  node: MagicalNode,
  visitedNodes: Map<
    MagicalNode,
    { path: (string | number)[]; index: MagicalNodeIndex }
  >
): MagicalNodeWithIndexes {
  let getIndexForNode: (node: MagicalNode) => MagicalNodeIndex = node => {
    let info = visitedNodes.get(node);
    if (!info) {
      throw new InternalError(
        "Could not get index for node of type: " + node.type
      );
    }
    return info.index;
  };
  switch (node.type) {
    case "StringLiteral":
    case "NumberLiteral":
    case "TypeParameter":
    case "Symbol":
    case "Intrinsic": {
      return node;
    }
    case "Union": {
      return {
        type: "Union",
        types: node.types.map(x => getIndexForNode(x)),
        name: node.name
      };
    }
    case "Intersection": {
      return {
        type: "Intersection",
        types: node.types.map(x => getIndexForNode(x))
      };
    }
    case "Array":
    case "Promise":
    case "ReadonlyArray": {
      return {
        type: node.type,
        value: getIndexForNode(node.value)
      };
    }
    case "Tuple": {
      return {
        type: "Tuple",
        value: node.value.map(x => getIndexForNode(x))
      };
    }
    case "IndexedAccess": {
      return {
        type: "IndexedAccess",
        index: getIndexForNode(node.index),
        object: getIndexForNode(node.object)
      };
    }
    case "Class": {
      return {
        type: "Class",
        name: node.name,
        properties: node.properties.map(x => {
          return { ...x, value: getIndexForNode(x.value) };
        }),
        thisNode: node.thisNode ? getIndexForNode(node.thisNode) : null,
        typeParameters: node.typeParameters.map(x => getIndexForNode(x))
      };
    }
    case "Object": {
      return {
        type: "Object",
        name: node.name,
        properties: node.properties.map(x => {
          return { ...x, value: getIndexForNode(x.value) };
        }),
        callSignatures: node.callSignatures.map(x => {
          return {
            return: getIndexForNode(x.return),
            parameters: x.parameters.map(x => ({
              ...x,
              type: getIndexForNode(x.type)
            })),
            typeParameters: x.typeParameters.map(x => getIndexForNode(x))
          };
        }),
        constructSignatures: node.constructSignatures.map(x => {
          return {
            return: getIndexForNode(x.return),
            parameters: x.parameters.map(x => ({
              ...x,
              type: getIndexForNode(x.type)
            })),
            typeParameters: x.typeParameters.map(x => getIndexForNode(x))
          };
        }),
        aliasTypeArguments: node.aliasTypeArguments.map(x => getIndexForNode(x))
      };
    }
    case "Conditional": {
      return {
        type: "Conditional",
        check: getIndexForNode(node.check),
        extends: getIndexForNode(node.extends),
        false: getIndexForNode(node.false),
        true: getIndexForNode(node.true)
      };
    }
    case "Lazy": {
      throw new InternalError("Lazy nodes cannot be serialized");
    }

    default: {
      let _thisMakesTypeScriptEnsureThatAllNodesAreSpecifiedHere: never = node;
      // @ts-ignore
      throw new Error("this should never happen: " + node.type);
    }
  }
}
