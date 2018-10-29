import Color from './tree-node-color';
/**
 * Red Black Tree node.
 * @constructor
 * @param {*} data
 */
declare class TreeNode<T> {
    data: T | T[];
    color: Color;
    parent: TreeNode<T>;
    [key: number]: TreeNode<T>;
    constructor(data: T, asArray?: boolean);
}
export default TreeNode;
