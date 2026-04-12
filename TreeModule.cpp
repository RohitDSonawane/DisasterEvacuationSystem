#include "TreeModule.h"
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

bool TreeModule::insertNode(const std::string& parentName, const std::string& name, const std::string& type, int capacity) {
    // Stub
    return false;
}

TreeNode* TreeModule::searchNode(const std::string& name) const {
    // Stub
    return nullptr;
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
