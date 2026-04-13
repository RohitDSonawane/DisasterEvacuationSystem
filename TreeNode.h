#ifndef TREENODE_H
#define TREENODE_H

#include <string>
#include <vector>

struct TreeNode {
    std::string name;
    std::string type;
    int affectedPeople;
    int capacity;
    int occupancy;
    std::vector<TreeNode*> children;
    TreeNode* parent;

    TreeNode(std::string n, std::string t, int cap = 0);
};

#endif // TREENODE_H
