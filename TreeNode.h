#ifndef TREENODE_H
#define TREENODE_H

#include <string>
#include <vector>

struct TreeNode {
    std::string name;
    std::string type;
    int affectedPeople;
    int capacity;
    std::vector<TreeNode*> children;
    TreeNode* parent;

    TreeNode(std::string n, std::string t, int cap = 0)
        : name(n), type(t), affectedPeople(0), capacity(cap), parent(nullptr) {}
};

#endif // TREENODE_H
