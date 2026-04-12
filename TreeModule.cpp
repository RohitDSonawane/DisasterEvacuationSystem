#include "TreeModule.h"
#include "Constants.h"
#include <iostream>

TreeModule::TreeModule() : root(nullptr) {}

TreeModule::~TreeModule() {
    deleteTree(root);
}

void TreeModule::deleteTree(TreeNode* node) {
    if (!node) return;
    for (TreeNode* child : node->children) {
        deleteTree(child);
    }
    delete node;
}

TreeNode* TreeModule::findRecursive(TreeNode* current, const std::string& name) const {
    if (!current) return nullptr;
    if (current->name == name) return current;
    for (TreeNode* child : current->children) {
        TreeNode* found = findRecursive(child, name);
        if (found) return found;
    }
    return nullptr;
}

bool TreeModule::insertNode(const std::string& parentName, const std::string& name, const std::string& type, int capacity) {
    // Check for global duplication
    if (searchNode(name) != nullptr) {
        return false;
    }

    // Root initialization
    if (root == nullptr) {
        if (type == Constants::TYPE_STATE) {
            root = new TreeNode(name, type, capacity);
            return true;
        }
        return false; // Root must be a State
    }

    // Find parent
    TreeNode* parentNode = searchNode(parentName);
    if (!parentNode) {
        return false;
    }

    // Create and link node
    TreeNode* newNode = new TreeNode(name, type, capacity);
    newNode->parent = parentNode;
    parentNode->children.push_back(newNode);

    return true;
}

TreeNode* TreeModule::searchNode(const std::string& name) const {
    return findRecursive(root, name);
}

void TreeModule::aggregatePopulation() {
    // Stub
}

void TreeModule::listReliefCenters(const std::string& regionName) const {
    // Stub
}

std::vector<TreeNode*> TreeModule::getAllReliefCenters() const {
    // Stub
    return {};
}
