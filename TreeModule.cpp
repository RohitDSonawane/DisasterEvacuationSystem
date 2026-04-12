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

int TreeModule::aggregateRecursive(TreeNode* node) {
    if (!node) return 0;
    
    // Sum population from children
    int total = node->affectedPeople; // Start with the node's own localized population
    for (TreeNode* child : node->children) {
        total += aggregateRecursive(child);
    }
    
    node->affectedPeople = total; // Update node's population with aggregate
    return total;
}

void TreeModule::collectReliefCenters(TreeNode* node, std::vector<TreeNode*>& centers) const {
    if (!node) return;
    if (node->type == Constants::TYPE_RELIEFCENTER) {
        centers.push_back(node);
    }
    for (TreeNode* child : node->children) {
        collectReliefCenters(child, centers);
    }
}

void TreeModule::aggregatePopulation() {
    aggregateRecursive(root);
}

void TreeModule::listReliefCenters(const std::string& regionName) const {
    TreeNode* region = searchNode(regionName);
    if (!region) {
        std::cerr << "Region not found: " << regionName << std::endl;
        return;
    }

    std::vector<TreeNode*> centers;
    collectReliefCenters(region, centers);

    std::cout << "Relief Centers in " << regionName << ":" << std::endl;
    for (TreeNode* center : centers) {
        std::cout << " - " << center->name << " (Capacity: " << center->capacity << ")" << std::endl;
    }
}

std::vector<TreeNode*> TreeModule::getAllReliefCenters() const {
    std::vector<TreeNode*> centers;
    collectReliefCenters(root, centers);
    return centers;
}

void TreeModule::printSummaryRecursive(TreeNode* node) const {
    if (!node) return;
    
    if (node->affectedPeople > 0) {
        std::cout << node->name << " (" << node->type << ") - Affected: " << node->affectedPeople << std::endl;
    }

    for (TreeNode* child : node->children) {
        printSummaryRecursive(child);
    }
}

void TreeModule::printSummary() const {
    std::cout << "--- Administrative Affected Summary ---" << std::endl;
    printSummaryRecursive(root);
    std::cout << "---------------------------------------" << std::endl;
}
