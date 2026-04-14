#include "TreeNode.h"

TreeNode::TreeNode(std::string n, std::string t, int cap)
    : name(n), type(t), affectedPeople(0), capacity(cap), occupancy(0), parent(nullptr) {}
